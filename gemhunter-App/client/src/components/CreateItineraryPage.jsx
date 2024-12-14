import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents,useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "./css/CreateItinerary.css";
import API from "../API.mjs";
import characterIcon from "../icons/icon_walking_Man.png";
import gemmaIcon from "../icons/gemma_icon.webp";
import "leaflet-routing-machine";

const CreateItinerary = ({position}) => {
  const [formData, setFormData] = useState({
    timeAvailable: "",
    gems: "",
    attractions: "",
    location: null, // Nessuna posizione iniziale
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showMap, setShowMap] = useState(false); // Stato per controllare la visualizzazione della mappa
  const [attractions, setAttractions] = useState([]); // Stato per le attrazioni
  const [routeControl,setRouteControl] = useState(null); //Stato per controllare il routing


  const handleAttractionClick = (attraction, map) => {
    console.log("Attrazione cliccata:", attraction);
  
    // Rimuovi il percorso precedente (se esiste)
    if (routeControl) {
      routeControl.remove();
    }
  
    // Aggiungi il nuovo percorso
    const newRouteControl = L.Routing.control({
      waypoints: [
        L.latLng(formData.location.lat, formData.location.lng), // Posizione attuale
        L.latLng(attraction.lat, attraction.lon), // Posizione dell'attrazione
      ],
      routeWhileDragging: true, // Mostra la rotta mentre trascini
      createMarker: () => null, // Disabilita i marker per i waypoints
      showAlternatives: false, // Disabilita le alternative
      addWaypoints: false, // Disabilita l'aggiunta di nuovi waypoint
      lineOptions: {
        styles: [{ color: 'blue', weight: 4, opacity: 0.7 }] // Personalizza lo stile della linea
      },
    }).addTo(map);
  
    // Forza la rimozione del pannello delle direzioni dal DOM
    const routingContainer = document.querySelector('.leaflet-routing-container');
    if (routingContainer) {
      routingContainer.style.display = 'none'; // Nascondi il pannello
    }
  
    setRouteControl(newRouteControl);
  };


  const MapInteractionHandler = ({ onAttractionClick }) => {
    const map = useMap(); // Ottieni la mappa corrente
  
    return (
      <>
        {attractions.map((attraction, index) => (
        <div key={index}> {/* Usa l'indice come fallback, ma non è l'ideale */}
           {renderMarker(attraction, (attr) => onAttractionClick(attr, map))}
        </div>
      ))}
      </>
    );
  };
  
  // Ottenere la posizione corrente all'avvio
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
          setIsLoading(false);
        },
        (error) => {
          console.error("Errore nell'ottenere la posizione:", error);
          setFormData((prevData) => ({
            ...prevData,
            location: { lat: 41.9028, lng: 12.4964 }, // Default a Roma
          }));
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocalizzazione non supportata dal browser.");
      setFormData((prevData) => ({
        ...prevData,
        location: { lat: 41.9028, lng: 12.4964 }, // Default a Roma
      }));
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dati del form:", formData);
    // Aggiungi qui la logica per generare l'itinerario
    generateItinerary();
  };

  const generateItinerary = async () => {
    const list_attractions = await API.getAttractions(
      formData.timeAvailable,
      formData.attractions,
      formData.gems,
      formData.location.lat,
      formData.location.lng
    );
    setAttractions(list_attractions); // Salva le attrazioni nel nostro stato
    setShowMap(true); // Cambia lo stato per mostrare la mappa
  };

  const MapClickHandler = ({setFormData}) => {
    useMapEvents({
      click: (e) => {
        setFormData((prevData) => ({
          ...prevData,
          location: { lat: e.latlng.lat, lng: e.latlng.lng },
        }));
      },
    });
    return null;
  };


  const renderMarker = (attraction, onClick) => {
    const icon = L.icon({
      iconUrl: attraction.isGem === 1 ? gemmaIcon : attraction.icon, // Usa l'icona corretta
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  
    return (
      <Marker
        position={[attraction.lat, attraction.lon]}
        icon={icon}
        eventHandlers={{
          click: () => onClick(attraction), // Passa l'attraction al callback
        }}
      >
      </Marker>
    );
  };

  if (isLoading) {
    return <div>Caricamento della posizione...</div>;
  }



  return (
    
      <div>
      {!showMap ? (
        <>
        <div className="create-itinerary-container">
        <h1>Crea il tuo Itinerario</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="timeAvailable">Tempo disponibile:</label>
              <input
                type="text"
                id="timeAvailable"
                name="timeAvailable"
                value={formData.timeAvailable}
                onChange={handleChange}
                placeholder="Es. 3 ore"
                required />
            </div>
            <div className="form-group">
              <label htmlFor="gems">Numero di gemme:</label>
              <input
                type="number"
                id="gems"
                name="gems"
                value={formData.gems}
                onChange={handleChange}
                min="0"
                required />
            </div>
            <div className="form-group">
              <label htmlFor="attractions">Numero di attrazioni:</label>
              <input
                type="number"
                id="attractions"
                name="attractions"
                value={formData.attractions}
                onChange={handleChange}
                min="0"
                required />
            </div>
            <div className="form-group">
              <label>Posizione:</label>
              <MapContainer
                center={[formData.location.lat, formData.location.lng]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"/>
                <MapClickHandler setFormData={setFormData}  />
                <Marker position={[formData.location.lat, formData.location.lng]} />
              </MapContainer>
            </div>
            <button type="submit" className="submit-button">
              Genera Itinerario
            </button>
          </form>
          </div>
          </>
      ) : (
        // Mostra la mappa con le attrazioni se showMap è vero
        <div className="map-page-itinerary">
          <MapContainer
            center={[formData.location.lat, formData.location.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" />

            {/*Posizionamento attrazioni */}
            <MapInteractionHandler onAttractionClick={handleAttractionClick}/>
            {/* Posiziona l'omino sulla posizione attuale */}
            <Marker position={position} icon={new L.Icon({
                iconUrl: characterIcon, // Usa l'icona personalizzata
                iconSize: [34, 34], // Imposta la dimensione dell'icona
                iconAnchor: [16, 32], // Imposta l'ancora dell'icona
                popupAnchor: [0, -32], // Sposta il popup sopra l'icona
                shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                shadowSize: [41, 41],
                })}>
            </Marker>
          </MapContainer>
        </div>
      )}
      </div>
  );
};

export default CreateItinerary;
