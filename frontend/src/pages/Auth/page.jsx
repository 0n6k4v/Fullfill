'use client';

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    // Simple password strength calculator
    let strength = 0;
    if (password.length > 6) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    setPasswordStrength(strength);
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {activeTab === "login" ? "Welcome" : "Join Fulfill"}
              </h2>
              <p className="text-gray-600">
                {activeTab === "login"
                  ? "Sign in to continue your donation journey"
                  : "Create an account to start making a difference"}
              </p>
            </div>

            {activeTab === "login" ? (
              <LoginForm
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                setActiveTab={setActiveTab}
              />
            ) : (
              <RegisterForm
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                passwordStrength={passwordStrength}
                handlePasswordChange={handlePasswordChange}
                setActiveTab={setActiveTab}
              />
            )}
          </div>

          {/* Image Section */}
          <div className="hidden md:block w-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 p-12 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-6">
                Connect, Give, Fulfill
              </h2>
              <p className="text-xl mb-8">
                Join our platform where we make it easy to match donors and
                recipients seamlessly, making the giving process efficient and
                meaningful.
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                <div className="flex justify-center mb-4">
                  <img
                    src="https://readdy.ai/api/search-image?query=A%20diverse%20group%20of%20people%20happily%20exchanging%20donation%20items%2C%20showing%20community%20support%20and%20generosity.%20The%20image%20has%20soft%20lighting%20with%20a%20modern%20minimalist%20background%20that%20emphasizes%20human%20connection%20and%20charitable%20giving&width=400&height=300&seq=1&orientation=landscape"
                    alt="People exchanging donations"
                    className="rounded-lg w-full h-48 object-cover object-top"
                  />
                </div>
                <p className="text-white/90 italic">
                  "Fulfill has transformed how we connect donors with those in
                  need. The platform is intuitive and makes the entire process
                  seamless."
                </p>
                <p className="mt-2 font-semibold">
                  - Sarah Johnson, Community Organizer
                </p>
              </div>

              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-4xl font-bold">3,582</div>
                  <div className="text-white/80">Successful Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">247</div>
                  <div className="text-white/80">Partner Organizations</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">92%</div>
                  <div className="text-white/80">Match Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AuthPage;