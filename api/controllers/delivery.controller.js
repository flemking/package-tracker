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
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
      res.status(200).json(delivery);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
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
  await delivery.save();

  if (package_id) {
    // update current delivery of package
    const package = await Package.findByIdAndUpdate(package_id, {
      active_delivery_id: delivery._id.toString(),
    });
    await package.save();
  }
  res.status(201).json(delivery);
};

exports.updateDelivery = async (req, res) => {
  const { id } = req.params;
  const { package_id, pickup_time, start_time, end_time, location, status } =
    req.body;
  Delivery.findById(id)
    .then(async (delivery) => {
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
      delivery.package_id = package_id;
      delivery.pickup_time = pickup_time;
      delivery.start_time = start_time;
      delivery.end_time = end_time;
      delivery.location = location;
      delivery.status = status;
      delivery.save();

      if (package_id) {
        // update current delivery of package
        const package = await Package.findByIdAndUpdate(package_id, {
          active_delivery_id: delivery._id.toString(),
        });
        await package.save();
      }
      res.status(200).json(delivery);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

// partial update
exports.patchDelivery = async (req, res) => {
  const { id } = req.params;
  const { package_id, pickup_time, start_time, end_time, location, status } =
    req.body;
  Delivery.findById(id)
    .then(async (delivery) => {
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
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
      }
      delivery.save();

      if (package_id) {
        // update current delivery of package
        const package = await Package.findByIdAndUpdate(package_id, {
          current_delivery_id: delivery._id.toString(),
        });
        await package.save();
      }
      res.status(200).json(delivery);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

exports.deleteDelivery = async (req, res) => {
  const { id } = req.params;
  Delivery.findByIdAndDelete(id)
    .then((delivery) => {
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
      res.status(200).json({ message: "Delivery deleted" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

// Websocket controllers
exports.updateDeliveryLocation = async (req, res) => {
  const { id } = req.params;
  const { location } = req.body;
  Delivery.findById(id)
    .then((delivery) => {
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
      delivery.location = location;
      delivery.save();
      res.status(200).json({ message: "Delivery location updated" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

exports.updateDeliveryStatus = async (req, res) => {
  const { id, status } = req.params;
  Delivery.findById(id)
    .then((delivery) => {
      if (!delivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
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
      res.status(500).json({ message: error.message });
    });
};
