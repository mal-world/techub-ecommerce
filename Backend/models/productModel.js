import { pool } from "../config/postgresql.js";

class productModel {
    static #parseSpecs(product) {
        if (!product) return null;
        return {
            ...product,
            specifications: product.specifications
            ? JSON.parse(JSON.stringify(product.specifications))
            : null
        };
    }

    //get all product with filters
    static async findAll(filters = {}) {
        const {
            category_id, 
            brand_id, 
            min_price, 
            max_price, 
            search, 
            limit, 
            offset,
            spec
        } = filters;

        let query = `
        SELECT
            p.products_id, p.name, p.price, p.description,
            p.image_url, p.stock_quantity, p.is_featured, p.specifications,
            b.brand_name, c.category_name
        FROM products p
        JOIN brands b ON p.brand_id = b.brand_id
        JOIN categories c ON p.category_id = c.categories_id
        WHERE 1=1
        `;

        const params = [];

        //filtering
        if(category_id) {
            query += ` AND p.category_id = $${params.length + 1}`;
            params.push(category_id);
        }

        if(brand_id) {
            query += ` AND p.brand_id = $${params.length + 1}`;
            params.push(brand_id);
        }

        if(min_price) {
            query += ` AND p.price >= $${params.length + 1}`;
            params.push(min_price);
        }

        if(max_price) {
            query += ` AND p.price <= $${params.length + 1}`;
            params.push(max_price);
        }

        if(search) {
            query += ` AND (p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`;
            params.push(`%${search}%`);
        }

        if(spec) {
            Object.entries(spec).forEach(([key, value]) => {
                query += ` AND specifications->>'${key}' = $${params.length + 1}`;
                params.push(value);
            });
        }

        query += ' ORDER BY p.products_id DESC';

        if(limit) {
            query += ` LIMIT $${params.length + 1}`;
            params.push(limit);
        }

        if(offset) {
            query += ` OFFSET $${params.length + 1}`;
            params.push(offset);
        }

        const { rows } = await pool.query(query, params);
        return rows.map(this.#parseSpecs);
    }

    //get single product by ID
    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT
                p.*,
                b.brand_name,
                c.category_name
            FROM products p
            JOIN brands b ON p.brand_id = b.brand_id
            JOIN categories c ON p.category_id = c.categories_id
            WHERE p.products_id = $1`,
            [id]
        );
        return this.#parseSpecs(rows[0]);
    }

    //create product
    static async create(productData) {
  const { rows } = await pool.query(
    `INSERT INTO products (
      name, brand_id, category_id, price,
      description, image_urls, stock_quantity,
      is_featured, specifications, use_for
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      productData.name,
      productData.brand_id,
      productData.category_id,
      productData.price,
      productData.description,
      JSON.stringify(productData.image_urls),
      productData.stock_quantity || 0,
      productData.is_featured || false,
      productData.specifications ? JSON.stringify(productData.specifications) : null,
      productData.use_for ? JSON.stringify(productData.use_for) : null
    ]
  );
  return this.#parseSpecs(rows[0]);
}


    //update product
    static async update(id, updates) {
        const { rows } = await pool.query(
            `UPDATE products
            SET
                name = $1,
                brand_id = $2,
                category_id = $3,
                price = $4,
                description = $5,
                image_urls = $6,
                stock_quantity = $7,
                is_featured = $8,
                specifications = $9,
                use_for = $10
            WHERE products_id = $11
            RETURNING *`,
            [
                updates.name,
                updates.brand_id,
                updates.category_id,
                updates.price,
                updates.description,
                updates.image_url,
                updates.stock_quantity,
                updates.is_featured,
                updates.specifications,
                updates.use_for,
                id
            ]
        );
        return this.#parseSpecs(rows[0]);
    }

    //delete product
    static async delete(id) {
        const { rowCount} = await pool.query(
            `DELETE FROM products WHERE products_id = $1`,
            [id]
        );
        return rowCount > 0;
    }

    static async updateStock(product_id, newQuantity) {
        const query = `
            UPDATE products
            SET stock_quantity = $1
            WHERE products_id = $2
        `;
        await pool.query(query, [newQuantity, product_id]);
    }

}

export default productModel;