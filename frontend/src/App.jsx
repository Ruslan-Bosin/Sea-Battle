import { Routes, Route } from "react-router-dom"
import Primary from './app/UtilitarianPages/Primary';
import UserAuth from './app/Auth/UserAuth';
import AdminAuth from "./app/Auth/AdminAuth"
import NotFound from './app/UtilitarianPages/NotFound';
import AuthRequired from './app/Auth/AuthRequired';
import LoginForm from './app/Auth/UserAuthForms/LoginForm';
import RegisterForm from "./app/Auth/UserAuthForms/RegisterForm"
import AllFieldsPage from "./app/AdminFunctional/Tabs/AllFieldsPage";
import CreateFieldPage from "./app/AdminFunctional/Tabs/CreateFieldPage";
import EditFieldPage from "./app/AdminFunctional/Tabs/EditFieldPage";
import AdminMainPage from "./app/AdminFunctional/AdminMainPage";

function App() {
  return (
    <Routes>

      <Route element={<AuthRequired/>}>
        <Route path="/" element={<Primary/>}/>

        <Route element={<AdminMainPage/>}>
          <Route path="/admin/createField" element={<CreateFieldPage/>}/>
          <Route path="/admin/allfields" element={<AllFieldsPage/>}/>
          <Route path="/admin/editField/:fieldID" element={<EditFieldPage/>}/>
        </Route>

      </Route>

      <Route element={<UserAuth/>}>
        <Route path="/userauth/login" element={<LoginForm/>}/>
        <Route path="/userauth/register" element={<RegisterForm/>}/>
      </Route>

      <Route path="/adminauth" element={<AdminAuth/>}/>
      
      <Route path="/*" element={<NotFound/>}/>

    </Routes>
  );
}

export default App;
