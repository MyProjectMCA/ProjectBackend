const express = require('express')
const router = express.Router();
const fetchuser = require("../middleware/fetchuser")
const Feedback = require("../Models/Feedback")
const { body, validationResult } = require('express-validator');


// Route 1) Add a feedback using: POST "/api/feedback/addFeedback". login require
router.post("/addFeedback", fetchuser, [
    body('name', 'enter a valid title').isLength({ min: 3 }),
    body('email', "enter a valid email").isEmail(),
    body('feedback', 'feedback must be at lease 5 characters').isLength({ min: 5 }),
    body('rating', 'rating must be at lease 1').isLength({ min: 1 })
],
    async (req, res) => {

        try {
            const { name, email, feedback, rating } = req.body;

            //if there are errors return bad request and error message
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array() })
            }

            // create the Note object with data from request body and user id of logged in user
            const newfeedback = new Feedback({
                name, email, feedback, rating, user: req.user.id
            })

            const saveFeedback = await newfeedback.save()

            res.json(saveFeedback)
        } catch (error) {
            console.log("Error user login:", error)
            res.status(500).send("Internal server error")
        }
    }
)

module.exports = router