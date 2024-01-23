import { Routes, Route } from "react-router-dom"
import Primary from './pages/Primary';
import UserAuth from './pages/UserAuth';
import AdminAuth from './pages/AdminAuth';
import NotFound from './pages/NotFound';
import AuthRequired from './pages/AuthRequired';
import LoginForm from './pages/UserAuthForms/LoginForm';
import RegisterForm from "./pages/UserAuthForms/RegisterForm"
import AllFieldsPage from "./pages/AdminFunctional/Tabs/AllFieldsPage";
import CreateFieldPage from "./pages/AdminFunctional/Tabs/CreateFieldPage";
import EditFieldPage from "./pages/AdminFunctional/Tabs/EditFieldPage";
import AdminMainPage from "./pages/AdminFunctional/AdminMainPage";

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
