import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./AuthPage";
import HeroPage from "./HeroPage";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<HeroPage />} path="/" />
      <Route element={<AuthPage mode="login" />} path="/login" />
      <Route element={<AuthPage mode="signup" />} path="/signup" />
      <Route element={<Shop />} path="/shop" />
      <Route element={<Leaderboard />} path="/leaderboard" />
      <Route element={<Profile />} path="/profile" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}

export default App;