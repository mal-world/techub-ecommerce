import React, { useState, useEffect } from "react";
import Product from "./Product.jsx";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleSave = (savedProduct) => {
    // update product list with savedProduct
    setProducts((prev) => {
      const exists = prev.find(p => p.products_id === savedProduct.products_id);
      if (exists) {
        return prev.map(p => p.products_id === savedProduct.products_id ? savedProduct : p);
      }
      return [savedProduct, ...prev];
    });
  };

  return (
    <div>
      <h1>Products</h1>
      <button onClick={handleAddClick}>Add New Product</button>
      <ul>
        {products.map(product => (
          <li key={product.products_id}>
            {product.name} (${product.price}) — {product.category_name}
            <button onClick={() => handleEditClick(product)}>Edit</button>
          </li>
        ))}
      </ul>
      {modalOpen && (
        <Product
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          product={editingProduct}
          categories={[]} // you can pass real categories here
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProductsList;
