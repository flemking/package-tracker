const mongoose = require("mongoose");
const app = require("../server");
const supertest = require("supertest");

exports.createTestClient = async (server) => {
  if (!server) {
    throw new Error("Server instance is required");
  }
  return supertest(`http://localhost:${server.address().port}`);
};

exports.startServer = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let server;
  try {
    server = await app.listen(0, () => {
      console.log(`Server running on port ${server.address().port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }

  const testClient = await exports.createTestClient(server);
  return { server, testClient };
};
