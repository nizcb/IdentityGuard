import React from "react";
import Banner from "./components/banner/Banner.jsx";
import Contact from "./components/contact/Contact.jsx";
import Features from "./components/features/Features.jsx";
import Footer from "./components/footer/Footer.jsx";
import FooterBottom from "./components/footer/FooterBottom.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import Projects from "./components/projects/Projects.jsx";
import Resume from "./components/resume/Resume.jsx";
import Testimonial from "./components/tesimonial/Testimonial.jsx";
export default function Home() {
  return (
    <div className="w-full h-auto bg-bodyColor text-lightText px-4">
      <div className="max-w-screen-xl mx-auto">
        <Banner />
        <Features />
      </div>
    </div>
  );
}