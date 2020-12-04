const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
module.exports = (forRegister) => {
    return function (req, res, next) {
        if (req.headers.token) {
            if (typeof req.headers.token == "string" && req.headers.token.trim() !== "") {
                jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, payload) => {
                    if (err) {
                        return res.status(401).json({ status: 401, errors: true, data: null, message: "Invalid token" });
                    } else {
                        User.findById(payload.user).populate("role").lean().exec().then(d => {
                            if (d) {
                                delete d.password;
                                if (forRegister && d.isActive)
                                    return res.status(200).json({ status: 401, errors: false, data: { user: d }, message: "You are already logged in" });
                                if (forRegister || (!d.isActive))
                                    return res.status(401).json({ status: 401, errors: false, data: null, message: "Your account has been disabled" });
                                req.user = d;
                                next();
                            } else {
                                return res.status(401).json({ status: 401, errors: false, data: null, message: "Your token is not valid anymore" });
                            }
                        }).catch(e => res.status(401).json({ status: 401, errors: false, data: null, message: "Internal Server Error" }))
                    }
                })
            }
        } else {
            if (forRegister)
                return next();
            res.status(401).json({ status: 401, errors: false, data: null, message: "Unauthorized" });
        }
    }
}