import express from 'express'
import productController from '../controllers/productController.js';
import upload from '../middleware/multer.js';

const productRouter = express.Router();

console.log("productRouter loaded");


//------------------user----------------------
productRouter.get('/', productController.getAllProducts);
productRouter.get('/:id', productController.getProductById);
productRouter.get('/featured/list', productController.getFeaturedProducts);
productRouter.get('/related/:id', productController.getRelatedProducts);
productRouter.get('/brand/:brand_id', productController.getProductByBrand);
productRouter.get('/all/brands', productController.getAllBrands);
productRouter.get('/all/categories', productController.getAllCategories);
productRouter.get('/stock/:product_id', productController.checkStock);

//-----------------admin------------------------
productRouter.get('/admin', productController.getAllProductsAdmin)
productRouter.post('/',upload.any(), productController.createProduct);
productRouter.put('/:id', productController.updateProduct);
productRouter.delete('/:id', productController.deleteProduct);
productRouter.put('/stock/:product_id', productController.updateStock);

export default productRouter;