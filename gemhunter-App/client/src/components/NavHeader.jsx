import React, { useState } from "react";
import { FaGem, FaCamera, FaMap, FaBook, FaUser, FaBars } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/NavHeader.css"; // Stile personalizzato per il menu laterale e navbar
import { Link } from "react-router-dom";

const NavHeader = () => {
  const [selectedOption,setSelectedOption] = useState("GemHunter"); //Stato per opzione attualmente selezionata
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Dati del menu con label e icona
  const menuItems = [
    { label: "Free-Roam", icon: <FaGem />, link: "/free-roam" },
    { label: "Add Gem", icon: <FaCamera />, link: "/add-gem" },
    { label: "Create Itinerary", icon: <FaMap />, link: "/create-itinerary" },
    { label: "Deck", icon: <FaBook />, link: "/deck" },
    { label: "Profile", icon: <FaUser />, link: "/profile" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    setIsMenuOpen(false); // Chiude il menu dopo la selezione
  };

  // Filtra gli elementi del menu per escludere l'opzione selezionata
  const filteredMenuItems = menuItems.filter(
    (item) => item.label !== selectedOption
  );

  return (
    <>
      {/* Navbar fissa */}
      <nav className="navbar navbar-dark  fixed-top">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">{selectedOption}</span>
          <FaBars
            className="menu-toggle-icon text-light"
            onClick={toggleMenu}
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
            aria-label="Toggle sidebar menu"
          />
        </div>
      </nav>

      {/* Sidebar menu laterale */}
      <div className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <ul className="list-unstyled sidebar-menu">
            {filteredMenuItems.map((item) => (
                <li key={item.label}>
                <Link to= {item.link} onClick={() => handleOptionClick(item)}>
                    {item.icon} <span className="menu-text">{item.label}</span>
                </Link>
                </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default NavHeader;
