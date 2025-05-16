import React from "react";
import Header from "../../components/Header";
import HeroSection from "./components/HeroSection";
import CatalogPage from "./components/CatalogPage";
import SearchAndFilter from "./components/SearchAndFilter";
import DonationList from "./components/DonationList";
import Statistics from "./components/Statistics";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";
import FloatingActionButton from "../../components/FloatingActionButton";
import Footer from "../../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <HeroSection />
      <CatalogPage />
      {/* <SearchAndFilter /> */}
      {/* <DonationList /> */}
      <Statistics />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default HomePage;