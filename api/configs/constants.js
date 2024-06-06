require("dotenv").config();

exports.PORT = process.env.PORT || 3000;
exports.MONGODB_URI = process.env.MONGODB_URI;

exports.DELIVERY_STATUS = [
  "OPEN",
  "PICKED-UP",
  "IN-TRANSIT",
  "DELIVERED",
  "FAILED",
];
