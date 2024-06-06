const express = require("express");
const router = express.Router();
// const Delivery = require("../models/delivery.model");
const {
  getDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  patchDelivery,
  deleteDelivery,
  updateDeliveryStatus,
  updateDeliveryLocation,
} = require("../controllers/delivery.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Delivery:
 *       type: object
 *       required:
 *         - delivery_id
 *         - package_id
 *         - pickup_time
 *         - start_time
 *         - end_time
 *         - location
 *         - status
 *       properties:
 *         delivery_id:
 *           type: string
 *           description: Unique identifier for the delivery
 *         package_id:
 *           type: string
 *           description: Unique identifier for the package
 *         pickup_time:
 *           type: string
 *           format: date-time
 *           description: Date and time of pickup
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: Date and time of delivery start
 *         end_time:
 *           type: string
 *           format: date-time
 *           description: Date and time of delivery end
 *         location:
 *           $ref: '#/components/schemas/Location'
 *         status:
 *           type: string
 *           description: Status of the delivery
 *           enum:
 *             - OPEN
 *             - PICKED-UP
 *             - IN-TRANSIT
 *             - DELIVERED
 *             - FAILED
 *       example:
 *         delivery_id: 123
 *         package_id: 456
 *         pickup_time: 2022-01-01T00:00:00.000Z
 *         start_time: 2022-01-01T00:00:00.000Z
 *         end_time: 2022-01-01T00:00:00.000Z
 *         from_location: {lng: 0, lat: 0}
 *         to_location: {lng: 0, lat: 0}
 *         status: OPEN
 *
 */

/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: API endpoints for managing deliveries
 */

/**
 * @swagger
 * /api/delivery:
 *   post:
 *     summary: Create a new delivery
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       201:
 *         description: Delivery created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 */
router.post("/", async (req, res) => {
  try {
    await createDelivery(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/delivery:
 *   get:
 *     summary: Get all deliveries
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: Array of deliveries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    await getDeliveries(req, res);
  } catch (err) {
    res.status(500).json({ messagee: err.message });
  }
});

/**
 * @swagger
 * /api/delivery/{id}:
 *   get:
 *     summary: Get delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Delivery ID
 *     responses:
 *       200:
 *         description: Delivery data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
  try {
    await getDeliveryById(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/delivery/{id}:
 *   put:
 *     summary: Update delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Delivery ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       200:
 *         description: Delivery updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", async (req, res) => {
  try {
    await updateDelivery(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/delivery/{id}:
 *   patch:
 *     summary: Patch delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Delivery ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       200:
 *         description: Delivery patched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", async (req, res) => {
  try {
    await patchDelivery(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/delivery/{id}:
 *   delete:
 *     summary: Delete delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Delivery ID
 *     responses:
 *       200:
 *         description: Delivery deleted
 *       404:
 *         description: Delivery not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  try {
    await deleteDelivery(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/update-status/:status", async (req, res) => {
  try {
    await updateDeliveryStatus(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/update-location", async (req, res) => {
  try {
    await updateDeliveryLocation(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
