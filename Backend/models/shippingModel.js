import { pool } from "../config/postgresql.js";

class shippingModel {
  static async create(order_id, method, carrier, cost, estimated_date) {
    const query = `
      INSERT INTO shipping (order_id, method, carrier, cost, estimated_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [order_id, method, carrier, cost, estimated_date]);
    return rows[0];
  }

  static async findByOrderId(order_id) {
    const query = 'SELECT * FROM shipping WHERE order_id = $1';
    const { rows } = await pool.query(query, [order_id]);
    return rows[0];
  }

  static async updateTracking(order_id, carrier, tracking_number) {
    const query = `
      UPDATE shipping
      SET carrier = $1, tracking_number = $2
      WHERE order_id = $3
      RETURNING *
    `;
    const { rows } = await pool.query(query, [carrier, tracking_number, order_id]);
    return rows[0];
  }
}

export default shippingModel;