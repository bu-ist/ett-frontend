import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import './App.css';

// Layouts
import RootLayout from './layouts/RootLayout';

// Pages
import Home from './pages/home';
import LogoutPage from './pages/logoutPage';

import ConsentingPage from './pages/consentingPage';
import AuthorizedPage from './pages/authorizedPage';
import EntityPage from './pages/entityPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="consenting" element={<ConsentingPage />} />
      <Route path="auth-ind" element={<AuthorizedPage />} />
      <Route path="entity" element={<EntityPage />} />
      <Route path="logout" element={<LogoutPage />} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
