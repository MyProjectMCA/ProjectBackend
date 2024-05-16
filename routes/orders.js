const express = require('express')
const router = express.Router();
const fetchuser = require("../middleware/fetchuser")
const Orders = require("../Models/Orders")
const { body, validationResult } = require('express-validator');

// Route 1) Get all orders using: GET "/api/orders/fetchallorders". login require
router.get("/fetchallorders", fetchuser,
    async (req, res) => {
        try {
            const orders = await Orders.find({ user: req.user.id })
            res.json(orders)
        } catch (error) {
            console.log("Error user login:", error)
            res.status(500).send("Internal server error")
        }
    }
)

// Route 2) Add a new order using: POST "/api/orders/addorder". login require
router.post("/addorder", fetchuser, [
    body('foodList', 'enter a valid order').notEmpty()
],
    async (req, res) => {

        try {
            const { foodList,orderDetails } = req.body;

            //if there are errors return bad request and error message
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array() })
            }

            // create the Note object with data from request body and user id of logged in user
            const order = new Orders({
                foodList,orderDetails, user: req.user.id
            })

            const saveOrder = await order.save()

            res.json(saveOrder)
        } catch (error) {
            console.log("Error user login:", error)
            res.status(500).send("Internal server error")
        }
    }
)

// Route 3) update an exsisting note using: PUT "/api/orders/updateorder". login require
router.put("/updateorder/:id", fetchuser,
    async (req, res) => {
        const { orderDetails } = req.body;

        try {
            //create new note object
            const newOrder = {};
            if (orderDetails) { newOrder.orderDetails = orderDetails }

            //find the note to be updated and update it
            let order = await Orders.findById(req.params.id);
            if (!order) { return res.status(400).send("Not Found") }

            //check if the user attempting to edit is the same person logged in and he is only updating his own note
            if (order.user.toString() !== req.user.id) {
                return resonse.status(401).send("Not Allowed")
            }

            //find the note to be updated and pass new values as args
            order = await Orders.findByIdAndUpdate(req.params.id, { $set: newOrder }, { new: true })

            res.json({ order });
        } catch (error) {
            console.log("Error user login:", error)
            res.status(500).send("Internal server error")
        }
    }
)


// Route 4) delete an exsisting order using: Delete "/api/orders/deleteoder". login require
router.delete("/deleteoder/:id", fetchuser,
    async (req, res) => {

        try {
            //find the note to be deleted and delete it
            let order = await Orders.findById(req.params.id);
            if (!order) { return res.status(400).send("Not Found") }

            //Allow deletion only if the user ownes this note
            if (order.user.toString() !== req.user.id) {
                return resonse.status(401).send("Not Allowed")
            }

            //find the note to be updated and pass new values as args
            order = await Orders.findByIdAndDelete(req.params.id)

            res.json({ "Success": "order has been deleted", order });
        } catch (error) {
            console.log("Error user login:", error)
            res.status(500).send("Internal server error")
        }

    }
)




module.exports = router