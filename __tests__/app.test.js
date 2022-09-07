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
