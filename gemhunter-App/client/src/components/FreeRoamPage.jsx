import { MapContainer ,TileLayer,Marker,useMap,Circle} from "react-leaflet";
import characterIcon from "../icons/icon_walking_Man.png"; // Aggiungi il percorso dell'immagine del personaggio
import { useState } from "react";
import { Modal } from "react-bootstrap";
import API from "../API.mjs";
import { useEffect } from "react";

const FreeRoamPage = ({position,attractions}) => {
  // Se la posizione è nulla, non renderizzare la mappa
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [showCard,setShowCard] = useState(false);
  
  // Calcola la distanza tra due coordinate geografiche in metri
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Raggio della Terra in metri
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distanza in metri
  };

  if (!position) {
    return <div>Loading...</div>;
  }

  const handleAttractionClick = (attraction) => {
    console.log("Attraction clicked:", attraction);
    if(attraction.isFound ===1){
      //Se isFound allora c'è il Popup della carta
      setShowCard(true);
      setSelectedAttraction(attraction);
    } else {
      console.log("Attraction not found or isFound is not 1");
    }
  }

  const closeModal = () => {
    setShowCard(false);
    setSelectedAttraction(null);
  };

  const checkProximity = async () => {
    for (const attraction of attractions) {
      if (attraction.isGem === 1 && attraction.isFound !== 1) {
        const distance = calculateDistance(position[0], position[1], attraction.lat, attraction.lon);
        if (distance <= 10) {
          console.log("User is within range of the gem:", attraction);

          // Mostra il popup della carta
          setShowCard(true);
          setSelectedAttraction(attraction);

          // Chiama l'API per aggiornare isFound
          API.updateAttraction(attraction.id);
          break; // Esci dal loop una volta trovata una gemma vicina
        }
      }
    }
  };

  useEffect(( ) => {
    if(position) {
      checkProximity();
    }
  },[position]);


  const renderMarker = (attraction) => {
    console.log(attraction);
    if (attraction.isGem === 1) {
      // Se isGem è 1, crea un'ellisse
      return (
        <Circle
          center={[attraction.lat, attraction.lon]}
          radius={300}
          fillColor="green"
          color="darkgreen"
          weight={2}
          opacity={1}
          fillOpacity={0.6}
        />
      );
    } else {
      // Se isGem è 0, usa l'icona
      const icon = L.icon({
        iconUrl: attraction.icon, // Percorso dell'icona
        iconSize: [32, 32], // Imposta le dimensioni dell'icona
        iconAnchor: [16, 32], // Ancoraggio per la posizione dell'icona
        popupAnchor: [0, -32] // Ancoraggio per il popup
      });

      return (
        <Marker position={[attraction.lat, attraction.lon]} icon={icon} eventHandlers={{
          click: () => handleAttractionClick(attraction),
        }}>
        </Marker>
      );
    }
  };
 
 
    return(
    <div>
    {!showCard ? (
    <div className="map-page">
    {/*Mappa con Leaflet*/}
    <MapContainer center={[45.0703, 7.6869]} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"/>
      {/* Aggiungi i marker per le attrazioni */}
      {attractions.map((attraction) => (
        <div key={attraction.id}>
          {renderMarker(attraction)}
        </div>
      ))}
      {/* Marker per la posizione dell'utente */}
      {position && (
          <Marker position={position} icon={new L.Icon({
            iconUrl: characterIcon, // Usa l'icona personalizzata
            iconSize: [34, 34], // Imposta la dimensione dell'icona
            iconAnchor: [16, 32], // Imposta l'ancora dell'icona
            popupAnchor: [0, -32], // Sposta il popup sopra l'icona
          
          })} >
          </Marker>
        )}
    </MapContainer>
    </div> 
    ):(
      <div>
        <Modal show={showCard} onHide={closeModal} centered>
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
      </div>
    )}
    </div>
  );

};

export default FreeRoamPage;