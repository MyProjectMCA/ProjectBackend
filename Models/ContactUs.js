const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactUsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    }
  });

  const contactus = mongoose.model("contactus",ContactUsSchema)
  module.exports = contactus;