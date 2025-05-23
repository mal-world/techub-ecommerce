import { pool } from "../config/postgresql.js";

class orderItemModel {
    
    static async create(order_id, product_id, quantity, price) {
        const query = `
        INSERT INTO orderitems (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;
        const { rows } = await pool.query(query, [order_id, product_id, quantity, price]);
        return rows[0];
    }

    static async findByOrderId(order_id) {
        const query = `
        SELECT oi.*, p.name, p.image_url
        FROM orderitems oi
        JOIN products p ON oi.product_id = p.products_id
        WHERE oi.order_id = $1
        `;
        const { rows } = await pool.query(query, [order_id]);
        return rows;
    }
}
export default orderItemModel;