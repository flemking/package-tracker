const Delivery = require("../models/delivery.model");
const Package = require("../models/package.model");

exports.getDeliveries = async (req, res) => {
  Delivery.find()
    .then((deliveries) => {
      res.status(200).json(deliveries);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

exports.getDeliveryById = async (req, res) => {
  const { id } = req.params;
  Delivery.findById(id)
    .then((delivery) => {
      res.status(200).json(delivery);
    })
    .catch((error) => {
      res.status(404).json({ message: "Delivery not found" });
    });
};

exports.createDelivery = async (req, res) => {
  const { package_id, pickup_time, start_time, end_time, location, status } =
    req.body;
  const delivery = new Delivery({
    package_id: package_id,
    pickup_time: pickup_time,
    start_time: start_time,
    end_time: end_time,
    location: location,
    status: status,
  });
  try {
    await delivery.save();
    if (package_id) {
      // update current delivery's package
      const new_package = await Package.findById(package_id);
      if (new_package) {
        new_package.active_delivery_id = delivery._id.toString();
        await new_package.save();
      } else {
        return res.status(404).json({ message: "Package not found" });
      }
    }
    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDelivery = async (req, res) => {
  const { id } = req.params;
  const { package_id, pickup_time, start_time, end_time, location, status } =
    req.body;
  Delivery.findById(id)
    .then(async (delivery) => {
      delivery.package_id = package_id;
      delivery.pickup_time = pickup_time;
      delivery.start_time = start_time;
      delivery.end_time = end_time;
      delivery.location = location;
      delivery.status = status;
      // checking the status
      if (status === "PICKED-UP") {
        delivery.pickup_time = Date.now();
      } else if (status === "IN-TRANSIT") {
        delivery.start_time = Date.now();
      } else if (status === "DELIVERED") {
        delivery.end_time = Date.now();
      }
      delivery.save();

      if (package_id) {
        // update current delivery of package
        const new_package = await Package.findByIdAndUpdate(package_id, {
          active_delivery_id: delivery._id.toString(),
        });

        await new_package.save();
      }
      res.status(200).json(delivery);
    })
    .catch((error) => {
      res.status(404).json({ message: "Delivery not found" });
    });
};

// partial update
exports.patchDelivery = async (req, res) => {
  const { id } = req.params;
  const { package_id, pickup_time, start_time, end_time, location, status } =
    req.body;
  Delivery.findById(id)
    .then(async (delivery) => {
      if (package_id) {
        delivery.package_id = package_id;
      }
      if (pickup_time) {
        delivery.pickup_time = pickup_time;
      }
      if (start_time) {
        delivery.start_time = start_time;
      }
      if (end_time) {
        delivery.end_time = end_time;
      }
      if (location) {
        delivery.location = location;
      }
      if (status) {
        delivery.status = status;

        if (status === "PICKED-UP") {
          delivery.pickup_time = Date.now();
        } else if (status === "IN-TRANSIT") {
          delivery.start_time = Date.now();
        } else if (status === "DELIVERED") {
          delivery.end_time = Date.now();
        }
      }
      delivery.save();

      if (package_id) {
        // update current delivery of package
        const new_package = await Package.findByIdAndUpdate(package_id, {
          current_delivery_id: delivery._id.toString(),
        });
        await new_package.save();
      }
      res.status(200).json(delivery);
    })
    .catch((error) => {
      res.status(404).json({ message: "Delivery not found" });
    });
};

exports.deleteDelivery = async (req, res) => {
  const { id } = req.params;
  Delivery.findByIdAndDelete(id)
    .then((delivery) => {
      res.status(200).json({ message: "Delivery deleted" });
    })
    .catch((error) => {
      res.status(404).json({ message: "Delivery not found" });
    });
};

// Websocket controllers
exports.updateDeliveryLocation = async (req, res) => {
  const { id } = req.params;
  const { location } = req.body;
  Delivery.findById(id)
    .then((delivery) => {
      delivery.location = location;
      delivery.save();
      res.status(200).json({ message: "Delivery location updated" });
    })
    .catch((error) => {
      res.status(404).json({ message: "Delivery not found" });
    });
};

exports.updateDeliveryStatus = async (req, res) => {
  const { id, status } = req.params;
  Delivery.findById(id)
    .then((delivery) => {
      delivery.status = status;
      if (status === "PICKED-UP") {
        delivery.pickup_time = Date.now();
      } else if (status === "IN-TRANSIT") {
        delivery.start_time = Date.now();
      } else if (status === "DELIVERED") {
        delivery.end_time = Date.now();
      }
      delivery.save();
      res.status(200).json({ message: "Delivery status updated" });
    })
    .catch((error) => {
      res.status(404).json({ message: "Delivery not found" });
    });
};
