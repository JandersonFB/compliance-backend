// this module powers the chatbot's Dialogflow Fulfillment
// whenever a request is made to Dialogflow's detectIntent API, the API will hit this route
// for a high level overview of this code, look at the "handleNameInitial" function in this 
// module. This function has been commented for brief understanding

"use strict";
const express = require("express");
const router = express.Router();

const { WebhookClient } = require("dialogflow-fulfillment");
process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements
router.post("/", async (request, response) => {
    const agent = new WebhookClient({ request, response });
    // console.log("Dialogflow Request headers: " + JSON.stringify(request.headers));
    // console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function getMostRecentContext(contexts) {
        var mostRecentContext = contexts.reduce((max, ctx) => {
            if (!("lifespanCount" in max)) return ctx;

            if ("lifespanCount" in ctx) {
                if (max.lifespanCount > ctx.lifespanCount) {
                    return max;
                } else if (max.lifespanCount === ctx.lifespanCount) {
                    if (max.name.length > ctx.name.length) {
                        return max;
                    } else {
                        return ctx;
                    }
                }
            } else {
                return max;
            }
        });

        const words = mostRecentContext.name.split("/");
        return words[words.length - 1];
    }

    function getRecentContextNames(contexts) {
        const mostRecent = new Set();
        var maxLifespanCount = -1;
        for (const ctx of contexts) {
            if ("lifespanCount" in ctx) {
                if (ctx.lifespanCount > maxLifespanCount) {
                    maxLifespanCount = ctx.lifespanCount;
                    mostRecent.clear();
                    const words = ctx.name.split("/");
                    const contextName = words[words.length - 1];
                    mostRecent.add(contextName);
                } else if (ctx.lifespanCount === maxLifespanCount) {
                    const words = ctx.name.split("/");
                    const contextName = words[words.length - 1];
                    mostRecent.add(contextName);
                }
            }
        }
        return mostRecent;
    }

    function removeOldContexts(agent, requestContexts, mostRecentContextNames) {
        for (const ctx of requestContexts) {
            const words = ctx.name.split("/");

            const context = words[words.length - 1];
            if (!mostRecentContextNames.has(context)) {
                agent.context.set({ name: context, lifespan: "0" });
            }
        }
    }

    function handleNameInitial(agent) {
        // this function is called when the intent name that Dialogflow's detectIntent API matches a key in the intentMap declared in this module (see "let intentMap = new Map();" and "agent.handleRequest(intentMap);")

        // get all request contexts
        const requestContexts = request.body.queryResult.outputContexts;

        // filter the contexts to the most recent contexts only
        const mostRecentContextNames = getRecentContextNames(requestContexts);

        // remove all contexts that are not the most recent context
        // this is to prevent the conversation flow from derailing
        removeOldContexts(agent, requestContexts, mostRecentContextNames);

        // send response text
        agent.add("What’s your name?");
    }
    function handleContactPersonNameInitial(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "What is the name of the contact person in your organization?"
        );
    }
    function handleEmailAddressInitial(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("What is their email address?");
    }
    function handlePhoneNumberInitial(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("What is their phone number?");
    }
    function handleOrganisationNameInitial(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("What is your organisation's name");
    }
    function handleOrganisationAddressInitial(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("What is your organisation's address?");
    }
    function handleKnowClassOfMedicalDeviceInitial(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you know which class of Medical Device your software belongs to according to MHRA rules?"
        );
    }
    function handleKnowClassOfMedicalDeviceYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now, let's move on to NICE. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleKnowClassOfMedicalDeviceNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does the MD not touch patient or contact only intact skin?");
    }
    function handleAlreadyKnowsMhraClassYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleAlreadyKnowsMhraClassNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Now, let's start figuring out which Tier your DHT belongs to. Please remember your latest Tier as I say. Is your DHT unlikely to have direct and measurable individual patient outcomes? (If yes, Tier 1 - system service)"
        );
    }
    function handleNotTouchPatientYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class I. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleNotTouchPatientNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the MD involve channelling or storing for eventual administration?"
        );
    }
    function handleProceedToNhsdYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great let’s get started. Is your product available to the public and can you provide URL(s) to the app store location(s)?"
        );
    }
    function handleProceedToNhsdNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handle1SystemServiceYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT provides information and resources to patients or the public? The information can include specific conditions or about healthy living. (If yes, Tier 2 - inform)"
        );
    }
    function handle1SystemServiceNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT provides information and resources to patients or the public? The information can include specific conditions or about healthy living. (If yes, Tier 2 - inform)"
        );
    }
    function handleClassIYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassINo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleChannelingForAdministrationYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD to be used with blood, other bodily fluids, organs or tissues?"
        );
    }
    function handleChannelingForAdministrationNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the MD modify biological or chemical composition of blood, body liquids, or other liquids intended for infusion?"
        );
    }
    function handle1ProvideurlYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you confirm that users are able to contact you or your organisation directly via the product, if required? "
        );
    }
    function handle1ProvideurlNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you confirm that users are able to contact you or your organisation directly via the product, if required? "
        );
    }
    function handleEndYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handleEndNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handle2InformYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT allow users to record health parameters to create health diaries that are NOT shared with or sent to others? (If yes, Tier 2 - simple monitoring)"
        );
    }
    function handle2InformNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT allow users to record health parameters to create health diaries that are NOT shared with or sent to others? (If yes, Tier 2 - simple monitoring)"
        );
    }
    function handle2InformYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT allow users to record health parameters to create health diaries that are NOT shared with or sent to others? (If yes, Tier 2 - simple monitoring)"
        );
    }
    function handle2InformNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT allow users to record health parameters to create health diaries that are NOT shared with or sent to others? (If yes, Tier 2 - simple monitoring)"
        );
    }
    function handleProceedToNhsdYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great let’s get started. Is your product available to the public and can you provide URL(s) to the app store location(s)?"
        );
    }
    function handleProceedToNhsdNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handleDownloadedOrPurchasedYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleDownloadedOrPurchasedNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Now, let's start figuring out which Tier your DHT belongs to. Please remember your latest Tier as I say. Is your DHT unlikely to have direct and measurable individual patient outcomes? (If yes, Tier 1 - system service)"
        );
    }
    function handleUsedWithBloodYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleUsedWithBloodNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "May the MD be connected to an active medical device in Class IIa or higher?"
        );
    }
    function handleModifyBiologicalCompositionYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD only for filtration, centrifiguration, or exchange of gas or heat?"
        );
    }
    function handleModifyBiologicalCompositionNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the MD involve contact with injured skin (mechanical barrier, compression, absorb exudates)?"
        );
    }
    function handle2ContactOrganisationYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product use any forms of NHS Branding?");
    }
    function handle2ContactOrganisationNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product use any forms of NHS Branding?");
    }
    function handle2ContactOrganisationYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product use any forms of NHS Branding?");
    }
    function handle2ContactOrganisationNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product use any forms of NHS Branding?");
    }
    function handleEndYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handleEndNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handleEndYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handleEndNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handle2SimpleMonitoringYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT allow 2-way communication between users and professionals, 3rd party organisations or peers? (Clinical advice is provided by professionals using the DHT). (If yes, Tier 2 - communicate)"
        );
    }
    function handle2SimpleMonitoringNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT allow 2-way communication between users and professionals, 3rd party organisations or peers? (Clinical advice is provided by professionals using the DHT). (If yes, Tier 2 - communicate)"
        );
    }
    function handle2SimpleMonitoringYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT allow 2-way communication between users and professionals, 3rd party organisations or peers? (Clinical advice is provided by professionals using the DHT). (If yes, Tier 2 - communicate)"
        );
    }
    function handle2SimpleMonitoringNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT allow 2-way communication between users and professionals, 3rd party organisations or peers? (Clinical advice is provided by professionals using the DHT). (If yes, Tier 2 - communicate)"
        );
    }
    function handleProceedToNhsdYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great let’s get started. Is your product available to the public and can you provide URL(s) to the app store location(s)?"
        );
    }
    function handleProceedToNhsdNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handle1SystemServiceYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT provides information and resources to patients or the public? The information can include specific conditions or about healthy living. (If yes, Tier 2 - inform)"
        );
    }
    function handle1SystemServiceNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT provides information and resources to patients or the public? The information can include specific conditions or about healthy living. (If yes, Tier 2 - inform)"
        );
    }
    function handleClassIiaYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleConnectedToActiveMedicalDeviceYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class I. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleConnectedToActiveMedicalDeviceNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleFiltrationCentrifigurationYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleFiltrationCentrifigurationNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleContactWithInjuredSkinYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD intended for wounds which breach dermis and heal only by secondary intent?"
        );
    }
    function handleContactWithInjuredSkinNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD invasive in body orifice or stoma (not surgically)?"
        );
    }
    function handle3UseNhsBrandingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you confirm that you have permission from the Department of Health & Social Care and that it complies with NHS England’s Branding Guidelines?"
        );
    }
    function handle3UseNhsBrandingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product require registration with the General Pharmaceutical Council?"
        );
    }
    function handle3UseNhsBrandingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you confirm that you have permission from the Department of Health & Social Care and that it complies with NHS England’s Branding Guidelines?"
        );
    }
    function handle3UseNhsBrandingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product require registration with the General Pharmaceutical Council?"
        );
    }
    function handle2CommunicateYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your DHT designed to change user behaviour related to health issues (eg. smoking, eating, alcohol, sexual health, sleeping and exercise.)? (If yes, Tier 3a - preventative behaviour change)"
        );
    }
    function handle2CommunicateNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your DHT designed to change user behaviour related to health issues (eg. smoking, eating, alcohol, sexual health, sleeping and exercise.)? (If yes, Tier 3a - preventative behaviour change)"
        );
    }
    function handle2CommunicateYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your DHT designed to change user behaviour related to health issues (eg. smoking, eating, alcohol, sexual health, sleeping and exercise.)? (If yes, Tier 3a - preventative behaviour change)"
        );
    }
    function handle2CommunicateNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your DHT designed to change user behaviour related to health issues (eg. smoking, eating, alcohol, sexual health, sleeping and exercise.)? (If yes, Tier 3a - preventative behaviour change)"
        );
    }
    function handleProceedToNhsdYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great let’s get started. Is your product available to the public and can you provide URL(s) to the app store location(s)?"
        );
    }
    function handleProceedToNhsdNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handleDownloadedOrPurchasedYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleDownloadedOrPurchasedNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Now, let's start figuring out which Tier your DHT belongs to. Please remember your latest Tier as I say. Is your DHT unlikely to have direct and measurable individual patient outcomes? (If yes, Tier 1 - system service)"
        );
    }
    function handleClassIYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassINo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIiaYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIiaYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIibYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleWoundsWhichBreachDermisYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleWoundsWhichBreachDermisNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Yes, is the MD intended to manage micro-environment of wounds + others?"
        );
    }
    function handleInvasiveInBodyOrificeYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the MD for trancient use?");
    }
    function handleInvasiveInBodyOrificeNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the MD surgically invasive and for trancient use?");
    }
    function handle4ConfirmUseOfBrandingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product require registration with the General Pharmaceutical Council?"
        );
    }
    function handle4ConfirmUseOfBrandingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product require registration with the General Pharmaceutical Council?"
        );
    }
    function handle5RequireGpcYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide evidence confirming registration?");
    }
    function handle5RequireGpcNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product forms part of a service that requires registered healthcare professionals to operate?"
        );
    }
    function handle3ABehaviourChangeYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT aim to help people with a diagnosed condition to manage their health? This may include symptom tracking function that connects with a healthcare professional. (If yes, Tier 3a - self-manage)"
        );
    }
    function handle3ABehaviourChangeNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT aim to help people with a diagnosed condition to manage their health? This may include symptom tracking function that connects with a healthcare professional. (If yes, Tier 3a - self-manage)"
        );
    }
    function handle3ABehaviourChangeYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT aim to help people with a diagnosed condition to manage their health? This may include symptom tracking function that connects with a healthcare professional. (If yes, Tier 3a - self-manage)"
        );
    }
    function handle3ABehaviourChangeNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT aim to help people with a diagnosed condition to manage their health? This may include symptom tracking function that connects with a healthcare professional. (If yes, Tier 3a - self-manage)"
        );
    }
    function handleProceedToNhsdYes5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great let’s get started. Is your product available to the public and can you provide URL(s) to the app store location(s)?"
        );
    }
    function handleProceedToNhsdNo5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handleDownloadedOrPurchasedYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleDownloadedOrPurchasedNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Now, let's start figuring out which Tier your DHT belongs to. Please remember your latest Tier as I say. Is your DHT unlikely to have direct and measurable individual patient outcomes? (If yes, Tier 1 - system service)"
        );
    }
    function handleClassIibYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleManageMicroEnvironmentsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleManageMicroEnvironmentsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class I. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleTrancientUseYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class I. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleTrancientUseNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the MD for short-term use?");
    }
    function handleSurgicallyInvasiveYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD specifically to control/diagnose/monitor/correct a defect of heart or central circulatory system through direct contact?"
        );
    }
    function handleSurgicallyInvasiveNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the MD surgically invasive and for short-term use?");
    }
    function handle5RequireGpcYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide evidence confirming registration?");
    }
    function handle5RequireGpcNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product forms part of a service that requires registered healthcare professionals to operate?"
        );
    }
    function handle5RequireGpcYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide evidence confirming registration?");
    }
    function handle5RequireGpcNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product forms part of a service that requires registered healthcare professionals to operate?"
        );
    }
    function handle6ConfirmWithGpcYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product forms part of a service that requires registered healthcare professionals to operate?"
        );
    }
    function handle6ConfirmWithGpcNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product forms part of a service that requires registered healthcare professionals to operate?"
        );
    }
    function handle7RequireHealthcaresYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you confirm their registration status and names?");
    }
    function handle7RequireHealthcaresNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide a guest login for your product so that assessors can access and evaluate it?"
        );
    }
    function handle3ASelf_ManageYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT provide treatment for a diagnosed condition, such as CBT for anxiety, or guides treatment decisions? (If yes, Tier 3b - treat)"
        );
    }
    function handle3ASelf_ManageNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT provide treatment for a diagnosed condition, such as CBT for anxiety, or guides treatment decisions? (If yes, Tier 3b - treat)"
        );
    }
    function handle3ASelf_ManageYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT provide treatment for a diagnosed condition, such as CBT for anxiety, or guides treatment decisions? (If yes, Tier 3b - treat)"
        );
    }
    function handle3ASelf_ManageNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT provide treatment for a diagnosed condition, such as CBT for anxiety, or guides treatment decisions? (If yes, Tier 3b - treat)"
        );
    }
    function handleClassIiaYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassINo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassINo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleShortTermUseYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD only for use in oral cavity, ear canal, or in nasal cavity?"
        );
    }
    function handleShortTermUseNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the MD for long-term use?");
    }
    function handleControlDiagnoseMonitorOrCorrectYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class III. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleControlDiagnoseMonitorOrCorrectNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD or use in direct contact with the central nervous systerm?"
        );
    }
    function handleSurgicallyInvasiveAndShortTermUseYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD for use in direct contact with the central nervous system?"
        );
    }
    function handleSurgicallyInvasiveAndShortTermUseNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD surgically invasive, for long term use, or is an implantable device?"
        );
    }
    function handle7RequireHealthcaresYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you confirm their registration status and names?");
    }
    function handle7RequireHealthcaresNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide a guest login for your product so that assessors can access and evaluate it?"
        );
    }
    function handle7RequireHealthcaresYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you confirm their registration status and names?");
    }
    function handle7RequireHealthcaresNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide a guest login for your product so that assessors can access and evaluate it?"
        );
    }
    function handle8ConfirmHealthcareRegistrationYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide a guest login for your product so that assessors can access and evaluate it?"
        );
    }
    function handle8ConfirmHealthcareRegistrationNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide a guest login for your product so that assessors can access and evaluate it?"
        );
    }
    function handle9ProvideAGuestLoginYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Your organisation requires CQC registration?");
    }
    function handle9ProvideAGuestLoginNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Your organisation requires CQC registration?");
    }
    function handle3BTreatYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT automatically records information and transmits the data to a professional, career or 3rd party organisation WITHOUT any input from the user, to inform clinical management decisions? (If yes, Tier 3b - active monitoring)"
        );
    }
    function handle3BTreatNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT automatically records information and transmits the data to a professional, career or 3rd party organisation WITHOUT any input from the user, to inform clinical management decisions? (If yes, Tier 3b - active monitoring)"
        );
    }
    function handle3BTreatYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT automatically records information and transmits the data to a professional, career or 3rd party organisation WITHOUT any input from the user, to inform clinical management decisions? (If yes, Tier 3b - active monitoring)"
        );
    }
    function handle3BTreatNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT automatically records information and transmits the data to a professional, career or 3rd party organisation WITHOUT any input from the user, to inform clinical management decisions? (If yes, Tier 3b - active monitoring)"
        );
    }
    function handleOralCavityEarCanalYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class I. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleOralCavityEarCanalNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleLongTermUseYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD only for use in oral cavity, ear canal, or in nasal cavity and is not liable to be absorbed by the mucous membrane?"
        );
    }
    function handleLongTermUseNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD to be connected to an active medical device in Class IIa or higher?"
        );
    }
    function handleClassIiiYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiiNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleDirectContactWithCnsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class III. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleDirectContactWithCnsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the MD a reusable surgical instrument?");
    }
    function handleDirectContactWithCns2Yes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class III. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleDirectContactWithCns2No(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD specifically used to monitor/control/diagnose/correct defect of heart or central circulatory system by direct contact?"
        );
    }
    function handleSurgicallyInvasiveLongTermUseYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the MD to be used in teeth?");
    }
    function handleSurgicallyInvasiveLongTermUseNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD an active therapeutic device intended to administer or exchange energy?"
        );
    }
    function handle9ProvideAGuestLoginYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Your organisation requires CQC registration?");
    }
    function handle9ProvideAGuestLoginNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Your organisation requires CQC registration?");
    }
    function handle9ProvideAGuestLoginYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Your organisation requires CQC registration?");
    }
    function handle9ProvideAGuestLoginNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Your organisation requires CQC registration?");
    }
    function handle10RequireRegistrationWithCqcYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your organisation registered with CQC?");
    }
    function handle10RequireRegistrationWithCqcNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you think that your organisation does not require CQC registration?"
        );
    }
    function handle10RequireRegistrationWithCqcYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your organisation registered with CQC?");
    }
    function handle10RequireRegistrationWithCqcNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you think that your organisation does not require CQC registration?"
        );
    }
    function handle3BAcitve_MonitoringYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT have tools that perform clinical calculations that are likely to affect clinical care decisions? (If yes, Tier 3b - calculate)"
        );
    }
    function handle3BAcitve_MonitoringNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT have tools that perform clinical calculations that are likely to affect clinical care decisions? (If yes, Tier 3b - calculate)"
        );
    }
    function handle3BAcitve_MonitoringYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT have tools that perform clinical calculations that are likely to affect clinical care decisions? (If yes, Tier 3b - calculate)"
        );
    }
    function handle3BAcitve_MonitoringNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT have tools that perform clinical calculations that are likely to affect clinical care decisions? (If yes, Tier 3b - calculate)"
        );
    }
    function handleClassIYes5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassINo5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIiaYes5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleOralCavityEarCanalNotLiableToBeAbsorbedYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleOralCavityEarCanalNotLiableToBeAbsorbedNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleConnectedToActiveMedicalDevice2Yes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleConnectedToActiveMedicalDevice2No(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the MD surgically invasive and for trancient use?");
    }
    function handleProceedToNhsdYes6(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great let’s get started. Is your product available to the public and can you provide URL(s) to the app store location(s)?"
        );
    }
    function handleProceedToNhsdNo6(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handleDownloadedOrPurchasedYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleDownloadedOrPurchasedNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Now, let's start figuring out which Tier your DHT belongs to. Please remember your latest Tier as I say. Is your DHT unlikely to have direct and measurable individual patient outcomes? (If yes, Tier 1 - system service)"
        );
    }
    function handleClassIiiYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiiNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleReusableSurgicalInstrumentYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class I. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleReusableSurgicalInstrumentNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does the MD supply energy or ionising radiation?");
    }
    function handleClassIiiYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiiNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleMonitorControlDiagnoseOrCorrectYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class III. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleMonitorControlDiagnoseOrCorrectNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does the MD supply energy or ionising radiation?");
    }
    function handleUsedInTeethYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleUsedInTeethNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD to be used in direct contact with heart or central nervous/circulatory system?"
        );
    }
    function handleActiveTherapeuticDeviceYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the MD administer or exchange energy in a potentially hazardous way?"
        );
    }
    function handleActiveTherapeuticDeviceNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD an active device for diagnosis intended to supply energy to image in vivo distribution of radiopharmaceuticals, or for direct diagnosis or monitoring of vital physiological processes?"
        );
    }
    function handle11ConfirmRegistrationWithCqcYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide your organisation's CQC account number?");
    }
    function handle11ConfirmRegistrationWithCqcNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you think that your organisation does not require CQC registration?"
        );
    }
    function handle14NeedRegistrationCqcYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide a brief description of your product?");
    }
    function handle14NeedRegistrationCqcNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Have you reviewed the scope of registration for CQC and confirmed your organisation's activities do not require registration?"
        );
    }
    function handle3BCalculateYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT use data to diagnose a condition in a patient, or to guide a diagnostic decision made by a healthcare professional? (If yes, Tier 3b - diagnose)"
        );
    }
    function handle3BCalculateNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT use data to diagnose a condition in a patient, or to guide a diagnostic decision made by a healthcare professional? (If yes, Tier 3b - diagnose)"
        );
    }
    function handle3BCalculateYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT use data to diagnose a condition in a patient, or to guide a diagnostic decision made by a healthcare professional? (If yes, Tier 3b - diagnose)"
        );
    }
    function handle3BCalculateNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DHT use data to diagnose a condition in a patient, or to guide a diagnostic decision made by a healthcare professional? (If yes, Tier 3b - diagnose)"
        );
    }
    function handleClassIiaYes6(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo6(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIibYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIiaYes7(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo7(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleSurgicallyInvasiveYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD specifically to control/diagnose/monitor/correct a defect of heart or central circulatory system through direct contact?"
        );
    }
    function handleSurgicallyInvasiveNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the MD surgically invasive and for short-term use?");
    }
    function handleClassIYes6(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassINo6(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleSupplyEnergyYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleSupplyEnergyNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the MD have a biological effect, ie it is mainly or wholly absorbed?"
        );
    }
    function handleClassIiiYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiiNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleSupplyEnergy2Yes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleSupplyEnergy2No(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the MD have a biological effect or is mainly absorbed?"
        );
    }
    function handleClassIiaYes8(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo8(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleDirectContactWithHeartYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class III. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleDirectContactWithHeartNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the MD have a biological effect or is mainly absorbed?"
        );
    }
    function handleAdministerOrExchangeEnergyYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleAdministerOrExchangeEnergyNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the MD control, monitor, or influence directly the performance of a Class IIb active therapeutic device?"
        );
    }
    function handleSupplyEnergyToImageInVivoYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD specifically intended to monitor vital physiological parameters where variations could result in immediate danger?"
        );
    }
    function handleSupplyEnergyToImageInVivoNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD an active device to administer or remove medicines and other substances to or from the body?"
        );
    }
    function handle12ProvideCqcNumberYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide the date of your organisation's most recent registration certificate?"
        );
    }
    function handle12ProvideCqcNumberNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you think that your organisation does not require CQC registration?"
        );
    }
    function handle14NeedRegistrationCqcYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide a brief description of your product?");
    }
    function handle14NeedRegistrationCqcNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Have you reviewed the scope of registration for CQC and confirmed your organisation's activities do not require registration?"
        );
    }
    function handle16ProvideDescriptionYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product integrate with a website or other software/device?"
        );
    }
    function handle16ProvideDescriptionNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product integrate with a website or other software/device?"
        );
    }
    function handle15ConfirmDoesNotNeedCqcYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide a brief description of your product?");
    }
    function handle15ConfirmDoesNotNeedCqcNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide a brief description of your product?");
    }
    function handle3BDiagnoseYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "This is the end of the Functional Classification. If you have told multiple Tiers, then you have to choose the highest Tier. Plus, the Tiers are cumulative. This means that your DHT must meet all the standards in the previous Tier(s), as well as its own Tier. Now we will move on to NHSD’s questions. Would you like to go through them?"
        );
    }
    function handle3BDiagnoseNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "This is the end of the Functional Classification. If you have told multiple Tiers, then you have to choose the highest Tier. Plus, the Tiers are cumulative. This means that your DHT must meet all the standards in the previous Tier(s), as well as its own Tier. Now we will move on to NHSD’s questions. Would you like to go through them?"
        );
    }
    function handle3BDiagnoseYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "This is the end of the Functional Classification. If you have told multiple Tiers, then you have to choose the highest Tier. Plus, the Tiers are cumulative. This means that your DHT must meet all the standards in the previous Tier(s), as well as its own Tier. Now we will move on to NHSD’s questions. Would you like to go through them?"
        );
    }
    function handle3BDiagnoseNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "This is the end of the Functional Classification. If you have told multiple Tiers, then you have to choose the highest Tier. Plus, the Tiers are cumulative. This means that your DHT must meet all the standards in the previous Tier(s), as well as its own Tier. Now we will move on to NHSD’s questions. Would you like to go through them?"
        );
    }
    function handleClassIibYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleHaveABiologicalEffectYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleHaveABiologicalEffectNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD intended to administer medicine in a potentially hazardous manner?"
        );
    }
    function handleClassIibYes5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleHaveABiologicalEffect2Yes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class III. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleHaveABiologicalEffect2No(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the MD undergo chemical change in the body, or is used to administer medicine (not in teeth)?"
        );
    }
    function handleClassIiiYes5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiiNo5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleHaveABiologicalEffectOrMainlyAbsorbedYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class III. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleHaveABiologicalEffectOrMainlyAbsorbedNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the MD undergo chemical change in the body, or is used to administer medicine (not in teeth"
        );
    }
    function handleClassIibYes6(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo6(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleControlMonitorOrInfluenceYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleControlMonitorOrInfluenceNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleMonitorVitalPhysiologicalParametersYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleMonitorVitalPhysiologicalParametersNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the MD emit ionizing radiation and is intended for diagnostic and therapeutic interventional radiology?"
        );
    }
    function handleActiveDeviceToAdministerMedicinesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does the MD do so in a potentially hazardous way?");
    }
    function handleActiveDeviceToAdministerMedicinesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD an active medical device but is not classified by any of the above rules?"
        );
    }
    function handle13ProvideRecentCqcRegistrationYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you think that your organisation does not require CQC registration?"
        );
    }
    function handle13ProvideRecentCqcRegistrationNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you think that your organisation does not require CQC registration?"
        );
    }
    function handle14NeedRegistrationCqcYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide a brief description of your product?");
    }
    function handle14NeedRegistrationCqcNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Have you reviewed the scope of registration for CQC and confirmed your organisation's activities do not require registration?"
        );
    }
    function handle17IntegrateWithWebsiteOrOthersYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product connects to any of the NHS Service listed: Electronic Prescription Service (EPS) or Electronic Referrals Service (eRS) or GP2GP or GP? Connect  GPSoC Connection to Primary Care Systems (EMIS, Microtest, TPP & VISION)  Health and Social Care Network  NHS Mail  NHS Pathways  Spine  Summary Care Records."
        );
    }
    function handle17IntegrateWithWebsiteOrOthersNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product connects to any of the NHS Service listed: Electronic Prescription Service (EPS) or Electronic Referrals Service (eRS) or GP2GP or GP? Connect  GPSoC Connection to Primary Care Systems (EMIS, Microtest, TPP & VISION)  Health and Social Care Network  NHS Mail  NHS Pathways  Spine  Summary Care Records."
        );
    }
    function handle17IntegrateWithWebsiteOrOthersYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product connects to any of the NHS Service listed: Electronic Prescription Service (EPS) or Electronic Referrals Service (eRS) or GP2GP or GP? Connect  GPSoC Connection to Primary Care Systems (EMIS, Microtest, TPP & VISION)  Health and Social Care Network  NHS Mail  NHS Pathways  Spine  Summary Care Records."
        );
    }
    function handle17IntegrateWithWebsiteOrOthersNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product connects to any of the NHS Service listed: Electronic Prescription Service (EPS) or Electronic Referrals Service (eRS) or GP2GP or GP? Connect  GPSoC Connection to Primary Care Systems (EMIS, Microtest, TPP & VISION)  Health and Social Care Network  NHS Mail  NHS Pathways  Spine  Summary Care Records."
        );
    }
    function handle16ProvideDescriptionYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product integrate with a website or other software/device?"
        );
    }
    function handle16ProvideDescriptionNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product integrate with a website or other software/device?"
        );
    }
    function handle16ProvideDescriptionYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product integrate with a website or other software/device?"
        );
    }
    function handle16ProvideDescriptionNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product integrate with a website or other software/device?"
        );
    }
    function handleFunctionalClassificationOverYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleFunctionalClassificationOverNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handleFunctionalClassificationOverYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleFunctionalClassificationOverNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handleClassIibYes7(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo7(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleAdministerMedicineYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleAdministerMedicineNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleClassIiiYes6(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiiNo6(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleUndergoChemicalChangeYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleUndergoChemicalChangeNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleClassIiiYes7(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiiNo7(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleUndergoChemicalChangeOrAdministerMedicineYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class III. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleUndergoChemicalChangeOrAdministerMedicineNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD for use in breast implants, or hip, knee, or shoulder joint replacements?"
        );
    }
    function handleClassIibYes8(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo8(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIiaYes9(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo9(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIibYes9(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo9(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleEmitIonizingRadiationYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleEmitIonizingRadiationNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handlePotentiallyHazardousYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handlePotentiallyHazardousNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleActiveDeviceNotClassifiedYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class I. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleActiveDeviceNotClassifiedNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the MD incorporate integral medicinal substances liable to act in an ancillary way on the human body?"
        );
    }
    function handle14NeedRegistrationCqcYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide a brief description of your product?");
    }
    function handle14NeedRegistrationCqcNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Have you reviewed the scope of registration for CQC and confirmed your organisation's activities do not require registration?"
        );
    }
    function handle14NeedRegistrationCqcYes5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide a brief description of your product?");
    }
    function handle14NeedRegistrationCqcNo5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Have you reviewed the scope of registration for CQC and confirmed your organisation's activities do not require registration?"
        );
    }
    function handle18ConnectWithDevicesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Could your product replace a commissioned NHS service?");
    }
    function handle18ConnectWithDevicesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can provide details about how your product could replace a commissioned service?"
        );
    }
    function handle18ConnectWithDevicesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Could your product replace a commissioned NHS service?");
    }
    function handle18ConnectWithDevicesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can provide details about how your product could replace a commissioned service?"
        );
    }
    function handleProceedToNhsdYes7(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great let’s get started. Is your product available to the public and can you provide URL(s) to the app store location(s)?"
        );
    }
    function handleProceedToNhsdNo7(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handleEndYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handleEndNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handleClassIibYes10(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo10(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIiaYes10(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo10(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIibYes11(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo11(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIiaYes11(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo11(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIiiYes8(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiiNo8(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleUseInBreastImplantsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class III. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleUseInBreastImplantsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleClassIibYes12(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo12(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIiaYes12(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo12(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIibYes13(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo13(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIiaYes13(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo13(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIYes7(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassINo7(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleIncorporateIntegralMedicinalSubstancesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class III. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleIncorporateIntegralMedicinalSubstancesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD used for contraception or prevention of sexually transmitted diseases?"
        );
    }
    function handle19ReplaceANhsServiceYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can provide details about how your product could replace a commissioned service?"
        );
    }
    function handle19ReplaceANhsServiceNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product free to public users?");
    }
    function handle20ConfirmReplaceANhsServiceYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product free to public users?");
    }
    function handle20ConfirmReplaceANhsServiceNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product free to public users?");
    }
    function handleClassIiiYes9(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiiNo9(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIibYes14(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo14(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIiiYes10(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiiNo10(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleContraceptionYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the MD implantable or is long-term invasive?");
    }
    function handleContraceptionNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the MD specifically to be used for disinfecting MDs?");
    }
    function handle20ConfirmReplaceANhsServiceYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product free to public users?");
    }
    function handle20ConfirmReplaceANhsServiceNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product free to public users?");
    }
    function handle21FreeToPublicYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Do you have the source of funding?");
    }
    function handle21FreeToPublicNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Do you have the source of funding?");
    }
    function handle21FreeToPublicYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Do you have the source of funding?");
    }
    function handle21FreeToPublicNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Do you have the source of funding?");
    }
    function handle21FreeToPublicYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Do you have the source of funding?");
    }
    function handle21FreeToPublicNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Do you have the source of funding?");
    }
    function handleImplantableYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class III. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleImplantableNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleDisinfectingMdsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD specifically to be used for disinfecting, cleaning, rinsing or hydrating contact lenses?"
        );
    }
    function handleDisinfectingMdsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD intended for recording of X-ray diagnostic images?"
        );
    }
    function handle22SourceOfFundingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product involved in a pilot or trial with an NHS hospital, Trust, CCG or in a primary care setting?"
        );
    }
    function handle22SourceOfFundingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product involved in a pilot or trial with an NHS hospital, Trust, CCG or in a primary care setting?"
        );
    }
    function handle22SourceOfFundingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product involved in a pilot or trial with an NHS hospital, Trust, CCG or in a primary care setting?"
        );
    }
    function handle22SourceOfFundingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product involved in a pilot or trial with an NHS hospital, Trust, CCG or in a primary care setting?"
        );
    }
    function handleClassIiiYes11(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiiNo11(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIibYes15(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo15(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleDisinfectingContactLensesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleDisinfectingContactLensesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the MD specifically to be used for disinfecting invasive MDs?"
        );
    }
    function handleRecordingOfXRayYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleRecordingOfXRayNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the MD utilize non-viable animal tissues or derivatives (not devices in contact with only intact skin)?"
        );
    }
    function handle23ProvideATrialYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide a brief detail of the pilot or trial?(just answer Yes or No)"
        );
    }
    function handle23ProvideATrialNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal data of NHS or Social Care users?"
        );
    }
    function handle23ProvideATrialYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide a brief detail of the pilot or trial?(just answer Yes or No)"
        );
    }
    function handle23ProvideATrialNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal data of NHS or Social Care users?"
        );
    }
    function handleClassIibYes16(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo16(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleDisinfectingInvasiveMdsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleDisinfectingInvasiveMdsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIa. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleClassIiaYes14(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo14(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleNonViableAnimalTissuesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class III. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleNonViableAnimalTissuesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the MD a blood bag?");
    }
    function handle24ProvideDetailOfTheTrialYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal data of NHS or Social Care users?"
        );
    }
    function handle24ProvideDetailOfTheTrialNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal data of NHS or Social Care users?"
        );
    }
    function handle25ConfirmProcessPersonalDataYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you know where does the product process (e.g. store) the personal data of NHS or Social Care patient/client/service users?"
        );
    }
    function handle25ConfirmProcessPersonalDataNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product available on iOS/Android/Windows Mobile/ OS X/ Linux/others?"
        );
    }
    function handleClassIibYes17(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo17(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIiaYes15(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiaNo15(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleClassIiiYes12(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIiiNo12(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleBloodBagYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleBloodBagNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Error");
    }
    function handle25ConfirmProcessPersonalDataYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you know where does the product process (e.g. store) the personal data of NHS or Social Care patient/client/service users?"
        );
    }
    function handle25ConfirmProcessPersonalDataNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product available on iOS/Android/Windows Mobile/ OS X/ Linux/others?"
        );
    }
    function handle25ConfirmProcessPersonalDataYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you know where does the product process (e.g. store) the personal data of NHS or Social Care patient/client/service users?"
        );
    }
    function handle25ConfirmProcessPersonalDataNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product available on iOS/Android/Windows Mobile/ OS X/ Linux/others?"
        );
    }
    function handle26ConfirmWhereToProcessYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product available on iOS/Android/Windows Mobile/ OS X/ Linux/others?"
        );
    }
    function handle26ConfirmWhereToProcessNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product available on iOS/Android/Windows Mobile/ OS X/ Linux/others?"
        );
    }
    function handle27ComfrimAvailableOnPlatformsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide the following version number?");
    }
    function handle27ComfrimAvailableOnPlatformsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the type of pharmacy is clearly stated prior to the beginning of any sign up process?"
        );
    }
    function handleClassIibYes18(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great you're all set for NICE compliance. Would you like to answer questions required by NHS Digital?"
        );
    }
    function handleClassIibNo18(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Ok. Let's start functional classification now. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
        );
    }
    function handleBloodBagYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Your MD belongs to Class IIb. Now Let's move on to NICE. Do you know which Tier of Digital Healthcare Technology (DHT), simply put, your software belongs to according to NICE rules?"
        );
    }
    function handleBloodBagNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Error");
    }
    function handle27ComfrimAvailableOnPlatformsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide the following version number?");
    }
    function handle27ComfrimAvailableOnPlatformsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the type of pharmacy is clearly stated prior to the beginning of any sign up process?"
        );
    }
    function handle27ComfrimAvailableOnPlatformsYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide the following version number?");
    }
    function handle27ComfrimAvailableOnPlatformsNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the type of pharmacy is clearly stated prior to the beginning of any sign up process?"
        );
    }
    function handle28ProvidePlatformNumberYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the type of pharmacy is clearly stated prior to the beginning of any sign up process?"
        );
    }
    function handle28ProvidePlatformNumberNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the type of pharmacy is clearly stated prior to the beginning of any sign up process?"
        );
    }
    function handle29ConfirmTypeOfPharmacyYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product provide any clinical benefits?");
    }
    function handle29ConfirmTypeOfPharmacyNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product provide any clinical benefits?");
    }
    function handle29ConfirmTypeOfPharmacyYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product provide any clinical benefits?");
    }
    function handle29ConfirmTypeOfPharmacyNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product provide any clinical benefits?");
    }
    function handle29ConfirmTypeOfPharmacyYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product provide any clinical benefits?");
    }
    function handle29ConfirmTypeOfPharmacyNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product provide any clinical benefits?");
    }
    function handle30ProvideClinicalBenefitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have any evidence to show success of the clinical benefits?"
        );
    }
    function handle30ProvideClinicalBenefitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give a reason why your product does not provide clinical benefits?"
        );
    }
    function handle30ProvideClinicalBenefitsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have any evidence to show success of the clinical benefits?"
        );
    }
    function handle30ProvideClinicalBenefitsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give a reason why your product does not provide clinical benefits?"
        );
    }
    function handle31ProvideEvidenceOfClinicalBenefitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you upload a relevant document or provide relevant URLs?"
        );
    }
    function handle31ProvideEvidenceOfClinicalBenefitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you upload a relevant document or provide relevant URLs?"
        );
    }
    function handle33ProvideTheReasonOfNotHaveClinicalBenefitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product provide any behavioural benefits?");
    }
    function handle33ProvideTheReasonOfNotHaveClinicalBenefitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product provide any behavioural benefits?");
    }
    function handle32ProvideTheUrlOfClinicalBenefitsD11Yes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give a reason why your product does not provide clinical benefits?"
        );
    }
    function handle32ProvideTheUrlOfClinicalBenefitsD11No(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product provide any behavioural benefits?");
    }
    function handle32ProvideTheUrlOfClinicalBenefitsD11Yes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give a reason why your product does not provide clinical benefits?"
        );
    }
    function handle32ProvideTheUrlOfClinicalBenefitsD11No2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product provide any behavioural benefits?");
    }
    function handle34ProvideBehaviouralBenefitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe the improvements to psychological or social motivation, patient reported outcomes or experience measures?(Just answer Yes or No)."
        );
    }
    function handle34ProvideBehaviouralBenefitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give a reason why not?");
    }
    function handle34ProvideBehaviouralBenefitsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe the improvements to psychological or social motivation, patient reported outcomes or experience measures?(Just answer Yes or No)."
        );
    }
    function handle34ProvideBehaviouralBenefitsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give a reason why not?");
    }
    function handle33ProvideTheReasonOfNotHaveClinicalBenefitsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product provide any behavioural benefits?");
    }
    function handle33ProvideTheReasonOfNotHaveClinicalBenefitsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product provide any behavioural benefits?");
    }
    function handle34ProvideBehaviouralBenefitsYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe the improvements to psychological or social motivation, patient reported outcomes or experience measures?(Just answer Yes or No)."
        );
    }
    function handle34ProvideBehaviouralBenefitsNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give a reason why not?");
    }
    function handle35ProvideImprovementOfBahaviouralBenefitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you upload a relevant document or provide relevant URLs ?"
        );
    }
    function handle35ProvideImprovementOfBahaviouralBenefitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Are there any economic benefits to using your product?");
    }
    function handle37ConfirmReasonNotHaveBehaviouralBenefitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Are there any economic benefits to using your product?");
    }
    function handle37ConfirmReasonNotHaveBehaviouralBenefitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Are there any economic benefits to using your product?");
    }
    function handle36ProvideUrlOfBehaviouralBenefitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give a reason why not?");
    }
    function handle36ProvideUrlOfBehaviouralBenefitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Are there any economic benefits to using your product?");
    }
    function handle38ConfirmOfEconomicBenefitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe what economic benefits and the time-frame for success?"
        );
    }
    function handle38ConfirmOfEconomicBenefitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give a reason why not?");
    }
    function handle38ConfirmOfEconomicBenefitsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe what economic benefits and the time-frame for success?"
        );
    }
    function handle38ConfirmOfEconomicBenefitsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give a reason why not?");
    }
    function handle38ConfirmOfEconomicBenefitsYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe what economic benefits and the time-frame for success?"
        );
    }
    function handle38ConfirmOfEconomicBenefitsNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give a reason why not?");
    }
    function handle37ConfirmReasonNotHaveBehaviouralBenefitsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Are there any economic benefits to using your product?");
    }
    function handle37ConfirmReasonNotHaveBehaviouralBenefitsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Are there any economic benefits to using your product?");
    }
    function handle38ConfirmOfEconomicBenefitsYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe what economic benefits and the time-frame for success?"
        );
    }
    function handle38ConfirmOfEconomicBenefitsNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give a reason why not?");
    }
    function handle39DescribeTheEconomicBenefitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide any evidence to show success of the economic benefits?"
        );
    }
    function handle39DescribeTheEconomicBenefitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Are there any other outcomes that you have measured?");
    }
    function handle41ProvideAReasonNotHaveEconomicBenefitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Are there any other outcomes that you have measured?");
    }
    function handle41ProvideAReasonNotHaveEconomicBenefitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Are there any other outcomes that you have measured?");
    }
    function handle40ProvideEvidenceOfEconomicBenefitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give a reason why not?");
    }
    function handle40ProvideEvidenceOfEconomicBenefitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Are there any other outcomes that you have measured?");
    }
    function handle42ConfirmAnyOtherOutcomesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe what other outcomes and the time-frame for success?"
        );
    }
    function handle42ConfirmAnyOtherOutcomesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give the reason why not?");
    }
    function handle42ConfirmAnyOtherOutcomesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe what other outcomes and the time-frame for success?"
        );
    }
    function handle42ConfirmAnyOtherOutcomesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give the reason why not?");
    }
    function handle42ConfirmAnyOtherOutcomesYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe what other outcomes and the time-frame for success?"
        );
    }
    function handle42ConfirmAnyOtherOutcomesNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give the reason why not?");
    }
    function handle41ProvideAReasonNotHaveEconomicBenefitsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Are there any other outcomes that you have measured?");
    }
    function handle41ProvideAReasonNotHaveEconomicBenefitsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Are there any other outcomes that you have measured?");
    }
    function handle42ConfirmAnyOtherOutcomesYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe what other outcomes and the time-frame for success?"
        );
    }
    function handle42ConfirmAnyOtherOutcomesNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give the reason why not?");
    }
    function handle43ProvideWhatOtherOutcomesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has your product been evaluated in any way for these other outcomes?"
        );
    }
    function handle43ProvideWhatOtherOutcomesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has your product been evaluated in any way for these other outcomes?"
        );
    }
    function handle47ProvideReasonWhyNoOutcomesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are there any resource impact benefits associated with your product?"
        );
    }
    function handle47ProvideReasonWhyNoOutcomesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are there any resource impact benefits associated with your product?"
        );
    }
    function handle44ConfirmEvaluatedForOutcomesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide evidence demonstrating the evaluation of these outcomes?"
        );
    }
    function handle44ConfirmEvaluatedForOutcomesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you upload a relevant document or provide relevant URLs?"
        );
    }
    function handle44ConfirmEvaluatedForOutcomesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide evidence demonstrating the evaluation of these outcomes?"
        );
    }
    function handle44ConfirmEvaluatedForOutcomesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you upload a relevant document or provide relevant URLs?"
        );
    }
    function handle48ConfirmResourceImpactBenefitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide detail of resource impact benefits?");
    }
    function handle48ConfirmResourceImpactBenefitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product fall within the scope of the NHS England mandated Safety Standard DCB0129?"
        );
    }
    function handle48ConfirmResourceImpactBenefitsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide detail of resource impact benefits?");
    }
    function handle48ConfirmResourceImpactBenefitsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product fall within the scope of the NHS England mandated Safety Standard DCB0129?"
        );
    }
    function handle45ProvideEvidenceOfEvaluatingOutcomesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you upload a relevant document or provide relevant URLs?"
        );
    }
    function handle45ProvideEvidenceOfEvaluatingOutcomesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you upload a relevant document or provide relevant URLs?"
        );
    }
    function handle46ProvideUrlOfEvaluatingOutcomesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give the reason why not?");
    }
    function handle46ProvideUrlOfEvaluatingOutcomesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give the reason why not?");
    }
    function handle49ProvideDetailOfResourceImpactBenefitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product fall within the scope of the NHS England mandated Safety Standard DCB0129?"
        );
    }
    function handle49ProvideDetailOfResourceImpactBenefitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product fall within the scope of the NHS England mandated Safety Standard DCB0129?"
        );
    }
    function handle50ConfirmWithinNhsDcb0129Yes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide a copy of your Safety Case and Hazard Log?");
    }
    function handle50ConfirmWithinNhsDcb0129No(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide a brief explanation as to why your product does not fall within the scope of the NHS England mandated Safety Standard DCB0129?"
        );
    }
    function handle46ProvideUrlOfEvaluatingOutcomesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give the reason why not?");
    }
    function handle46ProvideUrlOfEvaluatingOutcomesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give the reason why not?");
    }
    function handle46ProvideUrlOfEvaluatingOutcomesYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give the reason why not?");
    }
    function handle46ProvideUrlOfEvaluatingOutcomesNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you give the reason why not?");
    }
    function handle47ProvideReasonWhyNoOutcomesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are there any resource impact benefits associated with your product?"
        );
    }
    function handle47ProvideReasonWhyNoOutcomesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are there any resource impact benefits associated with your product?"
        );
    }
    function handle47ProvideReasonWhyNoOutcomesYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are there any resource impact benefits associated with your product?"
        );
    }
    function handle47ProvideReasonWhyNoOutcomesNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are there any resource impact benefits associated with your product?"
        );
    }
    function handle50ConfirmWithinNhsDcb0129Yes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide a copy of your Safety Case and Hazard Log?");
    }
    function handle50ConfirmWithinNhsDcb0129No2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide a brief explanation as to why your product does not fall within the scope of the NHS England mandated Safety Standard DCB0129?"
        );
    }
    function handle50ConfirmWithinNhsDcb0129Yes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you provide a copy of your Safety Case and Hazard Log?");
    }
    function handle50ConfirmWithinNhsDcb0129No3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide a brief explanation as to why your product does not fall within the scope of the NHS England mandated Safety Standard DCB0129?"
        );
    }
    function handle51ProvideCopyOfSafetyCaseYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is it possible for users to experience adverse effects as a result of using your product?"
        );
    }
    function handle51ProvideCopyOfSafetyCaseNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is it possible for users to experience adverse effects as a result of using your product?"
        );
    }
    function handle52ProvideWhyNotFallWithinDcb0129Yes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is it possible for users to experience adverse effects as a result of using your product?"
        );
    }
    function handle52ProvideWhyNotFallWithinDcb0129No(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is it possible for users to experience adverse effects as a result of using your product?"
        );
    }
    function handle53ConfirmAdverseEffectsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you list all of the possible adverse effects of using your product if require?"
        );
    }
    function handle53ConfirmAdverseEffectsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has the safety assessment for your product been approved by a qualified clinician?"
        );
    }
    function handle53ConfirmAdverseEffectsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you list all of the possible adverse effects of using your product if require?"
        );
    }
    function handle53ConfirmAdverseEffectsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has the safety assessment for your product been approved by a qualified clinician?"
        );
    }
    function handle53ConfirmAdverseEffectsYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you list all of the possible adverse effects of using your product if require?"
        );
    }
    function handle53ConfirmAdverseEffectsNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has the safety assessment for your product been approved by a qualified clinician?"
        );
    }
    function handle53ConfirmAdverseEffectsYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you list all of the possible adverse effects of using your product if require?"
        );
    }
    function handle53ConfirmAdverseEffectsNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has the safety assessment for your product been approved by a qualified clinician?"
        );
    }
    function handle54ProvidePossibleAdverseEffectsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has the safety assessment for your product been approved by a qualified clinician?"
        );
    }
    function handle54ProvidePossibleAdverseEffectsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has the safety assessment for your product been approved by a qualified clinician?"
        );
    }
    function handle55ConfirmApprovedByClinicianYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you the name and job title of the reviewer?");
    }
    function handle55ConfirmApprovedByClinicianNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product process personal data?");
    }
    function handle55ConfirmApprovedByClinicianYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you the name and job title of the reviewer?");
    }
    function handle55ConfirmApprovedByClinicianNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product process personal data?");
    }
    function handle55ConfirmApprovedByClinicianYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you the name and job title of the reviewer?");
    }
    function handle55ConfirmApprovedByClinicianNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product process personal data?");
    }
    function handle56ProvideNameOfClinicianYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product process personal data?");
    }
    function handle56ProvideNameOfClinicianNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product process personal data?");
    }
    function handle57ConfirmProcessTheDataPersonalYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide details of any other personal data items being processed by your product that are not listed in the supporting information?"
        );
    }
    function handle57ConfirmProcessTheDataPersonalNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You have indicated that the use of your product will not cause any personal or sensitive personal data to be processed. Please confirm that:  You have read and fully understood the definitions of personal sensitive personal data provided by the Information Commissioner’s Office  You have read and fully understood the supporting information and examples  You have fully considered all the data including that processed by placing and retrieving information through a cookie or similar technology  Should there be an intention to process such data, you accept that a reassessment will be required before the data processing begins in order to remain on the NHS Apps Library I confirm"
        );
    }
    function handle57ConfirmProcessTheDataPersonalYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide details of any other personal data items being processed by your product that are not listed in the supporting information?"
        );
    }
    function handle57ConfirmProcessTheDataPersonalNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You have indicated that the use of your product will not cause any personal or sensitive personal data to be processed. Please confirm that:  You have read and fully understood the definitions of personal sensitive personal data provided by the Information Commissioner’s Office  You have read and fully understood the supporting information and examples  You have fully considered all the data including that processed by placing and retrieving information through a cookie or similar technology  Should there be an intention to process such data, you accept that a reassessment will be required before the data processing begins in order to remain on the NHS Apps Library I confirm"
        );
    }
    function handle57ConfirmProcessTheDataPersonalYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide details of any other personal data items being processed by your product that are not listed in the supporting information?"
        );
    }
    function handle57ConfirmProcessTheDataPersonalNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You have indicated that the use of your product will not cause any personal or sensitive personal data to be processed. Please confirm that:  You have read and fully understood the definitions of personal sensitive personal data provided by the Information Commissioner’s Office  You have read and fully understood the supporting information and examples  You have fully considered all the data including that processed by placing and retrieving information through a cookie or similar technology  Should there be an intention to process such data, you accept that a reassessment will be required before the data processing begins in order to remain on the NHS Apps Library I confirm"
        );
    }
    function handle58ProvidePeronalDataProcessedYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product process sensitive personal data?");
    }
    function handle58ProvidePeronalDataProcessedNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your product process sensitive personal data?");
    }
    function handle61ConfirmFullyUnderstandingOfPersonalDataSensitiveDataYes(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you understand you/your organisation's role?  'Controller'  'Controller' and 'manufacturer/designer' of the product)  'Processor' only or  Product 'manufacturer/designer' only."
        );
    }
    function handle61ConfirmFullyUnderstandingOfPersonalDataSensitiveDataNo(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you understand you/your organisation's role?  'Controller'  'Controller' and 'manufacturer/designer' of the product)  'Processor' only or  Product 'manufacturer/designer' only."
        );
    }
    function handle59ConfirmProcessSensitiveDataYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide details of any other sensitive personal data items being processed by your product?"
        );
    }
    function handle59ConfirmProcessSensitiveDataNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You have indicated that the use of your product will not cause any personal or sensitive personal data to be processed. Please confirm that:  You have read and fully understood the definitions of personal sensitive personal data provided by the Information Commissioner’s Office  You have read and fully understood the supporting information and examples  You have fully considered all the data including that processed by placing and retrieving information through a cookie or similar technology  Should there be an intention to process such data, you accept that a reassessment will be required before the data processing begins in order to remain on the NHS Apps Library I confirm"
        );
    }
    function handle59ConfirmProcessSensitiveDataYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide details of any other sensitive personal data items being processed by your product?"
        );
    }
    function handle59ConfirmProcessSensitiveDataNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You have indicated that the use of your product will not cause any personal or sensitive personal data to be processed. Please confirm that:  You have read and fully understood the definitions of personal sensitive personal data provided by the Information Commissioner’s Office  You have read and fully understood the supporting information and examples  You have fully considered all the data including that processed by placing and retrieving information through a cookie or similar technology  Should there be an intention to process such data, you accept that a reassessment will be required before the data processing begins in order to remain on the NHS Apps Library I confirm"
        );
    }
    function handle62UnderstandOrganisationSRoleYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is not a Controller?"
        );
    }
    function handle62UnderstandOrganisationSRoleNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is not a Controller?"
        );
    }
    function handle62UnderstandOrganisationSRoleYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is not a Controller?"
        );
    }
    function handle62UnderstandOrganisationSRoleNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is not a Controller?"
        );
    }
    function handle60ProvideSensitivePersonalDataProcessedYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you understand you/your organisation's role?  'Controller'  'Controller' and 'manufacturer/designer' of the product)  'Processor' only or  Product 'manufacturer/designer' only."
        );
    }
    function handle60ProvideSensitivePersonalDataProcessedNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you understand you/your organisation's role?  'Controller'  'Controller' and 'manufacturer/designer' of the product)  'Processor' only or  Product 'manufacturer/designer' only."
        );
    }
    function handle61ConfirmFullyUnderstandingOfPersonalDataSensitiveDataYes2(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you understand you/your organisation's role?  'Controller'  'Controller' and 'manufacturer/designer' of the product)  'Processor' only or  Product 'manufacturer/designer' only."
        );
    }
    function handle61ConfirmFullyUnderstandingOfPersonalDataSensitiveDataNo2(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you understand you/your organisation's role?  'Controller'  'Controller' and 'manufacturer/designer' of the product)  'Processor' only or  Product 'manufacturer/designer' only."
        );
    }
    function handle63ProcessDataAndNotAControllerYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product personal OR sensitive personal data AND your organisation is a Processor (and not a Controller)?"
        );
    }
    function handle63ProcessDataAndNotAControllerNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product personal OR sensitive personal data AND your organisation is a Processor (and not a Controller)?"
        );
    }
    function handle63ProcessDataAndNotAControllerYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product personal OR sensitive personal data AND your organisation is a Processor (and not a Controller)?"
        );
    }
    function handle63ProcessDataAndNotAControllerNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product personal OR sensitive personal data AND your organisation is a Processor (and not a Controller)?"
        );
    }
    function handle62UnderstandOrganisationSRoleYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is not a Controller?"
        );
    }
    function handle62UnderstandOrganisationSRoleNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is not a Controller?"
        );
    }
    function handle62UnderstandOrganisationSRoleYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is not a Controller?"
        );
    }
    function handle62UnderstandOrganisationSRoleNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is not a Controller?"
        );
    }
    function handle64ProcessPersonalDataAndProcessorNotControllerYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide the details of the 'Processor' organisation on whose behalf you are processing personal data."
        );
    }
    function handle64ProcessPersonalDataAndProcessorNotControllerNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide the details of the 'Processor' organisation on whose behalf you are processing personal data."
        );
    }
    function handle64ProcessPersonalDataAndProcessorNotControllerYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide the details of the 'Processor' organisation on whose behalf you are processing personal data."
        );
    }
    function handle64ProcessPersonalDataAndProcessorNotControllerNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide the details of the 'Processor' organisation on whose behalf you are processing personal data."
        );
    }
    function handle65ProvideDetailsOfControllerYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is neither a Controller nor Processor?"
        );
    }
    function handle65ProvideDetailsOfControllerNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is neither a Controller nor Processor?"
        );
    }
    function handle65ProvideDetailsOfControllerYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is neither a Controller nor Processor?"
        );
    }
    function handle65ProvideDetailsOfControllerNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is neither a Controller nor Processor?"
        );
    }
    function handle66ProcessDataNotControllerNotProcessorYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You/your organisation is developing, or has developed, a product but you will not control or process the personal data because: the individual user who downloads your product controls their own data entirely OR  the client (organisation) which buys your product is the Controller’ and will make the decisions described earlier regarding what personal data is processed when using your product). If your answer to this is 'Yes', then you/your organisation is a manufacturer or designer (neither a 'Controller' nor 'Processor'). Your app must be designed and configurable to meet the potential clients' (the 'Controller') legal requirements or safeguard the privacy rights of users who individually download the product you make available."
        );
    }
    function handle66ProcessDataNotControllerNotProcessorNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND is a Controller?"
        );
    }
    function handle66ProcessDataNotControllerNotProcessorYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You/your organisation is developing, or has developed, a product but you will not control or process the personal data because: the individual user who downloads your product controls their own data entirely OR  the client (organisation) which buys your product is the Controller’ and will make the decisions described earlier regarding what personal data is processed when using your product). If your answer to this is 'Yes', then you/your organisation is a manufacturer or designer (neither a 'Controller' nor 'Processor'). Your app must be designed and configurable to meet the potential clients' (the 'Controller') legal requirements or safeguard the privacy rights of users who individually download the product you make available."
        );
    }
    function handle66ProcessDataNotControllerNotProcessorNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND is a Controller?"
        );
    }
    function handle67ChooseToKnowManufacturerOrDesignerYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND is a Controller?"
        );
    }
    function handle67ChooseToKnowManufacturerOrDesignerNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND is a Controller?"
        );
    }
    function handle68ProcessDataAndControllerYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your organisation subject to European/UK Data Protection laws?"
        );
    }
    function handle68ProcessDataAndControllerNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is a Controller AND is subject to European/UK Data Protection Laws?"
        );
    }
    function handle68ProcessDataAndControllerYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your organisation subject to European/UK Data Protection laws?"
        );
    }
    function handle68ProcessDataAndControllerNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is a Controller AND is subject to European/UK Data Protection Laws?"
        );
    }
    function handle68ProcessDataAndControllerYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your organisation subject to European/UK Data Protection laws?"
        );
    }
    function handle68ProcessDataAndControllerNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is a Controller AND is subject to European/UK Data Protection Laws?"
        );
    }
    function handle69SubjectToLawsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is a Controller AND is subject to European/UK Data Protection Laws?"
        );
    }
    function handle69SubjectToLawsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data AND your organisation is a Controller AND is subject to European/UK Data Protection Laws?"
        );
    }
    function handle70DataAndControllerAndLawsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product have a registration number in the Data Protection Register?"
        );
    }
    function handle70DataAndControllerAndLawsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you tell us your overall grading (which must achieve Green or Amber to be considered for the NHS Apps Library)?"
        );
    }
    function handle70DataAndControllerAndLawsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product have a registration number in the Data Protection Register?"
        );
    }
    function handle70DataAndControllerAndLawsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you tell us your overall grading (which must achieve Green or Amber to be considered for the NHS Apps Library)?"
        );
    }
    function handle70DataAndControllerAndLawsYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product have a registration number in the Data Protection Register?"
        );
    }
    function handle70DataAndControllerAndLawsNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you tell us your overall grading (which must achieve Green or Amber to be considered for the NHS Apps Library)?"
        );
    }
    function handle71ConfirmNumberOfDprYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you tell us your overall grading (which must achieve Green or Amber to be considered for the NHS Apps Library)?"
        );
    }
    function handle71ConfirmNumberOfDprNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you tell us your overall grading (which must achieve Green or Amber to be considered for the NHS Apps Library)?"
        );
    }
    function handle72ProvideTheOverallGradingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide the name and title of a senior manager in the 'Controller' organisation who verifies the grading is accurate?"
        );
    }
    function handle72ProvideTheOverallGradingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product your product partially meet the criteria set out in Annex 2 of Guidelines of DPIA?"
        );
    }
    function handle72ProvideTheOverallGradingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide the name and title of a senior manager in the 'Controller' organisation who verifies the grading is accurate?"
        );
    }
    function handle72ProvideTheOverallGradingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product your product partially meet the criteria set out in Annex 2 of Guidelines of DPIA?"
        );
    }
    function handle72ProvideTheOverallGradingYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide the name and title of a senior manager in the 'Controller' organisation who verifies the grading is accurate?"
        );
    }
    function handle72ProvideTheOverallGradingNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product your product partially meet the criteria set out in Annex 2 of Guidelines of DPIA?"
        );
    }
    function handle72ProvideTheNameOfOverallGradingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you supply a copy of the completed ICO Checklist?");
    }
    function handle72ProvideTheNameOfOverallGradingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you supply a copy of the completed ICO Checklist?");
    }
    function handle74ConfirmMeetsAnnex2Yes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide DPIA includes details of trackers and permissions used by your product along with the justification for why each is required and their purpose?"
        );
    }
    function handle74ConfirmMeetsAnnex2No(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DPIA include details of trackers and permissions used by your product?"
        );
    }
    function handle73ProvideCopyPfTheChecklistYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product your product partially meet the criteria set out in Annex 2 of Guidelines of DPIA?"
        );
    }
    function handle73ProvideCopyPfTheChecklistNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product your product partially meet the criteria set out in Annex 2 of Guidelines of DPIA?"
        );
    }
    function handle73ProvideCopyPfTheChecklistYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product your product partially meet the criteria set out in Annex 2 of Guidelines of DPIA?"
        );
    }
    function handle73ProvideCopyPfTheChecklistNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product your product partially meet the criteria set out in Annex 2 of Guidelines of DPIA?"
        );
    }
    function handle75ProvideDpiaYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DPIA include details of trackers and permissions used by your product?"
        );
    }
    function handle75ProvideDpiaNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DPIA include details of trackers and permissions used by your product?"
        );
    }
    function handle76ConfirmPermissionOfDpiaYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal data AND your organisation is a Controller?"
        );
    }
    function handle76ConfirmPermissionOfDpiaNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal data AND your organisation is a Controller?"
        );
    }
    function handle74ConfirmMeetsAnnex2Yes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide DPIA includes details of trackers and permissions used by your product along with the justification for why each is required and their purpose?"
        );
    }
    function handle74ConfirmMeetsAnnex2No2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DPIA include details of trackers and permissions used by your product?"
        );
    }
    function handle74ConfirmMeetsAnnex2Yes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide DPIA includes details of trackers and permissions used by your product along with the justification for why each is required and their purpose?"
        );
    }
    function handle74ConfirmMeetsAnnex2No3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your DPIA include details of trackers and permissions used by your product?"
        );
    }
    function handle76ConfirmPermissionOfDpiaYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal data AND your organisation is a Controller?"
        );
    }
    function handle76ConfirmPermissionOfDpiaNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal data AND your organisation is a Controller?"
        );
    }
    function handle76ConfirmPermissionOfDpiaYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal data AND your organisation is a Controller?"
        );
    }
    function handle76ConfirmPermissionOfDpiaNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal data AND your organisation is a Controller?"
        );
    }
    function handle77ConfirmDataAndControllerYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the legal basis for each processing purpose of the personal data clearly described to the individual?"
        );
    }
    function handle77ConfirmDataAndControllerNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is there an 'other legal basis' for the processing of personal data?"
        );
    }
    function handle77ConfirmDataAndControllerYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the legal basis for each processing purpose of the personal data clearly described to the individual?"
        );
    }
    function handle77ConfirmDataAndControllerNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is there an 'other legal basis' for the processing of personal data?"
        );
    }
    function handle78ConfirmLegalBasisYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is there an 'other legal basis' for the processing of personal data?"
        );
    }
    function handle78ConfirmLegalBasisNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is there an 'other legal basis' for the processing of personal data?"
        );
    }
    function handle79ConfirmOtherLegalBasisYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you describe the other legal basis?");
    }
    function handle79ConfirmOtherLegalBasisNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has your organisation developed measures to protect the applicable rights of the data subjects?"
        );
    }
    function handle79ConfirmOtherLegalBasisYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you describe the other legal basis?");
    }
    function handle79ConfirmOtherLegalBasisNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has your organisation developed measures to protect the applicable rights of the data subjects?"
        );
    }
    function handle79ConfirmOtherLegalBasisYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you describe the other legal basis?");
    }
    function handle79ConfirmOtherLegalBasisNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has your organisation developed measures to protect the applicable rights of the data subjects?"
        );
    }
    function handle80DescribeTheOtherLegalBasisYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has your organisation developed measures to protect the applicable rights of the data subjects?"
        );
    }
    function handle80DescribeTheOtherLegalBasisNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has your organisation developed measures to protect the applicable rights of the data subjects?"
        );
    }
    function handle81ConfirmMeasuresToProtectRightYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do the rights of the data subjects include providing transparency/fair processing information to data subjects?"
        );
    }
    function handle81ConfirmMeasuresToProtectRightNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use all reasonable measures to verify the identity of an individual who exercises these rights?"
        );
    }
    function handle81ConfirmMeasuresToProtectRightYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do the rights of the data subjects include providing transparency/fair processing information to data subjects?"
        );
    }
    function handle81ConfirmMeasuresToProtectRightNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use all reasonable measures to verify the identity of an individual who exercises these rights?"
        );
    }
    function handle81ConfirmMeasuresToProtectRightYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do the rights of the data subjects include providing transparency/fair processing information to data subjects?"
        );
    }
    function handle81ConfirmMeasuresToProtectRightNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use all reasonable measures to verify the identity of an individual who exercises these rights?"
        );
    }
    function handle82ProvideTransparencyToDataSubjectYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do the rights of the data include the right of data portability (which only applies where consent or contract with the data subject is the legal basis and personal data are / knowingly and actively provided by the data subject / generated by and collected from the use of the service or device e.g. observed’ such as search history, traffic data, location data, other raw data such as heartbeat tracked by fitness and health trackers)?"
        );
    }
    function handle82ProvideTransparencyToDataSubjectNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do the rights of the data include the right of data portability (which only applies where consent or contract with the data subject is the legal basis and personal data are / knowingly and actively provided by the data subject / generated by and collected from the use of the service or device e.g. observed’ such as search history, traffic data, location data, other raw data such as heartbeat tracked by fitness and health trackers)?"
        );
    }
    function handle86ConfirmMeasureOtVerifyTheIdentityYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product processe personal OR sensitive personal data AND your organisation is a Controller AND allows your users personal data to be processed by a third party?"
        );
    }
    function handle86ConfirmMeasureOtVerifyTheIdentityNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product processe personal OR sensitive personal data AND your organisation is a Controller AND allows your users personal data to be processed by a third party?"
        );
    }
    function handle83ProvideTheProbabilityToDataSubjectYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do the rights of the data subjects include the right to erase (or the right to be forgotten)?"
        );
    }
    function handle83ProvideTheProbabilityToDataSubjectNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do the rights of the data subjects include the right to erase (or the right to be forgotten)?"
        );
    }
    function handle83ProvideTheProbabilityToDataSubjectYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do the rights of the data subjects include the right to erase (or the right to be forgotten)?"
        );
    }
    function handle83ProvideTheProbabilityToDataSubjectNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do the rights of the data subjects include the right to erase (or the right to be forgotten)?"
        );
    }
    function handle87ConfirmDataAndControllerAndProcessedByAThirdPartyYes(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation allows or causes your users' personal data to be processed by a third party (e.g. hosts the data, manages your website, provides user research or analytics services, user survey tools, bulk email providers that manage your client email lists)?"
        );
    }
    function handle87ConfirmDataAndControllerAndProcessedByAThirdPartyNo(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the personal data obtained directly from the individual?"
        );
    }
    function handle87ConfirmDataAndControllerAndProcessedByAThirdPartyYes2(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation allows or causes your users' personal data to be processed by a third party (e.g. hosts the data, manages your website, provides user research or analytics services, user survey tools, bulk email providers that manage your client email lists)?"
        );
    }
    function handle87ConfirmDataAndControllerAndProcessedByAThirdPartyNo2(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the personal data obtained directly from the individual?"
        );
    }
    function handle84ProvideTheRightToEraseYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do the rights include the right to rectify, object, restrict processing?"
        );
    }
    function handle84ProvideTheRightToEraseNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do the rights include the right to rectify, object, restrict processing?"
        );
    }
    function handle84ProvideTheRightToEraseYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do the rights include the right to rectify, object, restrict processing?"
        );
    }
    function handle84ProvideTheRightToEraseNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do the rights include the right to rectify, object, restrict processing?"
        );
    }
    function handle88ConfirmAllowThirdPartyProcessingDataYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the third party provide technical services (e.g. maintains personal data backups or stores personal data in a cloud)?"
        );
    }
    function handle88ConfirmAllowThirdPartyProcessingDataNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the third party provide technical services (e.g. maintains personal data backups or stores personal data in a cloud)?"
        );
    }
    function handle104ConfirmPdFromIndividualYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is fair processing information provided at the time the personal data is obtained?"
        );
    }
    function handle104ConfirmPdFromIndividualNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the personal data obtained from a third party?");
    }
    function handle85ProvideTheRightToRectifyObjectYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use all reasonable measures to verify the identity of an individual who exercises these rights?"
        );
    }
    function handle85ProvideTheRightToRectifyObjectNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use all reasonable measures to verify the identity of an individual who exercises these rights?"
        );
    }
    function handle85ProvideTheRightToRectifyObjectYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use all reasonable measures to verify the identity of an individual who exercises these rights?"
        );
    }
    function handle85ProvideTheRightToRectifyObjectNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use all reasonable measures to verify the identity of an individual who exercises these rights?"
        );
    }
    function handle89ProvideTechinicalServicesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the third party accesses/uses personal data (for which you are the 'Controller')?"
        );
    }
    function handle89ProvideTechinicalServicesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the third party accesses/uses personal data (for which you are the 'Controller')?"
        );
    }
    function handle89ProvideTechinicalServicesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the third party accesses/uses personal data (for which you are the 'Controller')?"
        );
    }
    function handle89ProvideTechinicalServicesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the third party accesses/uses personal data (for which you are the 'Controller')?"
        );
    }
    function handle105ConfirmFairPdYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the personal data obtained from a third party?");
    }
    function handle105ConfirmFairPdNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the personal data obtained from a third party?");
    }
    function handle106ConfirmPdFormThirdPartyYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is a fair processing information provided within one month of having obtained the data from a third party OR, if the personal data is used to communicate with the individual, at the latest, when the first communication takes place?"
        );
    }
    function handle106ConfirmPdFormThirdPartyNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation process personal OR sensitive personal data AND is a Controller?"
        );
    }
    function handle86ConfirmMeasureOtVerifyTheIdentityYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product processe personal OR sensitive personal data AND your organisation is a Controller AND allows your users personal data to be processed by a third party?"
        );
    }
    function handle86ConfirmMeasureOtVerifyTheIdentityNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product processe personal OR sensitive personal data AND your organisation is a Controller AND allows your users personal data to be processed by a third party?"
        );
    }
    function handle86ConfirmMeasureOtVerifyTheIdentityYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product processe personal OR sensitive personal data AND your organisation is a Controller AND allows your users personal data to be processed by a third party?"
        );
    }
    function handle86ConfirmMeasureOtVerifyTheIdentityNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product processe personal OR sensitive personal data AND your organisation is a Controller AND allows your users personal data to be processed by a third party?"
        );
    }
    function handle90ConfirmThirdPartyOfPersonalDataYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is a written binding agreement n place between you/your organisation and each third party ('Processor')?"
        );
    }
    function handle90ConfirmThirdPartyOfPersonalDataNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is a written binding agreement n place between you/your organisation and each third party ('Processor')?"
        );
    }
    function handle90ConfirmThirdPartyOfPersonalDataYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is a written binding agreement n place between you/your organisation and each third party ('Processor')?"
        );
    }
    function handle90ConfirmThirdPartyOfPersonalDataNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is a written binding agreement n place between you/your organisation and each third party ('Processor')?"
        );
    }
    function handle106ConfirmPdFormThirdPartyYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is a fair processing information provided within one month of having obtained the data from a third party OR, if the personal data is used to communicate with the individual, at the latest, when the first communication takes place?"
        );
    }
    function handle106ConfirmPdFormThirdPartyNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation process personal OR sensitive personal data AND is a Controller?"
        );
    }
    function handle106ConfirmPdFormThirdPartyYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is a fair processing information provided within one month of having obtained the data from a third party OR, if the personal data is used to communicate with the individual, at the latest, when the first communication takes place?"
        );
    }
    function handle106ConfirmPdFormThirdPartyNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation process personal OR sensitive personal data AND is a Controller?"
        );
    }
    function handle107ConfirmFairPdOfThirdPartyYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation process personal OR sensitive personal data AND is a Controller?"
        );
    }
    function handle107ConfirmFairPdOfThirdPartyNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation process personal OR sensitive personal data AND is a Controller?"
        );
    }
    function handle108ConfirmPdAndControllerFollowingQYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation processing include The identity and the contact details of the 'Controller' and where applicable, the 'Controller's' representative?"
        );
    }
    function handle108ConfirmPdAndControllerFollowingQNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does  your product processe personal OR sensitive personal data AND your organisation is a Controller and if the legal basis for processing personal data is consent?"
        );
    }
    function handle91ConfirmWrittenBindingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do No contract clauses indemnify 'Processors' against fines or claims under UK/EU data protection law?"
        );
    }
    function handle91ConfirmWrittenBindingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do No contract clauses indemnify 'Processors' against fines or claims under UK/EU data protection law?"
        );
    }
    function handle91ConfirmWrittenBindingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do No contract clauses indemnify 'Processors' against fines or claims under UK/EU data protection law?"
        );
    }
    function handle91ConfirmWrittenBindingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do No contract clauses indemnify 'Processors' against fines or claims under UK/EU data protection law?"
        );
    }
    function handle108ConfirmPdAndControllerFollowingQYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation processing include The identity and the contact details of the 'Controller' and where applicable, the 'Controller's' representative?"
        );
    }
    function handle108ConfirmPdAndControllerFollowingQNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does  your product processe personal OR sensitive personal data AND your organisation is a Controller and if the legal basis for processing personal data is consent?"
        );
    }
    function handle108ConfirmPdAndControllerFollowingQYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation processing include The identity and the contact details of the 'Controller' and where applicable, the 'Controller's' representative?"
        );
    }
    function handle108ConfirmPdAndControllerFollowingQNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does  your product processe personal OR sensitive personal data AND your organisation is a Controller and if the legal basis for processing personal data is consent?"
        );
    }
    function handle109ConfirmIncludeContactOfControllerYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation processing include the purposes and the legal basis for each purpose?"
        );
    }
    function handle109ConfirmIncludeContactOfControllerNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation processing include the purposes and the legal basis for each purpose?"
        );
    }
    function handle124ConfirmSpdAndControllerAndConsentYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is consent freely given, specific for each separate purpose and informed?"
        );
    }
    function handle124ConfirmSpdAndControllerAndConsentNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data of children AND your organisation is a Controller?"
        );
    }
    function handle92ConfirmNoClausesIndemnifyProcessorsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the subject matter and duration of the processing?"
        );
    }
    function handle92ConfirmNoClausesIndemnifyProcessorsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the subject matter and duration of the processing?"
        );
    }
    function handle92ConfirmNoClausesIndemnifyProcessorsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the subject matter and duration of the processing?"
        );
    }
    function handle92ConfirmNoClausesIndemnifyProcessorsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the subject matter and duration of the processing?"
        );
    }
    function handle110ConfirmIncludeLegalBasisForPurposeYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the recipients, or categories of recipients, of the personal data?"
        );
    }
    function handle110ConfirmIncludeLegalBasisForPurposeNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the recipients, or categories of recipients, of the personal data?"
        );
    }
    function handle110ConfirmIncludeLegalBasisForPurposeYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the recipients, or categories of recipients, of the personal data?"
        );
    }
    function handle110ConfirmIncludeLegalBasisForPurposeNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the recipients, or categories of recipients, of the personal data?"
        );
    }
    function handle125ConfirmFreelyGivenYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is consent not a precondition of signing up to a service unless it is necessary for that service?"
        );
    }
    function handle125ConfirmFreelyGivenNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is consent not a precondition of signing up to a service unless it is necessary for that service?"
        );
    }
    function handle139ConfirmPdOfChildAndControllerYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the processes design by which a child can exercise their data protection rights with the child in mind, and make them easy for children to access and understand?"
        );
    }
    function handle139ConfirmPdOfChildAndControllerNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use cookies, web beacons or similar technologies?"
        );
    }
    function handle93ConfirmSetOutSubjectMatterYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the nature and purpose of the processing?"
        );
    }
    function handle93ConfirmSetOutSubjectMatterNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the nature and purpose of the processing?"
        );
    }
    function handle93ConfirmSetOutSubjectMatterYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the nature and purpose of the processing?"
        );
    }
    function handle93ConfirmSetOutSubjectMatterNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the nature and purpose of the processing?"
        );
    }
    function handle111ConfirmIncludeRecipientsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the details of data transfers outside the European Economic Area, including how the data will be protected. For example:  The recipient is in an adequate’ country (e.g. recognised by the EU Commission to have an adequate level of protection)  Binding Corporate Rules (BCR) or  Model Contract Clauses and you have made the individual aware of how they may obtain a copy of the safeguards, or where they can be seen?"
        );
    }
    function handle111ConfirmIncludeRecipientsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the details of data transfers outside the European Economic Area, including how the data will be protected. For example:  The recipient is in an adequate’ country (e.g. recognised by the EU Commission to have an adequate level of protection)  Binding Corporate Rules (BCR) or  Model Contract Clauses and you have made the individual aware of how they may obtain a copy of the safeguards, or where they can be seen?"
        );
    }
    function handle111ConfirmIncludeRecipientsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the details of data transfers outside the European Economic Area, including how the data will be protected. For example:  The recipient is in an adequate’ country (e.g. recognised by the EU Commission to have an adequate level of protection)  Binding Corporate Rules (BCR) or  Model Contract Clauses and you have made the individual aware of how they may obtain a copy of the safeguards, or where they can be seen?"
        );
    }
    function handle111ConfirmIncludeRecipientsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the details of data transfers outside the European Economic Area, including how the data will be protected. For example:  The recipient is in an adequate’ country (e.g. recognised by the EU Commission to have an adequate level of protection)  Binding Corporate Rules (BCR) or  Model Contract Clauses and you have made the individual aware of how they may obtain a copy of the safeguards, or where they can be seen?"
        );
    }
    function handle126ConfirmNotAPreconditionYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is consent requested separately from the terms and conditions?"
        );
    }
    function handle126ConfirmNotAPreconditionNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is consent requested separately from the terms and conditions?"
        );
    }
    function handle126ConfirmNotAPreconditionYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is consent requested separately from the terms and conditions?"
        );
    }
    function handle126ConfirmNotAPreconditionNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is consent requested separately from the terms and conditions?"
        );
    }
    function handle140ConfirmDesignEasyToUndersatndYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product Allow competent children to exercise their own data protection rights?"
        );
    }
    function handle140ConfirmDesignEasyToUndersatndNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product Allow competent children to exercise their own data protection rights?"
        );
    }
    function handle166ConfirmCookiesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation provides users with a cookie policy?"
        );
    }
    function handle166ConfirmCookiesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Bug reporting and Online tracking?"
        );
    }
    function handle94ConfirmSetOtTheNaturePurposeYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the type of personal data and categories of data subject?"
        );
    }
    function handle94ConfirmSetOtTheNaturePurposeNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the type of personal data and categories of data subject?"
        );
    }
    function handle94ConfirmSetOtTheNaturePurposeYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the type of personal data and categories of data subject?"
        );
    }
    function handle94ConfirmSetOtTheNaturePurposeNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the type of personal data and categories of data subject?"
        );
    }
    function handle112ConfirmIncludeEucBcrYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the retention period or, if no fixed retention period can be provided, the criteria used to determine that period?"
        );
    }
    function handle112ConfirmIncludeEucBcrNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the retention period or, if no fixed retention period can be provided, the criteria used to determine that period?"
        );
    }
    function handle112ConfirmIncludeEucBcrYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the retention period or, if no fixed retention period can be provided, the criteria used to determine that period?"
        );
    }
    function handle112ConfirmIncludeEucBcrNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the retention period or, if no fixed retention period can be provided, the criteria used to determine that period?"
        );
    }
    function handle127ConfirmSeparatelyFromTeamYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the individual provided with the relevant fair processing information?"
        );
    }
    function handle127ConfirmSeparatelyFromTeamNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the individual provided with the relevant fair processing information?"
        );
    }
    function handle127ConfirmSeparatelyFromTeamYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the individual provided with the relevant fair processing information?"
        );
    }
    function handle127ConfirmSeparatelyFromTeamNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the individual provided with the relevant fair processing information?"
        );
    }
    function handle141ConfirmExerciseDataProtectionRightsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does you design your processes so that, as far as possible, it is as easy for a child to get their personal data erased as it was for them to provide it in the first place?"
        );
    }
    function handle141ConfirmExerciseDataProtectionRightsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does you design your processes so that, as far as possible, it is as easy for a child to get their personal data erased as it was for them to provide it in the first place?"
        );
    }
    function handle141ConfirmExerciseDataProtectionRightsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does you design your processes so that, as far as possible, it is as easy for a child to get their personal data erased as it was for them to provide it in the first place?"
        );
    }
    function handle141ConfirmExerciseDataProtectionRightsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does you design your processes so that, as far as possible, it is as easy for a child to get their personal data erased as it was for them to provide it in the first place?"
        );
    }
    function handle167ConfirmCookiesPolicyYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does cookie policy explain that consent is being requested for the storage and access of cookies in and from the users’ terminal equipment?"
        );
    }
    function handle167ConfirmCookiesPolicyNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does cookie policy explain that consent is being requested for the storage and access of cookies in and from the users’ terminal equipment?"
        );
    }
    function handle175ConfirmBugReportingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation collect usage or bug report data (e.g. Google/Adobe Analytics)?"
        );
    }
    function handle175ConfirmBugReportingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Appointment of a Data Protection Officer?"
        );
    }
    function handle95ConfirmSetOutTheTypeOfDataYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the obligations and rights of the 'Controller'?"
        );
    }
    function handle95ConfirmSetOutTheTypeOfDataNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the obligations and rights of the 'Controller'?"
        );
    }
    function handle95ConfirmSetOutTheTypeOfDataYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the obligations and rights of the 'Controller'?"
        );
    }
    function handle95ConfirmSetOutTheTypeOfDataNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts clearly set out the obligations and rights of the 'Controller'?"
        );
    }
    function handle113ConfirmIncludeRetentionPeriodYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the right to lodge a complaint with a supervisory authority (in the UK this would be the Information Commissioner's Office (ICO))?"
        );
    }
    function handle113ConfirmIncludeRetentionPeriodNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the right to lodge a complaint with a supervisory authority (in the UK this would be the Information Commissioner's Office (ICO))?"
        );
    }
    function handle113ConfirmIncludeRetentionPeriodYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the right to lodge a complaint with a supervisory authority (in the UK this would be the Information Commissioner's Office (ICO))?"
        );
    }
    function handle113ConfirmIncludeRetentionPeriodNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the right to lodge a complaint with a supervisory authority (in the UK this would be the Information Commissioner's Office (ICO))?"
        );
    }
    function handle128ConfirmFairProcessInfoYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can the individual withdraw consent as easily as it was given (e.g. via the same electronic interface, an unsubscribe link; instructions in emails contained in all communications)?"
        );
    }
    function handle128ConfirmFairProcessInfoNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can the individual withdraw consent as easily as it was given (e.g. via the same electronic interface, an unsubscribe link; instructions in emails contained in all communications)?"
        );
    }
    function handle128ConfirmFairProcessInfoYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can the individual withdraw consent as easily as it was given (e.g. via the same electronic interface, an unsubscribe link; instructions in emails contained in all communications)?"
        );
    }
    function handle128ConfirmFairProcessInfoNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can the individual withdraw consent as easily as it was given (e.g. via the same electronic interface, an unsubscribe link; instructions in emails contained in all communications)?"
        );
    }
    function handle142ConfirmGetPdErasedEasilyYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation complies with all the requirements of the UK/EU data protection legislation, not just those specifically relating to children and included in this checklist?"
        );
    }
    function handle142ConfirmGetPdErasedEasilyNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation complies with all the requirements of the UK/EU data protection legislation, not just those specifically relating to children and included in this checklist?"
        );
    }
    function handle142ConfirmGetPdErasedEasilyYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation complies with all the requirements of the UK/EU data protection legislation, not just those specifically relating to children and included in this checklist?"
        );
    }
    function handle142ConfirmGetPdErasedEasilyNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation complies with all the requirements of the UK/EU data protection legislation, not just those specifically relating to children and included in this checklist?"
        );
    }
    function handle168ConfirmCookieExplainYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the cookie policy ensures consent valid by requiring a clear affirmative action from the user (e.g. pre-ticked boxes or inactivity do not constitute valid consent)?"
        );
    }
    function handle168ConfirmCookieExplainNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the cookie policy ensures consent valid by requiring a clear affirmative action from the user (e.g. pre-ticked boxes or inactivity do not constitute valid consent)?"
        );
    }
    function handle168ConfirmCookieExplainYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the cookie policy ensures consent valid by requiring a clear affirmative action from the user (e.g. pre-ticked boxes or inactivity do not constitute valid consent)?"
        );
    }
    function handle168ConfirmCookieExplainNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the cookie policy ensures consent valid by requiring a clear affirmative action from the user (e.g. pre-ticked boxes or inactivity do not constitute valid consent)?"
        );
    }
    function handle176ConfirmCollectBugReportDataYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is it collected with informed and valid consent of the user?"
        );
    }
    function handle176ConfirmCollectBugReportDataNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is it collected with informed and valid consent of the user?"
        );
    }
    function handle179ConfirmDpoYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation have a designated Data Protection Officer who is formally tasked with ensuring that you/your organisation is aware of, and complies with, its data protection responsibilities?"
        );
    }
    function handle179ConfirmDpoNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product an application for a smart-phone or tablet?"
        );
    }
    function handle96ConfirmSetOutObligationOfControllerYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to only act on the written instructions of the 'Controller'?"
        );
    }
    function handle96ConfirmSetOutObligationOfControllerNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to only act on the written instructions of the 'Controller'?"
        );
    }
    function handle96ConfirmSetOutObligationOfControllerYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to only act on the written instructions of the 'Controller'?"
        );
    }
    function handle96ConfirmSetOutObligationOfControllerNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to only act on the written instructions of the 'Controller'?"
        );
    }
    function handle114ConfirmIncludeRigthToLodgeYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include whether the provision of personal data is part of a statutory or contractual requirement or obligation and possible consequences of failing to provide the personal data?"
        );
    }
    function handle114ConfirmIncludeRigthToLodgeNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include whether the provision of personal data is part of a statutory or contractual requirement or obligation and possible consequences of failing to provide the personal data?"
        );
    }
    function handle114ConfirmIncludeRigthToLodgeYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include whether the provision of personal data is part of a statutory or contractual requirement or obligation and possible consequences of failing to provide the personal data?"
        );
    }
    function handle114ConfirmIncludeRigthToLodgeNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include whether the provision of personal data is part of a statutory or contractual requirement or obligation and possible consequences of failing to provide the personal data?"
        );
    }
    function handle129ConfirmWithdrawConsentEasilyYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is consent obtained separately for every type of purpose foreseen, for example marketing?"
        );
    }
    function handle129ConfirmWithdrawConsentEasilyNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is consent obtained separately for every type of purpose foreseen, for example marketing?"
        );
    }
    function handle129ConfirmWithdrawConsentEasilyYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is consent obtained separately for every type of purpose foreseen, for example marketing?"
        );
    }
    function handle129ConfirmWithdrawConsentEasilyNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is consent obtained separately for every type of purpose foreseen, for example marketing?"
        );
    }
    function handle143ConfirmCompliesRequirementsOfUkDataYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does you/your organisation design your processing with children in mind from the outset and uses a data protection by design and by default approach?"
        );
    }
    function handle143ConfirmCompliesRequirementsOfUkDataNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does you/your organisation design your processing with children in mind from the outset and uses a data protection by design and by default approach?"
        );
    }
    function handle143ConfirmCompliesRequirementsOfUkDataYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does you/your organisation design your processing with children in mind from the outset and uses a data protection by design and by default approach?"
        );
    }
    function handle143ConfirmCompliesRequirementsOfUkDataNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does you/your organisation design your processing with children in mind from the outset and uses a data protection by design and by default approach?"
        );
    }
    function handle169ConfirmValidCookieYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "The cookie policy fully explains the purpose, in plain language, of each cookie type being used."
        );
    }
    function handle169ConfirmValidCookieNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "The cookie policy fully explains the purpose, in plain language, of each cookie type being used."
        );
    }
    function handle169ConfirmValidCookieYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "The cookie policy fully explains the purpose, in plain language, of each cookie type being used."
        );
    }
    function handle169ConfirmValidCookieNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "The cookie policy fully explains the purpose, in plain language, of each cookie type being used."
        );
    }
    function handle177ConfirmInformedConsentOfUserYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is it collected using fully anonymised data (e.g. no personal data, such as tracking data, is collected by you/your organisation or any third party?"
        );
    }
    function handle177ConfirmInformedConsentOfUserNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is it collected using fully anonymised data (e.g. no personal data, such as tracking data, is collected by you/your organisation or any third party?"
        );
    }
    function handle177ConfirmInformedConsentOfUserYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is it collected using fully anonymised data (e.g. no personal data, such as tracking data, is collected by you/your organisation or any third party?"
        );
    }
    function handle177ConfirmInformedConsentOfUserNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is it collected using fully anonymised data (e.g. no personal data, such as tracking data, is collected by you/your organisation or any third party?"
        );
    }
    function handle180ConfirmHaveDpoYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product an application for a smart-phone or tablet?"
        );
    }
    function handle180ConfirmHaveDpoNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product an application for a smart-phone or tablet?"
        );
    }
    function handle181ConfirmProductAMobileDevicesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product access, process or store personal or sensitive personal data?"
        );
    }
    function handle181ConfirmProductAMobileDevicesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the colour contrast of the text on your native app comply with WCAG 2.0 AA level requirements? All text in your product must have a contrast ratio of at least 4.5 : 1.?"
        );
    }
    function handle97ConfirmProcessorActOnTheWrittenInstructionYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to ensure that their employees processing the data are subject to a duty of confidence?"
        );
    }
    function handle97ConfirmProcessorActOnTheWrittenInstructionNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to ensure that their employees processing the data are subject to a duty of confidence?"
        );
    }
    function handle97ConfirmProcessorActOnTheWrittenInstructionYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to ensure that their employees processing the data are subject to a duty of confidence?"
        );
    }
    function handle97ConfirmProcessorActOnTheWrittenInstructionNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to ensure that their employees processing the data are subject to a duty of confidence?"
        );
    }
    function handle115ConfirmIncludeFailingToTheProvbideThePeronalDataYes(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the existence of automated decision making including profiling and information about how decisions are made, the significance and the consequences?"
        );
    }
    function handle115ConfirmIncludeFailingToTheProvbideThePeronalDataNo(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the existence of automated decision making including profiling and information about how decisions are made, the significance and the consequences?"
        );
    }
    function handle115ConfirmIncludeFailingToTheProvbideThePeronalDataYes2(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the existence of automated decision making including profiling and information about how decisions are made, the significance and the consequences?"
        );
    }
    function handle115ConfirmIncludeFailingToTheProvbideThePeronalDataNo2(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the existence of automated decision making including profiling and information about how decisions are made, the significance and the consequences?"
        );
    }
    function handle130ConfirmObtainedSeperatelyYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is consent recorded?");
    }
    function handle130ConfirmObtainedSeperatelyNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is consent recorded?");
    }
    function handle130ConfirmObtainedSeperatelyYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is consent recorded?");
    }
    function handle130ConfirmObtainedSeperatelyNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is consent recorded?");
    }
    function handle144ConfirmProcessChilDfromOutsetYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation makes sure that your processing is fair and complies with the data protection principles?"
        );
    }
    function handle144ConfirmProcessChilDfromOutsetNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation makes sure that your processing is fair and complies with the data protection principles?"
        );
    }
    function handle144ConfirmProcessChilDfromOutsetYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation makes sure that your processing is fair and complies with the data protection principles?"
        );
    }
    function handle144ConfirmProcessChilDfromOutsetNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation makes sure that your processing is fair and complies with the data protection principles?"
        );
    }
    function handle170ConfirmCookieExplainThePurposeYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use strictly necessary’ cookies (without which the end user would be unable to use the specific service explicitly requested)?"
        );
    }
    function handle170ConfirmCookieExplainThePurposeNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use strictly necessary’ cookies (without which the end user would be unable to use the specific service explicitly requested)?"
        );
    }
    function handle170ConfirmCookieExplainThePurposeYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use strictly necessary’ cookies (without which the end user would be unable to use the specific service explicitly requested)?"
        );
    }
    function handle170ConfirmCookieExplainThePurposeNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use strictly necessary’ cookies (without which the end user would be unable to use the specific service explicitly requested)?"
        );
    }
    function handle178ConfirmFullyAnonymisedYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Appointment of a Data Protection Officer?"
        );
    }
    function handle178ConfirmFullyAnonymisedNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Appointment of a Data Protection Officer?"
        );
    }
    function handle178ConfirmFullyAnonymisedYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Appointment of a Data Protection Officer?"
        );
    }
    function handle178ConfirmFullyAnonymisedNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Appointment of a Data Protection Officer?"
        );
    }
    function handle181ConfirmProductAMobileDevicesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product access, process or store personal or sensitive personal data?"
        );
    }
    function handle181ConfirmProductAMobileDevicesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the colour contrast of the text on your native app comply with WCAG 2.0 AA level requirements? All text in your product must have a contrast ratio of at least 4.5 : 1.?"
        );
    }
    function handle181ConfirmProductAMobileDevicesYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product access, process or store personal or sensitive personal data?"
        );
    }
    function handle181ConfirmProductAMobileDevicesNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the colour contrast of the text on your native app comply with WCAG 2.0 AA level requirements? All text in your product must have a contrast ratio of at least 4.5 : 1.?"
        );
    }
    function handle182ConfirmProductProcessesPdYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product an application for a smart-phone or tablet AND accesses, processes or stores personal or sensitive personal data?"
        );
    }
    function handle182ConfirmProductProcessesPdNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Has a code-level security assessment been undertaken?");
    }
    function handle188ConfirmColorYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Did you follow the 6 key principles under the human- centred design process that conforms to the ISO 9241-210 Standard?"
        );
    }
    function handle188ConfirmColorNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Did you follow the 6 key principles under the human- centred design process that conforms to the ISO 9241-210 Standard?"
        );
    }
    function handle98ConfirmUnsureTheirEmployeesProcessingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to take appropriate measures to ensure the security of processing?"
        );
    }
    function handle98ConfirmUnsureTheirEmployeesProcessingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to take appropriate measures to ensure the security of processing?"
        );
    }
    function handle98ConfirmUnsureTheirEmployeesProcessingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to take appropriate measures to ensure the security of processing?"
        );
    }
    function handle98ConfirmUnsureTheirEmployeesProcessingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to take appropriate measures to ensure the security of processing?"
        );
    }
    function handle116ConfirmIncludeConsequencesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include The existence of the data subject’s right to access/obtain a copy of their personal data?"
        );
    }
    function handle116ConfirmIncludeConsequencesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include The existence of the data subject’s right to access/obtain a copy of their personal data?"
        );
    }
    function handle116ConfirmIncludeConsequencesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include The existence of the data subject’s right to access/obtain a copy of their personal data?"
        );
    }
    function handle116ConfirmIncludeConsequencesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include The existence of the data subject’s right to access/obtain a copy of their personal data?"
        );
    }
    function handle131ConfirmRecordedYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can your organisation  evidence that the individual gave their valid consent to the processing (e.g. how and when consent was obtained and the information provided to the individual (data subject) at the time)?"
        );
    }
    function handle131ConfirmRecordedNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can your organisation  evidence that the individual gave their valid consent to the processing (e.g. how and when consent was obtained and the information provided to the individual (data subject) at the time)?"
        );
    }
    function handle131ConfirmRecordedYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can your organisation  evidence that the individual gave their valid consent to the processing (e.g. how and when consent was obtained and the information provided to the individual (data subject) at the time)?"
        );
    }
    function handle131ConfirmRecordedNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can your organisation  evidence that the individual gave their valid consent to the processing (e.g. how and when consent was obtained and the information provided to the individual (data subject) at the time)?"
        );
    }
    function handle145ConfirmFairAndCompliesWithDppYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Data Protection Impact Assessments (DPIAs) to help you assess and mitigate the risks to children?"
        );
    }
    function handle145ConfirmFairAndCompliesWithDppNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Data Protection Impact Assessments (DPIAs) to help you assess and mitigate the risks to children?"
        );
    }
    function handle145ConfirmFairAndCompliesWithDppYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Data Protection Impact Assessments (DPIAs) to help you assess and mitigate the risks to children?"
        );
    }
    function handle145ConfirmFairAndCompliesWithDppNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Data Protection Impact Assessments (DPIAs) to help you assess and mitigate the risks to children?"
        );
    }
    function handle171ConfirmUseStrictlyNecessaryCookiesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does you organisation Exclude 'strictly necessary' cookies, is consent obtained for each separate cookie purpose?"
        );
    }
    function handle171ConfirmUseStrictlyNecessaryCookiesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does you organisation Exclude 'strictly necessary' cookies, is consent obtained for each separate cookie purpose?"
        );
    }
    function handle171ConfirmUseStrictlyNecessaryCookiesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does you organisation Exclude 'strictly necessary' cookies, is consent obtained for each separate cookie purpose?"
        );
    }
    function handle171ConfirmUseStrictlyNecessaryCookiesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does you organisation Exclude 'strictly necessary' cookies, is consent obtained for each separate cookie purpose?"
        );
    }
    function handle179ConfirmDpoYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation have a designated Data Protection Officer who is formally tasked with ensuring that you/your organisation is aware of, and complies with, its data protection responsibilities?"
        );
    }
    function handle179ConfirmDpoNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product an application for a smart-phone or tablet?"
        );
    }
    function handle179ConfirmDpoYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation have a designated Data Protection Officer who is formally tasked with ensuring that you/your organisation is aware of, and complies with, its data protection responsibilities?"
        );
    }
    function handle179ConfirmDpoNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product an application for a smart-phone or tablet?"
        );
    }
    function handle183ConfirmSmartPhoneAndProcessPdYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is sensitive personal data persisted to the mobile device?");
    }
    function handle183ConfirmSmartPhoneAndProcessPdNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Has a code-level security assessment been undertaken?");
    }
    function handle185ConfirmCodeLevelSecurityYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can your organisation evidence of the assessment report?");
    }
    function handle185ConfirmCodeLevelSecurityNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the colour contrast of the text on your native app comply with WCAG 2.0 AA level requirements? All text in your product must have a contrast ratio of at least 4.5 : 1.?"
        );
    }
    function handle189ConfirmFollow6PrinciplesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what phases did your human-centred design process go through? For example discovery, alpha, beta, go live?"
        );
    }
    function handle189ConfirmFollow6PrinciplesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what phases did your human-centred design process go through? For example discovery, alpha, beta, go live?"
        );
    }
    function handle189ConfirmFollow6PrinciplesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what phases did your human-centred design process go through? For example discovery, alpha, beta, go live?"
        );
    }
    function handle189ConfirmFollow6PrinciplesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what phases did your human-centred design process go through? For example discovery, alpha, beta, go live?"
        );
    }
    function handle99ConfirmEnsureTheSecurityOfProcessingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to only engage 'Sub- Processors' with the prior consent of the 'Controller' and under the same conditions as the processing written contract?"
        );
    }
    function handle99ConfirmEnsureTheSecurityOfProcessingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to only engage 'Sub- Processors' with the prior consent of the 'Controller' and under the same conditions as the processing written contract?"
        );
    }
    function handle99ConfirmEnsureTheSecurityOfProcessingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to only engage 'Sub- Processors' with the prior consent of the 'Controller' and under the same conditions as the processing written contract?"
        );
    }
    function handle99ConfirmEnsureTheSecurityOfProcessingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to only engage 'Sub- Processors' with the prior consent of the 'Controller' and under the same conditions as the processing written contract?"
        );
    }
    function handle117ConfirmIncludeObtainCopyOfPdYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include The existence of the data subject’s rights to rectify, erase and restrict their personal data?"
        );
    }
    function handle117ConfirmIncludeObtainCopyOfPdNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include The existence of the data subject’s rights to rectify, erase and restrict their personal data?"
        );
    }
    function handle117ConfirmIncludeObtainCopyOfPdYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include The existence of the data subject’s rights to rectify, erase and restrict their personal data?"
        );
    }
    function handle117ConfirmIncludeObtainCopyOfPdNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include The existence of the data subject’s rights to rectify, erase and restrict their personal data?"
        );
    }
    function handle132ConfirmEvidenceOfValidConsentYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the individual required to provide a clear affirmative action to signify consent to the processing of personal data for each purpose?"
        );
    }
    function handle132ConfirmEvidenceOfValidConsentNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the individual required to provide a clear affirmative action to signify consent to the processing of personal data for each purpose?"
        );
    }
    function handle132ConfirmEvidenceOfValidConsentYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the individual required to provide a clear affirmative action to signify consent to the processing of personal data for each purpose?"
        );
    }
    function handle132ConfirmEvidenceOfValidConsentNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the individual required to provide a clear affirmative action to signify consent to the processing of personal data for each purpose?"
        );
    }
    function handle146ConfirmUseDpiasYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your processing  likely to result in a high risk to the rights and freedom of children, then you always complete a DPIA?"
        );
    }
    function handle146ConfirmUseDpiasNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your processing  likely to result in a high risk to the rights and freedom of children, then you always complete a DPIA?"
        );
    }
    function handle146ConfirmUseDpiasYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your processing  likely to result in a high risk to the rights and freedom of children, then you always complete a DPIA?"
        );
    }
    function handle146ConfirmUseDpiasNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your processing  likely to result in a high risk to the rights and freedom of children, then you always complete a DPIA?"
        );
    }
    function handle172ConfirmExcludeStrictlyNecessaryCookiesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can your organisation evidence that the individual gave their valid consent to the processing (e.g. how and when consent was obtained and the information provided to the individual (data subject) at the time)?"
        );
    }
    function handle172ConfirmExcludeStrictlyNecessaryCookiesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can your organisation evidence that the individual gave their valid consent to the processing (e.g. how and when consent was obtained and the information provided to the individual (data subject) at the time)?"
        );
    }
    function handle172ConfirmExcludeStrictlyNecessaryCookiesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can your organisation evidence that the individual gave their valid consent to the processing (e.g. how and when consent was obtained and the information provided to the individual (data subject) at the time)?"
        );
    }
    function handle172ConfirmExcludeStrictlyNecessaryCookiesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can your organisation evidence that the individual gave their valid consent to the processing (e.g. how and when consent was obtained and the information provided to the individual (data subject) at the time)?"
        );
    }
    function handle184ConfirmPersistedToMobileDevicesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Has a code-level security assessment been undertaken?");
    }
    function handle184ConfirmPersistedToMobileDevicesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Has a code-level security assessment been undertaken?");
    }
    function handle185ConfirmCodeLevelSecurityYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can your organisation evidence of the assessment report?");
    }
    function handle185ConfirmCodeLevelSecurityNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the colour contrast of the text on your native app comply with WCAG 2.0 AA level requirements? All text in your product must have a contrast ratio of at least 4.5 : 1.?"
        );
    }
    function handle186ConfirmEvidenceOfCodeLevelReportYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has the security assessment been undertaken by an external body?"
        );
    }
    function handle186ConfirmEvidenceOfCodeLevelReportNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Has the security assessment been undertaken by an external body?"
        );
    }
    function handle188ConfirmColorYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Did you follow the 6 key principles under the human- centred design process that conforms to the ISO 9241-210 Standard?"
        );
    }
    function handle188ConfirmColorNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Did you follow the 6 key principles under the human- centred design process that conforms to the ISO 9241-210 Standard?"
        );
    }
    function handle190ProvidePhaseOfHumanCentredDesignYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what user demographics were defined at the outset of your product's development?"
        );
    }
    function handle190ProvidePhaseOfHumanCentredDesignNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what user demographics were defined at the outset of your product's development?"
        );
    }
    function handle190ProvidePhaseOfHumanCentredDesignYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what user demographics were defined at the outset of your product's development?"
        );
    }
    function handle190ProvidePhaseOfHumanCentredDesignNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what user demographics were defined at the outset of your product's development?"
        );
    }
    function handle100ConfirmOnlyEngageSubProcessingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to assist the 'Controller' in providing subject access and allowing data subjects to exercise their rights under the UK/EU law?"
        );
    }
    function handle100ConfirmOnlyEngageSubProcessingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to assist the 'Controller' in providing subject access and allowing data subjects to exercise their rights under the UK/EU law?"
        );
    }
    function handle100ConfirmOnlyEngageSubProcessingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to assist the 'Controller' in providing subject access and allowing data subjects to exercise their rights under the UK/EU law?"
        );
    }
    function handle100ConfirmOnlyEngageSubProcessingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to assist the 'Controller' in providing subject access and allowing data subjects to exercise their rights under the UK/EU law?"
        );
    }
    function handle118ConfirmIncludeRestrictTheirPdYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the existence of the data subject’s rights to object to the processing?"
        );
    }
    function handle118ConfirmIncludeRestrictTheirPdNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the existence of the data subject’s rights to object to the processing?"
        );
    }
    function handle118ConfirmIncludeRestrictTheirPdYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the existence of the data subject’s rights to object to the processing?"
        );
    }
    function handle118ConfirmIncludeRestrictTheirPdNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the existence of the data subject’s rights to object to the processing?"
        );
    }
    function handle133ConfirmAffirmativeYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your organisation NOT use pre-ticked opt-in boxes?");
    }
    function handle133ConfirmAffirmativeNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your organisation NOT use pre-ticked opt-in boxes?");
    }
    function handle133ConfirmAffirmativeYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your organisation NOT use pre-ticked opt-in boxes?");
    }
    function handle133ConfirmAffirmativeNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your organisation NOT use pre-ticked opt-in boxes?");
    }
    function handle147ConfirmRiskOfChildsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide privacy notices which are clear, and written in plain, age-appropriate language?"
        );
    }
    function handle147ConfirmRiskOfChildsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide privacy notices which are clear, and written in plain, age-appropriate language?"
        );
    }
    function handle147ConfirmRiskOfChildsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide privacy notices which are clear, and written in plain, age-appropriate language?"
        );
    }
    function handle147ConfirmRiskOfChildsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide privacy notices which are clear, and written in plain, age-appropriate language?"
        );
    }
    function handle173ConfirmEvidenceValidConsentYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can the consent be withdrawn as easily as it was given (e.g. via the same electronic interface)?"
        );
    }
    function handle173ConfirmEvidenceValidConsentNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can the consent be withdrawn as easily as it was given (e.g. via the same electronic interface)?"
        );
    }
    function handle173ConfirmEvidenceValidConsentYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can the consent be withdrawn as easily as it was given (e.g. via the same electronic interface)?"
        );
    }
    function handle173ConfirmEvidenceValidConsentNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can the consent be withdrawn as easily as it was given (e.g. via the same electronic interface)?"
        );
    }
    function handle185ConfirmCodeLevelSecurityYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can your organisation evidence of the assessment report?");
    }
    function handle185ConfirmCodeLevelSecurityNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the colour contrast of the text on your native app comply with WCAG 2.0 AA level requirements? All text in your product must have a contrast ratio of at least 4.5 : 1.?"
        );
    }
    function handle185ConfirmCodeLevelSecurityYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can your organisation evidence of the assessment report?");
    }
    function handle185ConfirmCodeLevelSecurityNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the colour contrast of the text on your native app comply with WCAG 2.0 AA level requirements? All text in your product must have a contrast ratio of at least 4.5 : 1.?"
        );
    }
    function handle187ConfirmByExternalBodyYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the colour contrast of the text on your native app comply with WCAG 2.0 AA level requirements? All text in your product must have a contrast ratio of at least 4.5 : 1.?"
        );
    }
    function handle187ConfirmByExternalBodyNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the colour contrast of the text on your native app comply with WCAG 2.0 AA level requirements? All text in your product must have a contrast ratio of at least 4.5 : 1.?"
        );
    }
    function handle187ConfirmByExternalBodyYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the colour contrast of the text on your native app comply with WCAG 2.0 AA level requirements? All text in your product must have a contrast ratio of at least 4.5 : 1.?"
        );
    }
    function handle187ConfirmByExternalBodyNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the colour contrast of the text on your native app comply with WCAG 2.0 AA level requirements? All text in your product must have a contrast ratio of at least 4.5 : 1.?"
        );
    }
    function handle191ProvideUserDemographicsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can yo ugive what user research informed your user needs?");
    }
    function handle191ProvideUserDemographicsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can yo ugive what user research informed your user needs?");
    }
    function handle191ProvideUserDemographicsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can yo ugive what user research informed your user needs?");
    }
    function handle191ProvideUserDemographicsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can yo ugive what user research informed your user needs?");
    }
    function handle101ConfirmDataSubjectToExerciseTheirRightsUnderUkLawsYes(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to assist the 'Controller' in meeting its UK/EU data protection law obligations in relation to:  the security of processing  the notification of personal data breaches, and  data protection impact assessment?"
        );
    }
    function handle101ConfirmDataSubjectToExerciseTheirRightsUnderUkLawsNo(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to assist the 'Controller' in meeting its UK/EU data protection law obligations in relation to:  the security of processing  the notification of personal data breaches, and  data protection impact assessment?"
        );
    }
    function handle101ConfirmDataSubjectToExerciseTheirRightsUnderUkLawsYes2(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to assist the 'Controller' in meeting its UK/EU data protection law obligations in relation to:  the security of processing  the notification of personal data breaches, and  data protection impact assessment?"
        );
    }
    function handle101ConfirmDataSubjectToExerciseTheirRightsUnderUkLawsNo2(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to assist the 'Controller' in meeting its UK/EU data protection law obligations in relation to:  the security of processing  the notification of personal data breaches, and  data protection impact assessment?"
        );
    }
    function handle119ConfirmIncludeExistenceOfTheDataYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include existence of the data subject’s rights to withdraw consent (if consent is the legal basis)?"
        );
    }
    function handle119ConfirmIncludeExistenceOfTheDataNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include existence of the data subject’s rights to withdraw consent (if consent is the legal basis)?"
        );
    }
    function handle119ConfirmIncludeExistenceOfTheDataYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include existence of the data subject’s rights to withdraw consent (if consent is the legal basis)?"
        );
    }
    function handle119ConfirmIncludeExistenceOfTheDataNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include existence of the data subject’s rights to withdraw consent (if consent is the legal basis)?"
        );
    }
    function handle134ConfirmNotPredictedYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your organisation NOT use blank opt-out boxes?");
    }
    function handle134ConfirmNotPredictedNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your organisation NOT use blank opt-out boxes?");
    }
    function handle134ConfirmNotPredictedYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your organisation NOT use blank opt-out boxes?");
    }
    function handle134ConfirmNotPredictedNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your organisation NOT use blank opt-out boxes?");
    }
    function handle148ConfirmPrivacyNoticesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use child friendly ways of presenting privacy information, such as diagrams, cartoons, graphics and videos, dashboards, layered and just-in-time notices, icons and symbols?"
        );
    }
    function handle148ConfirmPrivacyNoticesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use child friendly ways of presenting privacy information, such as diagrams, cartoons, graphics and videos, dashboards, layered and just-in-time notices, icons and symbols?"
        );
    }
    function handle148ConfirmPrivacyNoticesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use child friendly ways of presenting privacy information, such as diagrams, cartoons, graphics and videos, dashboards, layered and just-in-time notices, icons and symbols?"
        );
    }
    function handle148ConfirmPrivacyNoticesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use child friendly ways of presenting privacy information, such as diagrams, cartoons, graphics and videos, dashboards, layered and just-in-time notices, icons and symbols?"
        );
    }
    function handle174ConfirmConsentWithdrawEasilyYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Bug reporting and Online tracking?"
        );
    }
    function handle174ConfirmConsentWithdrawEasilyNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Bug reporting and Online tracking?"
        );
    }
    function handle174ConfirmConsentWithdrawEasilyYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Bug reporting and Online tracking?"
        );
    }
    function handle174ConfirmConsentWithdrawEasilyNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Bug reporting and Online tracking?"
        );
    }
    function handle188ConfirmColorYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Did you follow the 6 key principles under the human- centred design process that conforms to the ISO 9241-210 Standard?"
        );
    }
    function handle188ConfirmColorNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Did you follow the 6 key principles under the human- centred design process that conforms to the ISO 9241-210 Standard?"
        );
    }
    function handle188ConfirmColorYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Did you follow the 6 key principles under the human- centred design process that conforms to the ISO 9241-210 Standard?"
        );
    }
    function handle188ConfirmColorNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Did you follow the 6 key principles under the human- centred design process that conforms to the ISO 9241-210 Standard?"
        );
    }
    function handle192ResearchInformedUserNeedsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you list each user need your product addresses, and the acceptance criteria for each need?"
        );
    }
    function handle192ResearchInformedUserNeedsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you list each user need your product addresses, and the acceptance criteria for each need?"
        );
    }
    function handle192ResearchInformedUserNeedsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you list each user need your product addresses, and the acceptance criteria for each need?"
        );
    }
    function handle192ResearchInformedUserNeedsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you list each user need your product addresses, and the acceptance criteria for each need?"
        );
    }
    function handle102ConfirmProcessorAssistControllerYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to tell the 'Controller' immediately if it is asked to do something infringing UK/EU data protection law?"
        );
    }
    function handle102ConfirmProcessorAssistControllerNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to tell the 'Controller' immediately if it is asked to do something infringing UK/EU data protection law?"
        );
    }
    function handle102ConfirmProcessorAssistControllerYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to tell the 'Controller' immediately if it is asked to do something infringing UK/EU data protection law?"
        );
    }
    function handle102ConfirmProcessorAssistControllerNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do all contracts require the 'Processor' to tell the 'Controller' immediately if it is asked to do something infringing UK/EU data protection law?"
        );
    }
    function handle120ConfirmIncludeRightToWithdrawConsentYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include existence of the data subject’s rights to data portability (provide the personal data in machine readable form)?"
        );
    }
    function handle120ConfirmIncludeRightToWithdrawConsentNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include existence of the data subject’s rights to data portability (provide the personal data in machine readable form)?"
        );
    }
    function handle120ConfirmIncludeRightToWithdrawConsentYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include existence of the data subject’s rights to data portability (provide the personal data in machine readable form)?"
        );
    }
    function handle120ConfirmIncludeRightToWithdrawConsentNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include existence of the data subject’s rights to data portability (provide the personal data in machine readable form)?"
        );
    }
    function handle135ConfirmNotUseBlankYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your organisation NOT use default settings?");
    }
    function handle135ConfirmNotUseBlankNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your organisation NOT use default settings?");
    }
    function handle135ConfirmNotUseBlankYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your organisation NOT use default settings?");
    }
    function handle135ConfirmNotUseBlankNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your organisation NOT use default settings?");
    }
    function handle149ConfirmFriendlyWayOfDataYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you explain to children why you require the personal data you have asked for, and what you will do with it, in a way which they can understand?"
        );
    }
    function handle149ConfirmFriendlyWayOfDataNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you explain to children why you require the personal data you have asked for, and what you will do with it, in a way which they can understand?"
        );
    }
    function handle149ConfirmFriendlyWayOfDataYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you explain to children why you require the personal data you have asked for, and what you will do with it, in a way which they can understand?"
        );
    }
    function handle149ConfirmFriendlyWayOfDataNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you explain to children why you require the personal data you have asked for, and what you will do with it, in a way which they can understand?"
        );
    }
    function handle175ConfirmBugReportingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation collect usage or bug report data (e.g. Google/Adobe Analytics)?"
        );
    }
    function handle175ConfirmBugReportingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Appointment of a Data Protection Officer?"
        );
    }
    function handle175ConfirmBugReportingYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation collect usage or bug report data (e.g. Google/Adobe Analytics)?"
        );
    }
    function handle175ConfirmBugReportingNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Appointment of a Data Protection Officer?"
        );
    }
    function handle193ProvideProductAddressesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give how many times were versions of your product tested with users?"
        );
    }
    function handle193ProvideProductAddressesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give how many times were versions of your product tested with users?"
        );
    }
    function handle193ProvideProductAddressesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give how many times were versions of your product tested with users?"
        );
    }
    function handle193ProvideProductAddressesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give how many times were versions of your product tested with users?"
        );
    }
    function handle103ConfirmProcessorTellControllerYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the personal data obtained directly from the individual?"
        );
    }
    function handle103ConfirmProcessorTellControllerNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the personal data obtained directly from the individual?"
        );
    }
    function handle103ConfirmProcessorTellControllerYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the personal data obtained directly from the individual?"
        );
    }
    function handle103ConfirmProcessorTellControllerNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is the personal data obtained directly from the individual?"
        );
    }
    function handle121ConfirmIncludeRightToDataProbabilityYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the existence of the data subject’s rights to object to decisions based solely on automated processing (which could include profiling), if the decisions produce legal effects or similarly significantly affects the data subject?"
        );
    }
    function handle121ConfirmIncludeRightToDataProbabilityNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the existence of the data subject’s rights to object to decisions based solely on automated processing (which could include profiling), if the decisions produce legal effects or similarly significantly affects the data subject?"
        );
    }
    function handle121ConfirmIncludeRightToDataProbabilityYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the existence of the data subject’s rights to object to decisions based solely on automated processing (which could include profiling), if the decisions produce legal effects or similarly significantly affects the data subject?"
        );
    }
    function handle121ConfirmIncludeRightToDataProbabilityNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include the existence of the data subject’s rights to object to decisions based solely on automated processing (which could include profiling), if the decisions produce legal effects or similarly significantly affects the data subject?"
        );
    }
    function handle136ConfirmNotDefaultSettingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation NOT use a blanket acceptance of your terms and conditions?"
        );
    }
    function handle136ConfirmNotDefaultSettingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation NOT use a blanket acceptance of your terms and conditions?"
        );
    }
    function handle136ConfirmNotDefaultSettingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation NOT use a blanket acceptance of your terms and conditions?"
        );
    }
    function handle136ConfirmNotDefaultSettingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation NOT use a blanket acceptance of your terms and conditions?"
        );
    }
    function handle150ConfirmexplainToChildsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation Explain the risks inherent in the processing, and how you intend to safeguard against them, in a child friendly way, so that children (and their parents) understand the implications of sharing their personal data?"
        );
    }
    function handle150ConfirmexplainToChildsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation Explain the risks inherent in the processing, and how you intend to safeguard against them, in a child friendly way, so that children (and their parents) understand the implications of sharing their personal data?"
        );
    }
    function handle150ConfirmexplainToChildsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation Explain the risks inherent in the processing, and how you intend to safeguard against them, in a child friendly way, so that children (and their parents) understand the implications of sharing their personal data?"
        );
    }
    function handle150ConfirmexplainToChildsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation Explain the risks inherent in the processing, and how you intend to safeguard against them, in a child friendly way, so that children (and their parents) understand the implications of sharing their personal data?"
        );
    }
    function handle194ProvideTimesTestedYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Was your product evaluated for usability and accessibility before release?"
        );
    }
    function handle194ProvideTimesTestedNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Was your product evaluated for usability and accessibility before release?"
        );
    }
    function handle194ProvideTimesTestedYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Was your product evaluated for usability and accessibility before release?"
        );
    }
    function handle194ProvideTimesTestedNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Was your product evaluated for usability and accessibility before release?"
        );
    }
    function handle104ConfirmPdFromIndividualYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is fair processing information provided at the time the personal data is obtained?"
        );
    }
    function handle104ConfirmPdFromIndividualNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the personal data obtained from a third party?");
    }
    function handle104ConfirmPdFromIndividualYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is fair processing information provided at the time the personal data is obtained?"
        );
    }
    function handle104ConfirmPdFromIndividualNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is the personal data obtained from a third party?");
    }
    function handle122ConfirmIncludeDecissionBasedOnAutomatedProcessingYes(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include Users are notified of substantial changes to the existing transparency information (and consent obtained again unless the consent obtained previously remains valid)?"
        );
    }
    function handle122ConfirmIncludeDecissionBasedOnAutomatedProcessingNo(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include Users are notified of substantial changes to the existing transparency information (and consent obtained again unless the consent obtained previously remains valid)?"
        );
    }
    function handle122ConfirmIncludeDecissionBasedOnAutomatedProcessingYes2(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include Users are notified of substantial changes to the existing transparency information (and consent obtained again unless the consent obtained previously remains valid)?"
        );
    }
    function handle122ConfirmIncludeDecissionBasedOnAutomatedProcessingNo2(
        agent
    ) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation include Users are notified of substantial changes to the existing transparency information (and consent obtained again unless the consent obtained previously remains valid)?"
        );
    }
    function handle137ConfirmNotUseABlanketAcceptanceYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation ensures that an individual who refuses or withdraws consent can do so without detriment to the service provided (e.g. an individual is not unfairly penalised - though it is acceptable to offer additiona?"
        );
    }
    function handle137ConfirmNotUseABlanketAcceptanceNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation ensures that an individual who refuses or withdraws consent can do so without detriment to the service provided (e.g. an individual is not unfairly penalised - though it is acceptable to offer additiona?"
        );
    }
    function handle137ConfirmNotUseABlanketAcceptanceYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation ensures that an individual who refuses or withdraws consent can do so without detriment to the service provided (e.g. an individual is not unfairly penalised - though it is acceptable to offer additiona?"
        );
    }
    function handle137ConfirmNotUseABlanketAcceptanceNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation ensures that an individual who refuses or withdraws consent can do so without detriment to the service provided (e.g. an individual is not unfairly penalised - though it is acceptable to offer additiona?"
        );
    }
    function handle151ConfirmExplainRiskOfInherentYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation tell children what rights they have over their personal data in language they can understand?"
        );
    }
    function handle151ConfirmExplainRiskOfInherentNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation tell children what rights they have over their personal data in language they can understand?"
        );
    }
    function handle151ConfirmExplainRiskOfInherentYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation tell children what rights they have over their personal data in language they can understand?"
        );
    }
    function handle151ConfirmExplainRiskOfInherentNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation tell children what rights they have over their personal data in language they can understand?"
        );
    }
    function handle195ConfirmTestOfUsabilityAndAccessibilityYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Throughout the evaluation of early versions and pre- release versions, can you give what changes were made to your product in light of the user feedback? "
        );
    }
    function handle195ConfirmTestOfUsabilityAndAccessibilityNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a native iOS or Android app?");
    }
    function handle195ConfirmTestOfUsabilityAndAccessibilityYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Throughout the evaluation of early versions and pre- release versions, can you give what changes were made to your product in light of the user feedback? "
        );
    }
    function handle195ConfirmTestOfUsabilityAndAccessibilityNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a native iOS or Android app?");
    }
    function handle123ConfirmIncludeNotifiedWhenChangesYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does  your product processe personal OR sensitive personal data AND your organisation is a Controller and if the legal basis for processing personal data is consent?"
        );
    }
    function handle123ConfirmIncludeNotifiedWhenChangesNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does  your product processe personal OR sensitive personal data AND your organisation is a Controller and if the legal basis for processing personal data is consent?"
        );
    }
    function handle123ConfirmIncludeNotifiedWhenChangesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does  your product processe personal OR sensitive personal data AND your organisation is a Controller and if the legal basis for processing personal data is consent?"
        );
    }
    function handle123ConfirmIncludeNotifiedWhenChangesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does  your product processe personal OR sensitive personal data AND your organisation is a Controller and if the legal basis for processing personal data is consent?"
        );
    }
    function handle138ConfirmEnsureIndividualRefuseYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data of children AND your organisation is a Controller?"
        );
    }
    function handle138ConfirmEnsureIndividualRefuseNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data of children AND your organisation is a Controller?"
        );
    }
    function handle138ConfirmEnsureIndividualRefuseYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data of children AND your organisation is a Controller?"
        );
    }
    function handle138ConfirmEnsureIndividualRefuseNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data of children AND your organisation is a Controller?"
        );
    }
    function handle152ConfirmTellChildRightsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation not usually use children’s personal data to make solely automated decisions about them if these will have a legal, or a similarly significant, effect upon them?"
        );
    }
    function handle152ConfirmTellChildRightsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation not usually use children’s personal data to make solely automated decisions about them if these will have a legal, or a similarly significant, effect upon them?"
        );
    }
    function handle152ConfirmTellChildRightsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation not usually use children’s personal data to make solely automated decisions about them if these will have a legal, or a similarly significant, effect upon them?"
        );
    }
    function handle152ConfirmTellChildRightsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation not usually use children’s personal data to make solely automated decisions about them if these will have a legal, or a similarly significant, effect upon them?"
        );
    }
    function handle196ProvideUserFeedbackYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Post-release, can you giev how do you continue to collect feedback from users and make changes to your product based on this feedback?"
        );
    }
    function handle196ProvideUserFeedbackNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Post-release, can you giev how do you continue to collect feedback from users and make changes to your product based on this feedback?"
        );
    }
    function handle199IosOrAndroidYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what device OS accessibility features does your product use? For example VoiceOver (iOS), Dynamic Type (iOS), TalkBack (Android) or Select To Speak (Android)?"
        );
    }
    function handle199IosOrAndroidNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a progressive web app?");
    }
    function handle124ConfirmSpdAndControllerAndConsentYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is consent freely given, specific for each separate purpose and informed?"
        );
    }
    function handle124ConfirmSpdAndControllerAndConsentNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data of children AND your organisation is a Controller?"
        );
    }
    function handle124ConfirmSpdAndControllerAndConsentYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is consent freely given, specific for each separate purpose and informed?"
        );
    }
    function handle124ConfirmSpdAndControllerAndConsentNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product process personal OR sensitive personal data of children AND your organisation is a Controller?"
        );
    }
    function handle139ConfirmPdOfChildAndControllerYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the processes design by which a child can exercise their data protection rights with the child in mind, and make them easy for children to access and understand?"
        );
    }
    function handle139ConfirmPdOfChildAndControllerNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use cookies, web beacons or similar technologies?"
        );
    }
    function handle139ConfirmPdOfChildAndControllerYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does the processes design by which a child can exercise their data protection rights with the child in mind, and make them easy for children to access and understand?"
        );
    }
    function handle139ConfirmPdOfChildAndControllerNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use cookies, web beacons or similar technologies?"
        );
    }
    function handle153ConfirmNotUsePdToAutoDecisionYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "If you do use children’s personal data to make such decisions, then you make sure that one of the exceptions applies and that suitable, child appropriate measures are in place to safeguard the child’s rights, freedoms and legitimate interests."
        );
    }
    function handle153ConfirmNotUsePdToAutoDecisionNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "If you do use children’s personal data to make such decisions, then you make sure that one of the exceptions applies and that suitable, child appropriate measures are in place to safeguard the child’s rights, freedoms and legitimate interests."
        );
    }
    function handle153ConfirmNotUsePdToAutoDecisionYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "If you do use children’s personal data to make such decisions, then you make sure that one of the exceptions applies and that suitable, child appropriate measures are in place to safeguard the child’s rights, freedoms and legitimate interests."
        );
    }
    function handle153ConfirmNotUsePdToAutoDecisionNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "If you do use children’s personal data to make such decisions, then you make sure that one of the exceptions applies and that suitable, child appropriate measures are in place to safeguard the child’s rights, freedoms and legitimate interests."
        );
    }
    function handle197ProvidePostReleaseYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what is your post-release schedule of improvements to your product?"
        );
    }
    function handle197ProvidePostReleaseNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what is your post-release schedule of improvements to your product?"
        );
    }
    function handle197ProvidePostReleaseYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what is your post-release schedule of improvements to your product?"
        );
    }
    function handle197ProvidePostReleaseNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what is your post-release schedule of improvements to your product?"
        );
    }
    function handle200OsAccessibilityYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a progressive web app?");
    }
    function handle200OsAccessibilityNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a progressive web app?");
    }
    function handle201ConfirmProgressiveWebAppYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product comply with the baseline checklist for progressive web apps, as defined by Google?"
        );
    }
    function handle201ConfirmProgressiveWebAppNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a website?");
    }
    function handle154ConfirmNoeExceptionYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation stop any profiling of a child that is related to direct marketing if they ask you to?"
        );
    }
    function handle154ConfirmNoeExceptionNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation stop any profiling of a child that is related to direct marketing if they ask you to?"
        );
    }
    function handle154ConfirmNoeExceptionYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation stop any profiling of a child that is related to direct marketing if they ask you to?"
        );
    }
    function handle154ConfirmNoeExceptionNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation stop any profiling of a child that is related to direct marketing if they ask you to?"
        );
    }
    function handle198ProvideScheduleOfImprovementYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a native iOS or Android app?");
    }
    function handle198ProvideScheduleOfImprovementNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a native iOS or Android app?");
    }
    function handle198ProvideScheduleOfImprovementYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a native iOS or Android app?");
    }
    function handle198ProvideScheduleOfImprovementNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a native iOS or Android app?");
    }
    function handle201ConfirmProgressiveWebAppYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product comply with the baseline checklist for progressive web apps, as defined by Google?"
        );
    }
    function handle201ConfirmProgressiveWebAppNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a website?");
    }
    function handle201ConfirmProgressiveWebAppYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product comply with the baseline checklist for progressive web apps, as defined by Google?"
        );
    }
    function handle201ConfirmProgressiveWebAppNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a website?");
    }
    function handle202ConfirmComplyWithBaselineYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Have you conducted accessibility testing on your progressive web app?"
        );
    }
    function handle202ConfirmComplyWithBaselineNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Have you conducted accessibility testing on your progressive web app?"
        );
    }
    function handle204ConfirmWebsiteYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your website responsive?");
    }
    function handle204ConfirmWebsiteNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product expose any Application Programming Interfaces (APIs) or integration channels for other consumers?"
        );
    }
    function handle155ConfrimStopProfilingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When considering marketing to children, you take into account their reduced ability to recognise and critically assess the purposes behind the processing and the potential consequences of providing their personal data."
        );
    }
    function handle155ConfrimStopProfilingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When considering marketing to children, you take into account their reduced ability to recognise and critically assess the purposes behind the processing and the potential consequences of providing their personal data."
        );
    }
    function handle155ConfrimStopProfilingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When considering marketing to children, you take into account their reduced ability to recognise and critically assess the purposes behind the processing and the potential consequences of providing their personal data."
        );
    }
    function handle155ConfrimStopProfilingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When considering marketing to children, you take into account their reduced ability to recognise and critically assess the purposes behind the processing and the potential consequences of providing their personal data."
        );
    }
    function handle199IosOrAndroidYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what device OS accessibility features does your product use? For example VoiceOver (iOS), Dynamic Type (iOS), TalkBack (Android) or Select To Speak (Android)?"
        );
    }
    function handle199IosOrAndroidNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a progressive web app?");
    }
    function handle199IosOrAndroidYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give what device OS accessibility features does your product use? For example VoiceOver (iOS), Dynamic Type (iOS), TalkBack (Android) or Select To Speak (Android)?"
        );
    }
    function handle199IosOrAndroidNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a progressive web app?");
    }
    function handle203ConfirmAccessibilityTestingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a website?");
    }
    function handle203ConfirmAccessibilityTestingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a website?");
    }
    function handle203ConfirmAccessibilityTestingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a website?");
    }
    function handle203ConfirmAccessibilityTestingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your product a website?");
    }
    function handle205ConfirmResponsiveYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your website accessibility conform to WCAG 2.1 level AA?"
        );
    }
    function handle205ConfirmResponsiveNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your website accessibility conform to WCAG 2.1 level AA?"
        );
    }
    function handle212ConfirmExposeApiYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your API adhere to the Government Digital Services (GDS) Open API Best Practices?"
        );
    }
    function handle212ConfirmExposeApiNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product capable of exporting data in a standard format?"
        );
    }
    function handle156ConfirmMarketingChildSPdYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation take into account sector specific guidance on marketing to make sure that children’s personal data is not used in a way that might lead to their exploitation?"
        );
    }
    function handle156ConfirmMarketingChildSPdNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation take into account sector specific guidance on marketing to make sure that children’s personal data is not used in a way that might lead to their exploitation?"
        );
    }
    function handle156ConfirmMarketingChildSPdYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation take into account sector specific guidance on marketing to make sure that children’s personal data is not used in a way that might lead to their exploitation?"
        );
    }
    function handle156ConfirmMarketingChildSPdNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation take into account sector specific guidance on marketing to make sure that children’s personal data is not used in a way that might lead to their exploitation?"
        );
    }
    function handle204ConfirmWebsiteYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your website responsive?");
    }
    function handle204ConfirmWebsiteNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product expose any Application Programming Interfaces (APIs) or integration channels for other consumers?"
        );
    }
    function handle204ConfirmWebsiteYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Is your website responsive?");
    }
    function handle204ConfirmWebsiteNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product expose any Application Programming Interfaces (APIs) or integration channels for other consumers?"
        );
    }
    function handle206ConfirmWcag21Yes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your website provide text equivalents for every non- text element within the product?"
        );
    }
    function handle206ConfirmWcag21No(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your website provide text equivalents for every non- text element within the product?"
        );
    }
    function handle206ConfirmWcag21Yes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your website provide text equivalents for every non- text element within the product?"
        );
    }
    function handle206ConfirmWcag21No2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your website provide text equivalents for every non- text element within the product?"
        );
    }
    function handle213ApiAdhereToGdsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product capable of exporting data in a standard format?"
        );
    }
    function handle213ApiAdhereToGdsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product capable of exporting data in a standard format?"
        );
    }
    function handle214CapableInStandardFormatYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product a wearable or device or integrates with them?"
        );
    }
    function handle214CapableInStandardFormatNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product a wearable or device or integrates with them?"
        );
    }
    function handle157ConfirmTakeGuidanceIntoAccountYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation stop processing a child’s personal data for the purposes of direct marketing if they ask you to?"
        );
    }
    function handle157ConfirmTakeGuidanceIntoAccountNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation stop processing a child’s personal data for the purposes of direct marketing if they ask you to?"
        );
    }
    function handle157ConfirmTakeGuidanceIntoAccountYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation stop processing a child’s personal data for the purposes of direct marketing if they ask you to?"
        );
    }
    function handle157ConfirmTakeGuidanceIntoAccountNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation stop processing a child’s personal data for the purposes of direct marketing if they ask you to?"
        );
    }
    function handle207ProvideTextEquivalenceYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Have you conducted accessibility testing on your web service?"
        );
    }
    function handle207ProvideTextEquivalenceNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Have you conducted accessibility testing on your web service?"
        );
    }
    function handle207ProvideTextEquivalenceYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Have you conducted accessibility testing on your web service?"
        );
    }
    function handle207ProvideTextEquivalenceNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Have you conducted accessibility testing on your web service?"
        );
    }
    function handle214CapableInStandardFormatYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product a wearable or device or integrates with them?"
        );
    }
    function handle214CapableInStandardFormatNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product a wearable or device or integrates with them?"
        );
    }
    function handle214CapableInStandardFormatYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product a wearable or device or integrates with them?"
        );
    }
    function handle214CapableInStandardFormatNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product a wearable or device or integrates with them?"
        );
    }
    function handle215ConfirmWearableDeviceYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give evidence of how it complies with ISO/IEEE 11073 Personal Health Data (PHD) Standards?"
        );
    }
    function handle215ConfirmWearableDeviceNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are the source code and any configuration items for your product version controlled with all changes audited?"
        );
    }
    function handle215ConfirmWearableDeviceYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you give evidence of how it complies with ISO/IEEE 11073 Personal Health Data (PHD) Standards?"
        );
    }
    function handle215ConfirmWearableDeviceNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are the source code and any configuration items for your product version controlled with all changes audited?"
        );
    }
    function handle158ConfirmStopPdForMarketingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation comply with the direct marketing requirements of the Privacy and Electronic Communications Regulations (PECR)?"
        );
    }
    function handle158ConfirmStopPdForMarketingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation comply with the direct marketing requirements of the Privacy and Electronic Communications Regulations (PECR)?"
        );
    }
    function handle158ConfirmStopPdForMarketingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation comply with the direct marketing requirements of the Privacy and Electronic Communications Regulations (PECR)?"
        );
    }
    function handle158ConfirmStopPdForMarketingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation comply with the direct marketing requirements of the Privacy and Electronic Communications Regulations (PECR)?"
        );
    }
    function handle208ConfirmTestingOnWebYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can your product be used with keyboard-only control, and with assistive technologies, such as screen readers and screen magnifiers?"
        );
    }
    function handle208ConfirmTestingOnWebNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can your product be used with keyboard-only control, and with assistive technologies, such as screen readers and screen magnifiers?"
        );
    }
    function handle208ConfirmTestingOnWebYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can your product be used with keyboard-only control, and with assistive technologies, such as screen readers and screen magnifiers?"
        );
    }
    function handle208ConfirmTestingOnWebNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can your product be used with keyboard-only control, and with assistive technologies, such as screen readers and screen magnifiers?"
        );
    }
    function handle216ProvideEvidenceWithIsoIeeeYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are the source code and any configuration items for your product version controlled with all changes audited?"
        );
    }
    function handle216ProvideEvidenceWithIsoIeeeNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are the source code and any configuration items for your product version controlled with all changes audited?"
        );
    }
    function handle217ConfirmSourceCodeControlledWithAuditedYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have accreditation to any industry wide testing standards such as ISO 9001, ISO 29119 etc?"
        );
    }
    function handle217ConfirmSourceCodeControlledWithAuditedNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have accreditation to any industry wide testing standards such as ISO 9001, ISO 29119 etc?"
        );
    }
    function handle159ConfirmComplyWithMarketingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "If you decide not to offer your ISS (online service) directly to children, then you mitigate the risk of them gaining access, using measures that are proportionate to the risks inherent in the processing?"
        );
    }
    function handle159ConfirmComplyWithMarketingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "If you decide not to offer your ISS (online service) directly to children, then you mitigate the risk of them gaining access, using measures that are proportionate to the risks inherent in the processing?"
        );
    }
    function handle159ConfirmComplyWithMarketingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "If you decide not to offer your ISS (online service) directly to children, then you mitigate the risk of them gaining access, using measures that are proportionate to the risks inherent in the processing?"
        );
    }
    function handle159ConfirmComplyWithMarketingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "If you decide not to offer your ISS (online service) directly to children, then you mitigate the risk of them gaining access, using measures that are proportionate to the risks inherent in the processing?"
        );
    }
    function handle209ConfirmKeyboardOnlyControlYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your website provide an accessibility statement?");
    }
    function handle209ConfirmKeyboardOnlyControlNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your website provide an accessibility statement?");
    }
    function handle209ConfirmKeyboardOnlyControlYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your website provide an accessibility statement?");
    }
    function handle209ConfirmKeyboardOnlyControlNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Does your website provide an accessibility statement?");
    }
    function handle217ConfirmSourceCodeControlledWithAuditedYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have accreditation to any industry wide testing standards such as ISO 9001, ISO 29119 etc?"
        );
    }
    function handle217ConfirmSourceCodeControlledWithAuditedNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have accreditation to any industry wide testing standards such as ISO 9001, ISO 29119 etc?"
        );
    }
    function handle217ConfirmSourceCodeControlledWithAuditedYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have accreditation to any industry wide testing standards such as ISO 9001, ISO 29119 etc?"
        );
    }
    function handle217ConfirmSourceCodeControlledWithAuditedNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have accreditation to any industry wide testing standards such as ISO 9001, ISO 29119 etc?"
        );
    }
    function handle218ConfirmIso9001Yes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "What testing accreditation(s) do you have or are in the process of acquiring (including completion dates)?"
        );
    }
    function handle218ConfirmIso9001No(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "What testing accreditation(s) do you have or are in the process of acquiring (including completion dates)?"
        );
    }
    function handle218ConfirmIso9001Yes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "What testing accreditation(s) do you have or are in the process of acquiring (including completion dates)?"
        );
    }
    function handle218ConfirmIso9001No2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "What testing accreditation(s) do you have or are in the process of acquiring (including completion dates)?"
        );
    }
    function handle160ConfirmNotOfferIssYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When offering ISS to UK children on the basis of consent, you make reasonable efforts (taking into account the available technology and the risks inherent in the processing) to ensure that anyone who provides their own consent is at least 13 years old?"
        );
    }
    function handle160ConfirmNotOfferIssNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When offering ISS to UK children on the basis of consent, you make reasonable efforts (taking into account the available technology and the risks inherent in the processing) to ensure that anyone who provides their own consent is at least 13 years old?"
        );
    }
    function handle160ConfirmNotOfferIssYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When offering ISS to UK children on the basis of consent, you make reasonable efforts (taking into account the available technology and the risks inherent in the processing) to ensure that anyone who provides their own consent is at least 13 years old?"
        );
    }
    function handle160ConfirmNotOfferIssNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When offering ISS to UK children on the basis of consent, you make reasonable efforts (taking into account the available technology and the risks inherent in the processing) to ensure that anyone who provides their own consent is at least 13 years old?"
        );
    }
    function handle210ProvideAccessibilityTestingYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation provide evidence of this testing, including outcomes and any planned further changes to improve accessibility?"
        );
    }
    function handle210ProvideAccessibilityTestingNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product expose any Application Programming Interfaces (APIs) or integration channels for other consumers?"
        );
    }
    function handle210ProvideAccessibilityTestingYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation provide evidence of this testing, including outcomes and any planned further changes to improve accessibility?"
        );
    }
    function handle210ProvideAccessibilityTestingNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product expose any Application Programming Interfaces (APIs) or integration channels for other consumers?"
        );
    }
    function handle219ConfirmTestingAccreditationYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are all significant issues identified in all test phases resolved prior to release?"
        );
    }
    function handle219ConfirmTestingAccreditationNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are all significant issues identified in all test phases resolved prior to release?"
        );
    }
    function handle219ConfirmTestingAccreditationYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are all significant issues identified in all test phases resolved prior to release?"
        );
    }
    function handle219ConfirmTestingAccreditationNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Are all significant issues identified in all test phases resolved prior to release?"
        );
    }
    function handle161Provide13YearsOldYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When offering ISS to UK children on the basis of consent, you obtain parental consent to the processing for children who are under the age of 13, and make reasonable efforts (taking into account the available technology and risks inherent in the processing) to verify that the person providing consent holds parental responsibility for the child?"
        );
    }
    function handle161Provide13YearsOldNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When offering ISS to UK children on the basis of consent, you obtain parental consent to the processing for children who are under the age of 13, and make reasonable efforts (taking into account the available technology and risks inherent in the processing) to verify that the person providing consent holds parental responsibility for the child?"
        );
    }
    function handle161Provide13YearsOldYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When offering ISS to UK children on the basis of consent, you obtain parental consent to the processing for children who are under the age of 13, and make reasonable efforts (taking into account the available technology and risks inherent in the processing) to verify that the person providing consent holds parental responsibility for the child?"
        );
    }
    function handle161Provide13YearsOldNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When offering ISS to UK children on the basis of consent, you obtain parental consent to the processing for children who are under the age of 13, and make reasonable efforts (taking into account the available technology and risks inherent in the processing) to verify that the person providing consent holds parental responsibility for the child?"
        );
    }
    function handle211ProvideEvidenceImprovingAccessibilityYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product expose any Application Programming Interfaces (APIs) or integration channels for other consumers?"
        );
    }
    function handle211ProvideEvidenceImprovingAccessibilityNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your product expose any Application Programming Interfaces (APIs) or integration channels for other consumers?"
        );
    }
    function handle212ConfirmExposeApiYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your API adhere to the Government Digital Services (GDS) Open API Best Practices?"
        );
    }
    function handle212ConfirmExposeApiNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product capable of exporting data in a standard format?"
        );
    }
    function handle220ConfirmIssuesInAllTestsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you rollback to previous versions of your product?");
    }
    function handle220ConfirmIssuesInAllTestsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you rollback to previous versions of your product?");
    }
    function handle220ConfirmIssuesInAllTestsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you rollback to previous versions of your product?");
    }
    function handle220ConfirmIssuesInAllTestsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Can you rollback to previous versions of your product?");
    }
    function handle162ProvideEffortYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When targeting wider European (non UK) markets you comply with the age limits applicable in each member state?"
        );
    }
    function handle162ProvideEffortNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When targeting wider European (non UK) markets you comply with the age limits applicable in each member state?"
        );
    }
    function handle162ProvideEffortYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When targeting wider European (non UK) markets you comply with the age limits applicable in each member state?"
        );
    }
    function handle162ProvideEffortNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "When targeting wider European (non UK) markets you comply with the age limits applicable in each member state?"
        );
    }
    function handle212ConfirmExposeApiYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your API adhere to the Government Digital Services (GDS) Open API Best Practices?"
        );
    }
    function handle212ConfirmExposeApiNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product capable of exporting data in a standard format?"
        );
    }
    function handle212ConfirmExposeApiYes4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your API adhere to the Government Digital Services (GDS) Open API Best Practices?"
        );
    }
    function handle212ConfirmExposeApiNo4(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Is your product capable of exporting data in a standard format?"
        );
    }
    function handle221ConfirmRollbackYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide a brief outline of your rollback process and provide documentation to support this.?"
        );
    }
    function handle221ConfirmRollbackNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you proactively monitor running of systems and system components to automatically identify faults and technical issues?"
        );
    }
    function handle221ConfirmRollbackYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide a brief outline of your rollback process and provide documentation to support this.?"
        );
    }
    function handle221ConfirmRollbackNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you proactively monitor running of systems and system components to automatically identify faults and technical issues?"
        );
    }
    function handle163ConfirmAgeLimitsYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You regularly review available age verification and parental responsibility verification mechanisms to ensure you are using appropriate current technology?"
        );
    }
    function handle163ConfirmAgeLimitsNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You regularly review available age verification and parental responsibility verification mechanisms to ensure you are using appropriate current technology?"
        );
    }
    function handle163ConfirmAgeLimitsYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You regularly review available age verification and parental responsibility verification mechanisms to ensure you are using appropriate current technology?"
        );
    }
    function handle163ConfirmAgeLimitsNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You regularly review available age verification and parental responsibility verification mechanisms to ensure you are using appropriate current technology?"
        );
    }
    function handle222ProvideHowRollbackYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you proactively monitor running of systems and system components to automatically identify faults and technical issues?"
        );
    }
    function handle222ProvideHowRollbackNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you proactively monitor running of systems and system components to automatically identify faults and technical issues?"
        );
    }
    function handle223ConfirmMonitorRunningOfSystemYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have a documented road-map for the future development of your product?"
        );
    }
    function handle223ConfirmMonitorRunningOfSystemNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have a documented road-map for the future development of your product?"
        );
    }
    function handle164ConfirmReviewAgeVerificationYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You do NOT seek parental consent when offering online preventive or counselling services to a child?"
        );
    }
    function handle164ConfirmReviewAgeVerificationNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You do NOT seek parental consent when offering online preventive or counselling services to a child?"
        );
    }
    function handle164ConfirmReviewAgeVerificationYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You do NOT seek parental consent when offering online preventive or counselling services to a child?"
        );
    }
    function handle164ConfirmReviewAgeVerificationNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "You do NOT seek parental consent when offering online preventive or counselling services to a child?"
        );
    }
    function handle223ConfirmMonitorRunningOfSystemYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have a documented road-map for the future development of your product?"
        );
    }
    function handle223ConfirmMonitorRunningOfSystemNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have a documented road-map for the future development of your product?"
        );
    }
    function handle223ConfirmMonitorRunningOfSystemYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have a documented road-map for the future development of your product?"
        );
    }
    function handle223ConfirmMonitorRunningOfSystemNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have a documented road-map for the future development of your product?"
        );
    }
    function handle224ConfirmDocumentedRoadmapYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide details of planned development, technical updates and potential release dates?"
        );
    }
    function handle224ConfirmDocumentedRoadmapNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have a documented road-map for the future development of your product?"
        );
    }
    function handle224ConfirmDocumentedRoadmapYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide details of planned development, technical updates and potential release dates?"
        );
    }
    function handle224ConfirmDocumentedRoadmapNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have a documented road-map for the future development of your product?"
        );
    }
    function handle165ConfirmNotSeekParentalConsentYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use cookies, web beacons or similar technologies?"
        );
    }
    function handle165ConfirmNotSeekParentalConsentNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use cookies, web beacons or similar technologies?"
        );
    }
    function handle165ConfirmNotSeekParentalConsentYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use cookies, web beacons or similar technologies?"
        );
    }
    function handle165ConfirmNotSeekParentalConsentNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use cookies, web beacons or similar technologies?"
        );
    }
    function handle225ConfirmDetailsOfDevelopmentYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have a documented road-map for the future development of your product?"
        );
    }
    function handle225ConfirmDetailsOfDevelopmentNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have a documented road-map for the future development of your product?"
        );
    }
    function handle226ConfirmRoadMapForFutureYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide details of how you will ensure the continued availability of your product?"
        );
    }
    function handle226ConfirmRoadMapForFutureNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Do you have a plan for decommissioning your product?");
    }
    function handle166ConfirmCookiesYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation provides users with a cookie policy?"
        );
    }
    function handle166ConfirmCookiesNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Bug reporting and Online tracking?"
        );
    }
    function handle166ConfirmCookiesYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation provides users with a cookie policy?"
        );
    }
    function handle166ConfirmCookiesNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Does your organisation use Bug reporting and Online tracking?"
        );
    }
    function handle226ConfirmRoadMapForFutureYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide details of how you will ensure the continued availability of your product?"
        );
    }
    function handle226ConfirmRoadMapForFutureNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Do you have a plan for decommissioning your product?");
    }
    function handle226ConfirmRoadMapForFutureYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you provide details of how you will ensure the continued availability of your product?"
        );
    }
    function handle226ConfirmRoadMapForFutureNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Do you have a plan for decommissioning your product?");
    }
    function handle227ProvideEnsureAvailabilityYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Do you have a plan for decommissioning your product?");
    }
    function handle227ProvideEnsureAvailabilityNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("Do you have a plan for decommissioning your product?");
    }
    function handle228DecommissioningYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe your processes for decommissioning your product and dealing with any retained identifiable data?"
        );
    }
    function handle228DecommissioningNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handle228DecommissioningYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe your processes for decommissioning your product and dealing with any retained identifiable data?"
        );
    }
    function handle228DecommissioningNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handle228DecommissioningYes3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe your processes for decommissioning your product and dealing with any retained identifiable data?"
        );
    }
    function handle228DecommissioningNo3(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handle229ProvideDecommissioningYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have a plan for dealing with any retained identifiable data in the event that an individual stops using your product? For example by uninstalling or unsubscribing?"
        );
    }
    function handle229ProvideDecommissioningNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Do you have a plan for dealing with any retained identifiable data in the event that an individual stops using your product? For example by uninstalling or unsubscribing?"
        );
    }
    function handleEndYes5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handleEndNo5(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handle230ProvideIdentifiableDataYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe your processes for dealing with any retained identifiable data in the event that an individual stops using your product?"
        );
    }
    function handle230ProvideIdentifiableDataNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe your processes for dealing with any retained identifiable data in the event that an individual stops using your product?"
        );
    }
    function handle230ProvideIdentifiableDataYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe your processes for dealing with any retained identifiable data in the event that an individual stops using your product?"
        );
    }
    function handle230ProvideIdentifiableDataNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Can you describe your processes for dealing with any retained identifiable data in the event that an individual stops using your product?"
        );
    }
    function handle231ProvideRetainedIdentifiableYes(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handle231ProvideRetainedIdentifiableNo(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handle231ProvideRetainedIdentifiableYes2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handle231ProvideRetainedIdentifiableNo2(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add(
            "Great! You’re all set! Now you can look up our suggestions. Next time you visit us, you can look up your previous chat history!"
        );
    }
    function handleEndYes6(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handleEndNo6(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handleEndYes7(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handleEndNo7(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("The session has ended");
    }
    function handleDefaultFallbackIntent(agent) {
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        agent.add("I didn't get that. Can you say it again?");
        agent.add("I missed what you said. What was that?");
        agent.add("Sorry, could you say that again?");
        agent.add("Sorry, can you say that again?");
        agent.add("Can you say that again?");
        agent.add("Sorry, I didn't get that. Can you rephrase?");
        agent.add("Sorry, what was that?");
        agent.add("One more time?");
        agent.add("What was that?");
        agent.add("Say that one more time?");
        agent.add("I didn't get that. Can you repeat?");
        agent.add("I missed that, say that again?");
    }

    function handleClarification(agent) {
        var clarificationMap = new Map();
        clarificationMap.set("name-initial", "What name should I call you by?");
        clarificationMap.set(
            "contact-person-name-initial",
            "A contact person is the person in your organisation who is available to be contacted. What is his or her name?"
        );
        clarificationMap.set(
            "email-address-initial",
            "What is your contact person’s email address?"
        );
        clarificationMap.set(
            "phone-number-initial",
            "What is your contact person’s phone number?"
        );
        clarificationMap.set(
            "organisation-name-initial",
            "What is the name of the organisation who is applying to have their Medical Device comply with regulations?"
        );
        clarificationMap.set(
            "organisation-address-initial",
            "What is the address of the organisation who is applying to have their Medical Device comply with regulations?"
        );
        clarificationMap.set("know-class-of-medical-device-initial", "");
        clarificationMap.set("know-class-of-medical-device-yes", "");
        clarificationMap.set("know-class-of-medical-device-no", "");
        clarificationMap.set("already-knows-mhra-class-yes", "");
        clarificationMap.set("already-knows-mhra-class-no", "");
        clarificationMap.set("not-touch-patient-yes", "");
        clarificationMap.set("not-touch-patient-no", "");
        clarificationMap.set("proceed-to-nhsd-yes", "");
        clarificationMap.set(
            "proceed-to-nhsd-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("1-system-service-yes", "");
        clarificationMap.set("1-system-service-no", "");
        clarificationMap.set("class-i-yes", "");
        clarificationMap.set("class-i-no", "");
        clarificationMap.set("channeling-for-administration-yes", "");
        clarificationMap.set("channeling-for-administration-no", "");
        clarificationMap.set("1provideurl-yes", "");
        clarificationMap.set("1provideurl-no", "");
        clarificationMap.set(
            "end-yes",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "end-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("2-inform-yes", "");
        clarificationMap.set("2-inform-no", "");
        clarificationMap.set("2-inform-yes", "");
        clarificationMap.set("2-inform-no", "");
        clarificationMap.set("proceed-to-nhsd-yes", "");
        clarificationMap.set(
            "proceed-to-nhsd-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("downloaded-or-purchased-yes", "");
        clarificationMap.set("downloaded-or-purchased-no", "");
        clarificationMap.set("used-with-blood-yes", "");
        clarificationMap.set("used-with-blood-no", "");
        clarificationMap.set("modify-biological-composition-yes", "");
        clarificationMap.set("modify-biological-composition-no", "");
        clarificationMap.set("2contact-organisation-yes", "");
        clarificationMap.set("2contact-organisation-no", "");
        clarificationMap.set("2contact-organisation-yes", "");
        clarificationMap.set("2contact-organisation-no", "");
        clarificationMap.set(
            "end-yes",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "end-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "end-yes",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "end-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("2-simple-monitoring-yes", "");
        clarificationMap.set("2-simple-monitoring-no", "");
        clarificationMap.set("2-simple-monitoring-yes", "");
        clarificationMap.set("2-simple-monitoring-no", "");
        clarificationMap.set("proceed-to-nhsd-yes", "");
        clarificationMap.set(
            "proceed-to-nhsd-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("1-system-service-yes", "");
        clarificationMap.set("1-system-service-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("connected-to-active-medical-device-yes", "");
        clarificationMap.set("connected-to-active-medical-device-no", "");
        clarificationMap.set("filtration--centrifiguration-yes", "");
        clarificationMap.set("filtration--centrifiguration-no", "");
        clarificationMap.set("contact-with-injured-skin-yes", "");
        clarificationMap.set("contact-with-injured-skin-no", "");
        clarificationMap.set("3use-nhs-branding-yes", "");
        clarificationMap.set("3use-nhs-branding-no", "");
        clarificationMap.set("3use-nhs-branding-yes", "");
        clarificationMap.set("3use-nhs-branding-no", "");
        clarificationMap.set("2-communicate-yes", "");
        clarificationMap.set("2-communicate-no", "");
        clarificationMap.set("2-communicate-yes", "");
        clarificationMap.set("2-communicate-no", "");
        clarificationMap.set("proceed-to-nhsd-yes", "");
        clarificationMap.set(
            "proceed-to-nhsd-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("downloaded-or-purchased-yes", "");
        clarificationMap.set("downloaded-or-purchased-no", "");
        clarificationMap.set("class-i-yes", "");
        clarificationMap.set("class-i-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("wounds-which-breach-dermis-yes", "");
        clarificationMap.set("wounds-which-breach-dermis-no", "");
        clarificationMap.set("invasive-in-body-orifice-yes", "");
        clarificationMap.set("invasive-in-body-orifice-no", "");
        clarificationMap.set("4confirm-use-of-branding-yes", "");
        clarificationMap.set("4confirm-use-of-branding-no", "");
        clarificationMap.set("5require-gpc-yes", "");
        clarificationMap.set("5require-gpc-no", "");
        clarificationMap.set("3a-behaviour-change-yes", "");
        clarificationMap.set("3a-behaviour-change-no", "");
        clarificationMap.set("3a-behaviour-change-yes", "");
        clarificationMap.set("3a-behaviour-change-no", "");
        clarificationMap.set("proceed-to-nhsd-yes", "");
        clarificationMap.set(
            "proceed-to-nhsd-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("downloaded-or-purchased-yes", "");
        clarificationMap.set("downloaded-or-purchased-no", "");
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("manage-micro-environments-yes", "");
        clarificationMap.set("manage-micro-environments-no", "");
        clarificationMap.set("trancient-use-yes", "");
        clarificationMap.set("trancient-use-no", "");
        clarificationMap.set("surgically-invasive-yes", "");
        clarificationMap.set("surgically-invasive-no", "");
        clarificationMap.set("5require-gpc-yes", "");
        clarificationMap.set("5require-gpc-no", "");
        clarificationMap.set("5require-gpc-yes", "");
        clarificationMap.set("5require-gpc-no", "");
        clarificationMap.set("6confirm-with-gpc-yes", "");
        clarificationMap.set("6confirm-with-gpc-no", "");
        clarificationMap.set("7require-healthcares-yes", "");
        clarificationMap.set("7require-healthcares-no", "");
        clarificationMap.set("3a-self_manage-yes", "");
        clarificationMap.set("3a-self_manage-no", "");
        clarificationMap.set("3a-self_manage-yes", "");
        clarificationMap.set("3a-self_manage-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("class-i-yes", "");
        clarificationMap.set("class-i-no", "");
        clarificationMap.set("class-i-yes", "");
        clarificationMap.set("class-i-no", "");
        clarificationMap.set("short-term-use-yes", "");
        clarificationMap.set("short-term-use-no", "");
        clarificationMap.set("control--diagnose--monitor-or-correct-yes", "");
        clarificationMap.set("control--diagnose--monitor-or-correct-no", "");
        clarificationMap.set("surgically-invasive-and-short-term-use-yes", "");
        clarificationMap.set("surgically-invasive-and-short-term-use-no", "");
        clarificationMap.set("7require-healthcares-yes", "");
        clarificationMap.set("7require-healthcares-no", "");
        clarificationMap.set("7require-healthcares-yes", "");
        clarificationMap.set("7require-healthcares-no", "");
        clarificationMap.set("8confirm-healthcare-registration-yes", "");
        clarificationMap.set("8confirm-healthcare-registration-no", "");
        clarificationMap.set("9provide-a-guest-login-yes", "");
        clarificationMap.set("9provide-a-guest-login-no", "");
        clarificationMap.set("3b-treat-yes", "");
        clarificationMap.set("3b-treat-no", "");
        clarificationMap.set("3b-treat-yes", "");
        clarificationMap.set("3b-treat-no", "");
        clarificationMap.set("oral-cavity--ear-canal-yes", "");
        clarificationMap.set("oral-cavity--ear-canal-no", "");
        clarificationMap.set("long-term-use-yes", "");
        clarificationMap.set("long-term-use-no", "");
        clarificationMap.set("class-iii-yes", "");
        clarificationMap.set("class-iii-no", "");
        clarificationMap.set("direct-contact-with-cns-yes", "");
        clarificationMap.set("direct-contact-with-cns-no", "");
        clarificationMap.set("direct-contact-with-cns--2--yes", "");
        clarificationMap.set("direct-contact-with-cns--2--no", "");
        clarificationMap.set("surgically-invasive--long-term-use-yes", "");
        clarificationMap.set("surgically-invasive--long-term-use-no", "");
        clarificationMap.set("9provide-a-guest-login-yes", "");
        clarificationMap.set("9provide-a-guest-login-no", "");
        clarificationMap.set("9provide-a-guest-login-yes", "");
        clarificationMap.set("9provide-a-guest-login-no", "");
        clarificationMap.set("10require-registration-with-cqc-yes", "");
        clarificationMap.set("10require-registration-with-cqc-no", "");
        clarificationMap.set("10require-registration-with-cqc-yes", "");
        clarificationMap.set("10require-registration-with-cqc-no", "");
        clarificationMap.set("3b-acitve_monitoring-yes", "");
        clarificationMap.set("3b-acitve_monitoring-no", "");
        clarificationMap.set("3b-acitve_monitoring-yes", "");
        clarificationMap.set("3b-acitve_monitoring-no", "");
        clarificationMap.set("class-i-yes", "");
        clarificationMap.set("class-i-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set(
            "oral-cavity--ear-canal--not-liable-to-be-absorbed-yes",
            ""
        );
        clarificationMap.set(
            "oral-cavity--ear-canal--not-liable-to-be-absorbed-no",
            ""
        );
        clarificationMap.set("connected-to-active-medical-device--2--yes", "");
        clarificationMap.set("connected-to-active-medical-device--2--no", "");
        clarificationMap.set("proceed-to-nhsd-yes", "");
        clarificationMap.set(
            "proceed-to-nhsd-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("downloaded-or-purchased-yes", "");
        clarificationMap.set("downloaded-or-purchased-no", "");
        clarificationMap.set("class-iii-yes", "");
        clarificationMap.set("class-iii-no", "");
        clarificationMap.set("reusable-surgical-instrument-yes", "");
        clarificationMap.set("reusable-surgical-instrument-no", "");
        clarificationMap.set("class-iii-yes", "");
        clarificationMap.set("class-iii-no", "");
        clarificationMap.set("monitor--control--diagnose-or-correct-yes", "");
        clarificationMap.set("monitor--control--diagnose-or-correct-no", "");
        clarificationMap.set("used-in-teeth-yes", "");
        clarificationMap.set("used-in-teeth-no", "");
        clarificationMap.set("active-therapeutic-device-yes", "");
        clarificationMap.set("active-therapeutic-device-no", "");
        clarificationMap.set("11confirm-registration-with-cqc-yes", "");
        clarificationMap.set("11confirm-registration-with-cqc-no", "");
        clarificationMap.set("14need-registration-cqc-yes", "");
        clarificationMap.set("14need-registration-cqc-no", "");
        clarificationMap.set("3b-calculate-yes", "");
        clarificationMap.set("3b-calculate-no", "");
        clarificationMap.set("3b-calculate-yes", "");
        clarificationMap.set("3b-calculate-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("surgically-invasive-yes", "");
        clarificationMap.set("surgically-invasive-no", "");
        clarificationMap.set("class-i-yes", "");
        clarificationMap.set("class-i-no", "");
        clarificationMap.set("supply-energy-yes", "");
        clarificationMap.set("supply-energy-no", "");
        clarificationMap.set("class-iii-yes", "");
        clarificationMap.set("class-iii-no", "");
        clarificationMap.set("supply-energy--2--yes", "");
        clarificationMap.set("supply-energy--2--no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("direct-contact-with-heart-yes", "");
        clarificationMap.set("direct-contact-with-heart-no", "");
        clarificationMap.set("administer-or-exchange-energy-yes", "");
        clarificationMap.set("administer-or-exchange-energy-no", "");
        clarificationMap.set("supply-energy-to-image-in-vivo-yes", "");
        clarificationMap.set("supply-energy-to-image-in-vivo-no", "");
        clarificationMap.set("12provide-cqc-number-yes", "");
        clarificationMap.set("12provide-cqc-number-no", "");
        clarificationMap.set("14need-registration-cqc-yes", "");
        clarificationMap.set("14need-registration-cqc-no", "");
        clarificationMap.set("16provide-description-yes", "");
        clarificationMap.set("16provide-description-no", "");
        clarificationMap.set("15confirm-does-not-need-cqc-yes", "");
        clarificationMap.set("15confirm-does-not-need-cqc-no", "");
        clarificationMap.set(
            "3b-diagnose-yes",
            "For Example, a DHT in Tier3a must meet the standard for Tier 1, Tier 2 and Tier 3a; DHT in Tier 3b must meet the standards for all Tiers"
        );
        clarificationMap.set(
            "3b-diagnose-no",
            "For Example, a DHT in Tier3a must meet the standard for Tier 1, Tier 2 and Tier 3a; DHT in Tier 3b must meet the standards for all Tiers"
        );
        clarificationMap.set(
            "3b-diagnose-yes",
            "For Example, a DHT in Tier3a must meet the standard for Tier 1, Tier 2 and Tier 3a; DHT in Tier 3b must meet the standards for all Tiers"
        );
        clarificationMap.set(
            "3b-diagnose-no",
            "For Example, a DHT in Tier3a must meet the standard for Tier 1, Tier 2 and Tier 3a; DHT in Tier 3b must meet the standards for all Tiers"
        );
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("have-a-biological-effect-yes", "");
        clarificationMap.set("have-a-biological-effect-no", "");
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("have-a-biological-effect--2--yes", "");
        clarificationMap.set("have-a-biological-effect--2--no", "");
        clarificationMap.set("class-iii-yes", "");
        clarificationMap.set("class-iii-no", "");
        clarificationMap.set(
            "have-a-biological-effect-or-mainly-absorbed-yes",
            ""
        );
        clarificationMap.set(
            "have-a-biological-effect-or-mainly-absorbed-no",
            ""
        );
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("control--monitor-or-influence-yes", "");
        clarificationMap.set("control--monitor-or-influence-no", "");
        clarificationMap.set("monitor-vital-physiological-parameters-yes", "");
        clarificationMap.set("monitor-vital-physiological-parameters-no", "");
        clarificationMap.set("active-device-to-administer-medicines-yes", "");
        clarificationMap.set("active-device-to-administer-medicines-no", "");
        clarificationMap.set("13provide-recent-cqc-registration-yes", "");
        clarificationMap.set("13provide-recent-cqc-registration-no", "");
        clarificationMap.set("14need-registration-cqc-yes", "");
        clarificationMap.set("14need-registration-cqc-no", "");
        clarificationMap.set("17integrate-with-website-or-others-yes", "");
        clarificationMap.set("17integrate-with-website-or-others-no", "");
        clarificationMap.set("17integrate-with-website-or-others-yes", "");
        clarificationMap.set("17integrate-with-website-or-others-no", "");
        clarificationMap.set("16provide-description-yes", "");
        clarificationMap.set("16provide-description-no", "");
        clarificationMap.set("16provide-description-yes", "");
        clarificationMap.set("16provide-description-no", "");
        clarificationMap.set("functional-classification-over-yes", "");
        clarificationMap.set(
            "functional-classification-over-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("functional-classification-over-yes", "");
        clarificationMap.set(
            "functional-classification-over-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("administer-medicine-yes", "");
        clarificationMap.set("administer-medicine-no", "");
        clarificationMap.set("class-iii-yes", "");
        clarificationMap.set("class-iii-no", "");
        clarificationMap.set("undergo-chemical-change-yes", "");
        clarificationMap.set("undergo-chemical-change-no", "");
        clarificationMap.set("class-iii-yes", "");
        clarificationMap.set("class-iii-no", "");
        clarificationMap.set(
            "undergo-chemical-change-or-administer-medicine-yes",
            ""
        );
        clarificationMap.set(
            "undergo-chemical-change-or-administer-medicine-no",
            ""
        );
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("emit-ionizing-radiation-yes", "");
        clarificationMap.set("emit-ionizing-radiation-no", "");
        clarificationMap.set("potentially-hazardous-yes", "");
        clarificationMap.set("potentially-hazardous-no", "");
        clarificationMap.set("active-device-not-classified-yes", "");
        clarificationMap.set("active-device-not-classified-no", "");
        clarificationMap.set("14need-registration-cqc-yes", "");
        clarificationMap.set("14need-registration-cqc-no", "");
        clarificationMap.set("14need-registration-cqc-yes", "");
        clarificationMap.set("14need-registration-cqc-no", "");
        clarificationMap.set("18connect-with-devices-yes", "");
        clarificationMap.set("18connect-with-devices-no", "");
        clarificationMap.set("18connect-with-devices-yes", "");
        clarificationMap.set("18connect-with-devices-no", "");
        clarificationMap.set("proceed-to-nhsd-yes", "");
        clarificationMap.set(
            "proceed-to-nhsd-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "end-yes",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "end-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("class-iii-yes", "");
        clarificationMap.set("class-iii-no", "");
        clarificationMap.set("use-in-breast-implants-yes", "");
        clarificationMap.set("use-in-breast-implants-no", "");
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("class-i-yes", "");
        clarificationMap.set("class-i-no", "");
        clarificationMap.set(
            "incorporate-integral-medicinal-substances-yes",
            ""
        );
        clarificationMap.set(
            "incorporate-integral-medicinal-substances-no",
            ""
        );
        clarificationMap.set("19replace-a-nhs-service-yes", "");
        clarificationMap.set("19replace-a-nhs-service-no", "");
        clarificationMap.set("20confirm-replace-a-nhs-service-yes", "");
        clarificationMap.set("20confirm-replace-a-nhs-service-no", "");
        clarificationMap.set("class-iii-yes", "");
        clarificationMap.set("class-iii-no", "");
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("class-iii-yes", "");
        clarificationMap.set("class-iii-no", "");
        clarificationMap.set("contraception-yes", "");
        clarificationMap.set("contraception-no", "");
        clarificationMap.set("20confirm-replace-a-nhs-service-yes", "");
        clarificationMap.set("20confirm-replace-a-nhs-service-no", "");
        clarificationMap.set("21free-to-public-yes", "");
        clarificationMap.set("21free-to-public-no", "");
        clarificationMap.set("21free-to-public-yes", "");
        clarificationMap.set("21free-to-public-no", "");
        clarificationMap.set("21free-to-public-yes", "");
        clarificationMap.set("21free-to-public-no", "");
        clarificationMap.set("implantable-yes", "");
        clarificationMap.set("implantable-no", "");
        clarificationMap.set("disinfecting-mds-yes", "");
        clarificationMap.set("disinfecting-mds-no", "");
        clarificationMap.set("22source-of-funding-yes", "");
        clarificationMap.set("22source-of-funding-no", "");
        clarificationMap.set("22source-of-funding-yes", "");
        clarificationMap.set("22source-of-funding-no", "");
        clarificationMap.set("class-iii-yes", "");
        clarificationMap.set("class-iii-no", "");
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("disinfecting-contact-lenses-yes", "");
        clarificationMap.set("disinfecting-contact-lenses-no", "");
        clarificationMap.set("recording-of-x-ray-yes", "");
        clarificationMap.set("recording-of-x-ray-no", "");
        clarificationMap.set("23provide-a-trial-yes", "");
        clarificationMap.set("23provide-a-trial-no", "");
        clarificationMap.set("23provide-a-trial-yes", "");
        clarificationMap.set("23provide-a-trial-no", "");
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("disinfecting-invasive-mds-yes", "");
        clarificationMap.set("disinfecting-invasive-mds-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("non-viable-animal-tissues-yes", "");
        clarificationMap.set("non-viable-animal-tissues-no", "");
        clarificationMap.set("24provide-detail-of-the-trial-yes", "");
        clarificationMap.set("24provide-detail-of-the-trial-no", "");
        clarificationMap.set("25confirm-process-personal-data-yes", "");
        clarificationMap.set("25confirm-process-personal-data-no", "");
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("class-iia-yes", "");
        clarificationMap.set("class-iia-no", "");
        clarificationMap.set("class-iii-yes", "");
        clarificationMap.set("class-iii-no", "");
        clarificationMap.set("blood-bag-yes", "");
        clarificationMap.set("blood-bag-no", "");
        clarificationMap.set("25confirm-process-personal-data-yes", "");
        clarificationMap.set("25confirm-process-personal-data-no", "");
        clarificationMap.set("25confirm-process-personal-data-yes", "");
        clarificationMap.set("25confirm-process-personal-data-no", "");
        clarificationMap.set("26confirm-where-to-process-yes", "");
        clarificationMap.set("26confirm-where-to-process-no", "");
        clarificationMap.set("27comfrim-available-on-platforms-yes", "");
        clarificationMap.set("27comfrim-available-on-platforms-no", "");
        clarificationMap.set("class-iib-yes", "");
        clarificationMap.set("class-iib-no", "");
        clarificationMap.set("blood-bag-yes", "");
        clarificationMap.set("blood-bag-no", "");
        clarificationMap.set("27comfrim-available-on-platforms-yes", "");
        clarificationMap.set("27comfrim-available-on-platforms-no", "");
        clarificationMap.set("27comfrim-available-on-platforms-yes", "");
        clarificationMap.set("27comfrim-available-on-platforms-no", "");
        clarificationMap.set("28provide-platform-number-yes", "");
        clarificationMap.set("28provide-platform-number-no", "");
        clarificationMap.set("29confirm-type-of-pharmacy-yes", "");
        clarificationMap.set("29confirm-type-of-pharmacy-no", "");
        clarificationMap.set("29confirm-type-of-pharmacy-yes", "");
        clarificationMap.set("29confirm-type-of-pharmacy-no", "");
        clarificationMap.set("29confirm-type-of-pharmacy-yes", "");
        clarificationMap.set("29confirm-type-of-pharmacy-no", "");
        clarificationMap.set("30provide-clinical-benefits-yes", "");
        clarificationMap.set("30provide-clinical-benefits-no", "");
        clarificationMap.set("30provide-clinical-benefits-yes", "");
        clarificationMap.set("30provide-clinical-benefits-no", "");
        clarificationMap.set("31provide-evidence-of-clinical-benefits-yes", "");
        clarificationMap.set("31provide-evidence-of-clinical-benefits-no", "");
        clarificationMap.set(
            "33provide-the-reason-of-not-have-clinical-benefits-yes",
            ""
        );
        clarificationMap.set(
            "33provide-the-reason-of-not-have-clinical-benefits-no",
            ""
        );
        clarificationMap.set(
            "32provide-the-url-of-clinical-benefits-d11-yes",
            ""
        );
        clarificationMap.set(
            "32provide-the-url-of-clinical-benefits-d11-no",
            ""
        );
        clarificationMap.set(
            "32provide-the-url-of-clinical-benefits-d11-yes",
            ""
        );
        clarificationMap.set(
            "32provide-the-url-of-clinical-benefits-d11-no",
            ""
        );
        clarificationMap.set("34provide-behavioural-benefits-yes", "");
        clarificationMap.set("34provide-behavioural-benefits-no", "");
        clarificationMap.set("34provide-behavioural-benefits-yes", "");
        clarificationMap.set("34provide-behavioural-benefits-no", "");
        clarificationMap.set(
            "33provide-the-reason-of-not-have-clinical-benefits-yes",
            ""
        );
        clarificationMap.set(
            "33provide-the-reason-of-not-have-clinical-benefits-no",
            ""
        );
        clarificationMap.set("34provide-behavioural-benefits-yes", "");
        clarificationMap.set("34provide-behavioural-benefits-no", "");
        clarificationMap.set(
            "35provide-improvement-of-bahavioural-benefits-yes",
            ""
        );
        clarificationMap.set(
            "35provide-improvement-of-bahavioural-benefits-no",
            ""
        );
        clarificationMap.set(
            "37confirm-reason-not-have-behavioural-benefits-yes",
            ""
        );
        clarificationMap.set(
            "37confirm-reason-not-have-behavioural-benefits-no",
            ""
        );
        clarificationMap.set("36provide-url-of-behavioural-benefits-yes", "");
        clarificationMap.set("36provide-url-of-behavioural-benefits-no", "");
        clarificationMap.set("38confirm-of-economic-benefits-yes", "");
        clarificationMap.set("38confirm-of-economic-benefits-no", "");
        clarificationMap.set("38confirm-of-economic-benefits-yes", "");
        clarificationMap.set("38confirm-of-economic-benefits-no", "");
        clarificationMap.set("38confirm-of-economic-benefits-yes", "");
        clarificationMap.set("38confirm-of-economic-benefits-no", "");
        clarificationMap.set(
            "37confirm-reason-not-have-behavioural-benefits-yes",
            ""
        );
        clarificationMap.set(
            "37confirm-reason-not-have-behavioural-benefits-no",
            ""
        );
        clarificationMap.set("38confirm-of-economic-benefits-yes", "");
        clarificationMap.set("38confirm-of-economic-benefits-no", "");
        clarificationMap.set("39describe-the-economic-benefits-yes", "");
        clarificationMap.set("39describe-the-economic-benefits-no", "");
        clarificationMap.set(
            "41provide-a-reason-not-have-economic-benefits-yes",
            ""
        );
        clarificationMap.set(
            "41provide-a-reason-not-have-economic-benefits-no",
            ""
        );
        clarificationMap.set("40provide-evidence-of-economic-benefits-yes", "");
        clarificationMap.set("40provide-evidence-of-economic-benefits-no", "");
        clarificationMap.set("42confirm-any-other-outcomes-yes", "");
        clarificationMap.set("42confirm-any-other-outcomes-no", "");
        clarificationMap.set("42confirm-any-other-outcomes-yes", "");
        clarificationMap.set("42confirm-any-other-outcomes-no", "");
        clarificationMap.set("42confirm-any-other-outcomes-yes", "");
        clarificationMap.set("42confirm-any-other-outcomes-no", "");
        clarificationMap.set(
            "41provide-a-reason-not-have-economic-benefits-yes",
            ""
        );
        clarificationMap.set(
            "41provide-a-reason-not-have-economic-benefits-no",
            ""
        );
        clarificationMap.set("42confirm-any-other-outcomes-yes", "");
        clarificationMap.set("42confirm-any-other-outcomes-no", "");
        clarificationMap.set("43provide-what-other-outcomes-yes", "");
        clarificationMap.set("43provide-what-other-outcomes-no", "");
        clarificationMap.set("47provide-reason-why-no-outcomes-yes", "");
        clarificationMap.set("47provide-reason-why-no-outcomes-no", "");
        clarificationMap.set("44confirm-evaluated-for-outcomes-yes", "");
        clarificationMap.set("44confirm-evaluated-for-outcomes-no", "");
        clarificationMap.set("44confirm-evaluated-for-outcomes-yes", "");
        clarificationMap.set("44confirm-evaluated-for-outcomes-no", "");
        clarificationMap.set("48confirm-resource-impact-benefits-yes", "");
        clarificationMap.set("48confirm-resource-impact-benefits-no", "");
        clarificationMap.set("48confirm-resource-impact-benefits-yes", "");
        clarificationMap.set("48confirm-resource-impact-benefits-no", "");
        clarificationMap.set(
            "45provide-evidence-of-evaluating-outcomes-yes",
            ""
        );
        clarificationMap.set(
            "45provide-evidence-of-evaluating-outcomes-no",
            ""
        );
        clarificationMap.set("46provide-url-of-evaluating-outcomes-yes", "");
        clarificationMap.set("46provide-url-of-evaluating-outcomes-no", "");
        clarificationMap.set(
            "49provide-detail-of-resource-impact-benefits-yes",
            ""
        );
        clarificationMap.set(
            "49provide-detail-of-resource-impact-benefits-no",
            ""
        );
        clarificationMap.set("50confirm-within-nhs-dcb0129-yes", "");
        clarificationMap.set("50confirm-within-nhs-dcb0129-no", "");
        clarificationMap.set("46provide-url-of-evaluating-outcomes-yes", "");
        clarificationMap.set("46provide-url-of-evaluating-outcomes-no", "");
        clarificationMap.set("46provide-url-of-evaluating-outcomes-yes", "");
        clarificationMap.set("46provide-url-of-evaluating-outcomes-no", "");
        clarificationMap.set("47provide-reason-why-no-outcomes-yes", "");
        clarificationMap.set("47provide-reason-why-no-outcomes-no", "");
        clarificationMap.set("47provide-reason-why-no-outcomes-yes", "");
        clarificationMap.set("47provide-reason-why-no-outcomes-no", "");
        clarificationMap.set("50confirm-within-nhs-dcb0129-yes", "");
        clarificationMap.set("50confirm-within-nhs-dcb0129-no", "");
        clarificationMap.set("50confirm-within-nhs-dcb0129-yes", "");
        clarificationMap.set("50confirm-within-nhs-dcb0129-no", "");
        clarificationMap.set("51provide-copy-of-safety-case-yes", "");
        clarificationMap.set("51provide-copy-of-safety-case-no", "");
        clarificationMap.set("52provide-why-not-fall-within-dcb0129-yes", "");
        clarificationMap.set("52provide-why-not-fall-within-dcb0129-no", "");
        clarificationMap.set("53confirm-adverse-effects-yes", "");
        clarificationMap.set("53confirm-adverse-effects-no", "");
        clarificationMap.set("53confirm-adverse-effects-yes", "");
        clarificationMap.set("53confirm-adverse-effects-no", "");
        clarificationMap.set("53confirm-adverse-effects-yes", "");
        clarificationMap.set("53confirm-adverse-effects-no", "");
        clarificationMap.set("53confirm-adverse-effects-yes", "");
        clarificationMap.set("53confirm-adverse-effects-no", "");
        clarificationMap.set("54provide-possible-adverse-effects-yes", "");
        clarificationMap.set("54provide-possible-adverse-effects-no", "");
        clarificationMap.set("55confirm-approved-by-clinician-yes", "");
        clarificationMap.set("55confirm-approved-by-clinician-no", "");
        clarificationMap.set("55confirm-approved-by-clinician-yes", "");
        clarificationMap.set("55confirm-approved-by-clinician-no", "");
        clarificationMap.set("55confirm-approved-by-clinician-yes", "");
        clarificationMap.set("55confirm-approved-by-clinician-no", "");
        clarificationMap.set("56provide-name-of-clinician-yes", "");
        clarificationMap.set("56provide-name-of-clinician-no", "");
        clarificationMap.set("57confirm-process-the-data-personal-yes", "");
        clarificationMap.set("57confirm-process-the-data-personal-no", "");
        clarificationMap.set("57confirm-process-the-data-personal-yes", "");
        clarificationMap.set("57confirm-process-the-data-personal-no", "");
        clarificationMap.set("57confirm-process-the-data-personal-yes", "");
        clarificationMap.set("57confirm-process-the-data-personal-no", "");
        clarificationMap.set("58provide-peronal-data-processed-yes", "");
        clarificationMap.set("58provide-peronal-data-processed-no", "");
        clarificationMap.set(
            "61confirm-fully-understanding-of-personal-data-sensitive-data-yes",
            ""
        );
        clarificationMap.set(
            "61confirm-fully-understanding-of-personal-data-sensitive-data-no",
            ""
        );
        clarificationMap.set("59confirm-process-sensitive-data-yes", "");
        clarificationMap.set("59confirm-process-sensitive-data-no", "");
        clarificationMap.set("59confirm-process-sensitive-data-yes", "");
        clarificationMap.set("59confirm-process-sensitive-data-no", "");
        clarificationMap.set("62understand-organisation-s-role-yes", "");
        clarificationMap.set("62understand-organisation-s-role-no", "");
        clarificationMap.set("62understand-organisation-s-role-yes", "");
        clarificationMap.set("62understand-organisation-s-role-no", "");
        clarificationMap.set(
            "60provide-sensitive-personal-data-processed-yes",
            ""
        );
        clarificationMap.set(
            "60provide-sensitive-personal-data-processed-no",
            ""
        );
        clarificationMap.set(
            "61confirm-fully-understanding-of-personal-data-sensitive-data-yes",
            ""
        );
        clarificationMap.set(
            "61confirm-fully-understanding-of-personal-data-sensitive-data-no",
            ""
        );
        clarificationMap.set("63process-data-and-not-a-controller-yes", "");
        clarificationMap.set("63process-data-and-not-a-controller-no", "");
        clarificationMap.set("63process-data-and-not-a-controller-yes", "");
        clarificationMap.set("63process-data-and-not-a-controller-no", "");
        clarificationMap.set("62understand-organisation-s-role-yes", "");
        clarificationMap.set("62understand-organisation-s-role-no", "");
        clarificationMap.set("62understand-organisation-s-role-yes", "");
        clarificationMap.set("62understand-organisation-s-role-no", "");
        clarificationMap.set(
            "64process-personal-data-and-processor-not-controller-yes",
            ""
        );
        clarificationMap.set(
            "64process-personal-data-and-processor-not-controller-no",
            ""
        );
        clarificationMap.set(
            "64process-personal-data-and-processor-not-controller-yes",
            ""
        );
        clarificationMap.set(
            "64process-personal-data-and-processor-not-controller-no",
            ""
        );
        clarificationMap.set("65provide-details-of-controller-yes", "");
        clarificationMap.set("65provide-details-of-controller-no", "");
        clarificationMap.set("65provide-details-of-controller-yes", "");
        clarificationMap.set("65provide-details-of-controller-no", "");
        clarificationMap.set(
            "66process-data-not-controller-not-processor-yes",
            ""
        );
        clarificationMap.set(
            "66process-data-not-controller-not-processor-no",
            ""
        );
        clarificationMap.set(
            "66process-data-not-controller-not-processor-yes",
            ""
        );
        clarificationMap.set(
            "66process-data-not-controller-not-processor-no",
            ""
        );
        clarificationMap.set(
            "67choose-to-know-manufacturer-or-designer-yes",
            ""
        );
        clarificationMap.set(
            "67choose-to-know-manufacturer-or-designer-no",
            ""
        );
        clarificationMap.set("68process-data-and-controller-yes", "");
        clarificationMap.set("68process-data-and-controller-no", "");
        clarificationMap.set("68process-data-and-controller-yes", "");
        clarificationMap.set("68process-data-and-controller-no", "");
        clarificationMap.set("68process-data-and-controller-yes", "");
        clarificationMap.set("68process-data-and-controller-no", "");
        clarificationMap.set("69subject-to-laws-yes", "");
        clarificationMap.set("69subject-to-laws-no", "");
        clarificationMap.set("70data-and-controller-and-laws-yes", "");
        clarificationMap.set("70data-and-controller-and-laws-no", "");
        clarificationMap.set("70data-and-controller-and-laws-yes", "");
        clarificationMap.set("70data-and-controller-and-laws-no", "");
        clarificationMap.set("70data-and-controller-and-laws-yes", "");
        clarificationMap.set("70data-and-controller-and-laws-no", "");
        clarificationMap.set("71confirm-number-of-dpr-yes", "");
        clarificationMap.set("71confirm-number-of-dpr-no", "");
        clarificationMap.set("72provide-the-overall-grading-yes", "");
        clarificationMap.set("72provide-the-overall-grading-no", "");
        clarificationMap.set("72provide-the-overall-grading-yes", "");
        clarificationMap.set("72provide-the-overall-grading-no", "");
        clarificationMap.set("72provide-the-overall-grading-yes", "");
        clarificationMap.set("72provide-the-overall-grading-no", "");
        clarificationMap.set("72provide-the-name-of-overall-grading-yes", "");
        clarificationMap.set("72provide-the-name-of-overall-grading-no", "");
        clarificationMap.set("74confirm-meets-annex-2-yes", "");
        clarificationMap.set("74confirm-meets-annex-2-no", "");
        clarificationMap.set("73provide-copy-pf-the-checklist-yes", "");
        clarificationMap.set("73provide-copy-pf-the-checklist-no", "");
        clarificationMap.set("73provide-copy-pf-the-checklist-yes", "");
        clarificationMap.set("73provide-copy-pf-the-checklist-no", "");
        clarificationMap.set("75provide-dpia-yes", "");
        clarificationMap.set("75provide-dpia-no", "");
        clarificationMap.set("76confirm-permission-of-dpia-yes", "");
        clarificationMap.set("76confirm-permission-of-dpia-no", "");
        clarificationMap.set("74confirm-meets-annex-2-yes", "");
        clarificationMap.set("74confirm-meets-annex-2-no", "");
        clarificationMap.set("74confirm-meets-annex-2-yes", "");
        clarificationMap.set("74confirm-meets-annex-2-no", "");
        clarificationMap.set("76confirm-permission-of-dpia-yes", "");
        clarificationMap.set("76confirm-permission-of-dpia-no", "");
        clarificationMap.set("76confirm-permission-of-dpia-yes", "");
        clarificationMap.set("76confirm-permission-of-dpia-no", "");
        clarificationMap.set("77confirm-data-and-controller-yes", "");
        clarificationMap.set("77confirm-data-and-controller-no", "");
        clarificationMap.set("77confirm-data-and-controller-yes", "");
        clarificationMap.set("77confirm-data-and-controller-no", "");
        clarificationMap.set("78confirm-legal-basis-yes", "");
        clarificationMap.set("78confirm-legal-basis-no", "");
        clarificationMap.set("79confirm-other-legal-basis-yes", "");
        clarificationMap.set("79confirm-other-legal-basis-no", "");
        clarificationMap.set("79confirm-other-legal-basis-yes", "");
        clarificationMap.set("79confirm-other-legal-basis-no", "");
        clarificationMap.set("79confirm-other-legal-basis-yes", "");
        clarificationMap.set("79confirm-other-legal-basis-no", "");
        clarificationMap.set("80describe-the-other-legal-basis-yes", "");
        clarificationMap.set("80describe-the-other-legal-basis-no", "");
        clarificationMap.set("81confirm-measures-to-protect-right-yes", "");
        clarificationMap.set("81confirm-measures-to-protect-right-no", "");
        clarificationMap.set("81confirm-measures-to-protect-right-yes", "");
        clarificationMap.set("81confirm-measures-to-protect-right-no", "");
        clarificationMap.set("81confirm-measures-to-protect-right-yes", "");
        clarificationMap.set("81confirm-measures-to-protect-right-no", "");
        clarificationMap.set("82provide-transparency-to-data-subject-yes", "");
        clarificationMap.set("82provide-transparency-to-data-subject-no", "");
        clarificationMap.set(
            "86confirm-measure-ot-verify-the-identity-yes",
            ""
        );
        clarificationMap.set("86confirm-measure-ot-verify-the-identity-no", "");
        clarificationMap.set(
            "83provide-the-probability-to-data-subject-yes",
            ""
        );
        clarificationMap.set(
            "83provide-the-probability-to-data-subject-no",
            ""
        );
        clarificationMap.set(
            "83provide-the-probability-to-data-subject-yes",
            ""
        );
        clarificationMap.set(
            "83provide-the-probability-to-data-subject-no",
            ""
        );
        clarificationMap.set(
            "87confirm-data-and-controller-and-processed-by-a-third-party-yes",
            ""
        );
        clarificationMap.set(
            "87confirm-data-and-controller-and-processed-by-a-third-party-no",
            ""
        );
        clarificationMap.set(
            "87confirm-data-and-controller-and-processed-by-a-third-party-yes",
            ""
        );
        clarificationMap.set(
            "87confirm-data-and-controller-and-processed-by-a-third-party-no",
            ""
        );
        clarificationMap.set("84provide-the-right-to-erase-yes", "");
        clarificationMap.set("84provide-the-right-to-erase-no", "");
        clarificationMap.set("84provide-the-right-to-erase-yes", "");
        clarificationMap.set("84provide-the-right-to-erase-no", "");
        clarificationMap.set(
            "88confirm-allow-third-party-processing-data-yes",
            ""
        );
        clarificationMap.set(
            "88confirm-allow-third-party-processing-data-no",
            ""
        );
        clarificationMap.set("104confirm-pd-from-individual-yes", "");
        clarificationMap.set("104confirm-pd-from-individual-no", "");
        clarificationMap.set("85provide-the-right-to-rectify-object-yes", "");
        clarificationMap.set("85provide-the-right-to-rectify-object-no", "");
        clarificationMap.set("85provide-the-right-to-rectify-object-yes", "");
        clarificationMap.set("85provide-the-right-to-rectify-object-no", "");
        clarificationMap.set("89provide-techinical-services-yes", "");
        clarificationMap.set("89provide-techinical-services-no", "");
        clarificationMap.set("89provide-techinical-services-yes", "");
        clarificationMap.set("89provide-techinical-services-no", "");
        clarificationMap.set("105confirm-fair-pd-yes", "");
        clarificationMap.set("105confirm-fair-pd-no", "");
        clarificationMap.set("106confirm-pd-form-third-party-yes", "");
        clarificationMap.set("106confirm-pd-form-third-party-no", "");
        clarificationMap.set(
            "86confirm-measure-ot-verify-the-identity-yes",
            ""
        );
        clarificationMap.set("86confirm-measure-ot-verify-the-identity-no", "");
        clarificationMap.set(
            "86confirm-measure-ot-verify-the-identity-yes",
            ""
        );
        clarificationMap.set("86confirm-measure-ot-verify-the-identity-no", "");
        clarificationMap.set("90confirm-third-party-of-personal-data-yes", "");
        clarificationMap.set("90confirm-third-party-of-personal-data-no", "");
        clarificationMap.set("90confirm-third-party-of-personal-data-yes", "");
        clarificationMap.set("90confirm-third-party-of-personal-data-no", "");
        clarificationMap.set("106confirm-pd-form-third-party-yes", "");
        clarificationMap.set("106confirm-pd-form-third-party-no", "");
        clarificationMap.set("106confirm-pd-form-third-party-yes", "");
        clarificationMap.set("106confirm-pd-form-third-party-no", "");
        clarificationMap.set("107confirm-fair-pd-of-third-party-yes", "");
        clarificationMap.set("107confirm-fair-pd-of-third-party-no", "");
        clarificationMap.set(
            "108confirm-pd-and-controller-following-q-yes",
            ""
        );
        clarificationMap.set("108confirm-pd-and-controller-following-q-no", "");
        clarificationMap.set("91confirm-written-binding-yes", "");
        clarificationMap.set("91confirm-written-binding-no", "");
        clarificationMap.set("91confirm-written-binding-yes", "");
        clarificationMap.set("91confirm-written-binding-no", "");
        clarificationMap.set(
            "108confirm-pd-and-controller-following-q-yes",
            ""
        );
        clarificationMap.set("108confirm-pd-and-controller-following-q-no", "");
        clarificationMap.set(
            "108confirm-pd-and-controller-following-q-yes",
            ""
        );
        clarificationMap.set("108confirm-pd-and-controller-following-q-no", "");
        clarificationMap.set(
            "109confirm-include-contact-of-controller-yes",
            ""
        );
        clarificationMap.set("109confirm-include-contact-of-controller-no", "");
        clarificationMap.set(
            "124confirm-spd-and-controller-and-consent-yes",
            ""
        );
        clarificationMap.set(
            "124confirm-spd-and-controller-and-consent-no",
            ""
        );
        clarificationMap.set(
            "92confirm-no-clauses-indemnify-processors-yes",
            ""
        );
        clarificationMap.set(
            "92confirm-no-clauses-indemnify-processors-no",
            ""
        );
        clarificationMap.set(
            "92confirm-no-clauses-indemnify-processors-yes",
            ""
        );
        clarificationMap.set(
            "92confirm-no-clauses-indemnify-processors-no",
            ""
        );
        clarificationMap.set(
            "110confirm-include-legal-basis-for-purpose-yes",
            ""
        );
        clarificationMap.set(
            "110confirm-include-legal-basis-for-purpose-no",
            ""
        );
        clarificationMap.set(
            "110confirm-include-legal-basis-for-purpose-yes",
            ""
        );
        clarificationMap.set(
            "110confirm-include-legal-basis-for-purpose-no",
            ""
        );
        clarificationMap.set("125confirm-freely-given-yes", "");
        clarificationMap.set("125confirm-freely-given-no", "");
        clarificationMap.set("139confirm-pd-of-child-and-controller-yes", "");
        clarificationMap.set("139confirm-pd-of-child-and-controller-no", "");
        clarificationMap.set("93confirm-set-out-subject-matter-yes", "");
        clarificationMap.set("93confirm-set-out-subject-matter-no", "");
        clarificationMap.set("93confirm-set-out-subject-matter-yes", "");
        clarificationMap.set("93confirm-set-out-subject-matter-no", "");
        clarificationMap.set("111confirm-include-recipients-yes", "");
        clarificationMap.set("111confirm-include-recipients-no", "");
        clarificationMap.set("111confirm-include-recipients-yes", "");
        clarificationMap.set("111confirm-include-recipients-no", "");
        clarificationMap.set("126confirm-not-a-precondition-yes", "");
        clarificationMap.set("126confirm-not-a-precondition-no", "");
        clarificationMap.set("126confirm-not-a-precondition-yes", "");
        clarificationMap.set("126confirm-not-a-precondition-no", "");
        clarificationMap.set("140confirm-design-easy-to-undersatnd-yes", "");
        clarificationMap.set("140confirm-design-easy-to-undersatnd-no", "");
        clarificationMap.set("166confirm-cookies-yes", "");
        clarificationMap.set("166confirm-cookies-no", "");
        clarificationMap.set("94confirm-set-ot-the-nature-purpose-yes", "");
        clarificationMap.set("94confirm-set-ot-the-nature-purpose-no", "");
        clarificationMap.set("94confirm-set-ot-the-nature-purpose-yes", "");
        clarificationMap.set("94confirm-set-ot-the-nature-purpose-no", "");
        clarificationMap.set("112confirm-include-euc-bcr-yes", "");
        clarificationMap.set("112confirm-include-euc-bcr-no", "");
        clarificationMap.set("112confirm-include-euc-bcr-yes", "");
        clarificationMap.set("112confirm-include-euc-bcr-no", "");
        clarificationMap.set("127confirm-separately-from-team-yes", "");
        clarificationMap.set("127confirm-separately-from-team-no", "");
        clarificationMap.set("127confirm-separately-from-team-yes", "");
        clarificationMap.set("127confirm-separately-from-team-no", "");
        clarificationMap.set(
            "141confirm-exercise-data-protection-rights-yes",
            ""
        );
        clarificationMap.set(
            "141confirm-exercise-data-protection-rights-no",
            ""
        );
        clarificationMap.set(
            "141confirm-exercise-data-protection-rights-yes",
            ""
        );
        clarificationMap.set(
            "141confirm-exercise-data-protection-rights-no",
            ""
        );
        clarificationMap.set("167confirm-cookies-policy-yes", "");
        clarificationMap.set("167confirm-cookies-policy-no", "");
        clarificationMap.set("175confirm-bug-reporting-yes", "");
        clarificationMap.set("175confirm-bug-reporting-no", "");
        clarificationMap.set("95confirm-set-out-the-type-of-data-yes", "");
        clarificationMap.set("95confirm-set-out-the-type-of-data-no", "");
        clarificationMap.set("95confirm-set-out-the-type-of-data-yes", "");
        clarificationMap.set("95confirm-set-out-the-type-of-data-no", "");
        clarificationMap.set("113confirm-include-retention-period-yes", "");
        clarificationMap.set("113confirm-include-retention-period-no", "");
        clarificationMap.set("113confirm-include-retention-period-yes", "");
        clarificationMap.set("113confirm-include-retention-period-no", "");
        clarificationMap.set("128confirm-fair-process-info-yes", "");
        clarificationMap.set("128confirm-fair-process-info-no", "");
        clarificationMap.set("128confirm-fair-process-info-yes", "");
        clarificationMap.set("128confirm-fair-process-info-no", "");
        clarificationMap.set("142confirm-get-pd-erased-easily-yes", "");
        clarificationMap.set("142confirm-get-pd-erased-easily-no", "");
        clarificationMap.set("142confirm-get-pd-erased-easily-yes", "");
        clarificationMap.set("142confirm-get-pd-erased-easily-no", "");
        clarificationMap.set("168confirm-cookie-explain-yes", "");
        clarificationMap.set("168confirm-cookie-explain-no", "");
        clarificationMap.set("168confirm-cookie-explain-yes", "");
        clarificationMap.set("168confirm-cookie-explain-no", "");
        clarificationMap.set("176confirm-collect-bug-report-data-yes", "");
        clarificationMap.set("176confirm-collect-bug-report-data-no", "");
        clarificationMap.set("179confirm-dpo-yes", "");
        clarificationMap.set("179confirm-dpo-no", "");
        clarificationMap.set(
            "96confirm-set-out-obligation-of-controller-yes",
            ""
        );
        clarificationMap.set(
            "96confirm-set-out-obligation-of-controller-no",
            ""
        );
        clarificationMap.set(
            "96confirm-set-out-obligation-of-controller-yes",
            ""
        );
        clarificationMap.set(
            "96confirm-set-out-obligation-of-controller-no",
            ""
        );
        clarificationMap.set("114confirm-include-rigth-to-lodge-yes", "");
        clarificationMap.set("114confirm-include-rigth-to-lodge-no", "");
        clarificationMap.set("114confirm-include-rigth-to-lodge-yes", "");
        clarificationMap.set("114confirm-include-rigth-to-lodge-no", "");
        clarificationMap.set("129confirm-withdraw-consent-easily-yes", "");
        clarificationMap.set("129confirm-withdraw-consent-easily-no", "");
        clarificationMap.set("129confirm-withdraw-consent-easily-yes", "");
        clarificationMap.set("129confirm-withdraw-consent-easily-no", "");
        clarificationMap.set(
            "143confirm-complies-requirements-of-uk-data-yes",
            ""
        );
        clarificationMap.set(
            "143confirm-complies-requirements-of-uk-data-no",
            ""
        );
        clarificationMap.set(
            "143confirm-complies-requirements-of-uk-data-yes",
            ""
        );
        clarificationMap.set(
            "143confirm-complies-requirements-of-uk-data-no",
            ""
        );
        clarificationMap.set("169confirm-valid-cookie-yes", "");
        clarificationMap.set("169confirm-valid-cookie-no", "");
        clarificationMap.set("169confirm-valid-cookie-yes", "");
        clarificationMap.set("169confirm-valid-cookie-no", "");
        clarificationMap.set("177confirm-informed-consent-of-user-yes", "");
        clarificationMap.set("177confirm-informed-consent-of-user-no", "");
        clarificationMap.set("177confirm-informed-consent-of-user-yes", "");
        clarificationMap.set("177confirm-informed-consent-of-user-no", "");
        clarificationMap.set("180confirm-have-dpo-yes", "");
        clarificationMap.set("180confirm-have-dpo-no", "");
        clarificationMap.set("181confirm-product-a-mobile-devices-yes", "");
        clarificationMap.set("181confirm-product-a-mobile-devices-no", "");
        clarificationMap.set(
            "97confirm-processor-act-on-the-written-instruction-yes",
            ""
        );
        clarificationMap.set(
            "97confirm-processor-act-on-the-written-instruction-no",
            ""
        );
        clarificationMap.set(
            "97confirm-processor-act-on-the-written-instruction-yes",
            ""
        );
        clarificationMap.set(
            "97confirm-processor-act-on-the-written-instruction-no",
            ""
        );
        clarificationMap.set(
            "115confirm-include-failing-to-the-provbide-the-peronal-data-yes",
            ""
        );
        clarificationMap.set(
            "115confirm-include-failing-to-the-provbide-the-peronal-data-no",
            ""
        );
        clarificationMap.set(
            "115confirm-include-failing-to-the-provbide-the-peronal-data-yes",
            ""
        );
        clarificationMap.set(
            "115confirm-include-failing-to-the-provbide-the-peronal-data-no",
            ""
        );
        clarificationMap.set("130confirm-obtained-seperately-yes", "");
        clarificationMap.set("130confirm-obtained-seperately-no", "");
        clarificationMap.set("130confirm-obtained-seperately-yes", "");
        clarificationMap.set("130confirm-obtained-seperately-no", "");
        clarificationMap.set("144confirm-process-chil-dfrom-outset-yes", "");
        clarificationMap.set("144confirm-process-chil-dfrom-outset-no", "");
        clarificationMap.set("144confirm-process-chil-dfrom-outset-yes", "");
        clarificationMap.set("144confirm-process-chil-dfrom-outset-no", "");
        clarificationMap.set("170confirm-cookie-explain-the-purpose-yes", "");
        clarificationMap.set("170confirm-cookie-explain-the-purpose-no", "");
        clarificationMap.set("170confirm-cookie-explain-the-purpose-yes", "");
        clarificationMap.set("170confirm-cookie-explain-the-purpose-no", "");
        clarificationMap.set("178confirm-fully-anonymised-yes", "");
        clarificationMap.set("178confirm-fully-anonymised-no", "");
        clarificationMap.set("178confirm-fully-anonymised-yes", "");
        clarificationMap.set("178confirm-fully-anonymised-no", "");
        clarificationMap.set("181confirm-product-a-mobile-devices-yes", "");
        clarificationMap.set("181confirm-product-a-mobile-devices-no", "");
        clarificationMap.set("181confirm-product-a-mobile-devices-yes", "");
        clarificationMap.set("181confirm-product-a-mobile-devices-no", "");
        clarificationMap.set("182confirm-product-processes-pd-yes", "");
        clarificationMap.set("182confirm-product-processes-pd-no", "");
        clarificationMap.set("188confirm-color-yes", "");
        clarificationMap.set("188confirm-color-no", "");
        clarificationMap.set(
            "98confirm-unsure-their-employees-processing-yes",
            ""
        );
        clarificationMap.set(
            "98confirm-unsure-their-employees-processing-no",
            ""
        );
        clarificationMap.set(
            "98confirm-unsure-their-employees-processing-yes",
            ""
        );
        clarificationMap.set(
            "98confirm-unsure-their-employees-processing-no",
            ""
        );
        clarificationMap.set("116confirm-include-consequences-yes", "");
        clarificationMap.set("116confirm-include-consequences-no", "");
        clarificationMap.set("116confirm-include-consequences-yes", "");
        clarificationMap.set("116confirm-include-consequences-no", "");
        clarificationMap.set("131confirm-recorded-yes", "");
        clarificationMap.set("131confirm-recorded-no", "");
        clarificationMap.set("131confirm-recorded-yes", "");
        clarificationMap.set("131confirm-recorded-no", "");
        clarificationMap.set("145confirm-fair-and-complies-with-dpp-yes", "");
        clarificationMap.set("145confirm-fair-and-complies-with-dpp-no", "");
        clarificationMap.set("145confirm-fair-and-complies-with-dpp-yes", "");
        clarificationMap.set("145confirm-fair-and-complies-with-dpp-no", "");
        clarificationMap.set(
            "171confirm-use-strictly-necessary-cookies-yes",
            ""
        );
        clarificationMap.set(
            "171confirm-use-strictly-necessary-cookies-no",
            ""
        );
        clarificationMap.set(
            "171confirm-use-strictly-necessary-cookies-yes",
            ""
        );
        clarificationMap.set(
            "171confirm-use-strictly-necessary-cookies-no",
            ""
        );
        clarificationMap.set("179confirm-dpo-yes", "");
        clarificationMap.set("179confirm-dpo-no", "");
        clarificationMap.set("179confirm-dpo-yes", "");
        clarificationMap.set("179confirm-dpo-no", "");
        clarificationMap.set("183confirm-smart-phone-and-process-pd-yes", "");
        clarificationMap.set("183confirm-smart-phone-and-process-pd-no", "");
        clarificationMap.set("185confirm-code-level-security-yes", "");
        clarificationMap.set("185confirm-code-level-security-no", "");
        clarificationMap.set("189confirm-follow-6-principles-yes", "");
        clarificationMap.set("189confirm-follow-6-principles-no", "");
        clarificationMap.set("189confirm-follow-6-principles-yes", "");
        clarificationMap.set("189confirm-follow-6-principles-no", "");
        clarificationMap.set(
            "99confirm-ensure-the-security-of-processing-yes",
            ""
        );
        clarificationMap.set(
            "99confirm-ensure-the-security-of-processing-no",
            ""
        );
        clarificationMap.set(
            "99confirm-ensure-the-security-of-processing-yes",
            ""
        );
        clarificationMap.set(
            "99confirm-ensure-the-security-of-processing-no",
            ""
        );
        clarificationMap.set("117confirm-include-obtain-copy-of-pd-yes", "");
        clarificationMap.set("117confirm-include-obtain-copy-of-pd-no", "");
        clarificationMap.set("117confirm-include-obtain-copy-of-pd-yes", "");
        clarificationMap.set("117confirm-include-obtain-copy-of-pd-no", "");
        clarificationMap.set("132confirm-evidence-of-valid-consent-yes", "");
        clarificationMap.set("132confirm-evidence-of-valid-consent-no", "");
        clarificationMap.set("132confirm-evidence-of-valid-consent-yes", "");
        clarificationMap.set("132confirm-evidence-of-valid-consent-no", "");
        clarificationMap.set("146confirm-use-dpias-yes", "");
        clarificationMap.set("146confirm-use-dpias-no", "");
        clarificationMap.set("146confirm-use-dpias-yes", "");
        clarificationMap.set("146confirm-use-dpias-no", "");
        clarificationMap.set(
            "172confirm-exclude-strictly-necessary-cookies-yes",
            ""
        );
        clarificationMap.set(
            "172confirm-exclude-strictly-necessary-cookies-no",
            ""
        );
        clarificationMap.set(
            "172confirm-exclude-strictly-necessary-cookies-yes",
            ""
        );
        clarificationMap.set(
            "172confirm-exclude-strictly-necessary-cookies-no",
            ""
        );
        clarificationMap.set("184confirm-persisted-to-mobile-devices-yes", "");
        clarificationMap.set("184confirm-persisted-to-mobile-devices-no", "");
        clarificationMap.set("185confirm-code-level-security-yes", "");
        clarificationMap.set("185confirm-code-level-security-no", "");
        clarificationMap.set(
            "186confirm-evidence-of-code-level-report-yes",
            ""
        );
        clarificationMap.set("186confirm-evidence-of-code-level-report-no", "");
        clarificationMap.set("188confirm-color-yes", "");
        clarificationMap.set("188confirm-color-no", "");
        clarificationMap.set(
            "190provide-phase-of-human-centred-design-yes",
            ""
        );
        clarificationMap.set("190provide-phase-of-human-centred-design-no", "");
        clarificationMap.set(
            "190provide-phase-of-human-centred-design-yes",
            ""
        );
        clarificationMap.set("190provide-phase-of-human-centred-design-no", "");
        clarificationMap.set("100confirm-only-engage-sub-processing-yes", "");
        clarificationMap.set("100confirm-only-engage-sub-processing-no", "");
        clarificationMap.set("100confirm-only-engage-sub-processing-yes", "");
        clarificationMap.set("100confirm-only-engage-sub-processing-no", "");
        clarificationMap.set("118confirm-include-restrict-their-pd-yes", "");
        clarificationMap.set("118confirm-include-restrict-their-pd-no", "");
        clarificationMap.set("118confirm-include-restrict-their-pd-yes", "");
        clarificationMap.set("118confirm-include-restrict-their-pd-no", "");
        clarificationMap.set("133confirm-affirmative-yes", "");
        clarificationMap.set("133confirm-affirmative-no", "");
        clarificationMap.set("133confirm-affirmative-yes", "");
        clarificationMap.set("133confirm-affirmative-no", "");
        clarificationMap.set("147confirm-risk-of-childs-yes", "");
        clarificationMap.set("147confirm-risk-of-childs-no", "");
        clarificationMap.set("147confirm-risk-of-childs-yes", "");
        clarificationMap.set("147confirm-risk-of-childs-no", "");
        clarificationMap.set("173confirm-evidence-valid-consent-yes", "");
        clarificationMap.set("173confirm-evidence-valid-consent-no", "");
        clarificationMap.set("173confirm-evidence-valid-consent-yes", "");
        clarificationMap.set("173confirm-evidence-valid-consent-no", "");
        clarificationMap.set("185confirm-code-level-security-yes", "");
        clarificationMap.set("185confirm-code-level-security-no", "");
        clarificationMap.set("185confirm-code-level-security-yes", "");
        clarificationMap.set("185confirm-code-level-security-no", "");
        clarificationMap.set("187confirm-by-external-body-yes", "");
        clarificationMap.set("187confirm-by-external-body-no", "");
        clarificationMap.set("187confirm-by-external-body-yes", "");
        clarificationMap.set("187confirm-by-external-body-no", "");
        clarificationMap.set("191provide-user-demographics-yes", "");
        clarificationMap.set("191provide-user-demographics-no", "");
        clarificationMap.set("191provide-user-demographics-yes", "");
        clarificationMap.set("191provide-user-demographics-no", "");
        clarificationMap.set(
            "101confirm-data-subject-to-exercise-their-rights-under-uk-laws-yes",
            ""
        );
        clarificationMap.set(
            "101confirm-data-subject-to-exercise-their-rights-under-uk-laws-no",
            ""
        );
        clarificationMap.set(
            "101confirm-data-subject-to-exercise-their-rights-under-uk-laws-yes",
            ""
        );
        clarificationMap.set(
            "101confirm-data-subject-to-exercise-their-rights-under-uk-laws-no",
            ""
        );
        clarificationMap.set(
            "119confirm-include-existence-of-the-data-yes",
            ""
        );
        clarificationMap.set("119confirm-include-existence-of-the-data-no", "");
        clarificationMap.set(
            "119confirm-include-existence-of-the-data-yes",
            ""
        );
        clarificationMap.set("119confirm-include-existence-of-the-data-no", "");
        clarificationMap.set("134confirm-not-predicted-yes", "");
        clarificationMap.set("134confirm-not-predicted-no", "");
        clarificationMap.set("134confirm-not-predicted-yes", "");
        clarificationMap.set("134confirm-not-predicted-no", "");
        clarificationMap.set("148confirm-privacy-notices-yes", "");
        clarificationMap.set("148confirm-privacy-notices-no", "");
        clarificationMap.set("148confirm-privacy-notices-yes", "");
        clarificationMap.set("148confirm-privacy-notices-no", "");
        clarificationMap.set("174confirm-consent-withdraw-easily-yes", "");
        clarificationMap.set("174confirm-consent-withdraw-easily-no", "");
        clarificationMap.set("174confirm-consent-withdraw-easily-yes", "");
        clarificationMap.set("174confirm-consent-withdraw-easily-no", "");
        clarificationMap.set("188confirm-color-yes", "");
        clarificationMap.set("188confirm-color-no", "");
        clarificationMap.set("188confirm-color-yes", "");
        clarificationMap.set("188confirm-color-no", "");
        clarificationMap.set("192research-informed-user-needs-yes", "");
        clarificationMap.set("192research-informed-user-needs-no", "");
        clarificationMap.set("192research-informed-user-needs-yes", "");
        clarificationMap.set("192research-informed-user-needs-no", "");
        clarificationMap.set("102confirm-processor-assist-controller-yes", "");
        clarificationMap.set("102confirm-processor-assist-controller-no", "");
        clarificationMap.set("102confirm-processor-assist-controller-yes", "");
        clarificationMap.set("102confirm-processor-assist-controller-no", "");
        clarificationMap.set(
            "120confirm-include-right-to-withdraw-consent-yes",
            ""
        );
        clarificationMap.set(
            "120confirm-include-right-to-withdraw-consent-no",
            ""
        );
        clarificationMap.set(
            "120confirm-include-right-to-withdraw-consent-yes",
            ""
        );
        clarificationMap.set(
            "120confirm-include-right-to-withdraw-consent-no",
            ""
        );
        clarificationMap.set("135confirm-not-use-blank-yes", "");
        clarificationMap.set("135confirm-not-use-blank-no", "");
        clarificationMap.set("135confirm-not-use-blank-yes", "");
        clarificationMap.set("135confirm-not-use-blank-no", "");
        clarificationMap.set("149confirm-friendly-way-of-data-yes", "");
        clarificationMap.set("149confirm-friendly-way-of-data-no", "");
        clarificationMap.set("149confirm-friendly-way-of-data-yes", "");
        clarificationMap.set("149confirm-friendly-way-of-data-no", "");
        clarificationMap.set("175confirm-bug-reporting-yes", "");
        clarificationMap.set("175confirm-bug-reporting-no", "");
        clarificationMap.set("175confirm-bug-reporting-yes", "");
        clarificationMap.set("175confirm-bug-reporting-no", "");
        clarificationMap.set("193provide-product-addresses-yes", "");
        clarificationMap.set("193provide-product-addresses-no", "");
        clarificationMap.set("193provide-product-addresses-yes", "");
        clarificationMap.set("193provide-product-addresses-no", "");
        clarificationMap.set("103confirm-processor-tell-controller-yes", "");
        clarificationMap.set("103confirm-processor-tell-controller-no", "");
        clarificationMap.set("103confirm-processor-tell-controller-yes", "");
        clarificationMap.set("103confirm-processor-tell-controller-no", "");
        clarificationMap.set(
            "121confirm-include-right-to-data-probability-yes",
            ""
        );
        clarificationMap.set(
            "121confirm-include-right-to-data-probability-no",
            ""
        );
        clarificationMap.set(
            "121confirm-include-right-to-data-probability-yes",
            ""
        );
        clarificationMap.set(
            "121confirm-include-right-to-data-probability-no",
            ""
        );
        clarificationMap.set("136confirm-not-default-setting-yes", "");
        clarificationMap.set("136confirm-not-default-setting-no", "");
        clarificationMap.set("136confirm-not-default-setting-yes", "");
        clarificationMap.set("136confirm-not-default-setting-no", "");
        clarificationMap.set("150confirmexplain-to-childs-yes", "");
        clarificationMap.set("150confirmexplain-to-childs-no", "");
        clarificationMap.set("150confirmexplain-to-childs-yes", "");
        clarificationMap.set("150confirmexplain-to-childs-no", "");
        clarificationMap.set("194provide-times-tested-yes", "");
        clarificationMap.set("194provide-times-tested-no", "");
        clarificationMap.set("194provide-times-tested-yes", "");
        clarificationMap.set("194provide-times-tested-no", "");
        clarificationMap.set("104confirm-pd-from-individual-yes", "");
        clarificationMap.set("104confirm-pd-from-individual-no", "");
        clarificationMap.set("104confirm-pd-from-individual-yes", "");
        clarificationMap.set("104confirm-pd-from-individual-no", "");
        clarificationMap.set(
            "122confirm-include-decission-based-on-automated-processing-yes",
            ""
        );
        clarificationMap.set(
            "122confirm-include-decission-based-on-automated-processing-no",
            ""
        );
        clarificationMap.set(
            "122confirm-include-decission-based-on-automated-processing-yes",
            ""
        );
        clarificationMap.set(
            "122confirm-include-decission-based-on-automated-processing-no",
            ""
        );
        clarificationMap.set("137confirm-not-use-a-blanket-acceptance-yes", "");
        clarificationMap.set("137confirm-not-use-a-blanket-acceptance-no", "");
        clarificationMap.set("137confirm-not-use-a-blanket-acceptance-yes", "");
        clarificationMap.set("137confirm-not-use-a-blanket-acceptance-no", "");
        clarificationMap.set("151confirm-explain-risk-of-inherent-yes", "");
        clarificationMap.set("151confirm-explain-risk-of-inherent-no", "");
        clarificationMap.set("151confirm-explain-risk-of-inherent-yes", "");
        clarificationMap.set("151confirm-explain-risk-of-inherent-no", "");
        clarificationMap.set(
            "195confirm-test-of-usability-and-accessibility-yes",
            ""
        );
        clarificationMap.set(
            "195confirm-test-of-usability-and-accessibility-no",
            ""
        );
        clarificationMap.set(
            "195confirm-test-of-usability-and-accessibility-yes",
            ""
        );
        clarificationMap.set(
            "195confirm-test-of-usability-and-accessibility-no",
            ""
        );
        clarificationMap.set(
            "123confirm-include-notified-when-changes-yes",
            ""
        );
        clarificationMap.set("123confirm-include-notified-when-changes-no", "");
        clarificationMap.set(
            "123confirm-include-notified-when-changes-yes",
            ""
        );
        clarificationMap.set("123confirm-include-notified-when-changes-no", "");
        clarificationMap.set("138confirm-ensure-individual-refuse-yes", "");
        clarificationMap.set("138confirm-ensure-individual-refuse-no", "");
        clarificationMap.set("138confirm-ensure-individual-refuse-yes", "");
        clarificationMap.set("138confirm-ensure-individual-refuse-no", "");
        clarificationMap.set("152confirm-tell-child-rights-yes", "");
        clarificationMap.set("152confirm-tell-child-rights-no", "");
        clarificationMap.set("152confirm-tell-child-rights-yes", "");
        clarificationMap.set("152confirm-tell-child-rights-no", "");
        clarificationMap.set("196provide-user-feedback-yes", "");
        clarificationMap.set("196provide-user-feedback-no", "");
        clarificationMap.set("199ios-or-android-yes", "");
        clarificationMap.set("199ios-or-android-no", "");
        clarificationMap.set(
            "124confirm-spd-and-controller-and-consent-yes",
            ""
        );
        clarificationMap.set(
            "124confirm-spd-and-controller-and-consent-no",
            ""
        );
        clarificationMap.set(
            "124confirm-spd-and-controller-and-consent-yes",
            ""
        );
        clarificationMap.set(
            "124confirm-spd-and-controller-and-consent-no",
            ""
        );
        clarificationMap.set("139confirm-pd-of-child-and-controller-yes", "");
        clarificationMap.set("139confirm-pd-of-child-and-controller-no", "");
        clarificationMap.set("139confirm-pd-of-child-and-controller-yes", "");
        clarificationMap.set("139confirm-pd-of-child-and-controller-no", "");
        clarificationMap.set("153confirm-not-use-pd-to-auto-decision-yes", "");
        clarificationMap.set("153confirm-not-use-pd-to-auto-decision-no", "");
        clarificationMap.set("153confirm-not-use-pd-to-auto-decision-yes", "");
        clarificationMap.set("153confirm-not-use-pd-to-auto-decision-no", "");
        clarificationMap.set("197provide-post-release-yes", "");
        clarificationMap.set("197provide-post-release-no", "");
        clarificationMap.set("197provide-post-release-yes", "");
        clarificationMap.set("197provide-post-release-no", "");
        clarificationMap.set("200os-accessibility-yes", "");
        clarificationMap.set("200os-accessibility-no", "");
        clarificationMap.set("201confirm-progressive-web-app-yes", "");
        clarificationMap.set("201confirm-progressive-web-app-no", "");
        clarificationMap.set("154confirm-noe-exception-yes", "");
        clarificationMap.set("154confirm-noe-exception-no", "");
        clarificationMap.set("154confirm-noe-exception-yes", "");
        clarificationMap.set("154confirm-noe-exception-no", "");
        clarificationMap.set("198provide-schedule-of-improvement-yes", "");
        clarificationMap.set("198provide-schedule-of-improvement-no", "");
        clarificationMap.set("198provide-schedule-of-improvement-yes", "");
        clarificationMap.set("198provide-schedule-of-improvement-no", "");
        clarificationMap.set("201confirm-progressive-web-app-yes", "");
        clarificationMap.set("201confirm-progressive-web-app-no", "");
        clarificationMap.set("201confirm-progressive-web-app-yes", "");
        clarificationMap.set("201confirm-progressive-web-app-no", "");
        clarificationMap.set("202confirm-comply-with-baseline-yes", "");
        clarificationMap.set("202confirm-comply-with-baseline-no", "");
        clarificationMap.set("204confirm-website-yes", "");
        clarificationMap.set("204confirm-website-no", "");
        clarificationMap.set("155confrim-stop-profiling-yes", "");
        clarificationMap.set("155confrim-stop-profiling-no", "");
        clarificationMap.set("155confrim-stop-profiling-yes", "");
        clarificationMap.set("155confrim-stop-profiling-no", "");
        clarificationMap.set("199ios-or-android-yes", "");
        clarificationMap.set("199ios-or-android-no", "");
        clarificationMap.set("199ios-or-android-yes", "");
        clarificationMap.set("199ios-or-android-no", "");
        clarificationMap.set("203confirm-accessibility-testing-yes", "");
        clarificationMap.set("203confirm-accessibility-testing-no", "");
        clarificationMap.set("203confirm-accessibility-testing-yes", "");
        clarificationMap.set("203confirm-accessibility-testing-no", "");
        clarificationMap.set("205confirm-responsive-yes", "");
        clarificationMap.set("205confirm-responsive-no", "");
        clarificationMap.set("212confirm-expose-api-yes", "");
        clarificationMap.set("212confirm-expose-api-no", "");
        clarificationMap.set("156confirm-marketing-child-s-pd-yes", "");
        clarificationMap.set("156confirm-marketing-child-s-pd-no", "");
        clarificationMap.set("156confirm-marketing-child-s-pd-yes", "");
        clarificationMap.set("156confirm-marketing-child-s-pd-no", "");
        clarificationMap.set("204confirm-website-yes", "");
        clarificationMap.set("204confirm-website-no", "");
        clarificationMap.set("204confirm-website-yes", "");
        clarificationMap.set("204confirm-website-no", "");
        clarificationMap.set("206confirm-wcag2-1-yes", "");
        clarificationMap.set("206confirm-wcag2-1-no", "");
        clarificationMap.set("206confirm-wcag2-1-yes", "");
        clarificationMap.set("206confirm-wcag2-1-no", "");
        clarificationMap.set("213api-adhere-to-gds-yes", "");
        clarificationMap.set("213api-adhere-to-gds-no", "");
        clarificationMap.set("214capable-in-standard-format-yes", "");
        clarificationMap.set("214capable-in-standard-format-no", "");
        clarificationMap.set("157confirm-take-guidance-into-account-yes", "");
        clarificationMap.set("157confirm-take-guidance-into-account-no", "");
        clarificationMap.set("157confirm-take-guidance-into-account-yes", "");
        clarificationMap.set("157confirm-take-guidance-into-account-no", "");
        clarificationMap.set("207provide-text-equivalence-yes", "");
        clarificationMap.set("207provide-text-equivalence-no", "");
        clarificationMap.set("207provide-text-equivalence-yes", "");
        clarificationMap.set("207provide-text-equivalence-no", "");
        clarificationMap.set("214capable-in-standard-format-yes", "");
        clarificationMap.set("214capable-in-standard-format-no", "");
        clarificationMap.set("214capable-in-standard-format-yes", "");
        clarificationMap.set("214capable-in-standard-format-no", "");
        clarificationMap.set("215confirm-wearable-device-yes", "");
        clarificationMap.set("215confirm-wearable-device-no", "");
        clarificationMap.set("215confirm-wearable-device-yes", "");
        clarificationMap.set("215confirm-wearable-device-no", "");
        clarificationMap.set("158confirm-stop-pd-for-marketing-yes", "");
        clarificationMap.set("158confirm-stop-pd-for-marketing-no", "");
        clarificationMap.set("158confirm-stop-pd-for-marketing-yes", "");
        clarificationMap.set("158confirm-stop-pd-for-marketing-no", "");
        clarificationMap.set("208confirm-testing-on-web-yes", "");
        clarificationMap.set("208confirm-testing-on-web-no", "");
        clarificationMap.set("208confirm-testing-on-web-yes", "");
        clarificationMap.set("208confirm-testing-on-web-no", "");
        clarificationMap.set("216provide-evidence-with-iso-ieee-yes", "");
        clarificationMap.set("216provide-evidence-with-iso-ieee-no", "");
        clarificationMap.set(
            "217confirm-source-code-controlled-with-audited-yes",
            ""
        );
        clarificationMap.set(
            "217confirm-source-code-controlled-with-audited-no",
            ""
        );
        clarificationMap.set("159confirm-comply-with-marketing-yes", "");
        clarificationMap.set("159confirm-comply-with-marketing-no", "");
        clarificationMap.set("159confirm-comply-with-marketing-yes", "");
        clarificationMap.set("159confirm-comply-with-marketing-no", "");
        clarificationMap.set("209confirm-keyboard-only-control-yes", "");
        clarificationMap.set("209confirm-keyboard-only-control-no", "");
        clarificationMap.set("209confirm-keyboard-only-control-yes", "");
        clarificationMap.set("209confirm-keyboard-only-control-no", "");
        clarificationMap.set(
            "217confirm-source-code-controlled-with-audited-yes",
            ""
        );
        clarificationMap.set(
            "217confirm-source-code-controlled-with-audited-no",
            ""
        );
        clarificationMap.set(
            "217confirm-source-code-controlled-with-audited-yes",
            ""
        );
        clarificationMap.set(
            "217confirm-source-code-controlled-with-audited-no",
            ""
        );
        clarificationMap.set("218confirm-iso-9001-yes", "");
        clarificationMap.set("218confirm-iso-9001-no", "");
        clarificationMap.set("218confirm-iso-9001-yes", "");
        clarificationMap.set("218confirm-iso-9001-no", "");
        clarificationMap.set("160confirm-not-offer-iss-yes", "");
        clarificationMap.set("160confirm-not-offer-iss-no", "");
        clarificationMap.set("160confirm-not-offer-iss-yes", "");
        clarificationMap.set("160confirm-not-offer-iss-no", "");
        clarificationMap.set("210provide-accessibility-testing-yes", "");
        clarificationMap.set("210provide-accessibility-testing-no", "");
        clarificationMap.set("210provide-accessibility-testing-yes", "");
        clarificationMap.set("210provide-accessibility-testing-no", "");
        clarificationMap.set("219confirm-testing-accreditation-yes", "");
        clarificationMap.set("219confirm-testing-accreditation-no", "");
        clarificationMap.set("219confirm-testing-accreditation-yes", "");
        clarificationMap.set("219confirm-testing-accreditation-no", "");
        clarificationMap.set("161provide-13-years-old-yes", "");
        clarificationMap.set("161provide-13-years-old-no", "");
        clarificationMap.set("161provide-13-years-old-yes", "");
        clarificationMap.set("161provide-13-years-old-no", "");
        clarificationMap.set(
            "211provide-evidence-improving-accessibility-yes",
            ""
        );
        clarificationMap.set(
            "211provide-evidence-improving-accessibility-no",
            ""
        );
        clarificationMap.set("212confirm-expose-api-yes", "");
        clarificationMap.set("212confirm-expose-api-no", "");
        clarificationMap.set("220confirm-issues-in-all-tests-yes", "");
        clarificationMap.set("220confirm-issues-in-all-tests-no", "");
        clarificationMap.set("220confirm-issues-in-all-tests-yes", "");
        clarificationMap.set("220confirm-issues-in-all-tests-no", "");
        clarificationMap.set("162provide-effort-yes", "");
        clarificationMap.set("162provide-effort-no", "");
        clarificationMap.set("162provide-effort-yes", "");
        clarificationMap.set("162provide-effort-no", "");
        clarificationMap.set("212confirm-expose-api-yes", "");
        clarificationMap.set("212confirm-expose-api-no", "");
        clarificationMap.set("212confirm-expose-api-yes", "");
        clarificationMap.set("212confirm-expose-api-no", "");
        clarificationMap.set("221confirm-rollback-yes", "");
        clarificationMap.set("221confirm-rollback-no", "");
        clarificationMap.set("221confirm-rollback-yes", "");
        clarificationMap.set("221confirm-rollback-no", "");
        clarificationMap.set("163confirm-age-limits-yes", "");
        clarificationMap.set("163confirm-age-limits-no", "");
        clarificationMap.set("163confirm-age-limits-yes", "");
        clarificationMap.set("163confirm-age-limits-no", "");
        clarificationMap.set("222provide-how-rollback-yes", "");
        clarificationMap.set("222provide-how-rollback-no", "");
        clarificationMap.set("223confirm-monitor-running-of-system-yes", "");
        clarificationMap.set("223confirm-monitor-running-of-system-no", "");
        clarificationMap.set("164confirm-review-age-verification-yes", "");
        clarificationMap.set("164confirm-review-age-verification-no", "");
        clarificationMap.set("164confirm-review-age-verification-yes", "");
        clarificationMap.set("164confirm-review-age-verification-no", "");
        clarificationMap.set("223confirm-monitor-running-of-system-yes", "");
        clarificationMap.set("223confirm-monitor-running-of-system-no", "");
        clarificationMap.set("223confirm-monitor-running-of-system-yes", "");
        clarificationMap.set("223confirm-monitor-running-of-system-no", "");
        clarificationMap.set("224confirm-documented-roadmap-yes", "");
        clarificationMap.set("224confirm-documented-roadmap-no", "");
        clarificationMap.set("224confirm-documented-roadmap-yes", "");
        clarificationMap.set("224confirm-documented-roadmap-no", "");
        clarificationMap.set("165confirm-not-seek-parental-consent-yes", "");
        clarificationMap.set("165confirm-not-seek-parental-consent-no", "");
        clarificationMap.set("165confirm-not-seek-parental-consent-yes", "");
        clarificationMap.set("165confirm-not-seek-parental-consent-no", "");
        clarificationMap.set("225confirm-details-of-development-yes", "");
        clarificationMap.set("225confirm-details-of-development-no", "");
        clarificationMap.set("226confirm-road-map-for-future-yes", "");
        clarificationMap.set("226confirm-road-map-for-future-no", "");
        clarificationMap.set("166confirm-cookies-yes", "");
        clarificationMap.set("166confirm-cookies-no", "");
        clarificationMap.set("166confirm-cookies-yes", "");
        clarificationMap.set("166confirm-cookies-no", "");
        clarificationMap.set("226confirm-road-map-for-future-yes", "");
        clarificationMap.set("226confirm-road-map-for-future-no", "");
        clarificationMap.set("226confirm-road-map-for-future-yes", "");
        clarificationMap.set("226confirm-road-map-for-future-no", "");
        clarificationMap.set("227provide-ensure-availability-yes", "");
        clarificationMap.set("227provide-ensure-availability-no", "");
        clarificationMap.set("228decommissioning-yes", "");
        clarificationMap.set(
            "228decommissioning-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("228decommissioning-yes", "");
        clarificationMap.set(
            "228decommissioning-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("228decommissioning-yes", "");
        clarificationMap.set(
            "228decommissioning-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("229provide-decommissioning-yes", "");
        clarificationMap.set("229provide-decommissioning-no", "");
        clarificationMap.set(
            "end-yes",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "end-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set("230provide-identifiable-data-yes", "");
        clarificationMap.set("230provide-identifiable-data-no", "");
        clarificationMap.set("230provide-identifiable-data-yes", "");
        clarificationMap.set("230provide-identifiable-data-no", "");
        clarificationMap.set(
            "231provide-retained-identifiable-yes",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "231provide-retained-identifiable-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "231provide-retained-identifiable-yes",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "231provide-retained-identifiable-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "end-yes",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "end-no",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "end-yes",
            "click suggestion on the navigation bar"
        );
        clarificationMap.set(
            "end-no",
            "click suggestion on the navigation bar"
        );

        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContext = getMostRecentContext(requestContexts);

        if (clarificationMap.has(mostRecentContext)) {
            var responseText = clarificationMap.get(mostRecentContext);
        } else {
            var responseText = "No clarification is available";
        }
        agent.add(responseText);
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set("Name - Initial", handleNameInitial);
    intentMap.set(
        "Contact Person Name - Initial",
        handleContactPersonNameInitial
    );
    intentMap.set("Email Address - Initial", handleEmailAddressInitial);
    intentMap.set("Phone Number - Initial", handlePhoneNumberInitial);
    intentMap.set("Organisation Name - Initial", handleOrganisationNameInitial);
    intentMap.set(
        "Organisation Address - Initial",
        handleOrganisationAddressInitial
    );
    intentMap.set(
        "Know Class Of Medical Device - Initial",
        handleKnowClassOfMedicalDeviceInitial
    );
    intentMap.set(
        "Know-Class-Of-Medical-Device - Yes",
        handleKnowClassOfMedicalDeviceYes
    );
    intentMap.set(
        "Know-Class-Of-Medical-Device - No",
        handleKnowClassOfMedicalDeviceNo
    );
    intentMap.set(
        "Already-Knows-Mhra-Class - Yes",
        handleAlreadyKnowsMhraClassYes
    );
    intentMap.set(
        "Already-Knows-Mhra-Class - No",
        handleAlreadyKnowsMhraClassNo
    );
    intentMap.set("Not-Touch-Patient - Yes", handleNotTouchPatientYes);
    intentMap.set("Not-Touch-Patient - No", handleNotTouchPatientNo);
    intentMap.set("Proceed-To-Nhsd - Yes", handleProceedToNhsdYes);
    intentMap.set("Proceed-To-Nhsd - No", handleProceedToNhsdNo);
    intentMap.set("1-System-Service - Yes", handle1SystemServiceYes);
    intentMap.set("1-System-Service - No", handle1SystemServiceNo);
    intentMap.set("Class-I - Yes", handleClassIYes);
    intentMap.set("Class-I - No", handleClassINo);
    intentMap.set(
        "Channeling-For-Administration - Yes",
        handleChannelingForAdministrationYes
    );
    intentMap.set(
        "Channeling-For-Administration - No",
        handleChannelingForAdministrationNo
    );
    intentMap.set("1Provideurl - Yes", handle1ProvideurlYes);
    intentMap.set("1Provideurl - No", handle1ProvideurlNo);
    intentMap.set("End - Yes", handleEndYes);
    intentMap.set("End - No", handleEndNo);
    intentMap.set("2-Inform - Yes", handle2InformYes);
    intentMap.set("2-Inform - No", handle2InformNo);
    intentMap.set("2-Inform - Yes 2", handle2InformYes2);
    intentMap.set("2-Inform - No 2", handle2InformNo2);
    intentMap.set("Proceed-To-Nhsd - Yes 2", handleProceedToNhsdYes2);
    intentMap.set("Proceed-To-Nhsd - No 2", handleProceedToNhsdNo2);
    intentMap.set(
        "Downloaded-Or-Purchased - Yes",
        handleDownloadedOrPurchasedYes
    );
    intentMap.set(
        "Downloaded-Or-Purchased - No",
        handleDownloadedOrPurchasedNo
    );
    intentMap.set("Used-With-Blood - Yes", handleUsedWithBloodYes);
    intentMap.set("Used-With-Blood - No", handleUsedWithBloodNo);
    intentMap.set(
        "Modify-Biological-Composition - Yes",
        handleModifyBiologicalCompositionYes
    );
    intentMap.set(
        "Modify-Biological-Composition - No",
        handleModifyBiologicalCompositionNo
    );
    intentMap.set("2Contact-Organisation - Yes", handle2ContactOrganisationYes);
    intentMap.set("2Contact-Organisation - No", handle2ContactOrganisationNo);
    intentMap.set(
        "2Contact-Organisation - Yes 2",
        handle2ContactOrganisationYes2
    );
    intentMap.set(
        "2Contact-Organisation - No 2",
        handle2ContactOrganisationNo2
    );
    intentMap.set("End - Yes 2", handleEndYes2);
    intentMap.set("End - No 2", handleEndNo2);
    intentMap.set("End - Yes 3", handleEndYes3);
    intentMap.set("End - No 3", handleEndNo3);
    intentMap.set("2-Simple-Monitoring - Yes", handle2SimpleMonitoringYes);
    intentMap.set("2-Simple-Monitoring - No", handle2SimpleMonitoringNo);
    intentMap.set("2-Simple-Monitoring - Yes 2", handle2SimpleMonitoringYes2);
    intentMap.set("2-Simple-Monitoring - No 2", handle2SimpleMonitoringNo2);
    intentMap.set("Proceed-To-Nhsd - Yes 3", handleProceedToNhsdYes3);
    intentMap.set("Proceed-To-Nhsd - No 3", handleProceedToNhsdNo3);
    intentMap.set("1-System-Service - Yes 2", handle1SystemServiceYes2);
    intentMap.set("1-System-Service - No 2", handle1SystemServiceNo2);
    intentMap.set("Class-Iia - Yes", handleClassIiaYes);
    intentMap.set("Class-Iia - No", handleClassIiaNo);
    intentMap.set(
        "Connected-To-Active-Medical-Device - Yes",
        handleConnectedToActiveMedicalDeviceYes
    );
    intentMap.set(
        "Connected-To-Active-Medical-Device - No",
        handleConnectedToActiveMedicalDeviceNo
    );
    intentMap.set(
        "Filtration--Centrifiguration - Yes",
        handleFiltrationCentrifigurationYes
    );
    intentMap.set(
        "Filtration--Centrifiguration - No",
        handleFiltrationCentrifigurationNo
    );
    intentMap.set(
        "Contact-With-Injured-Skin - Yes",
        handleContactWithInjuredSkinYes
    );
    intentMap.set(
        "Contact-With-Injured-Skin - No",
        handleContactWithInjuredSkinNo
    );
    intentMap.set("3Use-Nhs-Branding - Yes", handle3UseNhsBrandingYes);
    intentMap.set("3Use-Nhs-Branding - No", handle3UseNhsBrandingNo);
    intentMap.set("3Use-Nhs-Branding - Yes 2", handle3UseNhsBrandingYes2);
    intentMap.set("3Use-Nhs-Branding - No 2", handle3UseNhsBrandingNo2);
    intentMap.set("2-Communicate - Yes", handle2CommunicateYes);
    intentMap.set("2-Communicate - No", handle2CommunicateNo);
    intentMap.set("2-Communicate - Yes 2", handle2CommunicateYes2);
    intentMap.set("2-Communicate - No 2", handle2CommunicateNo2);
    intentMap.set("Proceed-To-Nhsd - Yes 4", handleProceedToNhsdYes4);
    intentMap.set("Proceed-To-Nhsd - No 4", handleProceedToNhsdNo4);
    intentMap.set(
        "Downloaded-Or-Purchased - Yes 2",
        handleDownloadedOrPurchasedYes2
    );
    intentMap.set(
        "Downloaded-Or-Purchased - No 2",
        handleDownloadedOrPurchasedNo2
    );
    intentMap.set("Class-I - Yes 2", handleClassIYes2);
    intentMap.set("Class-I - No 2", handleClassINo2);
    intentMap.set("Class-Iia - Yes 2", handleClassIiaYes2);
    intentMap.set("Class-Iia - No 2", handleClassIiaNo2);
    intentMap.set("Class-Iia - Yes 3", handleClassIiaYes3);
    intentMap.set("Class-Iia - No 3", handleClassIiaNo3);
    intentMap.set("Class-Iib - Yes", handleClassIibYes);
    intentMap.set("Class-Iib - No", handleClassIibNo);
    intentMap.set(
        "Wounds-Which-Breach-Dermis - Yes",
        handleWoundsWhichBreachDermisYes
    );
    intentMap.set(
        "Wounds-Which-Breach-Dermis - No",
        handleWoundsWhichBreachDermisNo
    );
    intentMap.set(
        "Invasive-In-Body-Orifice - Yes",
        handleInvasiveInBodyOrificeYes
    );
    intentMap.set(
        "Invasive-In-Body-Orifice - No",
        handleInvasiveInBodyOrificeNo
    );
    intentMap.set(
        "4Confirm-Use-Of-Branding - Yes",
        handle4ConfirmUseOfBrandingYes
    );
    intentMap.set(
        "4Confirm-Use-Of-Branding - No",
        handle4ConfirmUseOfBrandingNo
    );
    intentMap.set("5Require-Gpc - Yes", handle5RequireGpcYes);
    intentMap.set("5Require-Gpc - No", handle5RequireGpcNo);
    intentMap.set("3A-Behaviour-Change - Yes", handle3ABehaviourChangeYes);
    intentMap.set("3A-Behaviour-Change - No", handle3ABehaviourChangeNo);
    intentMap.set("3A-Behaviour-Change - Yes 2", handle3ABehaviourChangeYes2);
    intentMap.set("3A-Behaviour-Change - No 2", handle3ABehaviourChangeNo2);
    intentMap.set("Proceed-To-Nhsd - Yes 5", handleProceedToNhsdYes5);
    intentMap.set("Proceed-To-Nhsd - No 5", handleProceedToNhsdNo5);
    intentMap.set(
        "Downloaded-Or-Purchased - Yes 3",
        handleDownloadedOrPurchasedYes3
    );
    intentMap.set(
        "Downloaded-Or-Purchased - No 3",
        handleDownloadedOrPurchasedNo3
    );
    intentMap.set("Class-Iib - Yes 2", handleClassIibYes2);
    intentMap.set("Class-Iib - No 2", handleClassIibNo2);
    intentMap.set(
        "Manage-Micro-Environments - Yes",
        handleManageMicroEnvironmentsYes
    );
    intentMap.set(
        "Manage-Micro-Environments - No",
        handleManageMicroEnvironmentsNo
    );
    intentMap.set("Trancient-Use - Yes", handleTrancientUseYes);
    intentMap.set("Trancient-Use - No", handleTrancientUseNo);
    intentMap.set("Surgically-Invasive - Yes", handleSurgicallyInvasiveYes);
    intentMap.set("Surgically-Invasive - No", handleSurgicallyInvasiveNo);
    intentMap.set("5Require-Gpc - Yes 2", handle5RequireGpcYes2);
    intentMap.set("5Require-Gpc - No 2", handle5RequireGpcNo2);
    intentMap.set("5Require-Gpc - Yes 3", handle5RequireGpcYes3);
    intentMap.set("5Require-Gpc - No 3", handle5RequireGpcNo3);
    intentMap.set("6Confirm-With-Gpc - Yes", handle6ConfirmWithGpcYes);
    intentMap.set("6Confirm-With-Gpc - No", handle6ConfirmWithGpcNo);
    intentMap.set("7Require-Healthcares - Yes", handle7RequireHealthcaresYes);
    intentMap.set("7Require-Healthcares - No", handle7RequireHealthcaresNo);
    intentMap.set("3A-Self_Manage - Yes", handle3ASelf_ManageYes);
    intentMap.set("3A-Self_Manage - No", handle3ASelf_ManageNo);
    intentMap.set("3A-Self_Manage - Yes 2", handle3ASelf_ManageYes2);
    intentMap.set("3A-Self_Manage - No 2", handle3ASelf_ManageNo2);
    intentMap.set("Class-Iia - Yes 4", handleClassIiaYes4);
    intentMap.set("Class-Iia - No 4", handleClassIiaNo4);
    intentMap.set("Class-I - Yes 3", handleClassIYes3);
    intentMap.set("Class-I - No 3", handleClassINo3);
    intentMap.set("Class-I - Yes 4", handleClassIYes4);
    intentMap.set("Class-I - No 4", handleClassINo4);
    intentMap.set("Short-Term-Use - Yes", handleShortTermUseYes);
    intentMap.set("Short-Term-Use - No", handleShortTermUseNo);
    intentMap.set(
        "Control--Diagnose--Monitor-Or-Correct - Yes",
        handleControlDiagnoseMonitorOrCorrectYes
    );
    intentMap.set(
        "Control--Diagnose--Monitor-Or-Correct - No",
        handleControlDiagnoseMonitorOrCorrectNo
    );
    intentMap.set(
        "Surgically-Invasive-And-Short-Term-Use - Yes",
        handleSurgicallyInvasiveAndShortTermUseYes
    );
    intentMap.set(
        "Surgically-Invasive-And-Short-Term-Use - No",
        handleSurgicallyInvasiveAndShortTermUseNo
    );
    intentMap.set(
        "7Require-Healthcares - Yes 2",
        handle7RequireHealthcaresYes2
    );
    intentMap.set("7Require-Healthcares - No 2", handle7RequireHealthcaresNo2);
    intentMap.set(
        "7Require-Healthcares - Yes 3",
        handle7RequireHealthcaresYes3
    );
    intentMap.set("7Require-Healthcares - No 3", handle7RequireHealthcaresNo3);
    intentMap.set(
        "8Confirm-Healthcare-Registration - Yes",
        handle8ConfirmHealthcareRegistrationYes
    );
    intentMap.set(
        "8Confirm-Healthcare-Registration - No",
        handle8ConfirmHealthcareRegistrationNo
    );
    intentMap.set("9Provide-A-Guest-Login - Yes", handle9ProvideAGuestLoginYes);
    intentMap.set("9Provide-A-Guest-Login - No", handle9ProvideAGuestLoginNo);
    intentMap.set("3B-Treat - Yes", handle3BTreatYes);
    intentMap.set("3B-Treat - No", handle3BTreatNo);
    intentMap.set("3B-Treat - Yes 2", handle3BTreatYes2);
    intentMap.set("3B-Treat - No 2", handle3BTreatNo2);
    intentMap.set("Oral-Cavity--Ear-Canal - Yes", handleOralCavityEarCanalYes);
    intentMap.set("Oral-Cavity--Ear-Canal - No", handleOralCavityEarCanalNo);
    intentMap.set("Long-Term-Use - Yes", handleLongTermUseYes);
    intentMap.set("Long-Term-Use - No", handleLongTermUseNo);
    intentMap.set("Class-Iii - Yes", handleClassIiiYes);
    intentMap.set("Class-Iii - No", handleClassIiiNo);
    intentMap.set(
        "Direct-Contact-With-Cns - Yes",
        handleDirectContactWithCnsYes
    );
    intentMap.set("Direct-Contact-With-Cns - No", handleDirectContactWithCnsNo);
    intentMap.set(
        "Direct-Contact-With-Cns--2- - Yes",
        handleDirectContactWithCns2Yes
    );
    intentMap.set(
        "Direct-Contact-With-Cns--2- - No",
        handleDirectContactWithCns2No
    );
    intentMap.set(
        "Surgically-Invasive--Long-Term-Use - Yes",
        handleSurgicallyInvasiveLongTermUseYes
    );
    intentMap.set(
        "Surgically-Invasive--Long-Term-Use - No",
        handleSurgicallyInvasiveLongTermUseNo
    );
    intentMap.set(
        "9Provide-A-Guest-Login - Yes 2",
        handle9ProvideAGuestLoginYes2
    );
    intentMap.set(
        "9Provide-A-Guest-Login - No 2",
        handle9ProvideAGuestLoginNo2
    );
    intentMap.set(
        "9Provide-A-Guest-Login - Yes 3",
        handle9ProvideAGuestLoginYes3
    );
    intentMap.set(
        "9Provide-A-Guest-Login - No 3",
        handle9ProvideAGuestLoginNo3
    );
    intentMap.set(
        "10Require-Registration-With-Cqc - Yes",
        handle10RequireRegistrationWithCqcYes
    );
    intentMap.set(
        "10Require-Registration-With-Cqc - No",
        handle10RequireRegistrationWithCqcNo
    );
    intentMap.set(
        "10Require-Registration-With-Cqc - Yes 2",
        handle10RequireRegistrationWithCqcYes2
    );
    intentMap.set(
        "10Require-Registration-With-Cqc - No 2",
        handle10RequireRegistrationWithCqcNo2
    );
    intentMap.set("3B-Acitve_Monitoring - Yes", handle3BAcitve_MonitoringYes);
    intentMap.set("3B-Acitve_Monitoring - No", handle3BAcitve_MonitoringNo);
    intentMap.set(
        "3B-Acitve_Monitoring - Yes 2",
        handle3BAcitve_MonitoringYes2
    );
    intentMap.set("3B-Acitve_Monitoring - No 2", handle3BAcitve_MonitoringNo2);
    intentMap.set("Class-I - Yes 5", handleClassIYes5);
    intentMap.set("Class-I - No 5", handleClassINo5);
    intentMap.set("Class-Iia - Yes 5", handleClassIiaYes5);
    intentMap.set("Class-Iia - No 5", handleClassIiaNo5);
    intentMap.set(
        "Oral-Cavity--Ear-Canal--Not-Liable-To-Be-Absorbed - Yes",
        handleOralCavityEarCanalNotLiableToBeAbsorbedYes
    );
    intentMap.set(
        "Oral-Cavity--Ear-Canal--Not-Liable-To-Be-Absorbed - No",
        handleOralCavityEarCanalNotLiableToBeAbsorbedNo
    );
    intentMap.set(
        "Connected-To-Active-Medical-Device--2- - Yes",
        handleConnectedToActiveMedicalDevice2Yes
    );
    intentMap.set(
        "Connected-To-Active-Medical-Device--2- - No",
        handleConnectedToActiveMedicalDevice2No
    );
    intentMap.set("Proceed-To-Nhsd - Yes 6", handleProceedToNhsdYes6);
    intentMap.set("Proceed-To-Nhsd - No 6", handleProceedToNhsdNo6);
    intentMap.set(
        "Downloaded-Or-Purchased - Yes 4",
        handleDownloadedOrPurchasedYes4
    );
    intentMap.set(
        "Downloaded-Or-Purchased - No 4",
        handleDownloadedOrPurchasedNo4
    );
    intentMap.set("Class-Iii - Yes 2", handleClassIiiYes2);
    intentMap.set("Class-Iii - No 2", handleClassIiiNo2);
    intentMap.set(
        "Reusable-Surgical-Instrument - Yes",
        handleReusableSurgicalInstrumentYes
    );
    intentMap.set(
        "Reusable-Surgical-Instrument - No",
        handleReusableSurgicalInstrumentNo
    );
    intentMap.set("Class-Iii - Yes 3", handleClassIiiYes3);
    intentMap.set("Class-Iii - No 3", handleClassIiiNo3);
    intentMap.set(
        "Monitor--Control--Diagnose-Or-Correct - Yes",
        handleMonitorControlDiagnoseOrCorrectYes
    );
    intentMap.set(
        "Monitor--Control--Diagnose-Or-Correct - No",
        handleMonitorControlDiagnoseOrCorrectNo
    );
    intentMap.set("Used-In-Teeth - Yes", handleUsedInTeethYes);
    intentMap.set("Used-In-Teeth - No", handleUsedInTeethNo);
    intentMap.set(
        "Active-Therapeutic-Device - Yes",
        handleActiveTherapeuticDeviceYes
    );
    intentMap.set(
        "Active-Therapeutic-Device - No",
        handleActiveTherapeuticDeviceNo
    );
    intentMap.set(
        "11Confirm-Registration-With-Cqc - Yes",
        handle11ConfirmRegistrationWithCqcYes
    );
    intentMap.set(
        "11Confirm-Registration-With-Cqc - No",
        handle11ConfirmRegistrationWithCqcNo
    );
    intentMap.set(
        "14Need-Registration-Cqc - Yes",
        handle14NeedRegistrationCqcYes
    );
    intentMap.set(
        "14Need-Registration-Cqc - No",
        handle14NeedRegistrationCqcNo
    );
    intentMap.set("3B-Calculate - Yes", handle3BCalculateYes);
    intentMap.set("3B-Calculate - No", handle3BCalculateNo);
    intentMap.set("3B-Calculate - Yes 2", handle3BCalculateYes2);
    intentMap.set("3B-Calculate - No 2", handle3BCalculateNo2);
    intentMap.set("Class-Iia - Yes 6", handleClassIiaYes6);
    intentMap.set("Class-Iia - No 6", handleClassIiaNo6);
    intentMap.set("Class-Iib - Yes 3", handleClassIibYes3);
    intentMap.set("Class-Iib - No 3", handleClassIibNo3);
    intentMap.set("Class-Iia - Yes 7", handleClassIiaYes7);
    intentMap.set("Class-Iia - No 7", handleClassIiaNo7);
    intentMap.set("Surgically-Invasive - Yes 2", handleSurgicallyInvasiveYes2);
    intentMap.set("Surgically-Invasive - No 2", handleSurgicallyInvasiveNo2);
    intentMap.set("Class-I - Yes 6", handleClassIYes6);
    intentMap.set("Class-I - No 6", handleClassINo6);
    intentMap.set("Supply-Energy - Yes", handleSupplyEnergyYes);
    intentMap.set("Supply-Energy - No", handleSupplyEnergyNo);
    intentMap.set("Class-Iii - Yes 4", handleClassIiiYes4);
    intentMap.set("Class-Iii - No 4", handleClassIiiNo4);
    intentMap.set("Supply-Energy--2- - Yes", handleSupplyEnergy2Yes);
    intentMap.set("Supply-Energy--2- - No", handleSupplyEnergy2No);
    intentMap.set("Class-Iia - Yes 8", handleClassIiaYes8);
    intentMap.set("Class-Iia - No 8", handleClassIiaNo8);
    intentMap.set(
        "Direct-Contact-With-Heart - Yes",
        handleDirectContactWithHeartYes
    );
    intentMap.set(
        "Direct-Contact-With-Heart - No",
        handleDirectContactWithHeartNo
    );
    intentMap.set(
        "Administer-Or-Exchange-Energy - Yes",
        handleAdministerOrExchangeEnergyYes
    );
    intentMap.set(
        "Administer-Or-Exchange-Energy - No",
        handleAdministerOrExchangeEnergyNo
    );
    intentMap.set(
        "Supply-Energy-To-Image-In-Vivo - Yes",
        handleSupplyEnergyToImageInVivoYes
    );
    intentMap.set(
        "Supply-Energy-To-Image-In-Vivo - No",
        handleSupplyEnergyToImageInVivoNo
    );
    intentMap.set("12Provide-Cqc-Number - Yes", handle12ProvideCqcNumberYes);
    intentMap.set("12Provide-Cqc-Number - No", handle12ProvideCqcNumberNo);
    intentMap.set(
        "14Need-Registration-Cqc - Yes 2",
        handle14NeedRegistrationCqcYes2
    );
    intentMap.set(
        "14Need-Registration-Cqc - No 2",
        handle14NeedRegistrationCqcNo2
    );
    intentMap.set("16Provide-Description - Yes", handle16ProvideDescriptionYes);
    intentMap.set("16Provide-Description - No", handle16ProvideDescriptionNo);
    intentMap.set(
        "15Confirm-Does-Not-Need-Cqc - Yes",
        handle15ConfirmDoesNotNeedCqcYes
    );
    intentMap.set(
        "15Confirm-Does-Not-Need-Cqc - No",
        handle15ConfirmDoesNotNeedCqcNo
    );
    intentMap.set("3B-Diagnose - Yes", handle3BDiagnoseYes);
    intentMap.set("3B-Diagnose - No", handle3BDiagnoseNo);
    intentMap.set("3B-Diagnose - Yes 2", handle3BDiagnoseYes2);
    intentMap.set("3B-Diagnose - No 2", handle3BDiagnoseNo2);
    intentMap.set("Class-Iib - Yes 4", handleClassIibYes4);
    intentMap.set("Class-Iib - No 4", handleClassIibNo4);
    intentMap.set(
        "Have-A-Biological-Effect - Yes",
        handleHaveABiologicalEffectYes
    );
    intentMap.set(
        "Have-A-Biological-Effect - No",
        handleHaveABiologicalEffectNo
    );
    intentMap.set("Class-Iib - Yes 5", handleClassIibYes5);
    intentMap.set("Class-Iib - No 5", handleClassIibNo5);
    intentMap.set(
        "Have-A-Biological-Effect--2- - Yes",
        handleHaveABiologicalEffect2Yes
    );
    intentMap.set(
        "Have-A-Biological-Effect--2- - No",
        handleHaveABiologicalEffect2No
    );
    intentMap.set("Class-Iii - Yes 5", handleClassIiiYes5);
    intentMap.set("Class-Iii - No 5", handleClassIiiNo5);
    intentMap.set(
        "Have-A-Biological-Effect-Or-Mainly-Absorbed - Yes",
        handleHaveABiologicalEffectOrMainlyAbsorbedYes
    );
    intentMap.set(
        "Have-A-Biological-Effect-Or-Mainly-Absorbed - No",
        handleHaveABiologicalEffectOrMainlyAbsorbedNo
    );
    intentMap.set("Class-Iib - Yes 6", handleClassIibYes6);
    intentMap.set("Class-Iib - No 6", handleClassIibNo6);
    intentMap.set(
        "Control--Monitor-Or-Influence - Yes",
        handleControlMonitorOrInfluenceYes
    );
    intentMap.set(
        "Control--Monitor-Or-Influence - No",
        handleControlMonitorOrInfluenceNo
    );
    intentMap.set(
        "Monitor-Vital-Physiological-Parameters - Yes",
        handleMonitorVitalPhysiologicalParametersYes
    );
    intentMap.set(
        "Monitor-Vital-Physiological-Parameters - No",
        handleMonitorVitalPhysiologicalParametersNo
    );
    intentMap.set(
        "Active-Device-To-Administer-Medicines - Yes",
        handleActiveDeviceToAdministerMedicinesYes
    );
    intentMap.set(
        "Active-Device-To-Administer-Medicines - No",
        handleActiveDeviceToAdministerMedicinesNo
    );
    intentMap.set(
        "13Provide-Recent-Cqc-Registration - Yes",
        handle13ProvideRecentCqcRegistrationYes
    );
    intentMap.set(
        "13Provide-Recent-Cqc-Registration - No",
        handle13ProvideRecentCqcRegistrationNo
    );
    intentMap.set(
        "14Need-Registration-Cqc - Yes 3",
        handle14NeedRegistrationCqcYes3
    );
    intentMap.set(
        "14Need-Registration-Cqc - No 3",
        handle14NeedRegistrationCqcNo3
    );
    intentMap.set(
        "17Integrate-With-Website-Or-Others - Yes",
        handle17IntegrateWithWebsiteOrOthersYes
    );
    intentMap.set(
        "17Integrate-With-Website-Or-Others - No",
        handle17IntegrateWithWebsiteOrOthersNo
    );
    intentMap.set(
        "17Integrate-With-Website-Or-Others - Yes 2",
        handle17IntegrateWithWebsiteOrOthersYes2
    );
    intentMap.set(
        "17Integrate-With-Website-Or-Others - No 2",
        handle17IntegrateWithWebsiteOrOthersNo2
    );
    intentMap.set(
        "16Provide-Description - Yes 2",
        handle16ProvideDescriptionYes2
    );
    intentMap.set(
        "16Provide-Description - No 2",
        handle16ProvideDescriptionNo2
    );
    intentMap.set(
        "16Provide-Description - Yes 3",
        handle16ProvideDescriptionYes3
    );
    intentMap.set(
        "16Provide-Description - No 3",
        handle16ProvideDescriptionNo3
    );
    intentMap.set(
        "Functional-Classification-Over - Yes",
        handleFunctionalClassificationOverYes
    );
    intentMap.set(
        "Functional-Classification-Over - No",
        handleFunctionalClassificationOverNo
    );
    intentMap.set(
        "Functional-Classification-Over - Yes 2",
        handleFunctionalClassificationOverYes2
    );
    intentMap.set(
        "Functional-Classification-Over - No 2",
        handleFunctionalClassificationOverNo2
    );
    intentMap.set("Class-Iib - Yes 7", handleClassIibYes7);
    intentMap.set("Class-Iib - No 7", handleClassIibNo7);
    intentMap.set("Administer-Medicine - Yes", handleAdministerMedicineYes);
    intentMap.set("Administer-Medicine - No", handleAdministerMedicineNo);
    intentMap.set("Class-Iii - Yes 6", handleClassIiiYes6);
    intentMap.set("Class-Iii - No 6", handleClassIiiNo6);
    intentMap.set(
        "Undergo-Chemical-Change - Yes",
        handleUndergoChemicalChangeYes
    );
    intentMap.set(
        "Undergo-Chemical-Change - No",
        handleUndergoChemicalChangeNo
    );
    intentMap.set("Class-Iii - Yes 7", handleClassIiiYes7);
    intentMap.set("Class-Iii - No 7", handleClassIiiNo7);
    intentMap.set(
        "Undergo-Chemical-Change-Or-Administer-Medicine - Yes",
        handleUndergoChemicalChangeOrAdministerMedicineYes
    );
    intentMap.set(
        "Undergo-Chemical-Change-Or-Administer-Medicine - No",
        handleUndergoChemicalChangeOrAdministerMedicineNo
    );
    intentMap.set("Class-Iib - Yes 8", handleClassIibYes8);
    intentMap.set("Class-Iib - No 8", handleClassIibNo8);
    intentMap.set("Class-Iia - Yes 9", handleClassIiaYes9);
    intentMap.set("Class-Iia - No 9", handleClassIiaNo9);
    intentMap.set("Class-Iib - Yes 9", handleClassIibYes9);
    intentMap.set("Class-Iib - No 9", handleClassIibNo9);
    intentMap.set(
        "Emit-Ionizing-Radiation - Yes",
        handleEmitIonizingRadiationYes
    );
    intentMap.set(
        "Emit-Ionizing-Radiation - No",
        handleEmitIonizingRadiationNo
    );
    intentMap.set("Potentially-Hazardous - Yes", handlePotentiallyHazardousYes);
    intentMap.set("Potentially-Hazardous - No", handlePotentiallyHazardousNo);
    intentMap.set(
        "Active-Device-Not-Classified - Yes",
        handleActiveDeviceNotClassifiedYes
    );
    intentMap.set(
        "Active-Device-Not-Classified - No",
        handleActiveDeviceNotClassifiedNo
    );
    intentMap.set(
        "14Need-Registration-Cqc - Yes 4",
        handle14NeedRegistrationCqcYes4
    );
    intentMap.set(
        "14Need-Registration-Cqc - No 4",
        handle14NeedRegistrationCqcNo4
    );
    intentMap.set(
        "14Need-Registration-Cqc - Yes 5",
        handle14NeedRegistrationCqcYes5
    );
    intentMap.set(
        "14Need-Registration-Cqc - No 5",
        handle14NeedRegistrationCqcNo5
    );
    intentMap.set(
        "18Connect-With-Devices - Yes",
        handle18ConnectWithDevicesYes
    );
    intentMap.set("18Connect-With-Devices - No", handle18ConnectWithDevicesNo);
    intentMap.set(
        "18Connect-With-Devices - Yes 2",
        handle18ConnectWithDevicesYes2
    );
    intentMap.set(
        "18Connect-With-Devices - No 2",
        handle18ConnectWithDevicesNo2
    );
    intentMap.set("Proceed-To-Nhsd - Yes 7", handleProceedToNhsdYes7);
    intentMap.set("Proceed-To-Nhsd - No 7", handleProceedToNhsdNo7);
    intentMap.set("End - Yes 4", handleEndYes4);
    intentMap.set("End - No 4", handleEndNo4);
    intentMap.set("Class-Iib - Yes 10", handleClassIibYes10);
    intentMap.set("Class-Iib - No 10", handleClassIibNo10);
    intentMap.set("Class-Iia - Yes 10", handleClassIiaYes10);
    intentMap.set("Class-Iia - No 10", handleClassIiaNo10);
    intentMap.set("Class-Iib - Yes 11", handleClassIibYes11);
    intentMap.set("Class-Iib - No 11", handleClassIibNo11);
    intentMap.set("Class-Iia - Yes 11", handleClassIiaYes11);
    intentMap.set("Class-Iia - No 11", handleClassIiaNo11);
    intentMap.set("Class-Iii - Yes 8", handleClassIiiYes8);
    intentMap.set("Class-Iii - No 8", handleClassIiiNo8);
    intentMap.set("Use-In-Breast-Implants - Yes", handleUseInBreastImplantsYes);
    intentMap.set("Use-In-Breast-Implants - No", handleUseInBreastImplantsNo);
    intentMap.set("Class-Iib - Yes 12", handleClassIibYes12);
    intentMap.set("Class-Iib - No 12", handleClassIibNo12);
    intentMap.set("Class-Iia - Yes 12", handleClassIiaYes12);
    intentMap.set("Class-Iia - No 12", handleClassIiaNo12);
    intentMap.set("Class-Iib - Yes 13", handleClassIibYes13);
    intentMap.set("Class-Iib - No 13", handleClassIibNo13);
    intentMap.set("Class-Iia - Yes 13", handleClassIiaYes13);
    intentMap.set("Class-Iia - No 13", handleClassIiaNo13);
    intentMap.set("Class-I - Yes 7", handleClassIYes7);
    intentMap.set("Class-I - No 7", handleClassINo7);
    intentMap.set(
        "Incorporate-Integral-Medicinal-Substances - Yes",
        handleIncorporateIntegralMedicinalSubstancesYes
    );
    intentMap.set(
        "Incorporate-Integral-Medicinal-Substances - No",
        handleIncorporateIntegralMedicinalSubstancesNo
    );
    intentMap.set(
        "19Replace-A-Nhs-Service - Yes",
        handle19ReplaceANhsServiceYes
    );
    intentMap.set("19Replace-A-Nhs-Service - No", handle19ReplaceANhsServiceNo);
    intentMap.set(
        "20Confirm-Replace-A-Nhs-Service - Yes",
        handle20ConfirmReplaceANhsServiceYes
    );
    intentMap.set(
        "20Confirm-Replace-A-Nhs-Service - No",
        handle20ConfirmReplaceANhsServiceNo
    );
    intentMap.set("Class-Iii - Yes 9", handleClassIiiYes9);
    intentMap.set("Class-Iii - No 9", handleClassIiiNo9);
    intentMap.set("Class-Iib - Yes 14", handleClassIibYes14);
    intentMap.set("Class-Iib - No 14", handleClassIibNo14);
    intentMap.set("Class-Iii - Yes 10", handleClassIiiYes10);
    intentMap.set("Class-Iii - No 10", handleClassIiiNo10);
    intentMap.set("Contraception - Yes", handleContraceptionYes);
    intentMap.set("Contraception - No", handleContraceptionNo);
    intentMap.set(
        "20Confirm-Replace-A-Nhs-Service - Yes 2",
        handle20ConfirmReplaceANhsServiceYes2
    );
    intentMap.set(
        "20Confirm-Replace-A-Nhs-Service - No 2",
        handle20ConfirmReplaceANhsServiceNo2
    );
    intentMap.set("21Free-To-Public - Yes", handle21FreeToPublicYes);
    intentMap.set("21Free-To-Public - No", handle21FreeToPublicNo);
    intentMap.set("21Free-To-Public - Yes 2", handle21FreeToPublicYes2);
    intentMap.set("21Free-To-Public - No 2", handle21FreeToPublicNo2);
    intentMap.set("21Free-To-Public - Yes 3", handle21FreeToPublicYes3);
    intentMap.set("21Free-To-Public - No 3", handle21FreeToPublicNo3);
    intentMap.set("Implantable - Yes", handleImplantableYes);
    intentMap.set("Implantable - No", handleImplantableNo);
    intentMap.set("Disinfecting-Mds - Yes", handleDisinfectingMdsYes);
    intentMap.set("Disinfecting-Mds - No", handleDisinfectingMdsNo);
    intentMap.set("22Source-Of-Funding - Yes", handle22SourceOfFundingYes);
    intentMap.set("22Source-Of-Funding - No", handle22SourceOfFundingNo);
    intentMap.set("22Source-Of-Funding - Yes 2", handle22SourceOfFundingYes2);
    intentMap.set("22Source-Of-Funding - No 2", handle22SourceOfFundingNo2);
    intentMap.set("Class-Iii - Yes 11", handleClassIiiYes11);
    intentMap.set("Class-Iii - No 11", handleClassIiiNo11);
    intentMap.set("Class-Iib - Yes 15", handleClassIibYes15);
    intentMap.set("Class-Iib - No 15", handleClassIibNo15);
    intentMap.set(
        "Disinfecting-Contact-Lenses - Yes",
        handleDisinfectingContactLensesYes
    );
    intentMap.set(
        "Disinfecting-Contact-Lenses - No",
        handleDisinfectingContactLensesNo
    );
    intentMap.set("Recording-Of-X-Ray - Yes", handleRecordingOfXRayYes);
    intentMap.set("Recording-Of-X-Ray - No", handleRecordingOfXRayNo);
    intentMap.set("23Provide-A-Trial - Yes", handle23ProvideATrialYes);
    intentMap.set("23Provide-A-Trial - No", handle23ProvideATrialNo);
    intentMap.set("23Provide-A-Trial - Yes 2", handle23ProvideATrialYes2);
    intentMap.set("23Provide-A-Trial - No 2", handle23ProvideATrialNo2);
    intentMap.set("Class-Iib - Yes 16", handleClassIibYes16);
    intentMap.set("Class-Iib - No 16", handleClassIibNo16);
    intentMap.set(
        "Disinfecting-Invasive-Mds - Yes",
        handleDisinfectingInvasiveMdsYes
    );
    intentMap.set(
        "Disinfecting-Invasive-Mds - No",
        handleDisinfectingInvasiveMdsNo
    );
    intentMap.set("Class-Iia - Yes 14", handleClassIiaYes14);
    intentMap.set("Class-Iia - No 14", handleClassIiaNo14);
    intentMap.set(
        "Non-Viable-Animal-Tissues - Yes",
        handleNonViableAnimalTissuesYes
    );
    intentMap.set(
        "Non-Viable-Animal-Tissues - No",
        handleNonViableAnimalTissuesNo
    );
    intentMap.set(
        "24Provide-Detail-Of-The-Trial - Yes",
        handle24ProvideDetailOfTheTrialYes
    );
    intentMap.set(
        "24Provide-Detail-Of-The-Trial - No",
        handle24ProvideDetailOfTheTrialNo
    );
    intentMap.set(
        "25Confirm-Process-Personal-Data - Yes",
        handle25ConfirmProcessPersonalDataYes
    );
    intentMap.set(
        "25Confirm-Process-Personal-Data - No",
        handle25ConfirmProcessPersonalDataNo
    );
    intentMap.set("Class-Iib - Yes 17", handleClassIibYes17);
    intentMap.set("Class-Iib - No 17", handleClassIibNo17);
    intentMap.set("Class-Iia - Yes 15", handleClassIiaYes15);
    intentMap.set("Class-Iia - No 15", handleClassIiaNo15);
    intentMap.set("Class-Iii - Yes 12", handleClassIiiYes12);
    intentMap.set("Class-Iii - No 12", handleClassIiiNo12);
    intentMap.set("Blood-Bag - Yes", handleBloodBagYes);
    intentMap.set("Blood Bag - No", handleBloodBagNo);
    intentMap.set(
        "25Confirm-Process-Personal-Data - Yes 2",
        handle25ConfirmProcessPersonalDataYes2
    );
    intentMap.set(
        "25Confirm-Process-Personal-Data - No 2",
        handle25ConfirmProcessPersonalDataNo2
    );
    intentMap.set(
        "25Confirm-Process-Personal-Data - Yes 3",
        handle25ConfirmProcessPersonalDataYes3
    );
    intentMap.set(
        "25Confirm-Process-Personal-Data - No 3",
        handle25ConfirmProcessPersonalDataNo3
    );
    intentMap.set(
        "26Confirm-Where-To-Process - Yes",
        handle26ConfirmWhereToProcessYes
    );
    intentMap.set(
        "26Confirm-Where-To-Process - No",
        handle26ConfirmWhereToProcessNo
    );
    intentMap.set(
        "27Comfrim-Available-On-Platforms - Yes",
        handle27ComfrimAvailableOnPlatformsYes
    );
    intentMap.set(
        "27Comfrim-Available-On-Platforms - No",
        handle27ComfrimAvailableOnPlatformsNo
    );
    intentMap.set("Class-Iib - Yes 18", handleClassIibYes18);
    intentMap.set("Class-Iib - No 18", handleClassIibNo18);
    intentMap.set("Blood-Bag - Yes 2", handleBloodBagYes2);
    intentMap.set("Blood Bag - No 2", handleBloodBagNo2);
    intentMap.set(
        "27Comfrim-Available-On-Platforms - Yes 2",
        handle27ComfrimAvailableOnPlatformsYes2
    );
    intentMap.set(
        "27Comfrim-Available-On-Platforms - No 2",
        handle27ComfrimAvailableOnPlatformsNo2
    );
    intentMap.set(
        "27Comfrim-Available-On-Platforms - Yes 3",
        handle27ComfrimAvailableOnPlatformsYes3
    );
    intentMap.set(
        "27Comfrim-Available-On-Platforms - No 3",
        handle27ComfrimAvailableOnPlatformsNo3
    );
    intentMap.set(
        "28Provide-Platform-Number - Yes",
        handle28ProvidePlatformNumberYes
    );
    intentMap.set(
        "28Provide-Platform-Number - No",
        handle28ProvidePlatformNumberNo
    );
    intentMap.set(
        "29Confirm-Type-Of-Pharmacy - Yes",
        handle29ConfirmTypeOfPharmacyYes
    );
    intentMap.set(
        "29Confirm-Type-Of-Pharmacy - No",
        handle29ConfirmTypeOfPharmacyNo
    );
    intentMap.set(
        "29Confirm-Type-Of-Pharmacy - Yes 2",
        handle29ConfirmTypeOfPharmacyYes2
    );
    intentMap.set(
        "29Confirm-Type-Of-Pharmacy - No 2",
        handle29ConfirmTypeOfPharmacyNo2
    );
    intentMap.set(
        "29Confirm-Type-Of-Pharmacy - Yes 3",
        handle29ConfirmTypeOfPharmacyYes3
    );
    intentMap.set(
        "29Confirm-Type-Of-Pharmacy - No 3",
        handle29ConfirmTypeOfPharmacyNo3
    );
    intentMap.set(
        "30Provide-Clinical-Benefits - Yes",
        handle30ProvideClinicalBenefitsYes
    );
    intentMap.set(
        "30Provide-Clinical-Benefits - No",
        handle30ProvideClinicalBenefitsNo
    );
    intentMap.set(
        "30Provide-Clinical-Benefits - Yes 2",
        handle30ProvideClinicalBenefitsYes2
    );
    intentMap.set(
        "30Provide-Clinical-Benefits - No 2",
        handle30ProvideClinicalBenefitsNo2
    );
    intentMap.set(
        "31Provide-Evidence-Of-Clinical-Benefits - Yes",
        handle31ProvideEvidenceOfClinicalBenefitsYes
    );
    intentMap.set(
        "31Provide-Evidence-Of-Clinical-Benefits - No",
        handle31ProvideEvidenceOfClinicalBenefitsNo
    );
    intentMap.set(
        "33Provide-The-Reason-Of-Not-Have-Clinical-Benefits - Yes",
        handle33ProvideTheReasonOfNotHaveClinicalBenefitsYes
    );
    intentMap.set(
        "33Provide-The-Reason-Of-Not-Have-Clinical-Benefits - No",
        handle33ProvideTheReasonOfNotHaveClinicalBenefitsNo
    );
    intentMap.set(
        "32Provide-The-Url-Of-Clinical-Benefits-D11 - Yes",
        handle32ProvideTheUrlOfClinicalBenefitsD11Yes
    );
    intentMap.set(
        "32Provide-The-Url-Of-Clinical-Benefits-D11 - No",
        handle32ProvideTheUrlOfClinicalBenefitsD11No
    );
    intentMap.set(
        "32Provide-The-Url-Of-Clinical-Benefits-D11 - Yes 2",
        handle32ProvideTheUrlOfClinicalBenefitsD11Yes2
    );
    intentMap.set(
        "32Provide-The-Url-Of-Clinical-Benefits-D11 - No 2",
        handle32ProvideTheUrlOfClinicalBenefitsD11No2
    );
    intentMap.set(
        "34Provide-Behavioural-Benefits - Yes",
        handle34ProvideBehaviouralBenefitsYes
    );
    intentMap.set(
        "34Provide-Behavioural-Benefits - No",
        handle34ProvideBehaviouralBenefitsNo
    );
    intentMap.set(
        "34Provide-Behavioural-Benefits - Yes 2",
        handle34ProvideBehaviouralBenefitsYes2
    );
    intentMap.set(
        "34Provide-Behavioural-Benefits - No 2",
        handle34ProvideBehaviouralBenefitsNo2
    );
    intentMap.set(
        "33Provide-The-Reason-Of-Not-Have-Clinical-Benefits - Yes 2",
        handle33ProvideTheReasonOfNotHaveClinicalBenefitsYes2
    );
    intentMap.set(
        "33Provide-The-Reason-Of-Not-Have-Clinical-Benefits - No 2",
        handle33ProvideTheReasonOfNotHaveClinicalBenefitsNo2
    );
    intentMap.set(
        "34Provide-Behavioural-Benefits - Yes 3",
        handle34ProvideBehaviouralBenefitsYes3
    );
    intentMap.set(
        "34Provide-Behavioural-Benefits - No 3",
        handle34ProvideBehaviouralBenefitsNo3
    );
    intentMap.set(
        "35Provide-Improvement-Of-Bahavioural-Benefits - Yes",
        handle35ProvideImprovementOfBahaviouralBenefitsYes
    );
    intentMap.set(
        "35Provide-Improvement-Of-Bahavioural-Benefits - No",
        handle35ProvideImprovementOfBahaviouralBenefitsNo
    );
    intentMap.set(
        "37Confirm-Reason-Not-Have-Behavioural-Benefits - Yes",
        handle37ConfirmReasonNotHaveBehaviouralBenefitsYes
    );
    intentMap.set(
        "37Confirm-Reason-Not-Have-Behavioural-Benefits - No",
        handle37ConfirmReasonNotHaveBehaviouralBenefitsNo
    );
    intentMap.set(
        "36Provide-Url-Of-Behavioural-Benefits - Yes",
        handle36ProvideUrlOfBehaviouralBenefitsYes
    );
    intentMap.set(
        "36Provide-Url-Of-Behavioural-Benefits - No",
        handle36ProvideUrlOfBehaviouralBenefitsNo
    );
    intentMap.set(
        "38Confirm-Of-Economic-Benefits - Yes",
        handle38ConfirmOfEconomicBenefitsYes
    );
    intentMap.set(
        "38Confirm-Of-Economic-Benefits - No",
        handle38ConfirmOfEconomicBenefitsNo
    );
    intentMap.set(
        "38Confirm-Of-Economic-Benefits - Yes 2",
        handle38ConfirmOfEconomicBenefitsYes2
    );
    intentMap.set(
        "38Confirm-Of-Economic-Benefits - No 2",
        handle38ConfirmOfEconomicBenefitsNo2
    );
    intentMap.set(
        "38Confirm-Of-Economic-Benefits - Yes 3",
        handle38ConfirmOfEconomicBenefitsYes3
    );
    intentMap.set(
        "38Confirm-Of-Economic-Benefits - No 3",
        handle38ConfirmOfEconomicBenefitsNo3
    );
    intentMap.set(
        "37Confirm-Reason-Not-Have-Behavioural-Benefits - Yes 2",
        handle37ConfirmReasonNotHaveBehaviouralBenefitsYes2
    );
    intentMap.set(
        "37Confirm-Reason-Not-Have-Behavioural-Benefits - No 2",
        handle37ConfirmReasonNotHaveBehaviouralBenefitsNo2
    );
    intentMap.set(
        "38Confirm-Of-Economic-Benefits - Yes 4",
        handle38ConfirmOfEconomicBenefitsYes4
    );
    intentMap.set(
        "38Confirm-Of-Economic-Benefits - No 4",
        handle38ConfirmOfEconomicBenefitsNo4
    );
    intentMap.set(
        "39Describe-The-Economic-Benefits - Yes",
        handle39DescribeTheEconomicBenefitsYes
    );
    intentMap.set(
        "39Describe-The-Economic-Benefits - No",
        handle39DescribeTheEconomicBenefitsNo
    );
    intentMap.set(
        "41Provide-A-Reason-Not-Have-Economic-Benefits - Yes",
        handle41ProvideAReasonNotHaveEconomicBenefitsYes
    );
    intentMap.set(
        "41Provide-A-Reason-Not-Have-Economic-Benefits - No",
        handle41ProvideAReasonNotHaveEconomicBenefitsNo
    );
    intentMap.set(
        "40Provide-Evidence-Of-Economic-Benefits - Yes",
        handle40ProvideEvidenceOfEconomicBenefitsYes
    );
    intentMap.set(
        "40Provide-Evidence-Of-Economic-Benefits - No",
        handle40ProvideEvidenceOfEconomicBenefitsNo
    );
    intentMap.set(
        "42Confirm-Any-Other-Outcomes - Yes",
        handle42ConfirmAnyOtherOutcomesYes
    );
    intentMap.set(
        "42Confirm-Any-Other-Outcomes - No",
        handle42ConfirmAnyOtherOutcomesNo
    );
    intentMap.set(
        "42Confirm-Any-Other-Outcomes - Yes 2",
        handle42ConfirmAnyOtherOutcomesYes2
    );
    intentMap.set(
        "42Confirm-Any-Other-Outcomes - No 2",
        handle42ConfirmAnyOtherOutcomesNo2
    );
    intentMap.set(
        "42Confirm-Any-Other-Outcomes - Yes 3",
        handle42ConfirmAnyOtherOutcomesYes3
    );
    intentMap.set(
        "42Confirm-Any-Other-Outcomes - No 3",
        handle42ConfirmAnyOtherOutcomesNo3
    );
    intentMap.set(
        "41Provide-A-Reason-Not-Have-Economic-Benefits - Yes 2",
        handle41ProvideAReasonNotHaveEconomicBenefitsYes2
    );
    intentMap.set(
        "41Provide-A-Reason-Not-Have-Economic-Benefits - No 2",
        handle41ProvideAReasonNotHaveEconomicBenefitsNo2
    );
    intentMap.set(
        "42Confirm-Any-Other-Outcomes - Yes 4",
        handle42ConfirmAnyOtherOutcomesYes4
    );
    intentMap.set(
        "42Confirm-Any-Other-Outcomes - No 4",
        handle42ConfirmAnyOtherOutcomesNo4
    );
    intentMap.set(
        "43Provide-What-Other-Outcomes - Yes",
        handle43ProvideWhatOtherOutcomesYes
    );
    intentMap.set(
        "43Provide-What-Other-Outcomes - No",
        handle43ProvideWhatOtherOutcomesNo
    );
    intentMap.set(
        "47Provide-Reason-Why-No-Outcomes - Yes",
        handle47ProvideReasonWhyNoOutcomesYes
    );
    intentMap.set(
        "47Provide-Reason-Why-No-Outcomes - No",
        handle47ProvideReasonWhyNoOutcomesNo
    );
    intentMap.set(
        "44Confirm-Evaluated-For-Outcomes - Yes",
        handle44ConfirmEvaluatedForOutcomesYes
    );
    intentMap.set(
        "44Confirm-Evaluated-For-Outcomes - No",
        handle44ConfirmEvaluatedForOutcomesNo
    );
    intentMap.set(
        "44Confirm-Evaluated-For-Outcomes - Yes 2",
        handle44ConfirmEvaluatedForOutcomesYes2
    );
    intentMap.set(
        "44Confirm-Evaluated-For-Outcomes - No 2",
        handle44ConfirmEvaluatedForOutcomesNo2
    );
    intentMap.set(
        "48Confirm-Resource-Impact-Benefits - Yes",
        handle48ConfirmResourceImpactBenefitsYes
    );
    intentMap.set(
        "48Confirm-Resource-Impact-Benefits - No",
        handle48ConfirmResourceImpactBenefitsNo
    );
    intentMap.set(
        "48Confirm-Resource-Impact-Benefits - Yes 2",
        handle48ConfirmResourceImpactBenefitsYes2
    );
    intentMap.set(
        "48Confirm-Resource-Impact-Benefits - No 2",
        handle48ConfirmResourceImpactBenefitsNo2
    );
    intentMap.set(
        "45Provide-Evidence-Of-Evaluating-Outcomes - Yes",
        handle45ProvideEvidenceOfEvaluatingOutcomesYes
    );
    intentMap.set(
        "45Provide-Evidence-Of-Evaluating-Outcomes - No",
        handle45ProvideEvidenceOfEvaluatingOutcomesNo
    );
    intentMap.set(
        "46Provide-Url-Of-Evaluating-Outcomes - Yes",
        handle46ProvideUrlOfEvaluatingOutcomesYes
    );
    intentMap.set(
        "46Provide-Url-Of-Evaluating-Outcomes - No",
        handle46ProvideUrlOfEvaluatingOutcomesNo
    );
    intentMap.set(
        "49Provide-Detail-Of-Resource-Impact-Benefits - Yes",
        handle49ProvideDetailOfResourceImpactBenefitsYes
    );
    intentMap.set(
        "49Provide-Detail-Of-Resource-Impact-Benefits - No",
        handle49ProvideDetailOfResourceImpactBenefitsNo
    );
    intentMap.set(
        "50Confirm-Within-Nhs-Dcb0129 - Yes",
        handle50ConfirmWithinNhsDcb0129Yes
    );
    intentMap.set(
        "50Confirm-Within-Nhs-Dcb0129 - No",
        handle50ConfirmWithinNhsDcb0129No
    );
    intentMap.set(
        "46Provide-Url-Of-Evaluating-Outcomes - Yes 2",
        handle46ProvideUrlOfEvaluatingOutcomesYes2
    );
    intentMap.set(
        "46Provide-Url-Of-Evaluating-Outcomes - No 2",
        handle46ProvideUrlOfEvaluatingOutcomesNo2
    );
    intentMap.set(
        "46Provide-Url-Of-Evaluating-Outcomes - Yes 3",
        handle46ProvideUrlOfEvaluatingOutcomesYes3
    );
    intentMap.set(
        "46Provide-Url-Of-Evaluating-Outcomes - No 3",
        handle46ProvideUrlOfEvaluatingOutcomesNo3
    );
    intentMap.set(
        "47Provide-Reason-Why-No-Outcomes - Yes 2",
        handle47ProvideReasonWhyNoOutcomesYes2
    );
    intentMap.set(
        "47Provide-Reason-Why-No-Outcomes - No 2",
        handle47ProvideReasonWhyNoOutcomesNo2
    );
    intentMap.set(
        "47Provide-Reason-Why-No-Outcomes - Yes 3",
        handle47ProvideReasonWhyNoOutcomesYes3
    );
    intentMap.set(
        "47Provide-Reason-Why-No-Outcomes - No 3",
        handle47ProvideReasonWhyNoOutcomesNo3
    );
    intentMap.set(
        "50Confirm-Within-Nhs-Dcb0129 - Yes 2",
        handle50ConfirmWithinNhsDcb0129Yes2
    );
    intentMap.set(
        "50Confirm-Within-Nhs-Dcb0129 - No 2",
        handle50ConfirmWithinNhsDcb0129No2
    );
    intentMap.set(
        "50Confirm-Within-Nhs-Dcb0129 - Yes 3",
        handle50ConfirmWithinNhsDcb0129Yes3
    );
    intentMap.set(
        "50Confirm-Within-Nhs-Dcb0129 - No 3",
        handle50ConfirmWithinNhsDcb0129No3
    );
    intentMap.set(
        "51Provide-Copy-Of-Safety-Case - Yes",
        handle51ProvideCopyOfSafetyCaseYes
    );
    intentMap.set(
        "51Provide-Copy-Of-Safety-Case - No",
        handle51ProvideCopyOfSafetyCaseNo
    );
    intentMap.set(
        "52Provide-Why-Not-Fall-Within-Dcb0129 - Yes",
        handle52ProvideWhyNotFallWithinDcb0129Yes
    );
    intentMap.set(
        "52Provide-Why-Not-Fall-Within-Dcb0129 - No",
        handle52ProvideWhyNotFallWithinDcb0129No
    );
    intentMap.set(
        "53Confirm-Adverse-Effects - Yes",
        handle53ConfirmAdverseEffectsYes
    );
    intentMap.set(
        "53Confirm-Adverse-Effects - No",
        handle53ConfirmAdverseEffectsNo
    );
    intentMap.set(
        "53Confirm-Adverse-Effects - Yes 2",
        handle53ConfirmAdverseEffectsYes2
    );
    intentMap.set(
        "53Confirm-Adverse-Effects - No 2",
        handle53ConfirmAdverseEffectsNo2
    );
    intentMap.set(
        "53Confirm-Adverse-Effects - Yes 3",
        handle53ConfirmAdverseEffectsYes3
    );
    intentMap.set(
        "53Confirm-Adverse-Effects - No 3",
        handle53ConfirmAdverseEffectsNo3
    );
    intentMap.set(
        "53Confirm-Adverse-Effects - Yes 4",
        handle53ConfirmAdverseEffectsYes4
    );
    intentMap.set(
        "53Confirm-Adverse-Effects - No 4",
        handle53ConfirmAdverseEffectsNo4
    );
    intentMap.set(
        "54Provide-Possible-Adverse-Effects - Yes",
        handle54ProvidePossibleAdverseEffectsYes
    );
    intentMap.set(
        "54Provide-Possible-Adverse-Effects - No",
        handle54ProvidePossibleAdverseEffectsNo
    );
    intentMap.set(
        "55Confirm-Approved-By-Clinician - Yes",
        handle55ConfirmApprovedByClinicianYes
    );
    intentMap.set(
        "55Confirm-Approved-By-Clinician - No",
        handle55ConfirmApprovedByClinicianNo
    );
    intentMap.set(
        "55Confirm-Approved-By-Clinician - Yes 2",
        handle55ConfirmApprovedByClinicianYes2
    );
    intentMap.set(
        "55Confirm-Approved-By-Clinician - No 2",
        handle55ConfirmApprovedByClinicianNo2
    );
    intentMap.set(
        "55Confirm-Approved-By-Clinician - Yes 3",
        handle55ConfirmApprovedByClinicianYes3
    );
    intentMap.set(
        "55Confirm-Approved-By-Clinician - No 3",
        handle55ConfirmApprovedByClinicianNo3
    );
    intentMap.set(
        "56Provide-Name-Of-Clinician - Yes",
        handle56ProvideNameOfClinicianYes
    );
    intentMap.set(
        "56Provide-Name-Of-Clinician - No",
        handle56ProvideNameOfClinicianNo
    );
    intentMap.set(
        "57Confirm-Process-The-Data-Personal - Yes",
        handle57ConfirmProcessTheDataPersonalYes
    );
    intentMap.set(
        "57Confirm-Process-The-Data-Personal - No",
        handle57ConfirmProcessTheDataPersonalNo
    );
    intentMap.set(
        "57Confirm-Process-The-Data-Personal - Yes 2",
        handle57ConfirmProcessTheDataPersonalYes2
    );
    intentMap.set(
        "57Confirm-Process-The-Data-Personal - No 2",
        handle57ConfirmProcessTheDataPersonalNo2
    );
    intentMap.set(
        "57Confirm-Process-The-Data-Personal - Yes 3",
        handle57ConfirmProcessTheDataPersonalYes3
    );
    intentMap.set(
        "57Confirm-Process-The-Data-Personal - No 3",
        handle57ConfirmProcessTheDataPersonalNo3
    );
    intentMap.set(
        "58Provide-Peronal-Data-Processed - Yes",
        handle58ProvidePeronalDataProcessedYes
    );
    intentMap.set(
        "58Provide-Peronal-Data-Processed - No",
        handle58ProvidePeronalDataProcessedNo
    );
    intentMap.set(
        "61Confirm-Fully-Understanding-Of-Personal-Data-Sensitive-Data - Yes",
        handle61ConfirmFullyUnderstandingOfPersonalDataSensitiveDataYes
    );
    intentMap.set(
        "61Confirm-Fully-Understanding-Of-Personal-Data-Sensitive-Data - No",
        handle61ConfirmFullyUnderstandingOfPersonalDataSensitiveDataNo
    );
    intentMap.set(
        "59Confirm-Process-Sensitive-Data - Yes",
        handle59ConfirmProcessSensitiveDataYes
    );
    intentMap.set(
        "59Confirm-Process-Sensitive-Data - No",
        handle59ConfirmProcessSensitiveDataNo
    );
    intentMap.set(
        "59Confirm-Process-Sensitive-Data - Yes 2",
        handle59ConfirmProcessSensitiveDataYes2
    );
    intentMap.set(
        "59Confirm-Process-Sensitive-Data - No 2",
        handle59ConfirmProcessSensitiveDataNo2
    );
    intentMap.set(
        "62Understand-Organisation-S-Role - Yes",
        handle62UnderstandOrganisationSRoleYes
    );
    intentMap.set(
        "62Understand-Organisation-S-Role - No",
        handle62UnderstandOrganisationSRoleNo
    );
    intentMap.set(
        "62Understand-Organisation-S-Role - Yes 2",
        handle62UnderstandOrganisationSRoleYes2
    );
    intentMap.set(
        "62Understand-Organisation-S-Role - No 2",
        handle62UnderstandOrganisationSRoleNo2
    );
    intentMap.set(
        "60Provide-Sensitive-Personal-Data-Processed - Yes",
        handle60ProvideSensitivePersonalDataProcessedYes
    );
    intentMap.set(
        "60Provide-Sensitive-Personal-Data-Processed - No",
        handle60ProvideSensitivePersonalDataProcessedNo
    );
    intentMap.set(
        "61Confirm-Fully-Understanding-Of-Personal-Data-Sensitive-Data - Yes 2",
        handle61ConfirmFullyUnderstandingOfPersonalDataSensitiveDataYes2
    );
    intentMap.set(
        "61Confirm-Fully-Understanding-Of-Personal-Data-Sensitive-Data - No 2",
        handle61ConfirmFullyUnderstandingOfPersonalDataSensitiveDataNo2
    );
    intentMap.set(
        "63Process-Data-And-Not-A-Controller - Yes",
        handle63ProcessDataAndNotAControllerYes
    );
    intentMap.set(
        "63Process-Data-And-Not-A-Controller - No",
        handle63ProcessDataAndNotAControllerNo
    );
    intentMap.set(
        "63Process-Data-And-Not-A-Controller - Yes 2",
        handle63ProcessDataAndNotAControllerYes2
    );
    intentMap.set(
        "63Process-Data-And-Not-A-Controller - No 2",
        handle63ProcessDataAndNotAControllerNo2
    );
    intentMap.set(
        "62Understand-Organisation-S-Role - Yes 3",
        handle62UnderstandOrganisationSRoleYes3
    );
    intentMap.set(
        "62Understand-Organisation-S-Role - No 3",
        handle62UnderstandOrganisationSRoleNo3
    );
    intentMap.set(
        "62Understand-Organisation-S-Role - Yes 4",
        handle62UnderstandOrganisationSRoleYes4
    );
    intentMap.set(
        "62Understand-Organisation-S-Role - No 4",
        handle62UnderstandOrganisationSRoleNo4
    );
    intentMap.set(
        "64Process-Personal-Data-And-Processor-Not-Controller - Yes",
        handle64ProcessPersonalDataAndProcessorNotControllerYes
    );
    intentMap.set(
        "64Process-Personal-Data-And-Processor-Not-Controller - No",
        handle64ProcessPersonalDataAndProcessorNotControllerNo
    );
    intentMap.set(
        "64Process-Personal-Data-And-Processor-Not-Controller - Yes 2",
        handle64ProcessPersonalDataAndProcessorNotControllerYes2
    );
    intentMap.set(
        "64Process-Personal-Data-And-Processor-Not-Controller - No 2",
        handle64ProcessPersonalDataAndProcessorNotControllerNo2
    );
    intentMap.set(
        "65Provide-Details-Of-Controller - Yes",
        handle65ProvideDetailsOfControllerYes
    );
    intentMap.set(
        "65Provide-Details-Of-Controller - No",
        handle65ProvideDetailsOfControllerNo
    );
    intentMap.set(
        "65Provide-Details-Of-Controller - Yes 2",
        handle65ProvideDetailsOfControllerYes2
    );
    intentMap.set(
        "65Provide-Details-Of-Controller - No 2",
        handle65ProvideDetailsOfControllerNo2
    );
    intentMap.set(
        "66Process-Data-Not-Controller-Not-Processor - Yes",
        handle66ProcessDataNotControllerNotProcessorYes
    );
    intentMap.set(
        "66Process-Data-Not-Controller-Not-Processor - No",
        handle66ProcessDataNotControllerNotProcessorNo
    );
    intentMap.set(
        "66Process-Data-Not-Controller-Not-Processor - Yes 2",
        handle66ProcessDataNotControllerNotProcessorYes2
    );
    intentMap.set(
        "66Process-Data-Not-Controller-Not-Processor - No 2",
        handle66ProcessDataNotControllerNotProcessorNo2
    );
    intentMap.set(
        "67Choose-To-Know-Manufacturer-Or-Designer - Yes",
        handle67ChooseToKnowManufacturerOrDesignerYes
    );
    intentMap.set(
        "67Choose-To-Know-Manufacturer-Or-Designer - No",
        handle67ChooseToKnowManufacturerOrDesignerNo
    );
    intentMap.set(
        "68Process-Data-And-Controller - Yes",
        handle68ProcessDataAndControllerYes
    );
    intentMap.set(
        "68Process-Data-And-Controller - No",
        handle68ProcessDataAndControllerNo
    );
    intentMap.set(
        "68Process-Data-And-Controller - Yes 2",
        handle68ProcessDataAndControllerYes2
    );
    intentMap.set(
        "68Process-Data-And-Controller - No 2",
        handle68ProcessDataAndControllerNo2
    );
    intentMap.set(
        "68Process-Data-And-Controller - Yes 3",
        handle68ProcessDataAndControllerYes3
    );
    intentMap.set(
        "68Process-Data-And-Controller - No 3",
        handle68ProcessDataAndControllerNo3
    );
    intentMap.set("69Subject-To-Laws - Yes", handle69SubjectToLawsYes);
    intentMap.set("69Subject-To-Laws - No", handle69SubjectToLawsNo);
    intentMap.set(
        "70Data-And-Controller-And-Laws - Yes",
        handle70DataAndControllerAndLawsYes
    );
    intentMap.set(
        "70Data-And-Controller-And-Laws - No",
        handle70DataAndControllerAndLawsNo
    );
    intentMap.set(
        "70Data-And-Controller-And-Laws - Yes 2",
        handle70DataAndControllerAndLawsYes2
    );
    intentMap.set(
        "70Data-And-Controller-And-Laws - No 2",
        handle70DataAndControllerAndLawsNo2
    );
    intentMap.set(
        "70Data-And-Controller-And-Laws - Yes 3",
        handle70DataAndControllerAndLawsYes3
    );
    intentMap.set(
        "70Data-And-Controller-And-Laws - No 3",
        handle70DataAndControllerAndLawsNo3
    );
    intentMap.set(
        "71Confirm-Number-Of-Dpr - Yes",
        handle71ConfirmNumberOfDprYes
    );
    intentMap.set("71Confirm-Number-Of-Dpr - No", handle71ConfirmNumberOfDprNo);
    intentMap.set(
        "72Provide-The-Overall-Grading - Yes",
        handle72ProvideTheOverallGradingYes
    );
    intentMap.set(
        "72Provide-The-Overall-Grading - No",
        handle72ProvideTheOverallGradingNo
    );
    intentMap.set(
        "72Provide-The-Overall-Grading - Yes 2",
        handle72ProvideTheOverallGradingYes2
    );
    intentMap.set(
        "72Provide-The-Overall-Grading - No 2",
        handle72ProvideTheOverallGradingNo2
    );
    intentMap.set(
        "72Provide-The-Overall-Grading - Yes 3",
        handle72ProvideTheOverallGradingYes3
    );
    intentMap.set(
        "72Provide-The-Overall-Grading - No 3",
        handle72ProvideTheOverallGradingNo3
    );
    intentMap.set(
        "72Provide-The-Name-Of-Overall-Grading - Yes",
        handle72ProvideTheNameOfOverallGradingYes
    );
    intentMap.set(
        "72Provide-The-Name-Of-Overall-Grading - No",
        handle72ProvideTheNameOfOverallGradingNo
    );
    intentMap.set(
        "74Confirm-Meets-Annex-2 - Yes",
        handle74ConfirmMeetsAnnex2Yes
    );
    intentMap.set("74Confirm-Meets-Annex-2 - No", handle74ConfirmMeetsAnnex2No);
    intentMap.set(
        "73Provide-Copy-Pf-The-Checklist - Yes",
        handle73ProvideCopyPfTheChecklistYes
    );
    intentMap.set(
        "73Provide-Copy-Pf-The-Checklist - No",
        handle73ProvideCopyPfTheChecklistNo
    );
    intentMap.set(
        "73Provide-Copy-Pf-The-Checklist - Yes 2",
        handle73ProvideCopyPfTheChecklistYes2
    );
    intentMap.set(
        "73Provide-Copy-Pf-The-Checklist - No 2",
        handle73ProvideCopyPfTheChecklistNo2
    );
    intentMap.set("75Provide-Dpia - Yes", handle75ProvideDpiaYes);
    intentMap.set("75Provide-Dpia - No", handle75ProvideDpiaNo);
    intentMap.set(
        "76Confirm-Permission-Of-Dpia - Yes",
        handle76ConfirmPermissionOfDpiaYes
    );
    intentMap.set(
        "76Confirm-Permission-Of-Dpia - No",
        handle76ConfirmPermissionOfDpiaNo
    );
    intentMap.set(
        "74Confirm-Meets-Annex-2 - Yes 2",
        handle74ConfirmMeetsAnnex2Yes2
    );
    intentMap.set(
        "74Confirm-Meets-Annex-2 - No 2",
        handle74ConfirmMeetsAnnex2No2
    );
    intentMap.set(
        "74Confirm-Meets-Annex-2 - Yes 3",
        handle74ConfirmMeetsAnnex2Yes3
    );
    intentMap.set(
        "74Confirm-Meets-Annex-2 - No 3",
        handle74ConfirmMeetsAnnex2No3
    );
    intentMap.set(
        "76Confirm-Permission-Of-Dpia - Yes 2",
        handle76ConfirmPermissionOfDpiaYes2
    );
    intentMap.set(
        "76Confirm-Permission-Of-Dpia - No 2",
        handle76ConfirmPermissionOfDpiaNo2
    );
    intentMap.set(
        "76Confirm-Permission-Of-Dpia - Yes 3",
        handle76ConfirmPermissionOfDpiaYes3
    );
    intentMap.set(
        "76Confirm-Permission-Of-Dpia - No 3",
        handle76ConfirmPermissionOfDpiaNo3
    );
    intentMap.set(
        "77Confirm-Data-And-Controller - Yes",
        handle77ConfirmDataAndControllerYes
    );
    intentMap.set(
        "77Confirm-Data-And-Controller - No",
        handle77ConfirmDataAndControllerNo
    );
    intentMap.set(
        "77Confirm-Data-And-Controller - Yes 2",
        handle77ConfirmDataAndControllerYes2
    );
    intentMap.set(
        "77Confirm-Data-And-Controller - No 2",
        handle77ConfirmDataAndControllerNo2
    );
    intentMap.set("78Confirm-Legal-Basis - Yes", handle78ConfirmLegalBasisYes);
    intentMap.set("78Confirm-Legal-Basis - No", handle78ConfirmLegalBasisNo);
    intentMap.set(
        "79Confirm-Other-Legal-Basis - Yes",
        handle79ConfirmOtherLegalBasisYes
    );
    intentMap.set(
        "79Confirm-Other-Legal-Basis - No",
        handle79ConfirmOtherLegalBasisNo
    );
    intentMap.set(
        "79Confirm-Other-Legal-Basis - Yes 2",
        handle79ConfirmOtherLegalBasisYes2
    );
    intentMap.set(
        "79Confirm-Other-Legal-Basis - No 2",
        handle79ConfirmOtherLegalBasisNo2
    );
    intentMap.set(
        "79Confirm-Other-Legal-Basis - Yes 3",
        handle79ConfirmOtherLegalBasisYes3
    );
    intentMap.set(
        "79Confirm-Other-Legal-Basis - No 3",
        handle79ConfirmOtherLegalBasisNo3
    );
    intentMap.set(
        "80Describe-The-Other-Legal-Basis - Yes",
        handle80DescribeTheOtherLegalBasisYes
    );
    intentMap.set(
        "80Describe-The-Other-Legal-Basis - No",
        handle80DescribeTheOtherLegalBasisNo
    );
    intentMap.set(
        "81Confirm-Measures-To-Protect-Right - Yes",
        handle81ConfirmMeasuresToProtectRightYes
    );
    intentMap.set(
        "81Confirm-Measures-To-Protect-Right - No",
        handle81ConfirmMeasuresToProtectRightNo
    );
    intentMap.set(
        "81Confirm-Measures-To-Protect-Right - Yes 2",
        handle81ConfirmMeasuresToProtectRightYes2
    );
    intentMap.set(
        "81Confirm-Measures-To-Protect-Right - No 2",
        handle81ConfirmMeasuresToProtectRightNo2
    );
    intentMap.set(
        "81Confirm-Measures-To-Protect-Right - Yes 3",
        handle81ConfirmMeasuresToProtectRightYes3
    );
    intentMap.set(
        "81Confirm-Measures-To-Protect-Right - No 3",
        handle81ConfirmMeasuresToProtectRightNo3
    );
    intentMap.set(
        "82Provide-Transparency-To-Data-Subject - Yes",
        handle82ProvideTransparencyToDataSubjectYes
    );
    intentMap.set(
        "82Provide-Transparency-To-Data-Subject - No",
        handle82ProvideTransparencyToDataSubjectNo
    );
    intentMap.set(
        "86Confirm-Measure-Ot-Verify-The-Identity - Yes",
        handle86ConfirmMeasureOtVerifyTheIdentityYes
    );
    intentMap.set(
        "86Confirm-Measure-Ot-Verify-The-Identity - No",
        handle86ConfirmMeasureOtVerifyTheIdentityNo
    );
    intentMap.set(
        "83Provide-The-Probability-To-Data-Subject - Yes",
        handle83ProvideTheProbabilityToDataSubjectYes
    );
    intentMap.set(
        "83Provide-The-Probability-To-Data-Subject - No",
        handle83ProvideTheProbabilityToDataSubjectNo
    );
    intentMap.set(
        "83Provide-The-Probability-To-Data-Subject - Yes 2",
        handle83ProvideTheProbabilityToDataSubjectYes2
    );
    intentMap.set(
        "83Provide-The-Probability-To-Data-Subject - No 2",
        handle83ProvideTheProbabilityToDataSubjectNo2
    );
    intentMap.set(
        "87Confirm-Data-And-Controller-And-Processed-By-A-Third-Party - Yes",
        handle87ConfirmDataAndControllerAndProcessedByAThirdPartyYes
    );
    intentMap.set(
        "87Confirm-Data-And-Controller-And-Processed-By-A-Third-Party - No",
        handle87ConfirmDataAndControllerAndProcessedByAThirdPartyNo
    );
    intentMap.set(
        "87Confirm-Data-And-Controller-And-Processed-By-A-Third-Party - Yes 2",
        handle87ConfirmDataAndControllerAndProcessedByAThirdPartyYes2
    );
    intentMap.set(
        "87Confirm-Data-And-Controller-And-Processed-By-A-Third-Party - No 2",
        handle87ConfirmDataAndControllerAndProcessedByAThirdPartyNo2
    );
    intentMap.set(
        "84Provide-The-Right-To-Erase - Yes",
        handle84ProvideTheRightToEraseYes
    );
    intentMap.set(
        "84Provide-The-Right-To-Erase - No",
        handle84ProvideTheRightToEraseNo
    );
    intentMap.set(
        "84Provide-The-Right-To-Erase - Yes 2",
        handle84ProvideTheRightToEraseYes2
    );
    intentMap.set(
        "84Provide-The-Right-To-Erase - No 2",
        handle84ProvideTheRightToEraseNo2
    );
    intentMap.set(
        "88Confirm-Allow-Third-Party-Processing-Data - Yes",
        handle88ConfirmAllowThirdPartyProcessingDataYes
    );
    intentMap.set(
        "88Confirm-Allow-Third-Party-Processing-Data - No",
        handle88ConfirmAllowThirdPartyProcessingDataNo
    );
    intentMap.set(
        "104Confirm-Pd-From-Individual - Yes",
        handle104ConfirmPdFromIndividualYes
    );
    intentMap.set(
        "104Confirm-Pd-From-Individual - No",
        handle104ConfirmPdFromIndividualNo
    );
    intentMap.set(
        "85Provide-The-Right-To-Rectify-Object - Yes",
        handle85ProvideTheRightToRectifyObjectYes
    );
    intentMap.set(
        "85Provide-The-Right-To-Rectify-Object - No",
        handle85ProvideTheRightToRectifyObjectNo
    );
    intentMap.set(
        "85Provide-The-Right-To-Rectify-Object - Yes 2",
        handle85ProvideTheRightToRectifyObjectYes2
    );
    intentMap.set(
        "85Provide-The-Right-To-Rectify-Object - No 2",
        handle85ProvideTheRightToRectifyObjectNo2
    );
    intentMap.set(
        "89Provide-Techinical-Services - Yes",
        handle89ProvideTechinicalServicesYes
    );
    intentMap.set(
        "89Provide-Techinical-Services - No",
        handle89ProvideTechinicalServicesNo
    );
    intentMap.set(
        "89Provide-Techinical-Services - Yes 2",
        handle89ProvideTechinicalServicesYes2
    );
    intentMap.set(
        "89Provide-Techinical-Services - No 2",
        handle89ProvideTechinicalServicesNo2
    );
    intentMap.set("105Confirm-Fair-Pd - Yes", handle105ConfirmFairPdYes);
    intentMap.set("105Confirm-Fair-Pd - No", handle105ConfirmFairPdNo);
    intentMap.set(
        "106Confirm-Pd-Form-Third-Party - Yes",
        handle106ConfirmPdFormThirdPartyYes
    );
    intentMap.set(
        "106Confirm-Pd-Form-Third-Party - No",
        handle106ConfirmPdFormThirdPartyNo
    );
    intentMap.set(
        "86Confirm-Measure-Ot-Verify-The-Identity - Yes 2",
        handle86ConfirmMeasureOtVerifyTheIdentityYes2
    );
    intentMap.set(
        "86Confirm-Measure-Ot-Verify-The-Identity - No 2",
        handle86ConfirmMeasureOtVerifyTheIdentityNo2
    );
    intentMap.set(
        "86Confirm-Measure-Ot-Verify-The-Identity - Yes 3",
        handle86ConfirmMeasureOtVerifyTheIdentityYes3
    );
    intentMap.set(
        "86Confirm-Measure-Ot-Verify-The-Identity - No 3",
        handle86ConfirmMeasureOtVerifyTheIdentityNo3
    );
    intentMap.set(
        "90Confirm-Third-Party-Of-Personal-Data - Yes",
        handle90ConfirmThirdPartyOfPersonalDataYes
    );
    intentMap.set(
        "90Confirm-Third-Party-Of-Personal-Data - No",
        handle90ConfirmThirdPartyOfPersonalDataNo
    );
    intentMap.set(
        "90Confirm-Third-Party-Of-Personal-Data - Yes 2",
        handle90ConfirmThirdPartyOfPersonalDataYes2
    );
    intentMap.set(
        "90Confirm-Third-Party-Of-Personal-Data - No 2",
        handle90ConfirmThirdPartyOfPersonalDataNo2
    );
    intentMap.set(
        "106Confirm-Pd-Form-Third-Party - Yes 2",
        handle106ConfirmPdFormThirdPartyYes2
    );
    intentMap.set(
        "106Confirm-Pd-Form-Third-Party - No 2",
        handle106ConfirmPdFormThirdPartyNo2
    );
    intentMap.set(
        "106Confirm-Pd-Form-Third-Party - Yes 3",
        handle106ConfirmPdFormThirdPartyYes3
    );
    intentMap.set(
        "106Confirm-Pd-Form-Third-Party - No 3",
        handle106ConfirmPdFormThirdPartyNo3
    );
    intentMap.set(
        "107Confirm-Fair-Pd-Of-Third-Party - Yes",
        handle107ConfirmFairPdOfThirdPartyYes
    );
    intentMap.set(
        "107Confirm-Fair-Pd-Of-Third-Party - No",
        handle107ConfirmFairPdOfThirdPartyNo
    );
    intentMap.set(
        "108Confirm-Pd-And-Controller-Following-Q - Yes",
        handle108ConfirmPdAndControllerFollowingQYes
    );
    intentMap.set(
        "108Confirm-Pd-And-Controller-Following-Q - No",
        handle108ConfirmPdAndControllerFollowingQNo
    );
    intentMap.set(
        "91Confirm-Written-Binding - Yes",
        handle91ConfirmWrittenBindingYes
    );
    intentMap.set(
        "91Confirm-Written-Binding - No",
        handle91ConfirmWrittenBindingNo
    );
    intentMap.set(
        "91Confirm-Written-Binding - Yes 2",
        handle91ConfirmWrittenBindingYes2
    );
    intentMap.set(
        "91Confirm-Written-Binding - No 2",
        handle91ConfirmWrittenBindingNo2
    );
    intentMap.set(
        "108Confirm-Pd-And-Controller-Following-Q - Yes 2",
        handle108ConfirmPdAndControllerFollowingQYes2
    );
    intentMap.set(
        "108Confirm-Pd-And-Controller-Following-Q - No 2",
        handle108ConfirmPdAndControllerFollowingQNo2
    );
    intentMap.set(
        "108Confirm-Pd-And-Controller-Following-Q - Yes 3",
        handle108ConfirmPdAndControllerFollowingQYes3
    );
    intentMap.set(
        "108Confirm-Pd-And-Controller-Following-Q - No 3",
        handle108ConfirmPdAndControllerFollowingQNo3
    );
    intentMap.set(
        "109Confirm-Include-Contact-Of-Controller - Yes",
        handle109ConfirmIncludeContactOfControllerYes
    );
    intentMap.set(
        "109Confirm-Include-Contact-Of-Controller - No",
        handle109ConfirmIncludeContactOfControllerNo
    );
    intentMap.set(
        "124Confirm-Spd-And-Controller-And-Consent - Yes",
        handle124ConfirmSpdAndControllerAndConsentYes
    );
    intentMap.set(
        "124Confirm-Spd-And-Controller-And-Consent - No",
        handle124ConfirmSpdAndControllerAndConsentNo
    );
    intentMap.set(
        "92Confirm-No-Clauses-Indemnify-Processors - Yes",
        handle92ConfirmNoClausesIndemnifyProcessorsYes
    );
    intentMap.set(
        "92Confirm-No-Clauses-Indemnify-Processors - No",
        handle92ConfirmNoClausesIndemnifyProcessorsNo
    );
    intentMap.set(
        "92Confirm-No-Clauses-Indemnify-Processors - Yes 2",
        handle92ConfirmNoClausesIndemnifyProcessorsYes2
    );
    intentMap.set(
        "92Confirm-No-Clauses-Indemnify-Processors - No 2",
        handle92ConfirmNoClausesIndemnifyProcessorsNo2
    );
    intentMap.set(
        "110Confirm-Include-Legal-Basis-For-Purpose - Yes",
        handle110ConfirmIncludeLegalBasisForPurposeYes
    );
    intentMap.set(
        "110Confirm-Include-Legal-Basis-For-Purpose - No",
        handle110ConfirmIncludeLegalBasisForPurposeNo
    );
    intentMap.set(
        "110Confirm-Include-Legal-Basis-For-Purpose - Yes 2",
        handle110ConfirmIncludeLegalBasisForPurposeYes2
    );
    intentMap.set(
        "110Confirm-Include-Legal-Basis-For-Purpose - No 2",
        handle110ConfirmIncludeLegalBasisForPurposeNo2
    );
    intentMap.set(
        "125Confirm-Freely-Given - Yes",
        handle125ConfirmFreelyGivenYes
    );
    intentMap.set(
        "125Confirm-Freely-Given - No",
        handle125ConfirmFreelyGivenNo
    );
    intentMap.set(
        "139Confirm-Pd-Of-Child-And-Controller - Yes",
        handle139ConfirmPdOfChildAndControllerYes
    );
    intentMap.set(
        "139Confirm-Pd-Of-Child-And-Controller - No",
        handle139ConfirmPdOfChildAndControllerNo
    );
    intentMap.set(
        "93Confirm-Set-Out-Subject-Matter - Yes",
        handle93ConfirmSetOutSubjectMatterYes
    );
    intentMap.set(
        "93Confirm-Set-Out-Subject-Matter - No",
        handle93ConfirmSetOutSubjectMatterNo
    );
    intentMap.set(
        "93Confirm-Set-Out-Subject-Matter - Yes 2",
        handle93ConfirmSetOutSubjectMatterYes2
    );
    intentMap.set(
        "93Confirm-Set-Out-Subject-Matter - No 2",
        handle93ConfirmSetOutSubjectMatterNo2
    );
    intentMap.set(
        "111Confirm-Include-Recipients - Yes",
        handle111ConfirmIncludeRecipientsYes
    );
    intentMap.set(
        "111Confirm-Include-Recipients - No",
        handle111ConfirmIncludeRecipientsNo
    );
    intentMap.set(
        "111Confirm-Include-Recipients - Yes 2",
        handle111ConfirmIncludeRecipientsYes2
    );
    intentMap.set(
        "111Confirm-Include-Recipients - No 2",
        handle111ConfirmIncludeRecipientsNo2
    );
    intentMap.set(
        "126Confirm-Not-A-Precondition - Yes",
        handle126ConfirmNotAPreconditionYes
    );
    intentMap.set(
        "126Confirm-Not-A-Precondition - No",
        handle126ConfirmNotAPreconditionNo
    );
    intentMap.set(
        "126Confirm-Not-A-Precondition - Yes 2",
        handle126ConfirmNotAPreconditionYes2
    );
    intentMap.set(
        "126Confirm-Not-A-Precondition - No 2",
        handle126ConfirmNotAPreconditionNo2
    );
    intentMap.set(
        "140Confirm-Design-Easy-To-Undersatnd - Yes",
        handle140ConfirmDesignEasyToUndersatndYes
    );
    intentMap.set(
        "140Confirm-Design-Easy-To-Undersatnd - No",
        handle140ConfirmDesignEasyToUndersatndNo
    );
    intentMap.set("166Confirm-Cookies - Yes", handle166ConfirmCookiesYes);
    intentMap.set("166Confirm-Cookies - No", handle166ConfirmCookiesNo);
    intentMap.set(
        "94Confirm-Set-Ot-The-Nature-Purpose - Yes",
        handle94ConfirmSetOtTheNaturePurposeYes
    );
    intentMap.set(
        "94Confirm-Set-Ot-The-Nature-Purpose - No",
        handle94ConfirmSetOtTheNaturePurposeNo
    );
    intentMap.set(
        "94Confirm-Set-Ot-The-Nature-Purpose - Yes 2",
        handle94ConfirmSetOtTheNaturePurposeYes2
    );
    intentMap.set(
        "94Confirm-Set-Ot-The-Nature-Purpose - No 2",
        handle94ConfirmSetOtTheNaturePurposeNo2
    );
    intentMap.set(
        "112Confirm-Include-Euc-Bcr - Yes",
        handle112ConfirmIncludeEucBcrYes
    );
    intentMap.set(
        "112Confirm-Include-Euc-Bcr - No",
        handle112ConfirmIncludeEucBcrNo
    );
    intentMap.set(
        "112Confirm-Include-Euc-Bcr - Yes 2",
        handle112ConfirmIncludeEucBcrYes2
    );
    intentMap.set(
        "112Confirm-Include-Euc-Bcr - No 2",
        handle112ConfirmIncludeEucBcrNo2
    );
    intentMap.set(
        "127Confirm-Separately-From-Team - Yes",
        handle127ConfirmSeparatelyFromTeamYes
    );
    intentMap.set(
        "127Confirm-Separately-From-Team - No",
        handle127ConfirmSeparatelyFromTeamNo
    );
    intentMap.set(
        "127Confirm-Separately-From-Team - Yes 2",
        handle127ConfirmSeparatelyFromTeamYes2
    );
    intentMap.set(
        "127Confirm-Separately-From-Team - No 2",
        handle127ConfirmSeparatelyFromTeamNo2
    );
    intentMap.set(
        "141Confirm-Exercise-Data-Protection-Rights - Yes",
        handle141ConfirmExerciseDataProtectionRightsYes
    );
    intentMap.set(
        "141Confirm-Exercise-Data-Protection-Rights - No",
        handle141ConfirmExerciseDataProtectionRightsNo
    );
    intentMap.set(
        "141Confirm-Exercise-Data-Protection-Rights - Yes 2",
        handle141ConfirmExerciseDataProtectionRightsYes2
    );
    intentMap.set(
        "141Confirm-Exercise-Data-Protection-Rights - No 2",
        handle141ConfirmExerciseDataProtectionRightsNo2
    );
    intentMap.set(
        "167Confirm-Cookies-Policy - Yes",
        handle167ConfirmCookiesPolicyYes
    );
    intentMap.set(
        "167Confirm-Cookies-Policy - No",
        handle167ConfirmCookiesPolicyNo
    );
    intentMap.set(
        "175Confirm-Bug-Reporting - Yes",
        handle175ConfirmBugReportingYes
    );
    intentMap.set(
        "175Confirm-Bug-Reporting - No",
        handle175ConfirmBugReportingNo
    );
    intentMap.set(
        "95Confirm-Set-Out-The-Type-Of-Data - Yes",
        handle95ConfirmSetOutTheTypeOfDataYes
    );
    intentMap.set(
        "95Confirm-Set-Out-The-Type-Of-Data - No",
        handle95ConfirmSetOutTheTypeOfDataNo
    );
    intentMap.set(
        "95Confirm-Set-Out-The-Type-Of-Data - Yes 2",
        handle95ConfirmSetOutTheTypeOfDataYes2
    );
    intentMap.set(
        "95Confirm-Set-Out-The-Type-Of-Data - No 2",
        handle95ConfirmSetOutTheTypeOfDataNo2
    );
    intentMap.set(
        "113Confirm-Include-Retention-Period - Yes",
        handle113ConfirmIncludeRetentionPeriodYes
    );
    intentMap.set(
        "113Confirm-Include-Retention-Period - No",
        handle113ConfirmIncludeRetentionPeriodNo
    );
    intentMap.set(
        "113Confirm-Include-Retention-Period - Yes 2",
        handle113ConfirmIncludeRetentionPeriodYes2
    );
    intentMap.set(
        "113Confirm-Include-Retention-Period - No 2",
        handle113ConfirmIncludeRetentionPeriodNo2
    );
    intentMap.set(
        "128Confirm-Fair-Process-Info - Yes",
        handle128ConfirmFairProcessInfoYes
    );
    intentMap.set(
        "128Confirm-Fair-Process-Info - No",
        handle128ConfirmFairProcessInfoNo
    );
    intentMap.set(
        "128Confirm-Fair-Process-Info - Yes 2",
        handle128ConfirmFairProcessInfoYes2
    );
    intentMap.set(
        "128Confirm-Fair-Process-Info - No 2",
        handle128ConfirmFairProcessInfoNo2
    );
    intentMap.set(
        "142Confirm-Get-Pd-Erased-Easily - Yes",
        handle142ConfirmGetPdErasedEasilyYes
    );
    intentMap.set(
        "142Confirm-Get-Pd-Erased-Easily - No",
        handle142ConfirmGetPdErasedEasilyNo
    );
    intentMap.set(
        "142Confirm-Get-Pd-Erased-Easily - Yes 2",
        handle142ConfirmGetPdErasedEasilyYes2
    );
    intentMap.set(
        "142Confirm-Get-Pd-Erased-Easily - No 2",
        handle142ConfirmGetPdErasedEasilyNo2
    );
    intentMap.set(
        "168Confirm-Cookie-Explain - Yes",
        handle168ConfirmCookieExplainYes
    );
    intentMap.set(
        "168Confirm-Cookie-Explain - No",
        handle168ConfirmCookieExplainNo
    );
    intentMap.set(
        "168Confirm-Cookie-Explain - Yes 2",
        handle168ConfirmCookieExplainYes2
    );
    intentMap.set(
        "168Confirm-Cookie-Explain - No 2",
        handle168ConfirmCookieExplainNo2
    );
    intentMap.set(
        "176Confirm-Collect-Bug-Report-Data - Yes",
        handle176ConfirmCollectBugReportDataYes
    );
    intentMap.set(
        "176Confirm-Collect-Bug-Report-Data - No",
        handle176ConfirmCollectBugReportDataNo
    );
    intentMap.set("179Confirm-Dpo - Yes", handle179ConfirmDpoYes);
    intentMap.set("179Confirm-Dpo - No", handle179ConfirmDpoNo);
    intentMap.set(
        "96Confirm-Set-Out-Obligation-Of-Controller - Yes",
        handle96ConfirmSetOutObligationOfControllerYes
    );
    intentMap.set(
        "96Confirm-Set-Out-Obligation-Of-Controller - No",
        handle96ConfirmSetOutObligationOfControllerNo
    );
    intentMap.set(
        "96Confirm-Set-Out-Obligation-Of-Controller - Yes 2",
        handle96ConfirmSetOutObligationOfControllerYes2
    );
    intentMap.set(
        "96Confirm-Set-Out-Obligation-Of-Controller - No 2",
        handle96ConfirmSetOutObligationOfControllerNo2
    );
    intentMap.set(
        "114Confirm-Include-Rigth-To-Lodge - Yes",
        handle114ConfirmIncludeRigthToLodgeYes
    );
    intentMap.set(
        "114Confirm-Include-Rigth-To-Lodge - No",
        handle114ConfirmIncludeRigthToLodgeNo
    );
    intentMap.set(
        "114Confirm-Include-Rigth-To-Lodge - Yes 2",
        handle114ConfirmIncludeRigthToLodgeYes2
    );
    intentMap.set(
        "114Confirm-Include-Rigth-To-Lodge - No 2",
        handle114ConfirmIncludeRigthToLodgeNo2
    );
    intentMap.set(
        "129Confirm-Withdraw-Consent-Easily - Yes",
        handle129ConfirmWithdrawConsentEasilyYes
    );
    intentMap.set(
        "129Confirm-Withdraw-Consent-Easily - No",
        handle129ConfirmWithdrawConsentEasilyNo
    );
    intentMap.set(
        "129Confirm-Withdraw-Consent-Easily - Yes 2",
        handle129ConfirmWithdrawConsentEasilyYes2
    );
    intentMap.set(
        "129Confirm-Withdraw-Consent-Easily - No 2",
        handle129ConfirmWithdrawConsentEasilyNo2
    );
    intentMap.set(
        "143Confirm-Complies-Requirements-Of-Uk-Data - Yes",
        handle143ConfirmCompliesRequirementsOfUkDataYes
    );
    intentMap.set(
        "143Confirm-Complies-Requirements-Of-Uk-Data - No",
        handle143ConfirmCompliesRequirementsOfUkDataNo
    );
    intentMap.set(
        "143Confirm-Complies-Requirements-Of-Uk-Data - Yes 2",
        handle143ConfirmCompliesRequirementsOfUkDataYes2
    );
    intentMap.set(
        "143Confirm-Complies-Requirements-Of-Uk-Data - No 2",
        handle143ConfirmCompliesRequirementsOfUkDataNo2
    );
    intentMap.set(
        "169Confirm-Valid-Cookie - Yes",
        handle169ConfirmValidCookieYes
    );
    intentMap.set(
        "169Confirm-Valid-Cookie - No",
        handle169ConfirmValidCookieNo
    );
    intentMap.set(
        "169Confirm-Valid-Cookie - Yes 2",
        handle169ConfirmValidCookieYes2
    );
    intentMap.set(
        "169Confirm-Valid-Cookie - No 2",
        handle169ConfirmValidCookieNo2
    );
    intentMap.set(
        "177Confirm-Informed-Consent-Of-User - Yes",
        handle177ConfirmInformedConsentOfUserYes
    );
    intentMap.set(
        "177Confirm-Informed-Consent-Of-User - No",
        handle177ConfirmInformedConsentOfUserNo
    );
    intentMap.set(
        "177Confirm-Informed-Consent-Of-User - Yes 2",
        handle177ConfirmInformedConsentOfUserYes2
    );
    intentMap.set(
        "177Confirm-Informed-Consent-Of-User - No 2",
        handle177ConfirmInformedConsentOfUserNo2
    );
    intentMap.set("180Confirm-Have-Dpo - Yes", handle180ConfirmHaveDpoYes);
    intentMap.set("180Confirm-Have-Dpo - No", handle180ConfirmHaveDpoNo);
    intentMap.set(
        "181Confirm-Product-A-Mobile-Devices - Yes",
        handle181ConfirmProductAMobileDevicesYes
    );
    intentMap.set(
        "181Confirm-Product-A-Mobile-Devices - No",
        handle181ConfirmProductAMobileDevicesNo
    );
    intentMap.set(
        "97Confirm-Processor-Act-On-The-Written-Instruction - Yes",
        handle97ConfirmProcessorActOnTheWrittenInstructionYes
    );
    intentMap.set(
        "97Confirm-Processor-Act-On-The-Written-Instruction - No",
        handle97ConfirmProcessorActOnTheWrittenInstructionNo
    );
    intentMap.set(
        "97Confirm-Processor-Act-On-The-Written-Instruction - Yes 2",
        handle97ConfirmProcessorActOnTheWrittenInstructionYes2
    );
    intentMap.set(
        "97Confirm-Processor-Act-On-The-Written-Instruction - No 2",
        handle97ConfirmProcessorActOnTheWrittenInstructionNo2
    );
    intentMap.set(
        "115Confirm-Include-Failing-To-The-Provbide-The-Peronal-Data - Yes",
        handle115ConfirmIncludeFailingToTheProvbideThePeronalDataYes
    );
    intentMap.set(
        "115Confirm-Include-Failing-To-The-Provbide-The-Peronal-Data - No",
        handle115ConfirmIncludeFailingToTheProvbideThePeronalDataNo
    );
    intentMap.set(
        "115Confirm-Include-Failing-To-The-Provbide-The-Peronal-Data - Yes 2",
        handle115ConfirmIncludeFailingToTheProvbideThePeronalDataYes2
    );
    intentMap.set(
        "115Confirm-Include-Failing-To-The-Provbide-The-Peronal-Data - No 2",
        handle115ConfirmIncludeFailingToTheProvbideThePeronalDataNo2
    );
    intentMap.set(
        "130Confirm-Obtained-Seperately - Yes",
        handle130ConfirmObtainedSeperatelyYes
    );
    intentMap.set(
        "130Confirm-Obtained-Seperately - No",
        handle130ConfirmObtainedSeperatelyNo
    );
    intentMap.set(
        "130Confirm-Obtained-Seperately - Yes 2",
        handle130ConfirmObtainedSeperatelyYes2
    );
    intentMap.set(
        "130Confirm-Obtained-Seperately - No 2",
        handle130ConfirmObtainedSeperatelyNo2
    );
    intentMap.set(
        "144Confirm-Process-Chil-Dfrom-Outset - Yes",
        handle144ConfirmProcessChilDfromOutsetYes
    );
    intentMap.set(
        "144Confirm-Process-Chil-Dfrom-Outset - No",
        handle144ConfirmProcessChilDfromOutsetNo
    );
    intentMap.set(
        "144Confirm-Process-Chil-Dfrom-Outset - Yes 2",
        handle144ConfirmProcessChilDfromOutsetYes2
    );
    intentMap.set(
        "144Confirm-Process-Chil-Dfrom-Outset - No 2",
        handle144ConfirmProcessChilDfromOutsetNo2
    );
    intentMap.set(
        "170Confirm-Cookie-Explain-The-Purpose - Yes",
        handle170ConfirmCookieExplainThePurposeYes
    );
    intentMap.set(
        "170Confirm-Cookie-Explain-The-Purpose - No",
        handle170ConfirmCookieExplainThePurposeNo
    );
    intentMap.set(
        "170Confirm-Cookie-Explain-The-Purpose - Yes 2",
        handle170ConfirmCookieExplainThePurposeYes2
    );
    intentMap.set(
        "170Confirm-Cookie-Explain-The-Purpose - No 2",
        handle170ConfirmCookieExplainThePurposeNo2
    );
    intentMap.set(
        "178Confirm-Fully-Anonymised - Yes",
        handle178ConfirmFullyAnonymisedYes
    );
    intentMap.set(
        "178Confirm-Fully-Anonymised - No",
        handle178ConfirmFullyAnonymisedNo
    );
    intentMap.set(
        "178Confirm-Fully-Anonymised - Yes 2",
        handle178ConfirmFullyAnonymisedYes2
    );
    intentMap.set(
        "178Confirm-Fully-Anonymised - No 2",
        handle178ConfirmFullyAnonymisedNo2
    );
    intentMap.set(
        "181Confirm-Product-A-Mobile-Devices - Yes 2",
        handle181ConfirmProductAMobileDevicesYes2
    );
    intentMap.set(
        "181Confirm-Product-A-Mobile-Devices - No 2",
        handle181ConfirmProductAMobileDevicesNo2
    );
    intentMap.set(
        "181Confirm-Product-A-Mobile-Devices - Yes 3",
        handle181ConfirmProductAMobileDevicesYes3
    );
    intentMap.set(
        "181Confirm-Product-A-Mobile-Devices - No 3",
        handle181ConfirmProductAMobileDevicesNo3
    );
    intentMap.set(
        "182Confirm-Product-Processes-Pd - Yes",
        handle182ConfirmProductProcessesPdYes
    );
    intentMap.set(
        "182Confirm-Product-Processes-Pd - No",
        handle182ConfirmProductProcessesPdNo
    );
    intentMap.set("188Confirm-Color - Yes", handle188ConfirmColorYes);
    intentMap.set("188Confirm-Color - No", handle188ConfirmColorNo);
    intentMap.set(
        "98Confirm-Unsure-Their-Employees-Processing - Yes",
        handle98ConfirmUnsureTheirEmployeesProcessingYes
    );
    intentMap.set(
        "98Confirm-Unsure-Their-Employees-Processing - No",
        handle98ConfirmUnsureTheirEmployeesProcessingNo
    );
    intentMap.set(
        "98Confirm-Unsure-Their-Employees-Processing - Yes 2",
        handle98ConfirmUnsureTheirEmployeesProcessingYes2
    );
    intentMap.set(
        "98Confirm-Unsure-Their-Employees-Processing - No 2",
        handle98ConfirmUnsureTheirEmployeesProcessingNo2
    );
    intentMap.set(
        "116Confirm-Include-Consequences - Yes",
        handle116ConfirmIncludeConsequencesYes
    );
    intentMap.set(
        "116Confirm-Include-Consequences - No",
        handle116ConfirmIncludeConsequencesNo
    );
    intentMap.set(
        "116Confirm-Include-Consequences - Yes 2",
        handle116ConfirmIncludeConsequencesYes2
    );
    intentMap.set(
        "116Confirm-Include-Consequences - No 2",
        handle116ConfirmIncludeConsequencesNo2
    );
    intentMap.set("131Confirm-Recorded - Yes", handle131ConfirmRecordedYes);
    intentMap.set("131Confirm-Recorded - No", handle131ConfirmRecordedNo);
    intentMap.set("131Confirm-Recorded - Yes 2", handle131ConfirmRecordedYes2);
    intentMap.set("131Confirm-Recorded - No 2", handle131ConfirmRecordedNo2);
    intentMap.set(
        "145Confirm-Fair-And-Complies-With-Dpp - Yes",
        handle145ConfirmFairAndCompliesWithDppYes
    );
    intentMap.set(
        "145Confirm-Fair-And-Complies-With-Dpp - No",
        handle145ConfirmFairAndCompliesWithDppNo
    );
    intentMap.set(
        "145Confirm-Fair-And-Complies-With-Dpp - Yes 2",
        handle145ConfirmFairAndCompliesWithDppYes2
    );
    intentMap.set(
        "145Confirm-Fair-And-Complies-With-Dpp - No 2",
        handle145ConfirmFairAndCompliesWithDppNo2
    );
    intentMap.set(
        "171Confirm-Use-Strictly-Necessary-Cookies - Yes",
        handle171ConfirmUseStrictlyNecessaryCookiesYes
    );
    intentMap.set(
        "171Confirm-Use-Strictly-Necessary-Cookies - No",
        handle171ConfirmUseStrictlyNecessaryCookiesNo
    );
    intentMap.set(
        "171Confirm-Use-Strictly-Necessary-Cookies - Yes 2",
        handle171ConfirmUseStrictlyNecessaryCookiesYes2
    );
    intentMap.set(
        "171Confirm-Use-Strictly-Necessary-Cookies - No 2",
        handle171ConfirmUseStrictlyNecessaryCookiesNo2
    );
    intentMap.set("179Confirm-Dpo - Yes 2", handle179ConfirmDpoYes2);
    intentMap.set("179Confirm-Dpo - No 2", handle179ConfirmDpoNo2);
    intentMap.set("179Confirm-Dpo - Yes 3", handle179ConfirmDpoYes3);
    intentMap.set("179Confirm-Dpo - No 3", handle179ConfirmDpoNo3);
    intentMap.set(
        "183Confirm-Smart-Phone-And-Process-Pd - Yes",
        handle183ConfirmSmartPhoneAndProcessPdYes
    );
    intentMap.set(
        "183Confirm-Smart-Phone-And-Process-Pd - No",
        handle183ConfirmSmartPhoneAndProcessPdNo
    );
    intentMap.set(
        "185Confirm-Code-Level-Security - Yes",
        handle185ConfirmCodeLevelSecurityYes
    );
    intentMap.set(
        "185Confirm-Code-Level-Security - No",
        handle185ConfirmCodeLevelSecurityNo
    );
    intentMap.set(
        "189Confirm-Follow-6-Principles - Yes",
        handle189ConfirmFollow6PrinciplesYes
    );
    intentMap.set(
        "189Confirm-Follow-6-Principles - No",
        handle189ConfirmFollow6PrinciplesNo
    );
    intentMap.set(
        "189Confirm-Follow-6-Principles - Yes 2",
        handle189ConfirmFollow6PrinciplesYes2
    );
    intentMap.set(
        "189Confirm-Follow-6-Principles - No 2",
        handle189ConfirmFollow6PrinciplesNo2
    );
    intentMap.set(
        "99Confirm-Ensure-The-Security-Of-Processing - Yes",
        handle99ConfirmEnsureTheSecurityOfProcessingYes
    );
    intentMap.set(
        "99Confirm-Ensure-The-Security-Of-Processing - No",
        handle99ConfirmEnsureTheSecurityOfProcessingNo
    );
    intentMap.set(
        "99Confirm-Ensure-The-Security-Of-Processing - Yes 2",
        handle99ConfirmEnsureTheSecurityOfProcessingYes2
    );
    intentMap.set(
        "99Confirm-Ensure-The-Security-Of-Processing - No 2",
        handle99ConfirmEnsureTheSecurityOfProcessingNo2
    );
    intentMap.set(
        "117Confirm-Include-Obtain-Copy-Of-Pd - Yes",
        handle117ConfirmIncludeObtainCopyOfPdYes
    );
    intentMap.set(
        "117Confirm-Include-Obtain-Copy-Of-Pd - No",
        handle117ConfirmIncludeObtainCopyOfPdNo
    );
    intentMap.set(
        "117Confirm-Include-Obtain-Copy-Of-Pd - Yes 2",
        handle117ConfirmIncludeObtainCopyOfPdYes2
    );
    intentMap.set(
        "117Confirm-Include-Obtain-Copy-Of-Pd - No 2",
        handle117ConfirmIncludeObtainCopyOfPdNo2
    );
    intentMap.set(
        "132Confirm-Evidence-Of-Valid-Consent - Yes",
        handle132ConfirmEvidenceOfValidConsentYes
    );
    intentMap.set(
        "132Confirm-Evidence-Of-Valid-Consent - No",
        handle132ConfirmEvidenceOfValidConsentNo
    );
    intentMap.set(
        "132Confirm-Evidence-Of-Valid-Consent - Yes 2",
        handle132ConfirmEvidenceOfValidConsentYes2
    );
    intentMap.set(
        "132Confirm-Evidence-Of-Valid-Consent - No 2",
        handle132ConfirmEvidenceOfValidConsentNo2
    );
    intentMap.set("146Confirm-Use-Dpias - Yes", handle146ConfirmUseDpiasYes);
    intentMap.set("146Confirm-Use-Dpias - No", handle146ConfirmUseDpiasNo);
    intentMap.set("146Confirm-Use-Dpias - Yes 2", handle146ConfirmUseDpiasYes2);
    intentMap.set("146Confirm-Use-Dpias - No 2", handle146ConfirmUseDpiasNo2);
    intentMap.set(
        "172Confirm-Exclude-Strictly-Necessary-Cookies - Yes",
        handle172ConfirmExcludeStrictlyNecessaryCookiesYes
    );
    intentMap.set(
        "172Confirm-Exclude-Strictly-Necessary-Cookies - No",
        handle172ConfirmExcludeStrictlyNecessaryCookiesNo
    );
    intentMap.set(
        "172Confirm-Exclude-Strictly-Necessary-Cookies - Yes 2",
        handle172ConfirmExcludeStrictlyNecessaryCookiesYes2
    );
    intentMap.set(
        "172Confirm-Exclude-Strictly-Necessary-Cookies - No 2",
        handle172ConfirmExcludeStrictlyNecessaryCookiesNo2
    );
    intentMap.set(
        "184Confirm-Persisted-To-Mobile-Devices - Yes",
        handle184ConfirmPersistedToMobileDevicesYes
    );
    intentMap.set(
        "184Confirm-Persisted-To-Mobile-Devices - No",
        handle184ConfirmPersistedToMobileDevicesNo
    );
    intentMap.set(
        "185Confirm-Code-Level-Security - Yes 2",
        handle185ConfirmCodeLevelSecurityYes2
    );
    intentMap.set(
        "185Confirm-Code-Level-Security - No 2",
        handle185ConfirmCodeLevelSecurityNo2
    );
    intentMap.set(
        "186Confirm-Evidence-Of-Code-Level-Report - Yes",
        handle186ConfirmEvidenceOfCodeLevelReportYes
    );
    intentMap.set(
        "186Confirm-Evidence-Of-Code-Level-Report - No",
        handle186ConfirmEvidenceOfCodeLevelReportNo
    );
    intentMap.set("188Confirm-Color - Yes 2", handle188ConfirmColorYes2);
    intentMap.set("188Confirm-Color - No 2", handle188ConfirmColorNo2);
    intentMap.set(
        "190Provide-Phase-Of-Human-Centred-Design - Yes",
        handle190ProvidePhaseOfHumanCentredDesignYes
    );
    intentMap.set(
        "190Provide-Phase-Of-Human-Centred-Design - No",
        handle190ProvidePhaseOfHumanCentredDesignNo
    );
    intentMap.set(
        "190Provide-Phase-Of-Human-Centred-Design - Yes 2",
        handle190ProvidePhaseOfHumanCentredDesignYes2
    );
    intentMap.set(
        "190Provide-Phase-Of-Human-Centred-Design - No 2",
        handle190ProvidePhaseOfHumanCentredDesignNo2
    );
    intentMap.set(
        "100Confirm-Only-Engage-Sub-Processing - Yes",
        handle100ConfirmOnlyEngageSubProcessingYes
    );
    intentMap.set(
        "100Confirm-Only-Engage-Sub-Processing - No",
        handle100ConfirmOnlyEngageSubProcessingNo
    );
    intentMap.set(
        "100Confirm-Only-Engage-Sub-Processing - Yes 2",
        handle100ConfirmOnlyEngageSubProcessingYes2
    );
    intentMap.set(
        "100Confirm-Only-Engage-Sub-Processing - No 2",
        handle100ConfirmOnlyEngageSubProcessingNo2
    );
    intentMap.set(
        "118Confirm-Include-Restrict-Their-Pd - Yes",
        handle118ConfirmIncludeRestrictTheirPdYes
    );
    intentMap.set(
        "118Confirm-Include-Restrict-Their-Pd - No",
        handle118ConfirmIncludeRestrictTheirPdNo
    );
    intentMap.set(
        "118Confirm-Include-Restrict-Their-Pd - Yes 2",
        handle118ConfirmIncludeRestrictTheirPdYes2
    );
    intentMap.set(
        "118Confirm-Include-Restrict-Their-Pd - No 2",
        handle118ConfirmIncludeRestrictTheirPdNo2
    );
    intentMap.set(
        "133Confirm-Affirmative - Yes",
        handle133ConfirmAffirmativeYes
    );
    intentMap.set("133Confirm-Affirmative - No", handle133ConfirmAffirmativeNo);
    intentMap.set(
        "133Confirm-Affirmative - Yes 2",
        handle133ConfirmAffirmativeYes2
    );
    intentMap.set(
        "133Confirm-Affirmative - No 2",
        handle133ConfirmAffirmativeNo2
    );
    intentMap.set(
        "147Confirm-Risk-Of-Childs - Yes",
        handle147ConfirmRiskOfChildsYes
    );
    intentMap.set(
        "147Confirm-Risk-Of-Childs - No",
        handle147ConfirmRiskOfChildsNo
    );
    intentMap.set(
        "147Confirm-Risk-Of-Childs - Yes 2",
        handle147ConfirmRiskOfChildsYes2
    );
    intentMap.set(
        "147Confirm-Risk-Of-Childs - No 2",
        handle147ConfirmRiskOfChildsNo2
    );
    intentMap.set(
        "173Confirm-Evidence-Valid-Consent - Yes",
        handle173ConfirmEvidenceValidConsentYes
    );
    intentMap.set(
        "173Confirm-Evidence-Valid-Consent - No",
        handle173ConfirmEvidenceValidConsentNo
    );
    intentMap.set(
        "173Confirm-Evidence-Valid-Consent - Yes 2",
        handle173ConfirmEvidenceValidConsentYes2
    );
    intentMap.set(
        "173Confirm-Evidence-Valid-Consent - No 2",
        handle173ConfirmEvidenceValidConsentNo2
    );
    intentMap.set(
        "185Confirm-Code-Level-Security - Yes 3",
        handle185ConfirmCodeLevelSecurityYes3
    );
    intentMap.set(
        "185Confirm-Code-Level-Security - No 3",
        handle185ConfirmCodeLevelSecurityNo3
    );
    intentMap.set(
        "185Confirm-Code-Level-Security - Yes 4",
        handle185ConfirmCodeLevelSecurityYes4
    );
    intentMap.set(
        "185Confirm-Code-Level-Security - No 4",
        handle185ConfirmCodeLevelSecurityNo4
    );
    intentMap.set(
        "187Confirm-By-External-Body - Yes",
        handle187ConfirmByExternalBodyYes
    );
    intentMap.set(
        "187Confirm-By-External-Body - No",
        handle187ConfirmByExternalBodyNo
    );
    intentMap.set(
        "187Confirm-By-External-Body - Yes 2",
        handle187ConfirmByExternalBodyYes2
    );
    intentMap.set(
        "187Confirm-By-External-Body - No 2",
        handle187ConfirmByExternalBodyNo2
    );
    intentMap.set(
        "191Provide-User-Demographics - Yes",
        handle191ProvideUserDemographicsYes
    );
    intentMap.set(
        "191Provide-User-Demographics - No",
        handle191ProvideUserDemographicsNo
    );
    intentMap.set(
        "191Provide-User-Demographics - Yes 2",
        handle191ProvideUserDemographicsYes2
    );
    intentMap.set(
        "191Provide-User-Demographics - No 2",
        handle191ProvideUserDemographicsNo2
    );
    intentMap.set(
        "101Confirm-Data-Subject-To-Exercise-Their-Rights-Under-Uk-Laws - Yes",
        handle101ConfirmDataSubjectToExerciseTheirRightsUnderUkLawsYes
    );
    intentMap.set(
        "101Confirm-Data-Subject-To-Exercise-Their-Rights-Under-Uk-Laws - No",
        handle101ConfirmDataSubjectToExerciseTheirRightsUnderUkLawsNo
    );
    intentMap.set(
        "101Confirm-Data-Subject-To-Exercise-Their-Rights-Under-Uk-Laws - Yes 2",
        handle101ConfirmDataSubjectToExerciseTheirRightsUnderUkLawsYes2
    );
    intentMap.set(
        "101Confirm-Data-Subject-To-Exercise-Their-Rights-Under-Uk-Laws - No 2",
        handle101ConfirmDataSubjectToExerciseTheirRightsUnderUkLawsNo2
    );
    intentMap.set(
        "119Confirm-Include-Existence-Of-The-Data - Yes",
        handle119ConfirmIncludeExistenceOfTheDataYes
    );
    intentMap.set(
        "119Confirm-Include-Existence-Of-The-Data - No",
        handle119ConfirmIncludeExistenceOfTheDataNo
    );
    intentMap.set(
        "119Confirm-Include-Existence-Of-The-Data - Yes 2",
        handle119ConfirmIncludeExistenceOfTheDataYes2
    );
    intentMap.set(
        "119Confirm-Include-Existence-Of-The-Data - No 2",
        handle119ConfirmIncludeExistenceOfTheDataNo2
    );
    intentMap.set(
        "134Confirm-Not-Predicted - Yes",
        handle134ConfirmNotPredictedYes
    );
    intentMap.set(
        "134Confirm-Not-Predicted - No",
        handle134ConfirmNotPredictedNo
    );
    intentMap.set(
        "134Confirm-Not-Predicted - Yes 2",
        handle134ConfirmNotPredictedYes2
    );
    intentMap.set(
        "134Confirm-Not-Predicted - No 2",
        handle134ConfirmNotPredictedNo2
    );
    intentMap.set(
        "148Confirm-Privacy-Notices - Yes",
        handle148ConfirmPrivacyNoticesYes
    );
    intentMap.set(
        "148Confirm-Privacy-Notices - No",
        handle148ConfirmPrivacyNoticesNo
    );
    intentMap.set(
        "148Confirm-Privacy-Notices - Yes 2",
        handle148ConfirmPrivacyNoticesYes2
    );
    intentMap.set(
        "148Confirm-Privacy-Notices - No 2",
        handle148ConfirmPrivacyNoticesNo2
    );
    intentMap.set(
        "174Confirm-Consent-Withdraw-Easily - Yes",
        handle174ConfirmConsentWithdrawEasilyYes
    );
    intentMap.set(
        "174Confirm-Consent-Withdraw-Easily - No",
        handle174ConfirmConsentWithdrawEasilyNo
    );
    intentMap.set(
        "174Confirm-Consent-Withdraw-Easily - Yes 2",
        handle174ConfirmConsentWithdrawEasilyYes2
    );
    intentMap.set(
        "174Confirm-Consent-Withdraw-Easily - No 2",
        handle174ConfirmConsentWithdrawEasilyNo2
    );
    intentMap.set("188Confirm-Color - Yes 3", handle188ConfirmColorYes3);
    intentMap.set("188Confirm-Color - No 3", handle188ConfirmColorNo3);
    intentMap.set("188Confirm-Color - Yes 4", handle188ConfirmColorYes4);
    intentMap.set("188Confirm-Color - No 4", handle188ConfirmColorNo4);
    intentMap.set(
        "192Research-Informed-User-Needs - Yes",
        handle192ResearchInformedUserNeedsYes
    );
    intentMap.set(
        "192Research-Informed-User-Needs - No",
        handle192ResearchInformedUserNeedsNo
    );
    intentMap.set(
        "192Research-Informed-User-Needs - Yes 2",
        handle192ResearchInformedUserNeedsYes2
    );
    intentMap.set(
        "192Research-Informed-User-Needs - No 2",
        handle192ResearchInformedUserNeedsNo2
    );
    intentMap.set(
        "102Confirm-Processor-Assist-Controller - Yes",
        handle102ConfirmProcessorAssistControllerYes
    );
    intentMap.set(
        "102Confirm-Processor-Assist-Controller - No",
        handle102ConfirmProcessorAssistControllerNo
    );
    intentMap.set(
        "102Confirm-Processor-Assist-Controller - Yes 2",
        handle102ConfirmProcessorAssistControllerYes2
    );
    intentMap.set(
        "102Confirm-Processor-Assist-Controller - No 2",
        handle102ConfirmProcessorAssistControllerNo2
    );
    intentMap.set(
        "120Confirm-Include-Right-To-Withdraw-Consent - Yes",
        handle120ConfirmIncludeRightToWithdrawConsentYes
    );
    intentMap.set(
        "120Confirm-Include-Right-To-Withdraw-Consent - No",
        handle120ConfirmIncludeRightToWithdrawConsentNo
    );
    intentMap.set(
        "120Confirm-Include-Right-To-Withdraw-Consent - Yes 2",
        handle120ConfirmIncludeRightToWithdrawConsentYes2
    );
    intentMap.set(
        "120Confirm-Include-Right-To-Withdraw-Consent - No 2",
        handle120ConfirmIncludeRightToWithdrawConsentNo2
    );
    intentMap.set(
        "135Confirm-Not-Use-Blank - Yes",
        handle135ConfirmNotUseBlankYes
    );
    intentMap.set(
        "135Confirm-Not-Use-Blank - No",
        handle135ConfirmNotUseBlankNo
    );
    intentMap.set(
        "135Confirm-Not-Use-Blank - Yes 2",
        handle135ConfirmNotUseBlankYes2
    );
    intentMap.set(
        "135Confirm-Not-Use-Blank - No 2",
        handle135ConfirmNotUseBlankNo2
    );
    intentMap.set(
        "149Confirm-Friendly-Way-Of-Data - Yes",
        handle149ConfirmFriendlyWayOfDataYes
    );
    intentMap.set(
        "149Confirm-Friendly-Way-Of-Data - No",
        handle149ConfirmFriendlyWayOfDataNo
    );
    intentMap.set(
        "149Confirm-Friendly-Way-Of-Data - Yes 2",
        handle149ConfirmFriendlyWayOfDataYes2
    );
    intentMap.set(
        "149Confirm-Friendly-Way-Of-Data - No 2",
        handle149ConfirmFriendlyWayOfDataNo2
    );
    intentMap.set(
        "175Confirm-Bug-Reporting - Yes 2",
        handle175ConfirmBugReportingYes2
    );
    intentMap.set(
        "175Confirm-Bug-Reporting - No 2",
        handle175ConfirmBugReportingNo2
    );
    intentMap.set(
        "175Confirm-Bug-Reporting - Yes 3",
        handle175ConfirmBugReportingYes3
    );
    intentMap.set(
        "175Confirm-Bug-Reporting - No 3",
        handle175ConfirmBugReportingNo3
    );
    intentMap.set(
        "193Provide-Product-Addresses - Yes",
        handle193ProvideProductAddressesYes
    );
    intentMap.set(
        "193Provide-Product-Addresses - No",
        handle193ProvideProductAddressesNo
    );
    intentMap.set(
        "193Provide-Product-Addresses - Yes 2",
        handle193ProvideProductAddressesYes2
    );
    intentMap.set(
        "193Provide-Product-Addresses - No 2",
        handle193ProvideProductAddressesNo2
    );
    intentMap.set(
        "103Confirm-Processor-Tell-Controller - Yes",
        handle103ConfirmProcessorTellControllerYes
    );
    intentMap.set(
        "103Confirm-Processor-Tell-Controller - No",
        handle103ConfirmProcessorTellControllerNo
    );
    intentMap.set(
        "103Confirm-Processor-Tell-Controller - Yes 2",
        handle103ConfirmProcessorTellControllerYes2
    );
    intentMap.set(
        "103Confirm-Processor-Tell-Controller - No 2",
        handle103ConfirmProcessorTellControllerNo2
    );
    intentMap.set(
        "121Confirm-Include-Right-To-Data-Probability - Yes",
        handle121ConfirmIncludeRightToDataProbabilityYes
    );
    intentMap.set(
        "121Confirm-Include-Right-To-Data-Probability - No",
        handle121ConfirmIncludeRightToDataProbabilityNo
    );
    intentMap.set(
        "121Confirm-Include-Right-To-Data-Probability - Yes 2",
        handle121ConfirmIncludeRightToDataProbabilityYes2
    );
    intentMap.set(
        "121Confirm-Include-Right-To-Data-Probability - No 2",
        handle121ConfirmIncludeRightToDataProbabilityNo2
    );
    intentMap.set(
        "136Confirm-Not-Default-Setting - Yes",
        handle136ConfirmNotDefaultSettingYes
    );
    intentMap.set(
        "136Confirm-Not-Default-Setting - No",
        handle136ConfirmNotDefaultSettingNo
    );
    intentMap.set(
        "136Confirm-Not-Default-Setting - Yes 2",
        handle136ConfirmNotDefaultSettingYes2
    );
    intentMap.set(
        "136Confirm-Not-Default-Setting - No 2",
        handle136ConfirmNotDefaultSettingNo2
    );
    intentMap.set(
        "150Confirmexplain-To-Childs - Yes",
        handle150ConfirmexplainToChildsYes
    );
    intentMap.set(
        "150Confirmexplain-To-Childs - No",
        handle150ConfirmexplainToChildsNo
    );
    intentMap.set(
        "150Confirmexplain-To-Childs - Yes 2",
        handle150ConfirmexplainToChildsYes2
    );
    intentMap.set(
        "150Confirmexplain-To-Childs - No 2",
        handle150ConfirmexplainToChildsNo2
    );
    intentMap.set(
        "194Provide-Times-Tested - Yes",
        handle194ProvideTimesTestedYes
    );
    intentMap.set(
        "194Provide-Times-Tested - No",
        handle194ProvideTimesTestedNo
    );
    intentMap.set(
        "194Provide-Times-Tested - Yes 2",
        handle194ProvideTimesTestedYes2
    );
    intentMap.set(
        "194Provide-Times-Tested - No 2",
        handle194ProvideTimesTestedNo2
    );
    intentMap.set(
        "104Confirm-Pd-From-Individual - Yes 2",
        handle104ConfirmPdFromIndividualYes2
    );
    intentMap.set(
        "104Confirm-Pd-From-Individual - No 2",
        handle104ConfirmPdFromIndividualNo2
    );
    intentMap.set(
        "104Confirm-Pd-From-Individual - Yes 3",
        handle104ConfirmPdFromIndividualYes3
    );
    intentMap.set(
        "104Confirm-Pd-From-Individual - No 3",
        handle104ConfirmPdFromIndividualNo3
    );
    intentMap.set(
        "122Confirm-Include-Decission-Based-On-Automated-Processing - Yes",
        handle122ConfirmIncludeDecissionBasedOnAutomatedProcessingYes
    );
    intentMap.set(
        "122Confirm-Include-Decission-Based-On-Automated-Processing - No",
        handle122ConfirmIncludeDecissionBasedOnAutomatedProcessingNo
    );
    intentMap.set(
        "122Confirm-Include-Decission-Based-On-Automated-Processing - Yes 2",
        handle122ConfirmIncludeDecissionBasedOnAutomatedProcessingYes2
    );
    intentMap.set(
        "122Confirm-Include-Decission-Based-On-Automated-Processing - No 2",
        handle122ConfirmIncludeDecissionBasedOnAutomatedProcessingNo2
    );
    intentMap.set(
        "137Confirm-Not-Use-A-Blanket-Acceptance - Yes",
        handle137ConfirmNotUseABlanketAcceptanceYes
    );
    intentMap.set(
        "137Confirm-Not-Use-A-Blanket-Acceptance - No",
        handle137ConfirmNotUseABlanketAcceptanceNo
    );
    intentMap.set(
        "137Confirm-Not-Use-A-Blanket-Acceptance - Yes 2",
        handle137ConfirmNotUseABlanketAcceptanceYes2
    );
    intentMap.set(
        "137Confirm-Not-Use-A-Blanket-Acceptance - No 2",
        handle137ConfirmNotUseABlanketAcceptanceNo2
    );
    intentMap.set(
        "151Confirm-Explain-Risk-Of-Inherent - Yes",
        handle151ConfirmExplainRiskOfInherentYes
    );
    intentMap.set(
        "151Confirm-Explain-Risk-Of-Inherent - No",
        handle151ConfirmExplainRiskOfInherentNo
    );
    intentMap.set(
        "151Confirm-Explain-Risk-Of-Inherent - Yes 2",
        handle151ConfirmExplainRiskOfInherentYes2
    );
    intentMap.set(
        "151Confirm-Explain-Risk-Of-Inherent - No 2",
        handle151ConfirmExplainRiskOfInherentNo2
    );
    intentMap.set(
        "195Confirm-Test-Of-Usability-And-Accessibility - Yes",
        handle195ConfirmTestOfUsabilityAndAccessibilityYes
    );
    intentMap.set(
        "195Confirm-Test-Of-Usability-And-Accessibility - No",
        handle195ConfirmTestOfUsabilityAndAccessibilityNo
    );
    intentMap.set(
        "195Confirm-Test-Of-Usability-And-Accessibility - Yes 2",
        handle195ConfirmTestOfUsabilityAndAccessibilityYes2
    );
    intentMap.set(
        "195Confirm-Test-Of-Usability-And-Accessibility - No 2",
        handle195ConfirmTestOfUsabilityAndAccessibilityNo2
    );
    intentMap.set(
        "123Confirm-Include-Notified-When-Changes - Yes",
        handle123ConfirmIncludeNotifiedWhenChangesYes
    );
    intentMap.set(
        "123Confirm-Include-Notified-When-Changes - No",
        handle123ConfirmIncludeNotifiedWhenChangesNo
    );
    intentMap.set(
        "123Confirm-Include-Notified-When-Changes - Yes 2",
        handle123ConfirmIncludeNotifiedWhenChangesYes2
    );
    intentMap.set(
        "123Confirm-Include-Notified-When-Changes - No 2",
        handle123ConfirmIncludeNotifiedWhenChangesNo2
    );
    intentMap.set(
        "138Confirm-Ensure-Individual-Refuse - Yes",
        handle138ConfirmEnsureIndividualRefuseYes
    );
    intentMap.set(
        "138Confirm-Ensure-Individual-Refuse - No",
        handle138ConfirmEnsureIndividualRefuseNo
    );
    intentMap.set(
        "138Confirm-Ensure-Individual-Refuse - Yes 2",
        handle138ConfirmEnsureIndividualRefuseYes2
    );
    intentMap.set(
        "138Confirm-Ensure-Individual-Refuse - No 2",
        handle138ConfirmEnsureIndividualRefuseNo2
    );
    intentMap.set(
        "152Confirm-Tell-Child-Rights - Yes",
        handle152ConfirmTellChildRightsYes
    );
    intentMap.set(
        "152Confirm-Tell-Child-Rights - No",
        handle152ConfirmTellChildRightsNo
    );
    intentMap.set(
        "152Confirm-Tell-Child-Rights - Yes 2",
        handle152ConfirmTellChildRightsYes2
    );
    intentMap.set(
        "152Confirm-Tell-Child-Rights - No 2",
        handle152ConfirmTellChildRightsNo2
    );
    intentMap.set(
        "196Provide-User-Feedback - Yes",
        handle196ProvideUserFeedbackYes
    );
    intentMap.set(
        "196Provide-User-Feedback - No",
        handle196ProvideUserFeedbackNo
    );
    intentMap.set("199Ios-Or-Android - Yes", handle199IosOrAndroidYes);
    intentMap.set("199Ios-Or-Android - No", handle199IosOrAndroidNo);
    intentMap.set(
        "124Confirm-Spd-And-Controller-And-Consent - Yes 2",
        handle124ConfirmSpdAndControllerAndConsentYes2
    );
    intentMap.set(
        "124Confirm-Spd-And-Controller-And-Consent - No 2",
        handle124ConfirmSpdAndControllerAndConsentNo2
    );
    intentMap.set(
        "124Confirm-Spd-And-Controller-And-Consent - Yes 3",
        handle124ConfirmSpdAndControllerAndConsentYes3
    );
    intentMap.set(
        "124Confirm-Spd-And-Controller-And-Consent - No 3",
        handle124ConfirmSpdAndControllerAndConsentNo3
    );
    intentMap.set(
        "139Confirm-Pd-Of-Child-And-Controller - Yes 2",
        handle139ConfirmPdOfChildAndControllerYes2
    );
    intentMap.set(
        "139Confirm-Pd-Of-Child-And-Controller - No 2",
        handle139ConfirmPdOfChildAndControllerNo2
    );
    intentMap.set(
        "139Confirm-Pd-Of-Child-And-Controller - Yes 3",
        handle139ConfirmPdOfChildAndControllerYes3
    );
    intentMap.set(
        "139Confirm-Pd-Of-Child-And-Controller - No 3",
        handle139ConfirmPdOfChildAndControllerNo3
    );
    intentMap.set(
        "153Confirm-Not-Use-Pd-To-Auto-Decision - Yes",
        handle153ConfirmNotUsePdToAutoDecisionYes
    );
    intentMap.set(
        "153Confirm-Not-Use-Pd-To-Auto-Decision - No",
        handle153ConfirmNotUsePdToAutoDecisionNo
    );
    intentMap.set(
        "153Confirm-Not-Use-Pd-To-Auto-Decision - Yes 2",
        handle153ConfirmNotUsePdToAutoDecisionYes2
    );
    intentMap.set(
        "153Confirm-Not-Use-Pd-To-Auto-Decision - No 2",
        handle153ConfirmNotUsePdToAutoDecisionNo2
    );
    intentMap.set(
        "197Provide-Post-Release - Yes",
        handle197ProvidePostReleaseYes
    );
    intentMap.set(
        "197Provide-Post-Release - No",
        handle197ProvidePostReleaseNo
    );
    intentMap.set(
        "197Provide-Post-Release - Yes 2",
        handle197ProvidePostReleaseYes2
    );
    intentMap.set(
        "197Provide-Post-Release - No 2",
        handle197ProvidePostReleaseNo2
    );
    intentMap.set("200Os-Accessibility - Yes", handle200OsAccessibilityYes);
    intentMap.set("200Os-Accessibility - No", handle200OsAccessibilityNo);
    intentMap.set(
        "201Confirm-Progressive-Web-App - Yes",
        handle201ConfirmProgressiveWebAppYes
    );
    intentMap.set(
        "201Confirm-Progressive-Web-App - No",
        handle201ConfirmProgressiveWebAppNo
    );
    intentMap.set(
        "154Confirm-Noe-Exception - Yes",
        handle154ConfirmNoeExceptionYes
    );
    intentMap.set(
        "154Confirm-Noe-Exception - No",
        handle154ConfirmNoeExceptionNo
    );
    intentMap.set(
        "154Confirm-Noe-Exception - Yes 2",
        handle154ConfirmNoeExceptionYes2
    );
    intentMap.set(
        "154Confirm-Noe-Exception - No 2",
        handle154ConfirmNoeExceptionNo2
    );
    intentMap.set(
        "198Provide-Schedule-Of-Improvement - Yes",
        handle198ProvideScheduleOfImprovementYes
    );
    intentMap.set(
        "198Provide-Schedule-Of-Improvement - No",
        handle198ProvideScheduleOfImprovementNo
    );
    intentMap.set(
        "198Provide-Schedule-Of-Improvement - Yes 2",
        handle198ProvideScheduleOfImprovementYes2
    );
    intentMap.set(
        "198Provide-Schedule-Of-Improvement - No 2",
        handle198ProvideScheduleOfImprovementNo2
    );
    intentMap.set(
        "201Confirm-Progressive-Web-App - Yes 2",
        handle201ConfirmProgressiveWebAppYes2
    );
    intentMap.set(
        "201Confirm-Progressive-Web-App - No 2",
        handle201ConfirmProgressiveWebAppNo2
    );
    intentMap.set(
        "201Confirm-Progressive-Web-App - Yes 3",
        handle201ConfirmProgressiveWebAppYes3
    );
    intentMap.set(
        "201Confirm-Progressive-Web-App - No 3",
        handle201ConfirmProgressiveWebAppNo3
    );
    intentMap.set(
        "202Confirm-Comply-With-Baseline - Yes",
        handle202ConfirmComplyWithBaselineYes
    );
    intentMap.set(
        "202Confirm-Comply-With-Baseline - No",
        handle202ConfirmComplyWithBaselineNo
    );
    intentMap.set("204Confirm-Website - Yes", handle204ConfirmWebsiteYes);
    intentMap.set("204Confirm-Website - No", handle204ConfirmWebsiteNo);
    intentMap.set(
        "155Confrim-Stop-Profiling - Yes",
        handle155ConfrimStopProfilingYes
    );
    intentMap.set(
        "155Confrim-Stop-Profiling - No",
        handle155ConfrimStopProfilingNo
    );
    intentMap.set(
        "155Confrim-Stop-Profiling - Yes 2",
        handle155ConfrimStopProfilingYes2
    );
    intentMap.set(
        "155Confrim-Stop-Profiling - No 2",
        handle155ConfrimStopProfilingNo2
    );
    intentMap.set("199Ios-Or-Android - Yes 2", handle199IosOrAndroidYes2);
    intentMap.set("199Ios-Or-Android - No 2", handle199IosOrAndroidNo2);
    intentMap.set("199Ios-Or-Android - Yes 3", handle199IosOrAndroidYes3);
    intentMap.set("199Ios-Or-Android - No 3", handle199IosOrAndroidNo3);
    intentMap.set(
        "203Confirm-Accessibility-Testing - Yes",
        handle203ConfirmAccessibilityTestingYes
    );
    intentMap.set(
        "203Confirm-Accessibility-Testing - No",
        handle203ConfirmAccessibilityTestingNo
    );
    intentMap.set(
        "203Confirm-Accessibility-Testing - Yes 2",
        handle203ConfirmAccessibilityTestingYes2
    );
    intentMap.set(
        "203Confirm-Accessibility-Testing - No 2",
        handle203ConfirmAccessibilityTestingNo2
    );
    intentMap.set("205Confirm-Responsive - Yes", handle205ConfirmResponsiveYes);
    intentMap.set("205Confirm-Responsive - No", handle205ConfirmResponsiveNo);
    intentMap.set("212Confirm-Expose-Api - Yes", handle212ConfirmExposeApiYes);
    intentMap.set("212Confirm-Expose-Api - No", handle212ConfirmExposeApiNo);
    intentMap.set(
        "156Confirm-Marketing-Child-S-Pd - Yes",
        handle156ConfirmMarketingChildSPdYes
    );
    intentMap.set(
        "156Confirm-Marketing-Child-S-Pd - No",
        handle156ConfirmMarketingChildSPdNo
    );
    intentMap.set(
        "156Confirm-Marketing-Child-S-Pd - Yes 2",
        handle156ConfirmMarketingChildSPdYes2
    );
    intentMap.set(
        "156Confirm-Marketing-Child-S-Pd - No 2",
        handle156ConfirmMarketingChildSPdNo2
    );
    intentMap.set("204Confirm-Website - Yes 2", handle204ConfirmWebsiteYes2);
    intentMap.set("204Confirm-Website - No 2", handle204ConfirmWebsiteNo2);
    intentMap.set("204Confirm-Website - Yes 3", handle204ConfirmWebsiteYes3);
    intentMap.set("204Confirm-Website - No 3", handle204ConfirmWebsiteNo3);
    intentMap.set("206Confirm-Wcag2-1 - Yes", handle206ConfirmWcag21Yes);
    intentMap.set("206Confirm-Wcag2-1 - No", handle206ConfirmWcag21No);
    intentMap.set("206Confirm-Wcag2-1 - Yes 2", handle206ConfirmWcag21Yes2);
    intentMap.set("206Confirm-Wcag2-1 - No 2", handle206ConfirmWcag21No2);
    intentMap.set("213Api-Adhere-To-Gds - Yes", handle213ApiAdhereToGdsYes);
    intentMap.set("213Api-Adhere-To-Gds - No", handle213ApiAdhereToGdsNo);
    intentMap.set(
        "214Capable-In-Standard-Format - Yes",
        handle214CapableInStandardFormatYes
    );
    intentMap.set(
        "214Capable-In-Standard-Format - No",
        handle214CapableInStandardFormatNo
    );
    intentMap.set(
        "157Confirm-Take-Guidance-Into-Account - Yes",
        handle157ConfirmTakeGuidanceIntoAccountYes
    );
    intentMap.set(
        "157Confirm-Take-Guidance-Into-Account - No",
        handle157ConfirmTakeGuidanceIntoAccountNo
    );
    intentMap.set(
        "157Confirm-Take-Guidance-Into-Account - Yes 2",
        handle157ConfirmTakeGuidanceIntoAccountYes2
    );
    intentMap.set(
        "157Confirm-Take-Guidance-Into-Account - No 2",
        handle157ConfirmTakeGuidanceIntoAccountNo2
    );
    intentMap.set(
        "207Provide-Text-Equivalence - Yes",
        handle207ProvideTextEquivalenceYes
    );
    intentMap.set(
        "207Provide-Text-Equivalence - No",
        handle207ProvideTextEquivalenceNo
    );
    intentMap.set(
        "207Provide-Text-Equivalence - Yes 2",
        handle207ProvideTextEquivalenceYes2
    );
    intentMap.set(
        "207Provide-Text-Equivalence - No 2",
        handle207ProvideTextEquivalenceNo2
    );
    intentMap.set(
        "214Capable-In-Standard-Format - Yes 2",
        handle214CapableInStandardFormatYes2
    );
    intentMap.set(
        "214Capable-In-Standard-Format - No 2",
        handle214CapableInStandardFormatNo2
    );
    intentMap.set(
        "214Capable-In-Standard-Format - Yes 3",
        handle214CapableInStandardFormatYes3
    );
    intentMap.set(
        "214Capable-In-Standard-Format - No 3",
        handle214CapableInStandardFormatNo3
    );
    intentMap.set(
        "215Confirm-Wearable-Device - Yes",
        handle215ConfirmWearableDeviceYes
    );
    intentMap.set(
        "215Confirm-Wearable-Device - No",
        handle215ConfirmWearableDeviceNo
    );
    intentMap.set(
        "215Confirm-Wearable-Device - Yes 2",
        handle215ConfirmWearableDeviceYes2
    );
    intentMap.set(
        "215Confirm-Wearable-Device - No 2",
        handle215ConfirmWearableDeviceNo2
    );
    intentMap.set(
        "158Confirm-Stop-Pd-For-Marketing - Yes",
        handle158ConfirmStopPdForMarketingYes
    );
    intentMap.set(
        "158Confirm-Stop-Pd-For-Marketing - No",
        handle158ConfirmStopPdForMarketingNo
    );
    intentMap.set(
        "158Confirm-Stop-Pd-For-Marketing - Yes 2",
        handle158ConfirmStopPdForMarketingYes2
    );
    intentMap.set(
        "158Confirm-Stop-Pd-For-Marketing - No 2",
        handle158ConfirmStopPdForMarketingNo2
    );
    intentMap.set(
        "208Confirm-Testing-On-Web - Yes",
        handle208ConfirmTestingOnWebYes
    );
    intentMap.set(
        "208Confirm-Testing-On-Web - No",
        handle208ConfirmTestingOnWebNo
    );
    intentMap.set(
        "208Confirm-Testing-On-Web - Yes 2",
        handle208ConfirmTestingOnWebYes2
    );
    intentMap.set(
        "208Confirm-Testing-On-Web - No 2",
        handle208ConfirmTestingOnWebNo2
    );
    intentMap.set(
        "216Provide-Evidence-With-Iso-Ieee - Yes",
        handle216ProvideEvidenceWithIsoIeeeYes
    );
    intentMap.set(
        "216Provide-Evidence-With-Iso-Ieee - No",
        handle216ProvideEvidenceWithIsoIeeeNo
    );
    intentMap.set(
        "217Confirm-Source-Code-Controlled-With-Audited - Yes",
        handle217ConfirmSourceCodeControlledWithAuditedYes
    );
    intentMap.set(
        "217Confirm-Source-Code-Controlled-With-Audited - No",
        handle217ConfirmSourceCodeControlledWithAuditedNo
    );
    intentMap.set(
        "159Confirm-Comply-With-Marketing - Yes",
        handle159ConfirmComplyWithMarketingYes
    );
    intentMap.set(
        "159Confirm-Comply-With-Marketing - No",
        handle159ConfirmComplyWithMarketingNo
    );
    intentMap.set(
        "159Confirm-Comply-With-Marketing - Yes 2",
        handle159ConfirmComplyWithMarketingYes2
    );
    intentMap.set(
        "159Confirm-Comply-With-Marketing - No 2",
        handle159ConfirmComplyWithMarketingNo2
    );
    intentMap.set(
        "209Confirm-Keyboard-Only-Control - Yes",
        handle209ConfirmKeyboardOnlyControlYes
    );
    intentMap.set(
        "209Confirm-Keyboard-Only-Control - No",
        handle209ConfirmKeyboardOnlyControlNo
    );
    intentMap.set(
        "209Confirm-Keyboard-Only-Control - Yes 2",
        handle209ConfirmKeyboardOnlyControlYes2
    );
    intentMap.set(
        "209Confirm-Keyboard-Only-Control - No 2",
        handle209ConfirmKeyboardOnlyControlNo2
    );
    intentMap.set(
        "217Confirm-Source-Code-Controlled-With-Audited - Yes 2",
        handle217ConfirmSourceCodeControlledWithAuditedYes2
    );
    intentMap.set(
        "217Confirm-Source-Code-Controlled-With-Audited - No 2",
        handle217ConfirmSourceCodeControlledWithAuditedNo2
    );
    intentMap.set(
        "217Confirm-Source-Code-Controlled-With-Audited - Yes 3",
        handle217ConfirmSourceCodeControlledWithAuditedYes3
    );
    intentMap.set(
        "217Confirm-Source-Code-Controlled-With-Audited - No 3",
        handle217ConfirmSourceCodeControlledWithAuditedNo3
    );
    intentMap.set("218Confirm-Iso-9001 - Yes", handle218ConfirmIso9001Yes);
    intentMap.set("218Confirm-Iso-9001 - No", handle218ConfirmIso9001No);
    intentMap.set("218Confirm-Iso-9001 - Yes 2", handle218ConfirmIso9001Yes2);
    intentMap.set("218Confirm-Iso-9001 - No 2", handle218ConfirmIso9001No2);
    intentMap.set(
        "160Confirm-Not-Offer-Iss - Yes",
        handle160ConfirmNotOfferIssYes
    );
    intentMap.set(
        "160Confirm-Not-Offer-Iss - No",
        handle160ConfirmNotOfferIssNo
    );
    intentMap.set(
        "160Confirm-Not-Offer-Iss - Yes 2",
        handle160ConfirmNotOfferIssYes2
    );
    intentMap.set(
        "160Confirm-Not-Offer-Iss - No 2",
        handle160ConfirmNotOfferIssNo2
    );
    intentMap.set(
        "210Provide-Accessibility-Testing - Yes",
        handle210ProvideAccessibilityTestingYes
    );
    intentMap.set(
        "210Provide-Accessibility-Testing - No",
        handle210ProvideAccessibilityTestingNo
    );
    intentMap.set(
        "210Provide-Accessibility-Testing - Yes 2",
        handle210ProvideAccessibilityTestingYes2
    );
    intentMap.set(
        "210Provide-Accessibility-Testing - No 2",
        handle210ProvideAccessibilityTestingNo2
    );
    intentMap.set(
        "219Confirm-Testing-Accreditation - Yes",
        handle219ConfirmTestingAccreditationYes
    );
    intentMap.set(
        "219Confirm-Testing-Accreditation - No",
        handle219ConfirmTestingAccreditationNo
    );
    intentMap.set(
        "219Confirm-Testing-Accreditation - Yes 2",
        handle219ConfirmTestingAccreditationYes2
    );
    intentMap.set(
        "219Confirm-Testing-Accreditation - No 2",
        handle219ConfirmTestingAccreditationNo2
    );
    intentMap.set(
        "161Provide-13-Years-Old - Yes",
        handle161Provide13YearsOldYes
    );
    intentMap.set("161Provide-13-Years-Old - No", handle161Provide13YearsOldNo);
    intentMap.set(
        "161Provide-13-Years-Old - Yes 2",
        handle161Provide13YearsOldYes2
    );
    intentMap.set(
        "161Provide-13-Years-Old - No 2",
        handle161Provide13YearsOldNo2
    );
    intentMap.set(
        "211Provide-Evidence-Improving-Accessibility - Yes",
        handle211ProvideEvidenceImprovingAccessibilityYes
    );
    intentMap.set(
        "211Provide-Evidence-Improving-Accessibility - No",
        handle211ProvideEvidenceImprovingAccessibilityNo
    );
    intentMap.set(
        "212Confirm-Expose-Api - Yes 2",
        handle212ConfirmExposeApiYes2
    );
    intentMap.set("212Confirm-Expose-Api - No 2", handle212ConfirmExposeApiNo2);
    intentMap.set(
        "220Confirm-Issues-In-All-Tests - Yes",
        handle220ConfirmIssuesInAllTestsYes
    );
    intentMap.set(
        "220Confirm-Issues-In-All-Tests - No",
        handle220ConfirmIssuesInAllTestsNo
    );
    intentMap.set(
        "220Confirm-Issues-In-All-Tests - Yes 2",
        handle220ConfirmIssuesInAllTestsYes2
    );
    intentMap.set(
        "220Confirm-Issues-In-All-Tests - No 2",
        handle220ConfirmIssuesInAllTestsNo2
    );
    intentMap.set("162Provide-Effort - Yes", handle162ProvideEffortYes);
    intentMap.set("162Provide-Effort - No", handle162ProvideEffortNo);
    intentMap.set("162Provide-Effort - Yes 2", handle162ProvideEffortYes2);
    intentMap.set("162Provide-Effort - No 2", handle162ProvideEffortNo2);
    intentMap.set(
        "212Confirm-Expose-Api - Yes 3",
        handle212ConfirmExposeApiYes3
    );
    intentMap.set("212Confirm-Expose-Api - No 3", handle212ConfirmExposeApiNo3);
    intentMap.set(
        "212Confirm-Expose-Api - Yes 4",
        handle212ConfirmExposeApiYes4
    );
    intentMap.set("212Confirm-Expose-Api - No 4", handle212ConfirmExposeApiNo4);
    intentMap.set("221Confirm-Rollback - Yes", handle221ConfirmRollbackYes);
    intentMap.set("221Confirm-Rollback - No", handle221ConfirmRollbackNo);
    intentMap.set("221Confirm-Rollback - Yes 2", handle221ConfirmRollbackYes2);
    intentMap.set("221Confirm-Rollback - No 2", handle221ConfirmRollbackNo2);
    intentMap.set("163Confirm-Age-Limits - Yes", handle163ConfirmAgeLimitsYes);
    intentMap.set("163Confirm-Age-Limits - No", handle163ConfirmAgeLimitsNo);
    intentMap.set(
        "163Confirm-Age-Limits - Yes 2",
        handle163ConfirmAgeLimitsYes2
    );
    intentMap.set("163Confirm-Age-Limits - No 2", handle163ConfirmAgeLimitsNo2);
    intentMap.set(
        "222Provide-How-Rollback - Yes",
        handle222ProvideHowRollbackYes
    );
    intentMap.set(
        "222Provide-How-Rollback - No",
        handle222ProvideHowRollbackNo
    );
    intentMap.set(
        "223Confirm-Monitor-Running-Of-System - Yes",
        handle223ConfirmMonitorRunningOfSystemYes
    );
    intentMap.set(
        "223Confirm-Monitor-Running-Of-System - No",
        handle223ConfirmMonitorRunningOfSystemNo
    );
    intentMap.set(
        "164Confirm-Review-Age-Verification - Yes",
        handle164ConfirmReviewAgeVerificationYes
    );
    intentMap.set(
        "164Confirm-Review-Age-Verification - No",
        handle164ConfirmReviewAgeVerificationNo
    );
    intentMap.set(
        "164Confirm-Review-Age-Verification - Yes 2",
        handle164ConfirmReviewAgeVerificationYes2
    );
    intentMap.set(
        "164Confirm-Review-Age-Verification - No 2",
        handle164ConfirmReviewAgeVerificationNo2
    );
    intentMap.set(
        "223Confirm-Monitor-Running-Of-System - Yes 2",
        handle223ConfirmMonitorRunningOfSystemYes2
    );
    intentMap.set(
        "223Confirm-Monitor-Running-Of-System - No 2",
        handle223ConfirmMonitorRunningOfSystemNo2
    );
    intentMap.set(
        "223Confirm-Monitor-Running-Of-System - Yes 3",
        handle223ConfirmMonitorRunningOfSystemYes3
    );
    intentMap.set(
        "223Confirm-Monitor-Running-Of-System - No 3",
        handle223ConfirmMonitorRunningOfSystemNo3
    );
    intentMap.set(
        "224Confirm-Documented-Roadmap - Yes",
        handle224ConfirmDocumentedRoadmapYes
    );
    intentMap.set(
        "224Confirm-Documented-Roadmap - No",
        handle224ConfirmDocumentedRoadmapNo
    );
    intentMap.set(
        "224Confirm-Documented-Roadmap - Yes 2",
        handle224ConfirmDocumentedRoadmapYes2
    );
    intentMap.set(
        "224Confirm-Documented-Roadmap - No 2",
        handle224ConfirmDocumentedRoadmapNo2
    );
    intentMap.set(
        "165Confirm-Not-Seek-Parental-Consent - Yes",
        handle165ConfirmNotSeekParentalConsentYes
    );
    intentMap.set(
        "165Confirm-Not-Seek-Parental-Consent - No",
        handle165ConfirmNotSeekParentalConsentNo
    );
    intentMap.set(
        "165Confirm-Not-Seek-Parental-Consent - Yes 2",
        handle165ConfirmNotSeekParentalConsentYes2
    );
    intentMap.set(
        "165Confirm-Not-Seek-Parental-Consent - No 2",
        handle165ConfirmNotSeekParentalConsentNo2
    );
    intentMap.set(
        "225Confirm-Details-Of-Development - Yes",
        handle225ConfirmDetailsOfDevelopmentYes
    );
    intentMap.set(
        "225Confirm-Details-Of-Development - No",
        handle225ConfirmDetailsOfDevelopmentNo
    );
    intentMap.set(
        "226Confirm-Road-Map-For-Future - Yes",
        handle226ConfirmRoadMapForFutureYes
    );
    intentMap.set(
        "226Confirm-Road-Map-For-Future - No",
        handle226ConfirmRoadMapForFutureNo
    );
    intentMap.set("166Confirm-Cookies - Yes 2", handle166ConfirmCookiesYes2);
    intentMap.set("166Confirm-Cookies - No 2", handle166ConfirmCookiesNo2);
    intentMap.set("166Confirm-Cookies - Yes 3", handle166ConfirmCookiesYes3);
    intentMap.set("166Confirm-Cookies - No 3", handle166ConfirmCookiesNo3);
    intentMap.set(
        "226Confirm-Road-Map-For-Future - Yes 2",
        handle226ConfirmRoadMapForFutureYes2
    );
    intentMap.set(
        "226Confirm-Road-Map-For-Future - No 2",
        handle226ConfirmRoadMapForFutureNo2
    );
    intentMap.set(
        "226Confirm-Road-Map-For-Future - Yes 3",
        handle226ConfirmRoadMapForFutureYes3
    );
    intentMap.set(
        "226Confirm-Road-Map-For-Future - No 3",
        handle226ConfirmRoadMapForFutureNo3
    );
    intentMap.set(
        "227Provide-Ensure-Availability - Yes",
        handle227ProvideEnsureAvailabilityYes
    );
    intentMap.set(
        "227Provide-Ensure-Availability - No",
        handle227ProvideEnsureAvailabilityNo
    );
    intentMap.set("228Decommissioning - Yes", handle228DecommissioningYes);
    intentMap.set("228Decommissioning - No", handle228DecommissioningNo);
    intentMap.set("228Decommissioning - Yes 2", handle228DecommissioningYes2);
    intentMap.set("228Decommissioning - No 2", handle228DecommissioningNo2);
    intentMap.set("228Decommissioning - Yes 3", handle228DecommissioningYes3);
    intentMap.set("228Decommissioning - No 3", handle228DecommissioningNo3);
    intentMap.set(
        "229Provide-Decommissioning - Yes",
        handle229ProvideDecommissioningYes
    );
    intentMap.set(
        "229Provide-Decommissioning - No",
        handle229ProvideDecommissioningNo
    );
    intentMap.set("End - Yes 5", handleEndYes5);
    intentMap.set("End - No 5", handleEndNo5);
    intentMap.set(
        "230Provide-Identifiable-Data - Yes",
        handle230ProvideIdentifiableDataYes
    );
    intentMap.set(
        "230Provide-Identifiable-Data - No",
        handle230ProvideIdentifiableDataNo
    );
    intentMap.set(
        "230Provide-Identifiable-Data - Yes 2",
        handle230ProvideIdentifiableDataYes2
    );
    intentMap.set(
        "230Provide-Identifiable-Data - No 2",
        handle230ProvideIdentifiableDataNo2
    );
    intentMap.set(
        "231Provide-Retained-Identifiable - Yes",
        handle231ProvideRetainedIdentifiableYes
    );
    intentMap.set(
        "231Provide-Retained-Identifiable - No",
        handle231ProvideRetainedIdentifiableNo
    );
    intentMap.set(
        "231Provide-Retained-Identifiable - Yes 2",
        handle231ProvideRetainedIdentifiableYes2
    );
    intentMap.set(
        "231Provide-Retained-Identifiable - No 2",
        handle231ProvideRetainedIdentifiableNo2
    );
    intentMap.set("End - Yes 6", handleEndYes6);
    intentMap.set("End - No 6", handleEndNo6);
    intentMap.set("End - Yes 7", handleEndYes7);
    intentMap.set("End - No 7", handleEndNo7);
    intentMap.set("Default Fallback Intent", handleDefaultFallbackIntent);
    intentMap.set("Clarification Intent", handleClarification);
    function handleEmailConversationHistory(agent) {
        agent.add("I'll get right on that");
    }
    function handleGeneralQuestion(agent) {
        const parameter = request.body.queryResult.parameters;

        if (parameter["regulation-body"] === "MHRA") {
            agent.add(
                "The Medicines and Healthcare products Regulatory Agency (MHRA) regulates medicines, medical devices and blood components for transfusion in the United Kingdom."
            );
        } else if (parameter["regulation-body"] === "NICE") {
            agent.add(
                "The National Institute for Health and Care Excellence (NICE) provides national guidance and advice to improve health and social care."
            );
        } else if (parameter["regulation-body"] === "NHSD") {
            agent.add(
                "NHS Digital is the national provider of information, data and IT systems for commissioners, analysts and clinicians in health and social care. They work with partners across the health and social care system to ensure information flows efficiently and securely."
            );
        }
    }

    function handleJumpToComplianceBody(agent){
        const parameter = request.body.queryResult.parameters;
        const requestContexts = request.body.queryResult.outputContexts;
        const mostRecentContextNames = getRecentContextNames(requestContexts);
        removeOldContexts(agent, requestContexts, mostRecentContextNames);
        if (parameter["regulation-body"] === "MHRA") {            
            agent.context.set({name:"know-class-of-medical-device-initial", lifespan:"3"})
            agent.add(
                "Do you know which class of Medical Device your software belongs to according to MHRA rules?"
            );
        } else if (parameter["regulation-body"] === "NICE") {
            agent.context.set({name:"know-class-of-medical-device", lifespan:"3"})
            agent.context.set({name:"know-class-of-medical-device-yes", lifespan:"3"})
            agent.add(
                "Great! You’re all set! Now, let's move on to NICE. Can your Digital Healthcare Technology (DHT) be directly downloaded or purchased by users? Or, is your Digital Healtcare Technology (DHT) designed with artificial intelligence using adaptive algorithms (that is, algorithms which continually and automatically change)? "
            );
        } else if (parameter["regulation-body"] === "NHSD") {
            agent.context.set({name:"proceed-to-nhsd", lifespan:"3"})
            agent.context.set({name:"proceed-to-nhsd-yes", lifespan:"3"})
            agent.add(
                "Great let’s get started. Is your product available to the public and can you provide URL(s) to the app store location(s)?"
            );
        }
    }
    intentMap.set("Email Conversation History", handleEmailConversationHistory);
    intentMap.set("General Question", handleGeneralQuestion);
    intentMap.set("Jump To Compliance Body", handleJumpToComplianceBody)
    agent.handleRequest(intentMap);
});

module.exports = router;
