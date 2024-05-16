const express = require('express')
const router = express.Router();
const fetchadmin = require("../middleware/fetchadmin")
const Orders = require("../Models/Orders")
const Feedback = require("../Models/Feedback")
const ContactUs = require("../Models/ContactUs")

// Route 1) Get all orders using: GET "/api/adminAccess/fetchallorders". login require
router.get("/fetchallorders", fetchadmin,
    async (req, res) => {
        try {
            const orders = await Orders.find()
            res.json(orders)
        } catch (error) {
            console.log("Error user login:", error)
            res.status(500).send("Internal server error")
        }
    }
)

// Route 2) Get all feedbacks using: GET "/api/adminAccess/fetchallfeedbacks". login require
router.get("/fetchallfeedbacks", fetchadmin,
    async (req, res) => {
        try {
            const orders = await Feedback.find()
            res.json(orders)
        } catch (error) {
            console.log("Error user login:", error)
            res.status(500).send("Internal server error")
        }
    }
)

// Route 3) Get all contact requests using: GET "/api/adminAccess/fetchallcontactus". login require
router.get("/fetchallcontactus", fetchadmin,
    async (req, res) => {
        try {
            const orders = await ContactUs.find()
            res.json(orders)
        } catch (error) {
            console.log("Error user login:", error)
            res.status(500).send("Internal server error")
        }
    }
)

module.exports = router