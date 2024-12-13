import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "./css/DeckPage.css"; // Importa il CSS per la pagina

const DeckPage = ({ attractions }) => {
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = (attraction) => {
    setSelectedAttraction(attraction);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedAttraction(null);
    setShowModal(false);
  };

  const displayedAttractions = attractions.slice(0, 9);

  return (
    <div className="deck-page">
      <h1>Hunter's Deck</h1>

      <div className="deck-grid">
        {displayedAttractions.map((attraction) => (
          <div
            key={attraction.id}
            className="deck-slot"
            onClick={() => handleCardClick(attraction)}
          >
            {attraction.isFound === 0 ? (
              <div className="slot-number">
                <p>{attraction.id}</p>
              </div>
            ) : (
              <div className="slot-card">
                <img
                  src={attraction.icon}
                  alt={attraction.name}
                  className="card-image"
                />
                <p>{attraction.name}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <Link to="/free-roam">
        <button className="back-button">Torna alla Mappa</button>
      </Link>
      {selectedAttraction?.isFound === 1  ?(
        <Modal show={showModal} onHide={closeModal} centered>
          <Modal.Body>
            <div className="modal-body">
              <img
                src={selectedAttraction?.icon}
                alt={selectedAttraction?.name}
                className="modal-card-image"
              />
              <div className="modal-title">
                {selectedAttraction?.name}
              </div>
              <div className="modal-description">
                {selectedAttraction?.description}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      ) : (
        <Modal show={showModal} onHide={closeModal} centered>
          <Modal.Body>
            <div className="modal-message">
              <p>You haven't found this attraction yet. Go and find it!</p>
            </div>
          </Modal.Body>
        </Modal>
      )};
    </div>
  );
};

export default DeckPage;
