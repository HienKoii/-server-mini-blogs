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
      SELECT p.*, u.name AS user_name, u.avatar AS user_avatar , u.is_tick AS user_tick
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
      SELECT p.*, u.name AS user_name, u.avatar AS user_avatar , u.is_tick AS user_tick
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
        SELECT p.*, u.name AS user_name, u.avatar AS user_avatar , u.is_tick AS user_tick
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC
    `;
    const result = await db.query(sql, [userId]);
    return result.rows;
  }

  static async findById(id) {
    const sql = `SELECT * FROM posts WHERE id = $1`;
    const result = await db.query(sql, [id]);
    return result.rows[0]; // chỉ trả về 1 object
  }

  static async findMediaById(id) {
    const sql = `SELECT media FROM posts WHERE id = $1`;
    const result = await db.query(sql, [id]);
    console.log("findMediaById: ", result.rows[0]?.media);

    return result.rows[0]?.media; // Trả về một đối tượng (vì id là duy nhất)
  }

  static async update(id, data) {
    const { content, media, status } = data;

    const sql = `
      UPDATE posts 
      SET content = $1, 
          media = $2::jsonb, 
          status = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 
      RETURNING *
    `;

    const result = await db.query(sql, [content, JSON.stringify(media || []), status, id]);

    return result.rows[0];
  }
}

module.exports = Posts;
