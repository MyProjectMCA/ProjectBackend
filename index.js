const connectToMongo =  require("./db");
const express = require('express')
var cors = require('cors')

const app = express()
const port = 5000

//to able to hit api directly from the browser
app.use(cors())

//middle-vare to use (req body in api's) or any json format in api's
app.use(express.json())

//available routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/adminAuth", require("./routes/adminAuth"))
app.use("/api/orders", require("./routes/orders"))
app.use("/api/adminAccess", require("./routes/adminAccess"))
app.use("/api/feedback", require("./routes/feedback"))
app.use("/api/contactus", require("./routes/contactus"))

app.listen(port, () => {
  console.log(`Resturant backend app listening on port http://localhost:${port}`)
})