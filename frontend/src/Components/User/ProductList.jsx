import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const res = await axios.get("http://localhost:7000/products");
      setProducts(res.data);
      setFilteredProducts(res.data);

      const uniqueBrands = [...new Set(res.data.map(prod => prod.brand))];
      setBrands(uniqueBrands);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Apply filters: brand, price, search
  useEffect(() => {
    let filtered = [...products];

    if (selectedBrand) {
      filtered = filtered.filter(prod => prod.brand === selectedBrand);
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(prod => prod.price >= min && prod.price <= max);
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(prod =>
        prod.title.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [selectedBrand, priceRange, searchTerm, products]);

  useEffect(() => {
    getAllProducts();
  }, []);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mt-5">
      {/* Filter & Search Controls */}
      <div className="box mb-4">
        <div className="columns is-multiline">
          {/* Search Bar */}
          <div className="column is-4">
            <label className="label">Search by Title</label>
            <input
              type="text"
              className="input"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Brand Filter */}
          <div className="column is-4">
            <label className="label">Filter by Brand</label>
            <div className="select is-fullwidth">
              <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                <option value="">All Brands</option>
                {brands.map((brand, index) => (
                  <option key={index} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Filter */}
          <div className="column is-4">
            <label className="label">Filter by Price</label>
            <div className="select is-fullwidth">
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                <option value="">All Prices</option>
                <option value="0-999">Below ₹1000</option>
                <option value="1000-5000">₹1000 - ₹5000</option>
                <option value="5001-10000">₹5001 - ₹10000</option>
                <option value="10001-50000">Above ₹10000</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* No Products Message */}
      {filteredProducts.length === 0 ? (
        <div className="notification is-warning has-text-centered is-light is-size-5">
          🚫 No products found matching your search or filters.
        </div>
      ) : (
        <>
          <div className="columns is-multiline">
            {currentProducts.map((prod, index) => (
              <div key={index} className="column is-3">
                <div className="card">
                  <div className="card-image px-4 py-4">
                    <figure className="image is-4by3">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        style={{ objectFit: "contain", height: "200px", width: "100%" }}
                      />
                    </figure>
                  </div>
                  <div className="card-content">
                    <p className="title is-5" style={{ minHeight: '2.8em' }}>
                      {prod.title}
                    </p>
                    <p><strong>Price: ₹{prod.price}</strong></p>
                    <p><em>Brand: {prod.brand}</em></p>
                  </div>
                  <footer className="card-footer">
                    <Link
                      to={`/Details/${prod.id}`}
                      className="card-footer-item has-background-link has-text-white has-text-weight-bold"
                    >
                      View details
                    </Link>
                  </footer>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav className="pagination is-centered mt-6" role="navigation" aria-label="pagination">
              <ul className="pagination-list">
                {[...Array(totalPages).keys()].map((num) => (
                  <li key={num}>
                    <button
                      className={`pagination-link ${currentPage === num + 1 ? 'is-current' : ''}`}
                      onClick={() => handlePageChange(num + 1)}
                    >
                      {num + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
