const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

afterAll(() => {
  console.log("All tests have been finished");
  return db.end();
});

beforeEach(() => {
  return seed(data);
});
/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object which has endpoint description queries and example response ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        
        const expectedResponse =
          endpointsJson["GET /api/topics"].exampleResponse.topics[0];
        expect(topics).toHaveLength(3);

        topics.forEach((topic) => {
          expect(Object.keys(topic)).toEqual(Object.keys(expectedResponse));
        });

        const keys = Object.keys(topics)
        keys.forEach((key)=>{
          topics.forEach((topic)=>{
            expect(typeof topic[key]).toBe(typeof expectedResponse[key])
          })
        })
      });
  });
  test('404: Responds with message when route is not correct', () => {
    return request(app)
    .get("/api/topicsdasd")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Route Does Not Found")
    })
  });
});
