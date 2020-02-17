const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const mongoUtil = require("../mongoUtil");
const db = mongoUtil.getDbData();
var ObjectId = require("mongodb").ObjectId;

module.exports = function(passport) {
    passport.use(
        new LocalStrategy(
            { usernameField: "username" },
            (username, password, done) => {
                // Match user
                db.collection("test")
                    .findOne({
                        username
                    })
                    .then(user => {
                        if (!user) {
                            return done(null, false, {
                                message: "That username is not registered"
                            });
                        }

                        // Match password
                        bcrypt.compare(
                            password,
                            user.password,
                            (err, isMatch) => {
                                if (err) throw err;
                                if (isMatch) {
                                    return done(null, user);
                                } else {
                                    return done(null, false, {
                                        message: "Password incorrect"
                                    });
                                }
                            }
                        );
                    });
            }
        )
    );
    passport.serializeUser(function(user, done) {
        console.log("*** serializeUser called, user: ");
        console.log(user); // the whole raw user object!
        console.log("---------");
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        console.log("DeserializeUser called");
        id = new ObjectId(id);

        db.collection("test").findOne({ _id: id }, function(err, user) {
            console.log("*** Deserialize user, user:");
            console.log(user);
            done(err, user);
        });
    });
};
