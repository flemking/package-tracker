const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { startServer } = require("./setup");

let server;

beforeAll(async () => {
  serverAndClient = await startServer();
  server = serverAndClient.server;
  testClient = serverAndClient.testClient;
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});

let packageId = "";
describe("Package API", () => {
  test("POST /api/package - should create a new package", async () => {
    const newPackage = {
      description: "Test Package",
      weight: 500,
      height: 10,
      depth: 5,
      from_name: "John Doe",
      from_address: "123 Start Street",
      from_location: {
        lat: 37.7749,
        lng: -122.4196,
      },
      to_name: "Jane Doe",
      to_address: "456 End Avenue",
      to_location: {
        lat: 37.7749,
        lng: -122.4196,
      },
    };

    const response = await request(app)
      .post("/api/package")
      .send(newPackage)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body.description).toBe(newPackage.description);
    expect(response.body.from_location).toEqual(newPackage.from_location);

    packageId = response.body._id;
  });

  test("GET /api/package - should return all packages", async () => {
    const response = await request(app)
      .get("/api/package")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });

  test("GET /api/package/:id - should return package by ID", async () => {
    const response = await request(app)
      .get(`/api/package/${packageId}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.description).toBe("Test Package");
  });

  test("PATCH /api/package/:id - should update package by ID", async () => {
    const updatedPackage = {
      description: "Updated Test Package",
    };

    const response = await request(app)
      .patch(`/api/package/${packageId}`)
      .send(updatedPackage)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.description).toEqual(updatedPackage.description);
  });

  test("DELETE /api/package/:id - should delete package by ID", async () => {
    await request(app).delete(`/api/package/${packageId}`).expect(200);
  });
});

/**
 * DELEVERY API TEST
 */

let deliveryId = "";
describe("Delivery API", () => {
  test("POST /api/delivery - should create a new delivery", async () => {
    const newDelivery = {
      package_id: packageId,
      pickup_time: "2022-01-01T00:00:00.000Z",
      start_time: "2022-01-01T00:00:00.000Z",
      end_time: "2022-01-01T01:00:00.000Z",
      location: {
        lat: 37.7749,
        lng: -122.4194,
      },
    };

    const response = await request(app)
      .post("/api/delivery")
      .send(newDelivery)
      .expect(201);

    deliveryId = response.body._id;
    expect(response.body).toHaveProperty("_id");
  });

  test("GET /api/delivery - should return all deliveries", async () => {
    const response = await request(app).get("/api/delivery").expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });

  test("GET /api/delivery/:id - should return delivery by ID", async () => {
    const response = await request(app)
      .get(`/api/delivery/${deliveryId}`)
      .expect(200);

    expect(response.body._id).toEqual(deliveryId);
  });

  test("PATCH /api/delivery/:id - should update delivery by ID", async () => {
    const updatedDelivery = {
      end_time: "2022-01-01T03:00:00.000Z",
      status: "DELIVERED",
    };
    const response = await request(app)
      .patch(`/api/delivery/${deliveryId}`)
      .send(updatedDelivery)
      .expect(200);
    expect(response.body.end_time).toEqual(updatedDelivery.end_time);
    expect(response.body.status).toEqual(updatedDelivery.status);
  });

  test("DELETE /api/delivery/:id - should delete delivery by ID", async () => {
    await request(app).delete(`/api/delivery/${deliveryId}`).expect(200);
  });
});

/**
 * TEST websockets
 */
