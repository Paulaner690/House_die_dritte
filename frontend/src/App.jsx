import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import CategoryPage from "./pages/CategoryPage";
import ProfilePage from "./pages/ProfilePage";
import CreateProfilePage from "./pages/CreateProfilePage";
import LoginPage from "./pages/LoginPage";
import ResetPassword from "./user/ResetPassword";

function App() {
  return (
    <>
      {/* <BrowserRouter> */}
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/detailPage/:id" element={<DetailPage />}/>
          <Route path="/categoryPage/:category" element={<CategoryPage />}/>
          <Route path="/createProfile" element={<CreateProfilePage />}/>
          <Route path="/loginPage" element={<LoginPage />}/>
          <Route path="/profilePage/:id" element={<ProfilePage />}/>
          <Route path="/passwordReset" element={<ResetPassword />} />
        </Routes>
      {/* </BrowserRouter> */}
    </>
  );
}

export default App;
