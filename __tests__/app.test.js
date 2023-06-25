const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  describe("GET", () => {
    test("200: responds with JSON describing all available endpoints", () => {
      request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              "GET /api": expect.any(Object),
              "GET /api/categories": expect.any(Object),
              "GET /api/reviews": expect.any(Object),
              "GET /api/reviews/:review_id": expect.any(Object),
              "PATCH /api/reviews/:review_id": expect.any(Object),
              "GET /api/reviews/:review_id/comments": expect.any(Object),
              "POST /api/reviews/:review_id/comments": expect.any(Object),
              "GET /api/users": expect.any(Object),
              "DELETE /api/comments/:comment_id": expect.any(Object),
            })
          );
        });
    });
  });
});
describe("/api/categories", () => {
  describe("GET", () => {
    test("200: responds with an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.categories)).toBe(true);
          expect(body.categories.length === 4).toBe(true);
          body.categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
});

describe("/api/reviews", () => {
  describe("GET", () => {
    test("200: responds with an array of review objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.reviews)).toBe(true);
          expect(body.reviews.length === 13).toBe(true);
          body.reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                review_id: expect.any(Number),
                title: expect.any(String),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                votes: expect.any(Number),
                category: expect.any(String),
                owner: expect.any(String),
                created_at: expect.any(String),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("200: reviews are ordered by date in descending order by default", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("200: accepts a category query which filters reviews by specified category", () => {
      return request(app)
        .get("/api/reviews?category=euro+game")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toEqual([
            {
              review_id: 1,
              title: "Agricola",
              review_body: "Farmyard fun!",
              designer: "Uwe Rosenberg",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              votes: 1,
              category: "euro game",
              owner: "mallionaire",
              created_at: "2021-01-18T10:00:20.514Z",
              comment_count: 0,
            },
          ]);
        });
    });
    test("200: category exists but there are no matching games", () => {
      return request(app)
        .get("/api/reviews?category=children's+games")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toEqual([]);
        });
    });
    test("404: category does not exist", () => {
      return request(app)
        .get("/api/reviews?category=strategy")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("strategy does not exist");
        });
    });
    test("200: accepts a sort_by query which sorts reviews by specified column", () => {
      return request(app)
        .get("/api/reviews?sort_by=comment_count")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeSortedBy("comment_count", {
            descending: true,
          });
        });
    });
    test("200: accepts an order query which specifies sort order", () => {
      return request(app)
        .get("/api/reviews?order=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeSortedBy("created_at");
        });
    });
    test("400: invalid column for sort_by query", () => {
      return request(app)
        .get("/api/reviews?sort_by=invalid_column")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("400: invalid order query", () => {
      return request(app)
        .get("/api/reviews?order=invalid_order")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

describe("/api/reviews/:review_id", () => {
  describe("GET", () => {
    test("200: responds with a review object", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual(
            expect.objectContaining({
              review_id: 1,
              title: "Agricola",
              review_body: "Farmyard fun!",
              designer: "Uwe Rosenberg",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              votes: 1,
              category: "euro game",
              owner: "mallionaire",
              created_at: "2021-01-18T10:00:20.514Z",
            })
          );
        });
    });
    test("200: review object also has comment_count property", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual(
            expect.objectContaining({
              review_id: 2,
              title: "Jenga",
              review_body: "Fiddly fun for all the family",
              designer: "Leslie Scott",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              votes: 5,
              category: "dexterity",
              owner: "philippaclaire9",
              created_at: "2021-01-18T10:01:41.251Z",
              comment_count: 3,
            })
          );
        });
    });
    test("404: review does not exist", () => {
      return request(app)
        .get("/api/reviews/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("review does not exist");
        });
    });
    test("400: invalid review ID", () => {
      return request(app)
        .get("/api/reviews/not_an_id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
  describe("PATCH", () => {
    test("200: updates votes property and responds with updated review", () => {
      const incrementVotes = { inc_votes: 10 };
      return request(app)
        .patch("/api/reviews/1")
        .send(incrementVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual(
            expect.objectContaining({
              review_id: 1,
              title: "Agricola",
              review_body: "Farmyard fun!",
              designer: "Uwe Rosenberg",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              votes: 11,
              category: "euro game",
              owner: "mallionaire",
              created_at: "2021-01-18T10:00:20.514Z",
            })
          );
        });
    });
    test("400: invalid value for incrementing votes", () => {
      const invalidVotes = { inc_votes: "ten" };
      return request(app)
        .patch("/api/reviews/1")
        .send(invalidVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("400: request missing inc_votes property", () => {
      const missingVotes = {};
      return request(app)
        .patch("/api/reviews/1")
        .send(missingVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("404: review does not exist", () => {
      const incrementVotes = { inc_votes: 10 };
      return request(app)
        .patch("/api/reviews/1000")
        .send(incrementVotes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("review does not exist");
        });
    });
    test("400: invalid review ID", () => {
      const incrementVotes = { inc_votes: 10 };
      return request(app)
        .patch("/api/reviews/not_an_id")
        .send(incrementVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  describe("GET", () => {
    test("200: responds with an array of comments for the given review_id", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
          expect(body.comments.length === 3).toBe(true);
          body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                review_id: expect.any(Number),
                body: expect.any(String),
                votes: expect.any(Number),
                author: expect.any(String),
                created_at: expect.any(String),
              })
            );
          });
        });
    });
    test("200: review exists but there are no comments", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("404: review does not exist", () => {
      return request(app)
        .get("/api/reviews/1000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("review does not exist");
        });
    });
    test("400: invalid review ID", () => {
      return request(app)
        .get("/api/reviews/not_an_id/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
  describe("POST", () => {
    test("201: posts a new comment and responds with the posted comment", () => {
      const newComment = {
        username: "mallionaire",
        body: "This is a new comment",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual(
            expect.objectContaining({
              author: "mallionaire",
              body: "This is a new comment",
              comment_id: 7,
              created_at: expect.any(String),
              review_id: 1,
              votes: 0,
            })
          );
        });
    });
    test("400: invalid request body", () => {
      const invalidComment = {
        username: "mallionaire",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(invalidComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("404: review does not exist", () => {
      const newComment = {
        username: "mallionaire",
        body: "This is a new comment",
      };
      return request(app)
        .post("/api/reviews/1000/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("review does not exist");
        });
    });
    test("400: invalid review ID", () => {
      const newComment = {
        username: "mallionaire",
        body: "This is a new comment",
      };
      return request(app)
        .post("/api/reviews/not_an_id/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("404: username not found", () => {
      const newComment = {
        username: "not_a_username",
        body: "This is a new comment",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("username does not exist");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("200: responds with an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.users)).toBe(true);
          expect(body.users.length === 4).toBe(true);
          body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
});
describe("/api/users/:username", () => {
  describe("GET", () => {
    test("200: responds with user object", () => {
      return request(app)
        .get("/api/users/mallionaire")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toEqual(
            expect.objectContaining({
              username: "mallionaire",
              name: "haz",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            })
          );
        });
    });
    test("404: user does not exist", () => {
      return request(app)
        .get("/api/users/not_a_user")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("user does not exist");
        });
    });
  });
});
describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("204: deletes comment by comment_id", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return db.query(`SELECT * FROM comments
          WHERE comment_id=1`);
        })
        .then(({ rows }) => {
          expect(rows.length).toBe(0);
        });
    });
    test("400: invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/one")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("404: comment does not exist", () => {
      return request(app)
        .delete("/api/comments/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comment does not exist");
        });
    });
  });
  describe("PATCH", () => {
    test("200: updates votes property and responds with updated comment", () => {
      const incrementVotes = { inc_votes: -1 };
      return request(app)
        .patch("/api/comments/1")
        .send(incrementVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toEqual(
            expect.objectContaining({
              comment_id: 1,
              body: "I loved this game too!",
              votes: 15,
              author: "bainesface",
              review_id: 2,
              created_at: "2017-11-22T12:43:33.389Z",
            })
          );
        });
    });
  });
});
