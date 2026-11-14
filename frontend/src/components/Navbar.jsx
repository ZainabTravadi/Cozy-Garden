
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    House,
    ShoppingCart,
    Trophy,
    UserRound,
    Menu,
    X,
    LogOut
} from "lucide-react";
import seedImage from "../assets/seed.png";
import '../styles/global.css';
import '../styles/components.css';
import { useAuth } from "../context/useAuth";

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="navbar">

            {/* Logo */}
            <NavLink to="/" className="navbar-logo">
                <img src={seedImage} alt="Cozy Garden logo" />
                <span>Cozy Garden</span>
            </NavLink>

            {/* Mobile Menu Button */}
            <button
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={menuOpen}
                aria-controls="main-navigation"
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                type="button"
            >
                {menuOpen ? <X /> : <Menu />}
            </button>

            {/* Navigation Links */}
            <nav id="main-navigation" aria-label="Main navigation" className={`navbar-links ${menuOpen ? "open" : ""}`}>

                <NavLink to="/garden" className="nav-link">
                    <House size={18} />
                    Garden
                </NavLink>

                <NavLink to="/shop" className="nav-link">
                    <ShoppingCart size={18} />
                    Shop
                </NavLink>

                <NavLink to="/leaderboard" className="nav-link">
                    <Trophy size={18} />
                    Leaderboard
                </NavLink>

                <NavLink to="/profile" className="nav-link">
                    <UserRound size={18} />
                    Profile
                </NavLink>

                <button
                    className="navbar-logout"
                    onClick={async () => {
                        try {
                            await logout();
                        } catch (error) {
                            console.error("Unable to clear the server session:", error);
                        } finally {
                            navigate("/", { replace: true });
                        }
                    }}
                    type="button"
                >
                    <LogOut size={18} />
                </button>

            </nav>

        </header>
    );
}

export default Navbar;
