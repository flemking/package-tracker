const express = require("express");
const mongoose = require("mongoose");
const packageRoutes = require("./routes/package.route");
const deliveryRoutes = require("./routes/delivery.route");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const helmet = require("helmet");

const cors = require("./middlewares/cors");

require("dotenv").config();
const { MONGODB_URI, PORT } = require("./configs/constants");

const app = express();

// Middleware
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Package Tracking API",
      version: "1.0.0",
      description: "API documentation for the Package Tracking System",
      contact: {
        name: "GOZEM",
        email: "support@gozem.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/package", packageRoutes);
app.use("/api/delivery", deliveryRoutes);

// MongoDB connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Socket.io
const server = require("http").Server(app);
const socketIo = require("socket.io");

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (deliveryId) => {
    console.log(`Client joined delivery: ${deliveryId}`);
    socket.join(deliveryId);
  });

  // Incoming event for location change
  socket.on("location_changed", ({ event, delivery_id, location }) => {
    console.log(
      `Location changed: ${event}, Delivery ID: ${delivery_id}, Location: ${location}`
    );
    io.to(delivery_id).emit("location_changed", {
      event,
      delivery_id,
      location,
    });
  });

  // Incoming event for status change
  socket.on("status_changed", ({ event, delivery_id, status }) => {
    console.log(
      `Status changed: ${event}, Delivery ID: ${delivery_id}, Status: ${status}`
    );
    io.to(delivery_id).emit("status_changed", { event, delivery_id, status });
  });

  // Broadcast event for delivery update
  socket.on("delivery_updated", ({ event, delivery_object }) => {
    console.log(
      `Delivery updated: ${event}, Delivery Object: ${JSON.stringify(
        delivery_object
      )}`
    );
    io.emit("delivery_updated", { event, delivery_object });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
