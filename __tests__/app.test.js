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
          comment_count: 11,
        });
      });
  });

  test("404: Article_id Does not exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
  test("400: article_id is not a number", () => {
    return request(app)
      .get("/api/articles/one")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
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
              comment_count: expect.any(Number),
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Should returns with all comments for Selected Author Id with most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
      });
  });

  test("200: Should returns empty array if article exist but does not have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("400: Should returns message if the article_id has invalid format", () => {
    return request(app)
      .get("/api/articles/one/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("404: Should returns message if route is not correct ", () => {
    return request(app)
      .get("/api/articles/1/commenstasda")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Route Does Not Found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Should post a body and return inserted Value", () => {
    const postBody = {
      username: "butter_bridge",
      body: "This is a comment about article",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(postBody)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("400: Should response with Bad Request when Post Body contains not allowed items", () => {
    const postBody = {
      username: "butter_bridge",
      body: "This is a comment about article",
      votes: 100,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(postBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Should response with Bad Request when Post Body is empty", () => {
    const postBody = {};
    return request(app)
      .post("/api/articles/1/comments")
      .send(postBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Should response with Bad Request when username does not exists", () => {
    const postBody = {
      username: "user_name",
      body: "This is a comment about article",
      votes: 100,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(postBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("404: Should response with Bad Request when Article does not exist ", () => {
    const postBody = {
      username: "butter_bridge",
      body: "This is a comment about article",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(postBody)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Does Not Found");
      });
  });
  test("400: Should response with Bad Request when article_id has invalid format", () => {
    const postBody = {
      username: "butter_bridge",
      body: "This is a comment about article",
    };
    return request(app)
      .post("/api/articles/one/comments")
      .send(postBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Should update articles votes and return updated article", () => {
    const updateBody = {
      inc_vote: -1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updateBody)
      .expect(200)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: Should response with Bad Request when Update Body contains not allowed items ", () => {
    const updateBody = {
      inc_vote: 1,
      title: "New_Title",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updateBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Should response with Bad Request when Update Body is empty", () => {
    const updateBody = {};
    return request(app)
      .patch("/api/articles/1")
      .send(updateBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("404: Should response with Does Not Found when article does not exist ", () => {
    const updateBody = {
      inc_vote: 1,
    };
    return request(app)
      .patch("/api/articles/999")
      .send(updateBody)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Does Not Found");
      });
  });
  test("400: Should response with Bad Request when article_id has invalid format ", () => {
    const updateBody = {
      inc_vote: 1,
    };
    return request(app)
      .patch("/api/articles/one")
      .send(updateBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Should response with Bad Request when inc_vote has invalid format ", () => {
    const updateBody = {
      inc_vote: "1",
    };
    return request(app)
      .patch("/api/articles/one")
      .send(updateBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Should delete comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
        return request(app).get("/api/comments/1").expect(404);
      });
  });
  test("404: Should returns with message if comment does not exist", () => {
    return request(app)
      .delete("/api/comments/99")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Does Not Found");
      });
  });
  test("400: Should returns with message if comment does not exist", () => {
    return request(app)
      .delete("/api/comments/one")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array which contains all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("404: Responds with a message when route is not correct", () => {
    return request(app)
      .get("/api/usersdasda")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Route Does Not Found");
      });
  });
});

describe("GET /api/articles?sort_by=&order=", () => {
  test("200: Should return with all articles with desc order and by created_at as default", () => {
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
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: Should return with all articles with asc order. Sort_by is created_at as default", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: false });
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
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: Should return with all articles with desc order by default. Sort_by is comment_count", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("comment_count", {
          descending: true,
          coerce: true,
        });
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
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: Should return with all articles with asc order. Sort_by is Author Name", () => {
    return request(app)
      .get("/api/articles?order=ASC&sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", { descending: false });
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
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("400: Should response with message when order variable has not correct name", () => {
    return request(app)
      .get("/api/articles?order=ascending")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Should response with message when sort_by variable has unauthorized key (user does not allowed by sorting data with topic )", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles?topic=", () => {
  test("200: Response with articles when topic query is empy ", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Response with articles when topic query has value ", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Response with empty array if topic exist but there is no article in database with selected topic ", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
  test("404: Response with message when topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=topic1")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Does Not Found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Returns with selected user", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });
  test("404: Returns with msg when username does not exist ", () => {
    return request(app)
      .get("/api/users/butter")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Does Not Found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Should decrease comment vote", () => {
    const updateBody = {
      inc_vote: -1,
    };
    return request(app)
      .patch("/api/comments/1")
      .send(updateBody)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 1,
          body: expect.any(String),
          article_id: 9,
          author: "butter_bridge",
          votes: 15,
          created_at: expect.any(String),
        });
      });
  });
  test("200: Should increase comment vote", () => {
    const updateBody = {
      inc_vote: 1,
    };
    return request(app)
      .patch("/api/comments/1")
      .send(updateBody)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 1,
          body: expect.any(String),
          article_id: 9,
          author: "butter_bridge",
          votes: 17,
          created_at: expect.any(String),
        });
      });
  });
  test("404: Should return msg when comment does not exists", () => {
    const updateBody = {
      inc_vote: 1,
    };
    return request(app)
      .patch("/api/comments/25")
      .send(updateBody)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Does Not Found");
      });
  });
  test("400: Should return msg when comment_id has invalid format", () => {
    const updateBody = {
      inc_vote: 1,
    };
    return request(app)
      .patch("/api/comments/one")
      .send(updateBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Should return msg when update body is empty", () => {
    const updateBody = {};
    return request(app)
      .patch("/api/comments/one")
      .send(updateBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Should return msg when update body contains unvalid keys", () => {
    const updateBody = {
      inc_vote: 1,
      author: "change_author",
    };
    return request(app)
      .patch("/api/comments/one")
      .send(updateBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Should return msg when inc_vote has invalid format", () => {
    const updateBody = {
      inc_vote: "1",
    };
    return request(app)
      .patch("/api/comments/one")
      .send(updateBody)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/article", () => {
  test("201: returns a posted body", () => {
    const postBody = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
    .post("/api/articles")
    .send(postBody)
    .expect(201)
    .then(({body : {article}})=>{
      expect(article).toMatchObject({
        article_id: expect.any(Number),
        title: postBody.title,
        author: postBody.author,
        body: postBody.body,
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: postBody.article_img_url,
        comment_count: expect.any(Number)
      })
    })
  });
  test("201: returns a posted body and default img_url when img_url is not provided", () => {
    const postBody = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
    };

    return request(app)
    .post("/api/articles")
    .send(postBody)
    .expect(201)
    .then(({body : {article}})=>{
      expect(article).toMatchObject({
        article_id: expect.any(Number),
        title: postBody.title,
        author: postBody.author,
        body: postBody.body,
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
        comment_count: expect.any(Number)
      })
    })
  });
  test("400: returns a msg when postbody has missing keys except than article_img_url", () => {
    const postBody = {
      title: "Living in the shadow of a great man",
      author: "butter_bridge",
      body: "I find this existence challenging",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
    .post("/api/articles")
    .send(postBody)
    .expect(400)
    .then(({body : {msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  });
  test("400: returns a msg when postbody has unauthorised key", () => {
    const postBody = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      author_id : 1,
      body: "I find this existence challenging",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
    .post("/api/articles")
    .send(postBody)
    .expect(400)
    .then(({body : {msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  });
  test("404: returns a msg when user does not exist", () => {
    const postBody = {
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "another_user",
      body: "I find this existence challenging",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
    .post("/api/articles")
    .send(postBody)
    .expect(404)
    .then(({body : {msg}})=>{
      expect(msg).toBe("Does Not Found")
    })
  });
  test("404: returns a msg when topic does not exist", () => {
    const postBody = {
      title: "Living in the shadow of a great man",
      topic: "another_topic",
      author: "butter_bridge",
      body: "I find this existence challenging",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
    .post("/api/articles")
    .send(postBody)
    .expect(404)
    .then(({body : {msg}})=>{
      expect(msg).toBe("Does Not Found")
    })
  });
  test("400: returns a msg when user value is empty", () => {
    const postBody = {
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };

    return request(app)
    .post("/api/articles")
    .send(postBody)
    .expect(400)
    .then(({body : {msg}})=>{
      expect(msg).toBe("Bad Request")
    })
  });

});
