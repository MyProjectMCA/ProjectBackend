const mongoose = require("mongoose");
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL

mongoose.set("strictQuery", false);
mongoose
  .connect(`${DATABASE_URL}`)
  .then(() => console.log("Connected mongodb"))
  .catch((e) => console.log(e));