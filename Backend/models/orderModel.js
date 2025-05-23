import { pool } from "../config/postgresql.js";

class orderModel {
    static async create(user_id, total_amount, status = 'pending') {
        const query = `
        INSERT INTO orders (user_id, total_amount, status)
        VALUES ($1, $2, $3)
        RETURNING *
        `;
        const { rows } = await pool.query(query, [user_id, total_amount, status]);
            return rows[0];
    }

    static async findById(order_id) {
        const query = 'SELECT * FROM orders WHERE order_id = $1';
        const { rows } = await pool.query(query, [order_id]);
        return rows[0];
    }

    static async findByUserId(user_id) {
        const query = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC';
        const{ rows } = await pool.query(query, [user_id]);
        return rows;
    }

    static async updateStatus(order_id, status) {
        const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status');
        } 

        const query = `
        UPDATE orders
        SET status = $1
        WHERE order_id = $2
        RETURNING *
        `;
        const { rows } = await pool.query(query, [status, order_id]);
        return rows[0];
    }
}

export default orderModel;