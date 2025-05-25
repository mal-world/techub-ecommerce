import { pool } from "../config/postgresql.js";

class cartModel {
    static async create(user_id) {
        const query = `
        INSERT INTO cart (user_id)
        VALUES ($1)
        RETURNING *
        `;
        const { rows } = await pool.query(query, [user_id]);
        return rows[0];
    }

    static async findByUserId(user_id) {
        const query = `
        SELECT
            c.cart_id,
            ci.cartitems_id,
            ci.product_id,
            ci.quantity,
            pr.name AS product_name,
            pr.price,
            pr.image_urls,
            pr.stock_quantity,
            (ci.quantity * pr.price) AS item_total
        FROM cart c
        LEFT JOIN cartItems ci ON c.cart_id = ci.cart_id
        LEFT JOIN products pr ON ci.product_id = pr.products_id
        WHERE c.user_id = $1
        ORDER BY ci.cartItems_id
        `;
        const { rows } = await pool.query(query, [user_id]);
        return rows;
    }

    //get cart ID for a user
    static async findCartByUserId(user_id) {
        const query = 'SELECT cart_id FROM cart WHERE user_id = $1';
        const { rows } = await pool.query(query, [user_id]);
        return rows[0]?.cart_id;
    }

    //add item to cart or update quantity if exists
    static async addOrUpdateItem(cart_id, product_id, quantity) {
        const existingItem = await pool.query(
            'SELECT * FROM cartitems WHERE cart_id = $1 AND product_id = $2',
            [cart_id, product_id]
        );

        if (existingItem.rows.length > 0) {
            const newQuantity = existingItem.rows[0].quantity + quantity;
            return this.updateItemQuantity(cart_id, product_id, newQuantity);
        } else {
            const query = `
            INSERT INTO cartitems (cart_id, product_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING *
            `;
            const { rows } = await pool.query(query, [cart_id, product_id, quantity]);
            return rows[0];
        }
    }

    //update item quantity
    static async updateItemQuantity(cart_id, product_id, quantity) {
        if (quantity <= 0) {
            return this.removeItem(cart_id, product_id);
        }

        const query = 
        `
        UPDATE cartitems
        SET quantity = $1
        WHERE cart_id = $2 AND product_id = $3
        RETURNING *
        `;
        const { rows } = await pool.query(query, [quantity, cart_id, product_id]);
        return rows[0];
    }

    //remove item from cart
    static async removeItem(cart_id, product_id) {
        const query = `
        DELETE FROM cartitems
        WHERE cart_id = $1 AND product_id = $2
        RETURNING *
        `;
        const { rows } = await pool.query(query, [cart_id, product_id]);
        return rows[0];
    }

    //clear cart
    static async clearCart(cart_id) {
        const query = `
        DELETE FROM cartitems
        WHERE cart_id = $1
        RETURNING *
        `;
        const { rows } = await pool.query(query, [cart_id]);
        return rows;
    }

    //get cart total
    static async getCartTotal(cart_id) {
        const query = `
        SELECT SUM(ci.quantity * pr.price) AS total
        FROM cartitems ci
        JOIN products pr ON ci.product_id = pr.products_id
        WHERE ci.cart_id = $1
        `;
        const { rows } = await pool.query(query, [cart_id]);
        return rows[0]?.total || 0;
    }
}

export default cartModel;