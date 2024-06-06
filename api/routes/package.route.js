const express = require("express");
const router = express.Router();
// const { Package } = require("../models/package.model");
const {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  patchPackage,
  deletePackage,
} = require("../controllers/package.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Package:
 *       type: object
 *       required:
 *         - description
 *         - weight
 *         - width
 *         - height
 *         - depth
 *         - from_name
 *         - from_address
 *         - from_location
 *         - to_name
 *         - to_address
 *         - to_location
 *       properties:
 *         package_id:
 *           type: string
 *           description: Unique identifier for the package
 *         active_delivery_id:
 *           type: string
 *           description: ID of the active delivery for this package
 *         description:
 *           type: string
 *         weight:
 *           type: number
 *         height:
 *           type: number
 *         depth:
 *           type: number
 *         from_name:
 *           type: string
 *         from_address:
 *           type: string
 *         from_location:
 *           $ref: '#/components/schemas/Location'
 *         to_name:
 *           type: string
 *         to_address:
 *           type: string
 *         to_location:
 *           $ref: '#/components/schemas/Location'
 *     Location:
 *       type: object
 *       properties:
 *         lat:
 *           type: number
 *         lng:
 *           type: number
 */

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Package managing API
 */

/**
 * @swagger
 * /api/package:
 *   post:
 *     summary: Create a new package
 *     tags: [Packages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Package'
 *     responses:
 *       201:
 *         description: Package created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       400:
 *         description: Bad request
 */
router.post("/", async (req, res) => {
  try {
    let newPackage = await createPackage(req, res);
    res.status(201).json(newPackage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/package:
 *   get:
 *     summary: Get all packages
 *     tags: [Packages]
 *     responses:
 *       200:
 *         description: List of all packages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Package'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    await getAllPackages(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/package/{id}:
 *   get:
 *     summary: Get package by ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
  try {
    await getPackageById(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/package/{id}:
 *   put:
 *     summary: Update package by ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Package ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Package'
 *     responses:
 *       200:
 *         description: Package updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", async (req, res) => {
  try {
    await updatePackage(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/package/{id}:
 *   patch:
 *     summary: Patch package by ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Package ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Package'
 *     responses:
 *       200:
 *         description: Package patched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", async (req, res) => {
  try {
    await patchPackage(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/package/{id}:
 *   delete:
 *     summary: Delete package by ID
 *     tags: [Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package deleted
 *       404:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  try {
    await deletePackage(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
