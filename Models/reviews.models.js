const db = require("../db/connection");
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

exports.fetchReviews = (category, sort_by = "created_at", order = "DESC") => {
  const validColumns = [
    "review_id",
    "category",
    "title",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrder = ["ASC", "DESC"];
  const queryValues = [];
  let validCategories = [];
  return db
    .query("SELECT * FROM categories")
    .then(({ rows }) => {
      rows.forEach((row) => {
        if (!validCategories.includes(row.slug)) {
          validCategories.push(row.slug);
        }
      });
    })
    .then(() => {
      let queryStr = `
      SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
      FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id`;

      if (!validColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: `bad request` });
      }
      if (!validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: "bad request" });
      }
      if (category) {
        if (!validCategories.includes(category)) {
          return Promise.reject({
            status: 404,
            msg: `${category} does not exist`,
          });
        } else {
          queryValues.push(category);
          queryStr += ` WHERE category = $1`;
        }
      }

      queryStr += ` 
      GROUP BY reviews.review_id
      ORDER BY ${sort_by} ${order}`;

      return db.query(queryStr, queryValues);
    })
    .then(({ rows }) => {
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

exports.addReview = (review_body, owner, title, category, designer) => {
  return db
    .query(
      `
    INSERT INTO reviews
    (review_body, owner, title, category, designer)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *;`,
      [review_body, owner, title, category, designer]
    )
    .then(({ rows }) => {
      return db.query(
        `
      SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
      FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id`,
        [rows[0].review_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
