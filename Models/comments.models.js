const db = require("../db/connection");

exports.fetchComments = (review_id) => {
  if (isNaN(review_id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(`SELECT * FROM reviews;`)
    .then(({ rows }) => {
      const existingReviewIDs = rows.map((row) => row.review_id);
      if (!existingReviewIDs.includes(+review_id)) {
        return Promise.reject({ status: 404, msg: "review does not exist" });
      }
    })
    .then(() => {
      return db.query(
        `
      SELECT * FROM comments
      WHERE comments.review_id = $1`,
        [review_id]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.addComment = (body, username, review_id) => {
  if (isNaN(review_id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(`SELECT * FROM reviews;`)
    .then(({ rows }) => {
      const existingReviewIDs = rows.map((row) => row.review_id);
      if (!existingReviewIDs.includes(+review_id)) {
        return Promise.reject({ status: 404, msg: "review does not exist" });
      }
    })
    .then(() => {
      return db.query(`SELECT * FROM users;`);
    })
    .then(({ rows }) => {
      const existingUsers = rows.map((row) => row.username);
      if (!existingUsers.includes(username)) {
        return Promise.reject({ status: 404, msg: "username does not exist" });
      }
    })
    .then(() => {
      return db.query(
        `
      INSERT INTO comments
      (body, author, review_id)
      VALUES 
      ($1, $2, $3)
      RETURNING *`,
        [body, username, review_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
