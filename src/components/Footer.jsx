
import { useState } from 'react';
import {useSelector} from 'react-redux';  
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub
} from 'react-icons/fa';

function Footer() {
  const [email, setEmail] = useState('');

  const isLoggedIn = useSelector((state) => state.auth.isloggedin);
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  const features = [
    'AI Resume Analysis',
    'Job Matching',
    'Interview Preparation',
    'Application Tracking',
    'Skill Gap Analysis',
    'Real-time Updates',
  ];

  return (
  <footer
    className={`mt-auto border-t ${
      isLoggedIn ? "lg:pl-64" : ""
    } ${
      isDark
        ? "bg-gray-900 border-gray-700 text-gray-300"
        : "bg-gray-50 border-gray-200 text-gray-900"
    }`}
  >
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-150 md:grid-cols-2 lg:grid-cols-2">

        {/* Company Info */}
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <BriefcaseIcon className="h-6 w-6 text-white" />
            </div>
            <h3
              className={`text-lg font-bold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              AI Resume Analyzer
            </h3>
          </div>

          <p
            className={`mt-4 text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            We use artificial intelligence to help job seekers find the perfect
            career opportunities. Upload your resume, get matched with jobs,
            and ace your interviews.
          </p>
        </div>

        {/* Features */}
        <div>
          <h3
            className={`text-lg font-semibold ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Features
          </h3>
          <ul className="mt-4 space-y-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-center">
                <span className="mr-2 text-blue-600">•</span>
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`mt-8 border-t pt-8 ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex flex-col items-center justify-between md:flex-col md:items-center gap-4">
          <p
            className={`text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            © {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.
          </p>

          <p
            className={`text-sm ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Made with ❤️ for job seekers everywhere
          </p>
        </div>

        <div className="mt-4 text-center">
          
        </div>
      </div>
    </div>
  </footer>
);


}

export default Footer;