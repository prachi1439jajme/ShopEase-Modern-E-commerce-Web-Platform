// Footer.js

import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-bold mb-2">Shopping24</h5>
            <ul>
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:underline">
                  MyCart
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:underline">
                  Category
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-2">Support</h5>
            <ul>
              <li>
                <Link href="#" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-2">Follow Us</h5>
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="https://www.facebook.com/jagmohanrai082"
                  className="hover:underline"
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.linkedin.com/in/jagmohan-rai1/"
                  className="hover:underline"
                >
                  Linkedin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-2">Best Offers</h5>
            <form>
              <input
                type="email"
                className="w-full px-4 py-2 mb-4 text-gray-900 rounded"
                placeholder="Your email address"
              />
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2024 Shipping24 E-commerce Site. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
