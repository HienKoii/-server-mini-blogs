const db = require("../config/db.config");

class User {
  static async create(userData) {
    const { username, email, password } = userData;

    const sql = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id";
    const result = await db.query(sql, [username, email, password]);

    return result.rows[0].id;
  }

  static async findByEmail(email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  }

  static async findByPassword(password) {
    const result = await db.query("SELECT * FROM users WHERE password = $1", [password]);
    return result.rows[0];
  }

  static async findById(id) {
    const sql = `SELECT 
    id, name, email, avatar, bio, cover_image, is_tick, created_at FROM users WHERE id = $1
    `;
    const result = await db.query(sql, [id]);
    if (result.rows[0]) {
      result.rows[0].avatar = result.rows[0].avatar || [];
      result.rows[0].cover_image = result.rows[0].cover_image || [];
    }
    return result.rows[0];
  }

  static async updateProfile(id, data) {
    const { name, bio, avatarUrl, coverImageUrl, is_tick } = data;

    // Đảm bảo avatar và coverImage là array hợp lệ
    const avatar = Array.isArray(avatarUrl) ? avatarUrl : avatarUrl ? [avatarUrl] : [];
    const coverImage = Array.isArray(coverImageUrl) ? coverImageUrl : coverImageUrl ? [coverImageUrl] : [];

    const sql = `UPDATE users SET name = $1, bio = $2, avatar = $3::jsonb, cover_image = $4::jsonb, is_tick = $5 WHERE id = $6 RETURNING *`;
    const values = [name, bio, JSON.stringify(avatar), JSON.stringify(coverImage), is_tick, id];

    const result = await db.query(sql, values);
    return result.rowCount > 0;
  }

  static async findAvatarById(userId) {
    const sql = `SELECT avatar FROM users WHERE id = $1`;
    const result = await db.query(sql, [userId]);
    return result.rows[0]?.avatar || [];
  }

  static async findCoverImageById(userId) {
    const sql = `SELECT cover_image FROM users WHERE id = $1`;
    const result = await db.query(sql, [userId]);
    return result.rows[0] || null;
  }

  static async updateAvatar(id, avatar) {
    // Bọc object thành array
    const avatarArray = avatar
      ? [
          {
            type: avatar.resource_type,
            url: avatar.secure_url,
            public_id: avatar.public_id,
          },
        ]
      : [];

    const sql = `UPDATE users SET avatar = $1::jsonb WHERE id = $2 RETURNING *`;
    const values = [JSON.stringify(avatarArray), id];

    const result = await db.query(sql, values);
    return result.rowCount > 0;
  }

  static async updateCoverImage(id, cover) {
    // Bọc object thành array
    const coverArray = cover
      ? [
          {
            type: cover.resource_type,
            url: cover.secure_url,
            public_id: cover.public_id,
          },
        ]
      : [];

    const sql = `UPDATE users SET cover_image = $1::jsonb WHERE id = $2 RETURNING *`;
    const values = [JSON.stringify(coverArray), id];

    const result = await db.query(sql, values);
    return result.rowCount > 0;
  }

  static async updateTickStatus(id, is_tick) {
    const sql = `UPDATE users SET is_tick = $1 WHERE id = $2 RETURNING *`;
    const result = await db.query(sql, [is_tick, id]);
    return result.rowCount > 0;
  }
}

module.exports = User;
