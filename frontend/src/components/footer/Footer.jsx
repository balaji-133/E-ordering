import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className="footer" id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" />
                <p>Experience delicious flavors, fresh ingredients, and warm hospitality at [Restaurant Name], where every meal is crafted to create unforgettable dining moments.</p>
                <footer-social-icons>
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </footer-social-icons>
            </div>
            <div className="footer-content-center">
                <h2>Company</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>

            </div>
            <div className="footer-content-right">
                <h2>Get in touch</h2>
                <ul>
                    <li>8074254343</li>
                    <li>contact@balo.com</li>
                </ul>
            </div>
        </div>
        <hr />
        <div className="footer-copyright">Copyright 2024 &copy </div>
    </div>
  )
}

export default Footer