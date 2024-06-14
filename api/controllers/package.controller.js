const Package = require("../models/package.model");

exports.getAllPackages = async (req, res) => {
  Package.find()
    .then((packages) => {
      res.status(200).json(packages);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};

exports.getPackageById = async (req, res) => {
  const { id } = req.params;
  Package.findById(id)
    .then((new_package) => {
      res.status(200).json(new_package);
    })
    .catch((error) => {
      res.status(404).json({ message: "Package not found" });
    });
};

exports.createPackage = async (req, res) => {
  const {
    active_delivery_id,
    description,
    weight,
    width,
    height,
    depth,
    from_name,
    from_address,
    from_location,
    to_name,
    to_address,
    to_location,
  } = req.body;

  const newPackage = new Package({
    active_delivery_id: active_delivery_id,
    description: description,
    weight: weight,
    width: width,
    height: height,
    depth: depth,
    from_name: from_name,
    from_address: from_address,
    from_location: from_location,
    to_name: to_name,
    to_address: to_address,
    to_location: to_location,
  });

  await newPackage.save();

  res.status(201).json(newPackage);
};

exports.updatePackage = async (req, res) => {
  const { id } = req.params;
  const {
    active_delivery_id,
    description,
    weight,
    width,
    height,
    depth,
    from_name,
    from_address,
    from_location,
    to_name,
    to_address,
    to_location,
  } = req.body;
  Package.findById(id)
    .then((new_package) => {
      new_package.active_delivery_id = active_delivery_id;
      new_package.description = description;
      new_package.weight = weight;
      new_package.width = width;
      new_package.height = height;
      new_package.depth = depth;
      new_package.from_name = from_name;
      new_package.from_address = from_address;
      new_package.from_location = from_location;
      new_package.to_name = to_name;
      new_package.to_address = to_address;
      new_package.to_location = to_location;
      new_package.save();
      res.status(200).json(new_package);
    })
    .catch((error) => {
      res.status(404).json({ message: "Package not found" });
    });
};

// partial update
exports.patchPackage = async (req, res) => {
  const { id } = req.params;
  const {
    active_delivery_id,
    description,
    weight,
    width,
    height,
    depth,
    from_name,
    from_address,
    from_location,
    to_name,
    to_address,
    to_location,
  } = req.body;
  Package.findById(id)
    .then((new_package) => {
      if (active_delivery_id) {
        new_package.active_delivery_id = active_delivery_id;
      }
      if (description) {
        new_package.description = description;
      }
      if (weight) {
        new_package.weight = weight;
      }
      if (width) {
        new_package.width = width;
      }
      if (height) {
        new_package.height = height;
      }
      if (depth) {
        new_package.depth = depth;
      }
      if (from_name) {
        new_package.from_name = from_name;
      }
      if (from_address) {
        new_package.from_address = from_address;
      }
      if (from_location) {
        new_package.from_location = from_location;
      }
      if (to_name) {
        new_package.to_name = to_name;
      }
      if (to_address) {
        new_package.to_address = to_address;
      }
      if (to_location) {
        new_package.to_location = to_location;
      }
      new_package.save();
      res.status(200).json(new_package);
    })
    .catch((error) => {
      res.status(404).json({ message: "Package not found" });
    });
};

exports.deletePackage = async (req, res) => {
  const { id } = req.params;
  Package.findByIdAndDelete(id, { new: true })
    .then((new_package) => {
      res.status(200).json({ message: "Package deleted" });
    })
    .catch((error) => {
      res.status(404).json({ message: "Package not found" });
    });
};
