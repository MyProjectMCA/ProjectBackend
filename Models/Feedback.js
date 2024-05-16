const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeedbackSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    feedback: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
  });

  const feedback = mongoose.model("feedback",FeedbackSchema)
  module.exports = feedback;