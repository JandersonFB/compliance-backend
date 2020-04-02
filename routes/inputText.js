//original code
"use strict";
const express = require("express");
const router = express.Router();

var mongoUtil = require("../mongoUtil");
var db = mongoUtil.getDbData();
var ObjectId = require("mongodb").ObjectId;
const Dialogflow = require("../dialogflowHandler");
const dialogflowHandler = new Dialogflow();
const nodemailer = require("nodemailer");

router.post("/", async (req, res, next) => {
    async function getRecentContextsFromDb(userID) {
        const result = await db
            .collection("userData")
            .findOne(
                { _id: ObjectId(userID) },
                { projection: { _id: 0, recentContexts: 1 } }
            );
        if (result && result.recentContexts) {
            const recentContexts = result.recentContexts;
            return recentContexts;
        }
        return [];
    }

    async function getDialogflowResponse(
        message,
        sessionID,
        isStartOfNewSession,
        userID
    ) {
        try {
            if (isStartOfNewSession && !isVisitor) {
                var recentContexts = await getRecentContextsFromDb(userID);
            } else {
                var recentContexts = null;
            }
            var dialogflowResponse = await dialogflowHandler.sendTextMessageToDialogFlow(
                message,
                sessionID,
                recentContexts
            );

            if (
                !(
                    dialogflowResponse &&
                    dialogflowResponse[0].queryResult.fulfillmentMessages
                )
            ) {
                //retry once
                var dialogflowResponse = await dialogflowHandler.sendTextMessageToDialogFlow(
                    message,
                    sessionID,
                    recentContexts
                );
                if (
                    !(
                        dialogflowResponse &&
                        dialogflowResponse[0].queryResult.fulfillmentMessages
                    )
                ) {
                    // if still no response after retry, send error message then quit
                    res.json({
                        message:
                            "I'm sorry. Something went wrong with my internal server. Please resend your message or try again later"
                    });
                    return;
                }
            }

            return dialogflowResponse[0];
        } catch (err) {
            console.log(err);
        }
    }

    async function handleParameters(dialogflowResponse) {
        const parameter = dialogflowResponse.queryResult.parameters.fields;
        if (parameter["given-name"]) {
            try {
                db.collection("userData").updateOne(
                    { _id: new ObjectId(userID) },
                    {
                        $set: { name: parameter["given-name"].stringValue }
                    },
                    { upsert: true }
                );
            } catch (err) {
                console.log(err);
            }
        } else if (parameter["address"]) {
            try {
                db.collection("userData").updateOne(
                    { _id: new ObjectId(userID) },
                    {
                        $set: { address: parameter["address"].stringValue }
                    },
                    { upsert: true }
                );
            } catch (err) {
                console.log(err);
            }
        } else if (parameter["company"]) {
            try {
                db.collection("userData").updateOne(
                    { _id: new ObjectId(userID) },
                    {
                        $set: { company: parameter["company"].stringValue }
                    },
                    { upsert: true }
                );
            } catch (err) {
                console.log(err);
            }
        } else if (parameter["email"]) {
            try {
                db.collection("userData").updateOne(
                    { _id: new ObjectId(userID) },
                    {
                        $set: { email: parameter["email"].stringValue }
                    },
                    { upsert: true }
                );
            } catch (err) {
                console.log(err);
            }
        }
    }

    async function handleIntentName(dialogflowResponse) {
        const intentName = dialogflowResponse.queryResult.intent.displayName;
        switch (intentName) {
            case "Email Conversation History":
                var transport = nodemailer.createTransport({
                    host: "in-v3.mailjet.com",
                    port: 587,
                    auth: {
                        user: process.env.MAILJET_USER,
                        pass: process.env.MAILJET_PASSWORD
                    }
                });
                try {
                    var userData = await db
                        .collection("userData")
                        .findOne(
                            { _id: ObjectId(userID) },
                            { projection: { _id: 0, conversationHistory: 1 } }
                        );
                } catch (err) {
                    console.log(err);
                }

                var htmlBody = "";
                var prevMessageTime = "";
                var n = 0;
                for (let i = 0; i < userData.conversationHistory.length; i++) {
                    if (i == 3 * n) {
                        const messageTime = userData.conversationHistory[i];
                        const messageDate = messageTime.substring(0, 10);
                        const messageHoursMinutes = messageTime.substring(
                            11,
                            16
                        );
                        if (
                            messageDate + messageHoursMinutes !==
                            prevMessageTime
                        ) {
                            prevMessageTime = messageDate + messageHoursMinutes;
                            htmlBody += `<h4>${messageDate +
                                " " +
                                messageHoursMinutes}</h4>`;
                        }
                    } else if (i == 3 * n + 1) {
                        htmlBody += `<p><b>${req.user.name}:</b> ${userData.conversationHistory[i]}</p>`;
                    } else {
                        n += 1;
                        htmlBody += `<p><b>Bot:</b> ${userData.conversationHistory[i]}</p>`;
                    }
                }

                const message = {
                    from: "syseng.team39@gmail.com", // Sender address
                    to: req.user.email, // List of recipients
                    subject: "Compliance Bot Conversation History", // Subject line
                    html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                    </head>
                    <body>
                        <h2>Compliance Bot Conversation History</h2>
                        ${htmlBody}
                    </body>
                    </html>`
                };

                transport.sendMail(message, function(err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Email response: ", info);
                    }
                });

                break;
            case "Email Address - Initial":
                try {
                    await db.collection("userData").updateOne(
                        { _id: new ObjectId(userID) },
                        {
                            $set: {
                                contactName:
                                    dialogflowResponse[0].queryResult
                                        .parameters["given-name"]
                            }
                        },
                        { upsert: true }
                    );
                } catch (err) {
                    console.log(err);
                }
                break;
        }
    }

    function getRecentContexts(dialogflowResponse) {
        function getContextName(ctx) {
            const words = ctx.name.split("/");
            return words[words.length - 1];
        }

        const contexts = dialogflowResponse.queryResult.outputContexts;

        const mostRecent = [];
        var maxLifespanCount = -1;
        for (const ctx of contexts) {
            if ("lifespanCount" in ctx) {
                if (ctx.lifespanCount > maxLifespanCount) {
                    maxLifespanCount = ctx.lifespanCount;
                    mostRecent.length = 0;
                    ctx.name = getContextName(ctx);
                    mostRecent.push(ctx);
                } else if (ctx.lifespanCount === maxLifespanCount) {
                    ctx.name = getContextName(ctx);
                    mostRecent.push(ctx);
                }
            }
        }

        return mostRecent;
    }

    const message = req.body.message;
    const sessionID = req.body.sessionID;
    // const isStartOfNewSession = req.body.isStartOfNewSession;
    const isStartOfNewSession = true
    console.log("sessionID: " + req.body.sessionID);
    console.log("user: " + JSON.stringify(req.user));

    if (req.session.passport && req.session.passport.user) {
        // user is logged in
        var userID = req.user._id; // this is the user ID used in mongoDB
        var isVisitor = false;
    } else {
        var isVisitor = true;
    }

    const dialogflowResponse = await getDialogflowResponse(
        message,
        sessionID,
        isStartOfNewSession,
        userID
    );

    // console.log(JSON.stringify(dialogflowResponse));

    var resultMessage =
        dialogflowResponse.queryResult.fulfillmentMessages[0].text.text[0];

    if (isVisitor) {
        res.json({
            message: resultMessage
        });
        return;
    }

    handleIntentName(dialogflowResponse);
    handleParameters(dialogflowResponse);

    const recentContexts = getRecentContexts(dialogflowResponse);
    // console.log(recentContexts);
    
    const mhraClasses = ["Class I", "Class IIa", "Class IIb", "Class III"];
    var updatedConvHistory = false;
    for (const mhraClass of mhraClasses) {
        const regex = RegExp(`\\s${mhraClass}[^a-zA-Z0-9]`);
        // if (resultMessage.includes(mhraClass)) {
        if (regex.test(resultMessage)) {
            // if user's MD is of var mhraClass, update convHistory and mhraClass
            try {
                db.collection("userData").updateOne(
                    { _id: new ObjectId(userID) },
                    {
                        $set: { mhraClass, recentContexts },
                        $push: {
                            conversationHistory: {
                                $each: [
                                    new Date().toISOString(),
                                    message,
                                    resultMessage
                                ]
                            }
                        }
                    },
                    { upsert: true }
                );
                updatedConvHistory = true;
            } catch (err) {
                console.log(err);
            }
            break;
        }
    }
    if (!updatedConvHistory) {
        try {
            db.collection("userData").updateOne(
                { _id: new ObjectId(userID) },
                {
                    $set: { recentContexts },
                    $push: {
                        conversationHistory: {
                            $each: [
                                new Date().toISOString(),
                                message,
                                resultMessage
                            ]
                        }
                    }
                },
                { upsert: true }
            );
        } catch (err) {
            console.log(err);
        }
    }

    // console.log(resultMessage);

    res.json({
        message: resultMessage
    });
    next()
});

module.exports = router;
