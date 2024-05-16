const express = require('express')
const router = express.Router();
const Admin = require("../Models/Admin")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchadmin = require("../middleware/fetchadmin")

//this is the secret string we use to sign the token
const JWR_SECRET = "IamAgood$Boy2"

// Route 1) create a admin using: post "/api/adminAuth/createuser". No login require
router.post("/createuser", [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
],
    async (req, res) => {
        let success = false;

        //if there are errors return bad request and error message
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success,error: errors.array() })
        }

        try {
            //check if the user with the same email exist already
            let admin = await Admin.findOne({ email: req.body.email })
            if (admin) {
                return res.status(400).json({success, error: "Sorry user with the same email already exist" })
            }

            //creating secreat password by adding salt with it
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            //createing an cuser
            admin = await Admin.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            })

            //send user token as the response for validating in the future for login session
            const data = {
                user: {
                    id: admin.id
                }
            }
            const authToken = jwt.sign(data, JWR_SECRET)
            success = true
            res.json({success, authToken })
            // res.json({admin})

        } catch (error) {
            console.log("Error creating new user:", error.message)
            res.status(500).send("Internal server error")
        }
    }
);

// Route 2) Authenticate a user using: post "/api/adminAuth/login". No login require
router.post("/login", [
    body('email', "enter a valid email").isEmail(),
    body('password', "password cannot be blank").exists()
],
    async (req, res) => {
        let success = false;
        //if there are errors return bad request and error message
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() })
        }

        //Now as user has entered both email and password we have to check if the user is in out DB
        const { email, password } = req.body;

        try {
            let admin = await Admin.findOne({ email })
            if (!admin) {
                return res.status(400).json({ success, error: "Please try to login with correct credentials" });
            }

            //we use bcryt package to compare token by extracting password from the req body
            //bcrypt.compare method takes string and hash as arguments and returns if it matches
            const passwordCompare = await bcrypt.compare(password, admin.password)
            if (!passwordCompare) {
                return res.status(400).json({ success, error: "Please try to login with correct credentials" });
            }

            //send user token as the response for validating in the future for login session
            const data = {
                user: {
                    id: admin.id
                }
            }
            const authToken = jwt.sign(data, JWR_SECRET)
            success = true
            res.json({success, authToken })

        } catch (error) {
            console.log("Error user login:", error)
            res.status(500).send("Internal server error")
        }
    }
);

// Route 3) Get loggedin user details using: post "/api/adminAuth/getuser". login require

router.post("/getuser", fetchadmin, async (req, res) => {
    try {
        const adminid = req.user.id;
        const admin = await Admin.findById(adminid).select("-password");
        res.send(admin);
    } catch (error) {
        console.log("Error user login:", error)
        res.status(500).send("Internal server error")
    }
}
);

module.exports = router