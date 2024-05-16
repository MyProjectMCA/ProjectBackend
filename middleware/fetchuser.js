var jwt = require('jsonwebtoken');
const JWR_SECRET = "IamAgood$Boy"

const fetchuser = (req, res, next) => {
    //get user from the jwt token and add id to req object
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ message: "Please authenticate with valid token" })
    }

    try {
        const data = jwt.verify(token, JWR_SECRET)
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).send({ message: "Please authenticate with valid token" })
    }
}

module.exports = fetchuser;