const mongoose = require("mongoose");
const LocationSchema = require("./schemas/location.schema");

const PackageSchema = new mongoose.Schema(
  {
    package_id: {
      type: String,
      required: false,
      unique: false,
      default: `PACKAGE-${Date.now()}`,
    },
    active_delivery_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
      required: false,
      default: null,
      nullable: true,
    },
    description: String,
    weight: Number,
    width: Number,
    height: Number,
    depth: Number,
    from_name: String,
    from_address: String,
    from_location: {
      type: LocationSchema,
      required: true,
    },
    to_name: String,
    to_address: String,
    to_location: {
      type: LocationSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Package", PackageSchema);
