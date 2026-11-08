
import { useState } from "react";
import { NavLink } from "react-router-dom";
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

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="navbar">

            {/* Logo */}
            <NavLink to="/" className="navbar-logo">
                <img src={seedImage} alt="Cozy Garden logo" />
                <span>Cozy Garden</span>
            </NavLink>

            {/* Mobile Menu Button */}
            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X /> : <Menu />}
            </button>

            {/* Navigation Links */}
            <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>

                <NavLink to="/game" className="nav-link">
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

                <button className="navbar-logout">
                    <LogOut size={18} />
                </button>

            </nav>

        </header>
    );
}

export default Navbar;
