import React from "react";
import Header from "../../components/Header";
import HeroSection from "./components/HeroSection";
import SearchAndFilter from "./components/SearchAndFilter";
import DonationList from "./components/DonationList";
import Statistics from "./components/Statistics";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";
import Footer from "../../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <HeroSection />
      <SearchAndFilter />
      <DonationList />
      <Statistics />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;