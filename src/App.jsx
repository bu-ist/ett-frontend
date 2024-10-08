import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import './App.css';

// Layouts
import RootLayout from './layouts/RootLayout';

// Pages
import Home from './pages/home';
import LogoutPage from './pages/logoutPage';

import ConsentingPage from './pages/consentingPage';

import AuthorizedPage from './pages/authorizedPage';
import SignUpAuthIndPage from './pages/authorized/signUpAuthIndPage';

import EntityPage from './pages/entityPage';
import SysadminPage from './pages/sysadminPage';

import SendInvitationPage from "./pages/sysadmin/sendInvitationPage";
import AcknowledgeEntityPage from "./pages/entity/acknowledgeEntityPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="consenting" element={<ConsentingPage />} />
      <Route path="auth-ind" element={<AuthorizedPage />} />
      <Route path="auth-ind/sign-up" element={<SignUpAuthIndPage />} />
      <Route path="entity" element={<EntityPage />} />
      <Route path="entity/acknowledge" element={<AcknowledgeEntityPage />} />
      <Route path="sysadmin" element={<SysadminPage />} />
      <Route path="sysadmin/send-invitation" element={<SendInvitationPage />} />
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
