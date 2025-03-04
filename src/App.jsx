import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import './App.css';

// Layouts
import RootLayout from './layouts/RootLayout';

// Pages
import Home from './pages/home';
import LogoutPage from './pages/logoutPage';
import NotFoundPage from './pages/notFoundPage';
import AboutPage from './pages/aboutPage';
import PrivacyPolicyPage from "./pages/privacyPolicyPage";
import TermsOfUsePage from "./pages/termsOfUsePage";

import ConsentingPage from './pages/consentingPage';
import ConsentingRegisterPage from './pages/consenting/consentingRegisterPage';
import ConsentFormPage from "./pages/consenting/consentFormPage";
import NewContactListPage from './pages/consenting/newContactListPage';

import AuthorizedPage from './pages/authorizedPage';
import SignUpAuthIndPage from './pages/authorized/signUpAuthIndPage';

import EntityPage from './pages/entityPage';
import SysadminPage from './pages/sysadminPage';

import SendInvitationPage from "./pages/sysadmin/sendInvitationPage";
import SupportProRegisterPage from './pages/entity/supportProRegisterPage';

import AmendRegistrationPage from './pages/amendRegistrationPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="consenting" element={<ConsentingPage />} />
      <Route path="consenting/register" element={<ConsentingRegisterPage />} />
      <Route path="consenting/consent-form" element={<ConsentFormPage />} />
      <Route path="consenting/add-exhibit-form" element={<NewContactListPage />} />
      <Route path="consenting/add-exhibit-form/other" element={<NewContactListPage />} />
      <Route path="consenting/add-exhibit-form/current" element={<NewContactListPage />} />
      <Route path="consenting/add-exhibit-form/both" element={<NewContactListPage />} />
      <Route path="auth-ind" element={<AuthorizedPage />} />
      <Route path="auth-ind/sign-up" element={<SignUpAuthIndPage />} />
      <Route path="entity" element={<EntityPage />} />
      <Route path="entity/register" element={<SupportProRegisterPage />} />
      <Route path="amend" element={<AmendRegistrationPage />} />
      <Route path="sysadmin" element={<SysadminPage />} />
      <Route path="sysadmin/send-invitation" element={<SendInvitationPage />} />
      <Route path="logout" element={<LogoutPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="privacy" element={<PrivacyPolicyPage />} />
      <Route path="terms" element={<TermsOfUsePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
