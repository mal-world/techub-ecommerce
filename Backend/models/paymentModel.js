import { pool } from "../config/postgresql.js";

class paymentModel {
  static async create(order_id, method, amount, status = 'pending') {
    const query = `
      INSERT INTO payment (order_id, method, amount, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [order_id, method, amount, status]);
    return rows[0];
  }

  static async findByOrderId(order_id) {
    const query = 'SELECT * FROM payment WHERE order_id = $1';
    const { rows } = await pool.query(query, [order_id]);
    return rows[0];
  }

  static async updateStatus(payment_id, status) {
    const query = `
      UPDATE payment
      SET status = $1, payment_date = CURRENT_TIMESTAMP
      WHERE payment_id = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [status, payment_id]);
    return rows[0];
  }
}

export default paymentModel;