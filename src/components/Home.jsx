// HomeSimple.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomeSimple = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  const isloggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
  <div
    className={`min-h-screen px-4 py-8 lg:px-8 ${
      isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
    }`}
  >
    {/* Hero Section */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <h1
          className={`text-5xl md:text-7xl font-bold mb-6 ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          AI Resume Analyzer
          <span className="block text-blue-600">
            Job Matching Platform
          </span>
        </h1>

        <p
          className={`text-xl mb-10 max-w-3xl mx-auto ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Upload your resume. Get matched with perfect jobs. Prepare for interviews.
          All powered by artificial intelligence.
        </p>
        
        {isloggedIn && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              Get Started Free
            </Link>
          </div>
        )}
        
      </div>
    </div>

    {/* Features */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Smart Resume Analysis",
            desc: "AI extracts skills, experience, and achievements from your resume automatically.",
            emoji: "📄",
          },
          {
            title: "Intelligent Job Matching",
            desc: "Get match scores and explanations for why you're a good fit for each job.",
            emoji: "🎯",
          },
          {
            title: "Interview Preparation",
            desc: "Generate personalized interview questions based on specific job requirements.",
            emoji: "💼",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-4xl mb-4">{feature.emoji}</div>
            <h3
              className={`text-2xl font-bold mb-3 ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {feature.title}
            </h3>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>

  </div>
);

};

export default HomeSimple;

