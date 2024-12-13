import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './App.css';
import MainPage from './components/MainPage.jsx';
import FreeRoamPage from './components/FreeRoamPage.jsx';
import AddGemPage from './components/AddGemPage.jsx';
import CreateItineraryPage from './components/CreateItineraryPage.jsx';
import DeckPage from './components/DeckPage.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import NavHeader from './components/NavHeader.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom'; // Importa Outlet
import { useState, useEffect } from "react";
import API from './API.mjs';

function App() {
  
  const [userLocation,setUserLocation] = useState(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
          alert("Unable to retrieve location");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Esegui il geolocalizzazione quando il componente viene montato
  useEffect(() => {
    getUserLocation();
    fetchAttractions();
  }, []);

  const position = userLocation ? [userLocation.lat, userLocation.lon] : null;

  const [attractions,setAttractions] = useState([]);

  const fetchAttractions = async () => {
    const risultato = await API.getAttractions()  // Sostituisci con l'endpoint corretto
    setAttractions(risultato);
  };

  return (
    <Routes>
      {/* Navbar visibile su tutte le pagine */}
      <Route element = {<>
       <NavHeader/><Outlet/> 
        </>}>
        {/* Gestione delle routes */}
        <Route path="/" element={<MainPage position={position} attractions = {attractions}/>} />
        <Route path="/free-roam" element={<FreeRoamPage position={position} attractions = {attractions}/>} />
        <Route path="/add-gem" element={<AddGemPage />} />
        <Route path="/create-itinerary" element={<CreateItineraryPage position ={position} />} />
        <Route path="/deck" element={<DeckPage attractions = {attractions} />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
