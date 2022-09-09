const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories").then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviewsById = (review_id) => {
  return db
    .query(
      `
      SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
      FROM reviews 
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      WHERE reviews.review_id=$1
      GROUP BY reviews.review_id
 ;`,
      [review_id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "review does not exist" });
      } else {
        return rows[0];
      }
    });
};

exports.fetchReviews = (category) => {
  const validCategories = [
    "euro game",
    "dexterity",
    "social deduction",
    "children's games",
  ];
  const queryValues = [];
  let queryStr = `SELECT * FROM reviews`;

  if (category) {
    if (!validCategories.includes(category)) {
      return Promise.reject({ status: 404, msg: `${category} does not exist` });
    } else {
      queryValues.push(category);
      queryStr += ` WHERE category = $1`;
    }
  }

  queryStr += ` ORDER BY created_at DESC`;
  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

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

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.updateReview = (inc_votes, review_id) => {
  return db
    .query(
      `UPDATE reviews 
      SET votes = votes + $1 
      WHERE review_id=$2 
      RETURNING *`,
      [inc_votes, review_id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "review does not exist" });
      } else {
        return rows[0];
      }
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
