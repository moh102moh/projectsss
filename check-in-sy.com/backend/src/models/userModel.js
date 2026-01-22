// src/models/userModel.js
import pool from "../config/db.js";
import bcrypt from "bcrypt";

/* CREATE USER - now accepts verify_code param */
export async function createUser(full_name, email, phone, password, role = "customer", verify_code = null) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (full_name, email, phone, password, role, verify_code) VALUES (?, ?, ?, ?, ?, ?)",
    [full_name, email, phone, hashedPassword, role, verify_code]
  );
  return result.insertId;
}

export async function getUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

export async function getUserById(id) {
  const [rows] = await pool.query("SELECT id, full_name, email, phone, role, created_at, is_verified FROM users WHERE id = ?", [id]);
  return rows[0];
}

export async function getAllUsers() {
  const [rows] = await pool.query("SELECT id, full_name, email, phone, role, is_verified FROM users");
  return rows;
}

export async function updateUserById(id, data) {
  const fields = [];
  const values = [];

  for (const key in data) {
    if (data[key] !== undefined) {
      fields.push(`${key}=?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) return false;

  const [result] = await pool.query(`UPDATE users SET ${fields.join(", ")} WHERE id=?`, [...values, id]);
  return result.affectedRows > 0;
}

export async function deleteUserById(id) {
  const [result] = await pool.query("DELETE FROM users WHERE id=?", [id]);
  return result.affectedRows > 0;
}

/* Verification & Reset helpers */
export async function updateUserVerification(email, code) {
  const [result] = await pool.query(
    "UPDATE users SET is_verified = 1, verify_code = NULL WHERE email = ? AND verify_code = ?",
    [email, code]
  );
  return result.affectedRows > 0;
}

export async function setResetCode(email, code) {
  const [result] = await pool.query(
    "UPDATE users SET reset_code = ? WHERE email = ?",
    [code, email]
  );
  return result.affectedRows > 0;
}

export async function updatePasswordByResetCode(code, newPassword) {
  const hashed = await bcrypt.hash(newPassword, 10);
  const [result] = await pool.query(
    "UPDATE users SET password = ?, reset_code = NULL WHERE reset_code = ?",
    [hashed, code]
  );
  return result.affectedRows > 0;
}
