import { pool } from '../config/postgresql.js';
import productModel from '../models/productModel.js';
import connectCloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier'

const cloudinary = connectCloudinary();

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};


//error handling
const handleError = (res, error) => {
    console.error('Database error:', error);
    res.json({ error: 'Internal server error'});
};

//get product with filtering
const productController = {

    getAllProducts: async (req, res) => {
        try{
            const { category_id, brand_id, min_price, max_price, search, limit, offset, spec, use_for } = req.query;

            let query = `
                SELECT p.*, b.brand_name, c.category_name
                FROM products p
                JOIN brands b ON p.brand_id = b.brand_id
                JOIN categories c ON p.category_id = c.categories_id
                WHERE 1=1
            `;

            const params = []; //filter

            if (category_id) {
                query += ` AND p.category_id = $${params.length + 1}`;
                params.push(category_id); 
            }

            if (brand_id) {
                const brandIds = brand_id.split(',').filter(Boolean);
                if (brandIds.length > 0) {
                    query += ` AND p.brand_id = ANY($${params.length + 1})`;
                    params.push(brandIds);
                }
            }

            if (min_price) {
                query += ` AND p.price >= $${params.length + 1}`;
                params.push(min_price);
            }

            if (max_price) {
                query += ` AND p.price <= $${params.length + 1}`;
                params.push(max_price);
            }

            if (search) {
                query += ` AND (p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`;
                params.push(`%${search}%`);
            }

            //JSONB
            if (spec) {
                try {
                    const specFilter = JSON.parse(spec);
                    Object.entries(specFilter).forEach(([key, value]) => {
                        query += ` AND p.specifications->>'${key}' ILIKE $${params.length + 1}`;
                        params.push(`%${value}%`);
                    });
                } catch (error) {
                    return res.json({ error: 'Invalid spec filter format'});
                }
            }
            
            if (use_for) {
                const useForItems = use_for.split(',').filter(Boolean);
                if (useForItems.length > 0) {
                    const useForConditions = useForItems.map((_, index) => 
                        `p.use_for::text ILIKE $${params.length + index + 1}`
                    ).join(' OR ');
                    query += ` AND (${useForConditions})`;
                    useForItems.forEach(item => params.push(`%${item}%`));
                }
            }

            query += ' ORDER BY p.created_at DESC';

            //add page if limit is provided
            if (limit) {
                query += `LIMIT $${params.length + 1}`;
                params.push(limit)
            }

            if (offset) {
                query += ` OFFSET $${params.length + 1}`;
                params.push(offset);
            }

            const { rows } = await pool.query(query, params);
            res.json(rows);

        } catch(error){
            handleError(res,error);
        }
    },

    // Get product details by id
    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const query = `
            SELECT
                p.*, 
                b.brand_name, 
                c.category_name
            FROM products p
            JOIN brands b ON p.brand_id = b.brand_id
            JOIN categories c ON p.category_id = c.categories_id
            WHERE p.products_id = $1
            `;
            const { rows } = await pool.query(query, [id]);

            if (rows.length === 0) {
                return res.status(404).json({error: 'Product not found'});
            }

            //convert JSONB spec to object if exist
            const product = rows[0];
            if (product.specifications) {
                product.specifications = JSON.parse(JSON.stringify(product.specifications));
            }
            
            res.json(product);
        } catch (error) {
            handleError(res, error);
        }
    },

    //get features products
    getFeaturedProducts: async (req, res) => {
        try {
            const query = `
            SELECT p.*, b.brand_name, c.category_name
            FROM products p
            JOIN brands b ON p.brand_id = b.brand_id
            JOIN categories c ON p.category_id = c.categories_id
            WHERE p.is_featured = true
            ORDER BY p.created_at DESC
            LIMIT 8
            `;

            const { rows } = await pool.query(query);
            res.json(rows);

        } catch (error) {
            handleError(res, error);
        }
    },

    //get related products
    getRelatedProducts: async (req, res) => {
        try {
            const { id } = req.params;
            const query = `
            SELECT p.*, brand_name, c.category_name
            FROM products p
            JOIN brands b ON p.brand_id = b.brand_id
            JOIN categories c ON p.category_id = c.categories_id
            WHERE p.category_id = (
                SELECT category_id FROM products WHERE products_id = $1
            )
            AND p.products_id != $1
            ORDER BY RANDOM()
            LIMIT 4
            `;
            const { rows } = await pool.query(query, [id]);
            res.json(rows);
        } catch (error) {
            handleError(res, error)
        }
    },

    //get product by brand
    getProductByBrand: async (req, res) => {
        try {
            const { brand_id } = req.params;
            const query = `
            SELECT p.*, b.brand_name, c.category_name
            FROM products p
            JOIN brands b ON p.brand_id = b.brand_id
            JOIN categories c ON p.category_id = c.categories_id
            WHERE p.brand_id = $1
            ORDER BY p.created_at DESC
            `

            const { rows } = await pool.query(query, [brand_id]);
            res.json(rows);
        } catch (error) {
            handleError(res, error);
        }
    },

    //create new product (Admin only)
    createProduct: async (req, res) => {
    try {
        const { 
            name, 
            brand_id, 
            category_id, 
            price, 
            description, 
            stock_quantity, 
            is_featured, 
            specifications,
            use_for: useForInput, // renamed to avoid shadowing
        } = req.body;
        console.log("Received use_for:", useForInput);

        const image_urls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const imageUrl = await uploadToCloudinary(file.buffer);
                image_urls.push(imageUrl);
            }
        }

        if (!name || !brand_id || !category_id || !price || image_urls.length === 0 || !useForInput) {
            return res.json({
                success: false,
                message: 'Missing required fields (name, brand_id, category_id, price, at least 1 image, and use_for)'
            });
        }

        const productData = {
            name,
            brand_id: Number(brand_id),
            category_id: Number(category_id),
            price: Number(price),
            description: description || null,
            image_urls,
            stock_quantity: stock_quantity ? Number(stock_quantity) : 0,
            is_featured: is_featured === "true" || is_featured === true,
            specifications: specifications ? JSON.parse(specifications) : null,
            use_for: (() => {
                try {
                    if (typeof useForInput === 'string') {
                        const parsed = JSON.parse(useForInput);
                        return Array.isArray(parsed) ? parsed : [parsed];
                    } else if (Array.isArray(useForInput)) {
                        return useForInput;
                    }
                    return useForInput ? [useForInput] : null;
                } catch {
                    return useForInput ? [useForInput] : null;
                }
            })()

        };

        const newProduct = await productModel.create(productData);

            res.json({
                success: true,
                message: "Product added successfully",
                product: newProduct
            });

        } catch (error) {
            console.error('Add product error:', error);
            res.json({
                success: false,
                message: error.message || 'Failed to add product'
            });
        }
    },

    //get all product data
    getAllProductsAdmin: async (req, res) => {
        try {
        const products = await productModel.findAll(); 
        res.json({
            success: true,
            products
        });
        } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
        }
    },

    //update products (admin only)
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                name,
                brand_id,
                category_id,
                price,
                description,
                image_urls,
                stock_quantity,
                is_featured,
                specifications
            } = req.body;

            const query = `
            UPDATE products
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
                updated_at = NOW()
            WHERE products_id = $10
            RETURNING *
            `;

            const { rows } = await pool.query(query, [
                name,
                brand_id,
                category_id,
                price,
                description,
                image_urls,
                stock_quantity,
                is_featured || false,
                specifications || null,
                id
            ]);

            if (rows.length === 0) {
                return res.json({ error: "Product not found "});
            }

            res.json(rows[0]);
        } catch (error) {
            handleError(res, error)
        }
    },

    //delete product (admin)
     deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const query = 'DELETE FROM products WHERE products_id = $1 RETURNING *';
            const { rows } = await pool.query(query, [id]);
            
            if (rows.length === 0) {
                return res.json({error: 'Product not found'});
            }

            res.json({ message: 'Product deleted successfully'});
        } catch (error) {
            handleError(res, error);
        }
    },

    //get all brand
    getAllBrands:async (req, res) => {
        try {
            const query = 'SELECT * FROM brands ORDER BY brand_name';
            const { rows } = await pool.query(query);
            res.json(rows);
        } catch (error) {
            handleError(res, error);
        }
    },

    //get all product by category
    getAllCategories: async (req, res) => {
        try {
            const query = 'SELECT * FROM categories ORDER BY category_name';
            const { rows } = await pool.query(query);
            res.json(rows);
        } catch (error) {
            handleError(res, error)
        }
    },

    //check product stock
    checkStock: async (req, res) => {
        try {
            const { product_id } = req.params;
            const query = 'SELECT stock_quantity FROM products WHERE products_id = $1';
            const { rows } = await pool.query(query, [product_id]);

            if (rows.length === 0) {
                return res.json({ error: 'Product not found'});
            }

            res.json({ stock_quantity : rows[0].stock_quantity});
        } catch (error) {
            handleError(res, error)
        }
    },

    //update product stock (admin or after order)
    updateStock: async (req, res) => {
        try {
            const { product_id } = req.params;
            const { quantity } = req.body;

            const query = `
            UPDATE products
            SET stock_quantity = stock_quantity + $1
            WHERE products_id = $2
            RETURNING stock_quantity
            `;

            const { rows } = await pool.query(query, [quantity, product_id]);

            if (rows.length === 0) {
                return res.json({ error: 'Product not found'});
            }

            res.json({ stock_quantity : rows[0].stock_quantity });
        } catch (error) {
            handleError(res, error)
        }
    }
};

export default productController;