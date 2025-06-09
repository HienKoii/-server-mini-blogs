const db = require("../config/db.config");

class Posts {
  static async create(data) {
    const { user_id, content, media, status } = data;

    const sql = "INSERT INTO posts (user_id, content, media, status) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(sql, [user_id, content, media, status]);

    return result.insertId;
  }

  static async findAllPrivatePosts() {
    const sql = `SELECT * FROM posts WHERE status = 1 ORDER BY created_at DESC`;
    const [rows] = await db.execute(sql);
    return rows;
  }

  static async findPrivatePostsByUserId(userId) {
    const sql = `SELECT * FROM posts WHERE user_id = ? AND status = 1 ORDER BY created_at DESC`;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
  }
  static async findAllPublicPosts() {
    const sql = `SELECT * FROM posts WHERE status = 0 ORDER BY created_at DESC`;
    const [rows] = await db.execute(sql);
    return rows;
  }

  static async findPublicPostsByUserId(userId) {
    const sql = `SELECT * FROM posts WHERE user_id = ? AND status = 0 ORDER BY created_at DESC`;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
  }

  static async findAllPublicPostsWithUser() {
    const sql = `
      SELECT p.*, u.name AS user_name, u.avatar AS user_avatar
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 0
      ORDER BY p.created_at DESC
    `;
    const [rows] = await db.execute(sql);
    return rows;
  }

  static async findPublicPostsByWithUserId(userId) {
    const sql = `
      SELECT p.*, u.name AS user_name, u.avatar AS user_avatar
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 0 AND p.user_id = ?
      ORDER BY p.created_at DESC
    `;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
  }

  static async findAll() {
    const sql = `SELECT * FROM posts ORDER BY created_at DESC`;
    const [rows] = await db.execute(sql);
    return rows;
  }

  static async findAllByWithUserId(userId) {
    const sql = `
        SELECT p.*, u.name AS user_name, u.avatar AS user_avatar
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE  p.user_id = ?
        ORDER BY p.created_at DESC
  `;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
  }

  static async findById(id) {
    const sql = `SELECT *  FROM posts  WHERE id = ?  ORDER BY created_at DESC`;
    const [rows] = await db.execute(sql, [id]);
    return rows;
  }
}

module.exports = Posts;
