import request from "supertest";
import { app, server } from "./app";

describe("first express test", () => {
  test("/ return 'Hello, World!'", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, World!");
  });

  afterAll(() => {
    server.close();
  });
});
