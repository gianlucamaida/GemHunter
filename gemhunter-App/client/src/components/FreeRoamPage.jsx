import { MapContainer ,TileLayer,Marker,useMap,Circle} from "react-leaflet";
import characterIcon from "../icons/icon_walking_Man.png"; // Aggiungi il percorso dell'immagine del personaggio
import { useState } from "react";
import { Modal } from "react-bootstrap";

const FreeRoamPage = ({position,attractions}) => {
  // Se la posizione è nulla, non renderizzare la mappa
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [showCard,setShowCard] = useState(false);
  

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