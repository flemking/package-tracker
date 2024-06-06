const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
  },
  {
    _id: false, // Don't create an _id field for this subdocument
  }
);

module.exports = LocationSchema;
