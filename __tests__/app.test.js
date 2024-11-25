const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const toBeSortedBy = require("jest-sorted");

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
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
  test("404: Responds with message when route is not correct", () => {
    return request(app)
      .get("/api/topicsdasd")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route Does Not Found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Should response with correct article ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        const expectedResponse =
          endpointsJson["GET /api/articles/:article_id"].exampleResponse
            .articles[0];
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test('404: Article_id Does not exist', () => {
      return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({body : {msg}})=>{
        expect(msg).toBe("Not Found")
      })
  });
  test('400: article_id is not a number', () => {
      return request(app)
      .get("/api/articles/one")
      .expect(400)
      .then(({body:{msg}})=>{
        expect(msg).toBe("Bad Request")
      })
  });
});

describe("GET /api/articles - Default Sort and Order", () => {
  test("200: Should response with all articles with desc order by age as default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("404: Responds with message when route is not correct  ", () => {
    request(app)
      .get("/api/articlesdasas")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route Does Not Found");
      });
  });
});
