import { Routes, Route } from "react-router-dom"

// Auth - user
import AuthRequired from './app/Auth/AuthRequired';

import UserAuth from './app/Auth/User/UserAuth';
import UserLoginForm from './app/Auth/User/UserAuthForms/UserLoginForm';
import UserRegisterForm from "./app/Auth/User/UserAuthForms/UserRegisterForm"
import UserForgotPassword from "./app/Auth/User/UserForgotPassword";

// Auth - admin
import AdminAuth from "./app/Auth/Admin/AdminAuth"
import AdminLoginForm from "./app/Auth/Admin/AdminAuthForms/AdminLoginForm"
import AdminRegisterForm from "./app/Auth/Admin/AdminAuthForms/AdminRegisterForm"
import AdminForgotPassword from "./app/Auth/Admin/AdminForgotPassword"

// Utilitarian
import Primary from './app/UtilitarianPages/Primary';
import NotFound from './app/UtilitarianPages/NotFound';
import Forbidden from "./app/UtilitarianPages/Forbidden";

// Admin Functional
import AdminMainPage from "./app/AdminFunctional/AdminMainPage";

import CreateFieldPage from "./app/AdminFunctional/Tabs/CreateFieldPage";
import AllFieldsPage from "./app/AdminFunctional/Tabs/AllFieldsPage";
import EditFieldPage from "./app/AdminFunctional/Tabs/EditFieldPage";

import AdminSettings from "./app/AdminFunctional/Tabs/AdminSettings";
import AdminSupport from "./app/AdminFunctional/Tabs/AdminSupport";

// User Functional
import UserMainPage from "./app/UserFunctional/UserMainPage";

import AvailableFields from "./app/UserFunctional/Tabs/AvailableFields";
import GamePage from "./app/UserFunctional/Tabs/GamePage";

import UserSettings from "./app/UserFunctional/Tabs/UserSettings";
import UserSupport from "./app/UserFunctional/Tabs/UserSupport"

function App() {
  return (
    <Routes>

      <Route element={<AuthRequired />}>
        <Route path="/" element={<Primary />} />

        <Route element={<AdminMainPage />}>
          <Route path="/admin/createField" element={<CreateFieldPage />} />
          <Route path="/admin/allfields" element={<AllFieldsPage />} />
          <Route path="/admin/editField/:fieldID" element={<EditFieldPage />} />

          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/support" element={<AdminSupport />} />
        </Route>

        <Route element={<UserMainPage />}>
          <Route path="/user/availableFields" element={<AvailableFields />} />
          <Route path="/user/game/:fieldID" element={<GamePage />} />

          <Route path="/user/settings" element={<UserSettings />} />
          <Route path="/user/support" element={<UserSupport />} />
        </Route>
      </Route>

      <Route element={<UserAuth />}>
        <Route path="/userauth/login" element={<UserLoginForm />} />
        <Route path="/userauth/register" element={<UserRegisterForm />} />
      </Route>

      <Route path="/userauth/forgotpassword" element={<UserForgotPassword />} />

      <Route element={<AdminAuth />} >
        <Route path="/adminauth/login" element={<AdminLoginForm />} />
        <Route path="/adminauth/register" element={<AdminRegisterForm />} />
      </Route>

      <Route path="/adminauth/forgotpassword" element={<AdminForgotPassword />} />

      <Route path="/*" element={<NotFound />} />
      <Rout path="/unauthorised" element={<Unauthorised />} />

    </Routes>
  );
}

export default App;
