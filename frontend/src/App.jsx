import { Route, Routes } from "react-router-dom";
import AuthPage from "./AuthPage";
import HeroPage from "./HeroPage";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import Garden from "./pages/Garden";
import HowToPlay from "./pages/HowToPlay";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import LegalPage from "./components/LegalPage";
import Seo from "./components/Seo";
import { Link } from "react-router-dom";

function NotFound() {
  return <main className="legal-page"><Seo title="Page not found" description="This Cozy Garden page could not be found." noindex /><section className="legal-content"><h1>That page has wandered off.</h1><p>Let's head back to the garden.</p><Link to="/">Return home</Link></section></main>;
}

function App() {
  return (
    <Routes>
      <Route element={<><Seo title="Cozy Garden" description="A cozy pixel-art farming game. Plant seeds, watch crops grow in real time, and return to harvest coins, XP, and achievements." /><HeroPage /></>} path="/" />
      <Route element={<><Seo title="How to Play" description="Learn how to buy seeds, plant your garden, grow crops, harvest rewards, and earn achievements in Cozy Garden." path="/how-to-play" /><HowToPlay /></>} path="/how-to-play" />
      <Route element={<><Seo title="Log In" description="Log in to tend your Cozy Garden." path="/login" noindex /><AuthPage key="login" mode="login" /></>} path="/login" />
      <Route element={<><Seo title="Create an Account" description="Create a Cozy Garden account and start your own pixel-art garden." path="/signup" noindex /><AuthPage key="signup" mode="signup" /></>} path="/signup" />
      <Route element={<LegalPage page="privacy" />} path="/privacy" />
      <Route element={<LegalPage page="terms" />} path="/terms" />
      <Route element={<LegalPage page="contact" />} path="/contact" />
      <Route element={<LegalPage page="security" />} path="/security" />
      <Route element={<LegalPage page="cookies" />} path="/cookies" />
      <Route element={<ProtectedRoute />}>
        <Route element={<Garden />} path="/garden" />
        <Route element={<Garden />} path="/game" />
        <Route element={<Shop />} path="/shop" />
        <Route element={<Leaderboard />} path="/leaderboard" />
        <Route element={<Profile />} path="/profile" />
      </Route>
      <Route element={<NotFound />} path="*" />
    </Routes>
  );
}

export default App;
