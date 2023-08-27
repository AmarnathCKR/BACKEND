const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const secretKey = "secretkey";
    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {

            return res.status(409).send({ data: "User access denied" });
        } else {

            req.params.id = decoded._id;
            return next();

        }
    });
};

module.exports = userAuth;
