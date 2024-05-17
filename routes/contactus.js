const express = require('express')
const router = express.Router();
const fetchuser = require("../middleware/fetchuser")
const contactus = require("../Models/ContactUs")
const { body, validationResult } = require('express-validator');


// Route 1) Add a contactus using: POST "/api/contactus/addcontactus". login require
router.post("/addcontactus", fetchuser, [
    body('name', 'enter a valid title').isLength({ min: 3 }),
    body('email', "enter a valid email").isEmail(),
    body('message', 'message must be at lease 5 characters').isLength({ min: 1 })
],
    async (req, res) => {

        try {
            const { name, email, message } = req.body;

            //if there are errors return bad request and error message
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array() })
            }

            // create the contact object with data from request body and user id of logged in user
            const newContactus = new contactus({
                name, email, message, user: req.user.id
            })

            const saveContactus = await newContactus.save()

            res.json(saveContactus)
        } catch (error) {
            console.log("Error user login:", error)
            res.status(500).send("Internal server error")
        }
    }
)

module.exports = router