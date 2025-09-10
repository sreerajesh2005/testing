import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCart";
import "../styles/Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Mock banner data - in a real app, this would come from your backend
  const bannerSlides = [
    {
      title: "Summer Sale",
      subtitle: "Up to 50% off on all electronics",
      image: "https://via.placeholder.com/1200x400/4A90E2/FFFFFF?text=Summer+Sale",
      cta: "Shop Now",
      ctaLink: "/products?category=electronics"
    },
    {
      title: "New Arrivals",
      subtitle: "Check out the latest gadgets",
      image: "https://via.placeholder.com/1200x400/50C878/FFFFFF?text=New+Arrivals",
      cta: "Discover",
      ctaLink: "/products?new=true"
    },
    {
      title: "Free Shipping",
      subtitle: "On all orders over $99",
      image: "https://via.placeholder.com/1200x400/FF6B6B/FFFFFF?text=Free+Shipping",
      cta: "Learn More",
      ctaLink: "/shipping"
    }
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:9000/api/products?limit=4", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load products");

        const data = await res.json();

        const arr = Array.isArray(data.products)
          ? data.products
          : Array.isArray(data)
          ? data
          : [];

        const normalized = arr.map((p) => ({ ...p, id: p._id }));
        setProducts(normalized);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // Auto-rotate banner slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  };

  return (
    <div className="home-container">
      {/* Hero Banner Carousel */}
      <section className="hero-banner">
        <div className="banner-slides">
          {bannerSlides.map((slide, index) => (
            <div 
              key={index} 
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="banner-overlay">
                <div className="container">
                  <div className="banner-content">
                    <h1>{slide.title}</h1>
                    <p>{slide.subtitle}</p>
                    <Link to={slide.ctaLink} className="cta-button">
                      {slide.cta}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Banner Navigation */}
        <button className="banner-nav banner-prev" onClick={goToPrevSlide}>
          &#8249;
        </button>
        <button className="banner-nav banner-next" onClick={goToNextSlide}>
          &#8250;
        </button>
        
        {/* Banner Indicators */}
        <div className="banner-indicators">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products container">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="view-all-btn">
            View All
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <h3>Limited Time Offer</h3>
            <p>Get 20% off your first order with code WELCOME20</p>
            <Link to="/products" className="promo-button">
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}