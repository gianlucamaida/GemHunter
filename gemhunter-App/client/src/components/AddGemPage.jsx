import React, { useState,useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./css/AddGem.css"; // CSS personalizzato per il componente
import API from '../API.mjs';

const AddGem = () => {
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lat, setLat] = useState(null); // Latitudine
  const [lon, setLon] = useState(null); // Longitudine
  const [isSubmitted, setIsSubmitted] = useState(false); // Stato per la sottomissione
  const [submitMessage, setSubmitMessage] = useState(""); 

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Funzione per attivare la fotocamera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Errore nell'accesso alla fotocamera", err);
    }
  };

  // Funzione per scattare una foto dalla fotocamera
  const takePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    setPhoto(canvasRef.current.toDataURL("image/jpeg"));
    setShowModal(true);
  };

   // Funzione per ottenere la posizione dell'utente (latitudine e longitudine)
   const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);  // Set latitudine
          setLon(position.coords.longitude);  // Set longitudine
        },
        (error) => {
          console.error("Errore nel recupero della posizione:", error);
          //Gestire caso in cui l'utente non permette accesso alla posizione
        }
      );
    } else {
      alert("La geolocalizzazione non è supportata dal tuo browser.");
    }
  };

  const handleSubmit = async () => {
    if (!name || !comment || !photo || lat === null || lon === null) {
      alert("Please fill in all fields, including location.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await API.addGem(name, photo, lat, lon, comment);  // Invia i dati al server
      setIsSubmitted(true); // Imposta il flag come sottomesso
      setSubmitMessage("Gem added successfully!"); // Imposta il messaggio di successo
    } catch (error) {
      console.error("Error submitting gem:", error);
      setIsSubmitted(true); // Imposta il flag come sottomesso
      setSubmitMessage("Error submitting gem."); // Imposta il messaggio di errore
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chiamato al montaggio del componente per ottenere la posizione
  useEffect(() => {
    getLocation();
  }, []);
  return (
    <div className="add-gem">
      <h1>Add a New Gem</h1>

      {/* Mappa (Puoi aggiungere una mappa qui, magari con un iframe o altro) */}

      <div className="camera-container">
        <video ref={videoRef} autoPlay width="100%" height="auto"></video>
        <button onClick={takePhoto}>Take Photo</button>
        <canvas ref={canvasRef} style={{ display: "none" }} width="640" height="480"></canvas>
      </div>

      {/* Modal per la foto scattata */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <div className="modal-content">
            <img src={photo} alt="Gem" className="captured-photo" />
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the name of the gem"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Form.Group>
            </Form>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal per il risultato dell'invio */}
      <Modal show={isSubmitted} onHide={() => setIsSubmitted(false)} centered>
        <Modal.Body>
          <div className="modal-content">
            <h4>{submitMessage}</h4>
            <Button variant="primary" onClick={() => setIsSubmitted(false)}>
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddGem;