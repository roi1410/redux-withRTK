const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: false,
  },
  experiences: [
    {
      period: { type: String, required: false },
      company: { type: String, required: false },
      summary: {
        Frontend: { type: [String], required: false },
        Backend: { type: [String], required: false },
        Management: { type: [String], required: false },
      },
    },
  ],
  primaryPosition: {
    type: String,
    required: false,
  },
  aboutDescription: { type: String, required: false },
  contactInfo: {
    tel: { type: String, required: false },
    email: { type: String, required: false },
    address: { type: String, required: false },
  },
  education: [
    {
      period: { type: String, required: false },
      titled: { type: String, required: false },
      awarded: { type: [String], required: false },
    },
  ],

  certification: { type: [String], required: false },

  profileImg: { type: String, required: false },
  backgroundImg: { type: String, required: false },
  url: {
    git: { type: String, required: false },
    LinkedIn: { type: String, required: false },
    website: { type: String, required: false },
  },
});
const CV = mongoose.model("CV", cvSchema);
module.exports = CV;
