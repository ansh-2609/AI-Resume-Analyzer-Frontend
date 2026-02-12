
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import {useSelector, useDispatch} from 'react-redux';
import { login } from './store/authSlice';
import { getThemeBackend } from './services/appServices';
import { setTheme } from './store/themeSlice';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isloggedin);
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";


  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      dispatch(login({ token, userId }));
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchTheme = async () => {
      try{
        const theme =  await getThemeBackend();
        if(theme){
          dispatch(setTheme(theme));
        }
      }catch(err){
        console.error('Error fetching theme:', err);
      }
    };

    if(isLoggedIn){
      fetchTheme();
    }
  }, [isLoggedIn, dispatch]);


  return (
  <div
    className={`flex min-h-screen ${
      isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
    }`}
  >
    <div className="flex flex-1 flex-col">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />

      {isLoggedIn && <Sidebar />}

      {mobileMenuOpen && isLoggedIn && (
        <Sidebar
          isMobile
          onClose={() => setMobileMenuOpen(false)}
        />
      )}

      <main
        className={`flex-1 ${
          isLoggedIn ? "lg:pl-64" : ""
        }`}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  </div>
);

}
export default App;