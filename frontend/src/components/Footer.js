import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ===== Top Links ===== */}
        <div className="footer-links">
          <div className="footer-column">
            <h6>Shop</h6>
            <ul>
              <li><a href="/women">Women</a></li>
              <li><a href="/men">Men</a></li>
              <li><a href="/kids">Kids</a></li>
              <li><a href="/new">New Arrivals</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h6>Help</h6>
            <ul>
              <li><a href="/faq">FAQs</a></li>
              <li><a href="/shipping">Shipping</a></li>
              <li><a href="/returns">Returns</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h6>Company</h6>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/stores">Store Locator</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/press">Press</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h6>Legal</h6>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* ===== Bottom Section ===== */}
        <div className="footer-bottom">
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>

          <div className="footer-meta">
            <select>
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
            </select>
            <select>
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>INR (₹)</option>
            </select>
          </div>
        </div>

        <div className="footer-copy">
          <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
