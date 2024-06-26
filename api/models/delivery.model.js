const mongoose = require("mongoose");
const { DELIVERY_STATUS } = require("../configs/constants");
const LocationSchema = require("./schemas/location.schema");

const DeliverySchema = new mongoose.Schema(
  {
    delivery_id: {
      type: String,
      required: false,
      unique: false,
      default: `DELIVERY-${Date.now()}`,
    },
    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    pickup_time: {
      type: Number,
      required: false,
    },
    start_time: {
      type: Number,
      required: false,
    },
    end_time: {
      type: Number,
      required: false,
    },
    location: {
      type: LocationSchema,
      required: true,
    },
    status: {
      type: String,
      enum: DELIVERY_STATUS,
      default: DELIVERY_STATUS[0],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Delivery", DeliverySchema);
