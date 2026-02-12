
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import Dashboard from './components/Dashboard.jsx';
import App from './App.jsx';
import JobMatcher from './components/JobMatcher.jsx';
import './App.css';
import Login from './components/auth/login.jsx';
import Signup from './components/auth/signup.jsx';
import { store } from './store/index.js';
import HomeSimple from './components/Home.jsx';
import Application from './components/Application.jsx';
import Settings from './components/Setting.jsx';
import InterviewPrep from './components/InterviewPrep.jsx';
import InterviewPrepDetail from './components/InterviewPrepDetail.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomeSimple/> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/jobmatcher", element: <JobMatcher /> },
      { path: "/applications", element: <Application /> },
      { path: "/interview", element: <InterviewPrep /> },
      { path: "/frontend-interview-questions", element: <InterviewPrepDetail /> },
      { path: "/react-interview-questions", element: <InterviewPrepDetail /> },
      { path: "/backend-interview-questions", element: <InterviewPrepDetail /> },
      { path: "/data-interview-questions", element: <InterviewPrepDetail /> },
      { path: "/devops-interview-questions", element: <InterviewPrepDetail /> },
      { path: "/settings", element: <Settings /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> }
    ]
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </StrictMode>
);