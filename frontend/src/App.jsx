import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./AuthPage";
import HeroPage from "./HeroPage";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import Garden from "./pages/Garden";
import HowToPlay from "./pages/HowToPlay";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<HeroPage />} path="/" />
      <Route element={<HowToPlay />} path="/how-to-play" />
      <Route element={<AuthPage key="login" mode="login" />} path="/login" />
      <Route element={<AuthPage key="signup" mode="signup" />} path="/signup" />
      <Route element={<ProtectedRoute />}>
        <Route element={<Garden />} path="/garden" />
        <Route element={<Garden />} path="/game" />
        <Route element={<Shop />} path="/shop" />
        <Route element={<Leaderboard />} path="/leaderboard" />
        <Route element={<Profile />} path="/profile" />
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}

export default App;