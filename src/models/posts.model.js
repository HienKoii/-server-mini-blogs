const db = require("../config/db.config");

class Posts {
  static async create(data) {
    const { user_id, content, media, status } = data;

    const sql = "INSERT INTO posts (user_id, content, media, status) VALUES ($1, $2, $3, $4) RETURNING id";
    const result = await db.query(sql, [user_id, content, media, status]);

    return result.rows[0].id;
  }

  static async findAllPrivatePosts() {
    const sql = `SELECT * FROM posts WHERE status = 1 ORDER BY created_at DESC`;
    const result = await db.query(sql);
    return result.rows;
  }

  static async findPrivatePostsByUserId(userId) {
    const sql = `SELECT * FROM posts WHERE user_id = $1 AND status = 1 ORDER BY created_at DESC`;
    const result = await db.query(sql, [userId]);
    return result.rows;
  }

  static async findAllPublicPosts() {
    const sql = `SELECT * FROM posts WHERE status = 0 ORDER BY created_at DESC`;
    const result = await db.query(sql);
    return result.rows;
  }

  static async findPublicPostsByUserId(userId) {
    const sql = `SELECT * FROM posts WHERE user_id = $1 AND status = 0 ORDER BY created_at DESC`;
    const result = await db.query(sql, [userId]);
    return result.rows;
  }

  static async findAllPublicPostsWithUser() {
    const sql = `
      SELECT p.*, u.name AS user_name, u.avatar AS user_avatar
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 0
      ORDER BY p.created_at DESC
    `;
    const result = await db.query(sql);
    return result.rows;
  }

  static async findPublicPostsByWithUserId(userId) {
    const sql = `
      SELECT p.*, u.name AS user_name, u.avatar AS user_avatar
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 0 AND p.user_id = $1
      ORDER BY p.created_at DESC
    `;
    const result = await db.query(sql, [userId]);
    return result.rows;
  }

  static async findAll() {
    const sql = `SELECT * FROM posts ORDER BY created_at DESC`;
    const result = await db.query(sql);
    return result.rows;
  }

  static async findAllByWithUserId(userId) {
    const sql = `
        SELECT p.*, u.name AS user_name, u.avatar AS user_avatar
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC
    `;
    const result = await db.query(sql, [userId]);
    return result.rows;
  }

  static async findById(id) {
    const sql = `SELECT * FROM posts WHERE id = $1 ORDER BY created_at DESC`;
    const result = await db.query(sql, [id]);
    return result.rows;
  }
}

module.exports = Posts;
