const db = require("../config/db.config");

class User {
  static async create(userData) {
    const { username, email, password } = userData;

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const [result] = await db.execute(sql, [username, email, password]);

    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }

  static async findByPassword(password) {
    const [rows] = await db.execute("SELECT * FROM users WHERE password = ?", [password]);
    return rows[0];
  }

  static async findById(id) {
    const sql = `SELECT 
    id, name, email, avatar, bio, cover_image , created_at FROM users WHERE id = ?
    `;
    const [rows] = await db.execute(sql, [id]);
    rows[0].avatar = JSON.parse(rows[0].avatar || []);
    rows[0].cover_image = JSON.parse(rows[0].cover_image || []);
    return rows[0];
  }

  static async updateProfile(id, data) {
    const { name, bio, avatarUrl, coverImageUrl } = data;

    const avatar = JSON.stringify(avatarUrl || []);
    console.log("avatar", avatar);
    const coverImage = JSON.stringify(coverImageUrl || []);

    const sql = `UPDATE users SET name = ?, bio = ?, avatar = ?, cover_image = ? WHERE id = ?`;
    const values = [name, bio, avatar, coverImage, id];

    const [result] = await db.execute(sql, values);
    return result.affectedRows > 0;
  }

  static async findAvatarById(userId) {
    const sql = `SELECT avatar FROM users WHERE id = ?`;
    const [rows] = await db.execute(sql, [userId]);
    rows[0].avatar = JSON.parse(rows[0].avatar || []);
    return rows[0].avatar;
  }

  static async findCoverImageById(userId) {
    const sql = `SELECT cover_image FROM users WHERE id = ?`;
    const [rows] = await db.execute(sql, [userId]);
    rows[0].cover_image = JSON.parse(rows[0].cover_image || []);
    return rows[0];
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

    // Convert thành chuỗi JSON
    const convertAvatar = JSON.stringify(avatarArray);

    const sql = `UPDATE users SET avatar = ? WHERE id = ?`;
    const values = [convertAvatar, id];

    const [result] = await db.execute(sql, values);
    return result.affectedRows > 0;
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

    // Convert thành chuỗi JSON
    const convertCover = JSON.stringify(coverArray);

    // Cập nhật trường cover_image
    const sql = `UPDATE users SET cover_image = ? WHERE id = ?`;
    const values = [convertCover, id];

    const [result] = await db.execute(sql, values);
    console.log("result", result);
    return result.affectedRows > 0;
  }
}

module.exports = User;
