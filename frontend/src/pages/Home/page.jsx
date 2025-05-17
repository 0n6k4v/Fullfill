"use client";

import React from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import DonationList from "./components/DonationList";
import Statistics from "./components/Statistics";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import CatalogPage from "./components/CatalogPage";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* <Header /> */}
      {/* <HeroSection /> */}
      <CatalogPage />
      {/* <Statistics /> */}
      {/* <HowItWorks /> */}
      {/* <Testimonials />
      <CTASection /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default page;
