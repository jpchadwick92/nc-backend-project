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
          body.reviews.forEach((category) => {
            expect(category).toEqual(
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
