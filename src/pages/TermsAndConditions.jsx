// src/pages/TermsAndConditions.jsx
import React from "react";
import Navbar from "../COMPONENTS/Navbar/Navbar";
import Footer1 from "../COMPONENTS/Footer/Footer1";
import Footer2 from "../COMPONENTS/Footer/Footer2";
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  return (
    <>
      <Navbar reloadnavbar={false} />
      <div className="terms-container">
        <section className="terms-header">
          <h1>Terms and Conditions</h1>
          <p>Please read these terms and conditions carefully before using our service.</p>
        </section>

        <section className="terms-section">
          <h2>📋 Preamble</h2>
          <p>
            SustainaFood offers a platform for users to purchase food products from various suppliers. To use the service, the user must accept these terms and conditions without reservation.
          </p>
        </section>

        <section className="terms-section">
          <h2>1. Purpose</h2>
          <p>
            These Terms and Conditions outline the terms under which SustainaFood provides its platform to users to purchase food products from sellers.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Description of the Marketplace</h2>
          <p>
            The platform provides a marketplace for users to connect with vendors, place orders for food products, and make payments directly. SustainaFood is not a seller of the products listed by vendors.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Access to the Marketplace</h2>
          <p>
            Access to the platform is restricted to adults, and requires creating an account with accurate information. Users must maintain the confidentiality of their login credentials.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Service Fees</h2>
          <p>
            Creating an account and accessing the platform is free of charge. However, purchasing products from vendors is subject to pricing as defined in the vendor agreements.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Personal Data</h2>
          <p>
            The personal information collected from users will be used for service provision purposes and may be shared with vendors and delivery services as necessary.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Intellectual Property</h2>
          <p>
            All content on the platform, including text, images, and other materials, is protected by intellectual property laws. Unauthorized reproduction or distribution of platform content is prohibited.
          </p>
        </section>

        <section className="cta">
          <h2>Need More Information?</h2>
          <p>If you have questions, feel free to contact us for further details about our terms and conditions.</p>
          <button onClick={() => window.location.href = "/contact"}>Contact Us 💬</button>
        </section>
      </div>
      <Footer1 />
      <Footer2 />
    </>
  );
};

export default TermsAndConditions;