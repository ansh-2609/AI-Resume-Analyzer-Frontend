
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  BriefcaseIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { logout } from '../store/authSlice';


function Header({ onMobileMenuOpen }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchRef = useRef(null);

  const isLoggedIn = useSelector((state) => state.auth.isloggedin);

  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    console.log('Login Status:', isLoggedIn);
    // setIsLoggedIn(!!(token && userId));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    dispatch(logout())
    navigate('/login');
    setUserMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  }

  return (
  <header
    className={`sticky top-0 z-30 shadow-md ${
      isLoggedIn ? "lg:pl-64" : ""
    } ${
      isDark
        ? "bg-blue-700 text-white"
        : "bg-blue-600 text-white"
    }`}
  >
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-20 items-center justify-between">

        {/* Logo & Mobile Menu */}
        <div className="flex items-center">
          <button
            onClick={onMobileMenuOpen}
            className={`mr-3 rounded-md p-2 cursor-pointer lg:hidden ${
              isDark ? "hover:bg-blue-800" : "hover:bg-blue-700"
            }`}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <BriefcaseIcon className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xl font-bold">AI Resume Analyzer</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`rounded-full p-1 cursor-pointer ${
                    isDark ? "hover:bg-blue-800" : "hover:bg-blue-700"
                  }`}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500">
                    <UserCircleIcon className="h-full w-full p-1" />
                  </div>
                </button>

                {userMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ring-1 ring-black/5 ${
                      isDark ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    {[
                      { label: "Settings", action: () => navigate("/settings") },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          item.action();
                          setUserMenuOpen(false);
                        }}
                        className={`w-full px-4 py-2 cursor-pointer text-left text-sm ${
                          isDark
                            ? "text-gray-200 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleLogout}
                        className={`w-full px-4 py-2 cursor-pointer text-left text-sm ${
                          isDark
                            ? "text-gray-200 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Logged Out */
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSignup}
                className="hidden md:flex rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-300 cursor-pointer"
              >
                Sign Up
              </button>
              <button
                onClick={handleLogin}
                className={`rounded-md px-4 py-2 cursor-pointer text-sm font-medium ${
                  isDark
                    ? "bg-gray-800 text-white hover:bg-gray-500"
                    : "bg-white text-blue-600 hover:bg-gray-100"
                }`}
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
);
}

export default Header;