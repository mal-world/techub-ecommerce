import { pool } from "../config/postgresql.js";

class addressModel {
    static async create({ user_id, first_name, last_name, address1, city, post_code, state, phone_number}) {
        const query = `
        INSERT INTO address (user_id, first_name, last_name, address1, city, post_code, state, phone_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `;

        const values = [user_id, first_name, last_name, address1, city, post_code, state, phone_number];
        const { rows } = await pool.query(query, values);
        return rows;
    }

    static async findByUserId(user_id) {
        const query = 'SELECT * FROM address WHERE user_id = $1';
        const { rows } = await pool.query(query, [user_id]);
        return rows[0];
    }

    static async findById(address_id) {
        const query = 'SELECT * FROM address WHERE address_id = $1';
        const { rows } = await pool.query(query, [address_id]);
        return rows[0] || null;
    }

    static async update(address_id, updates) {
        const {first_name, last_name, address1, city, post_code, state, phone_number} = updates;
        const query = `
        UPDATE address
        SET first_name = $1, last_name = $2, address1 = $3, city = $4, post_code = $5, state = $6, phone_number = $7
        WHERE address_id = $8
        RETURNING *
        `;
        const values = [first_name, last_name, address1, city, post_code, state, phone_number, address_id];
        const { rows } = await pool.query(query, values);
        return rows[0] || null;
    }

    static async delete(address_id) {
        const query = 'DELETE FROM address WHERE address_id = $1 RETURNING *';
        const { rows } = await pool.query(query, [address_id]);
        return rows[0] || null;
    }
}

export default addressModel;