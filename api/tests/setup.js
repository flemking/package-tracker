const mongoose = require("mongoose");
const app = require("../server");
const supertest = require("supertest");

/**
 * Create a test client for Supertest
 * @param {object} server - The server instance to test
 * @return {Promise<supertest.SuperTest<supertest.TestOptions>>} A promise that resolves to a Supertest client
 * @throws {Error} If no server instance is provided
 */
exports.createTestClient = async (serverInstance) => {
  if (!serverInstance) {
    throw new Error("A server instance is required");
  }
  const { port } = serverInstance.address();
  return supertest(`http://localhost:${port}`);
};

exports.startServer = async () => {
  const connectionUri = process.env.MONGODB_URI;
  await mongoose.connect(connectionUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const server = await app.listen(0);
  const serverUrl = `http://localhost:${server.address().port}`;
  const testClient = await exports.createTestClient(server);

  return { server, serverUrl, testClient };
};
