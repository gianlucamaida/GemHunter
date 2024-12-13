import { MapContainer ,TileLayer,Marker,useMap,Popup,Circle} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./css/MapPage.css"
import L from "leaflet"; // Importa Leaflet per la creazione di marker
import { Link } from "react-router-dom";

import characterIcon from "../icons/icon_walking_Man.png"; // Aggiungi il percorso dell'immagine del personaggio


const MainPage = ({position,attractions}) => {

  // Se la posizione è nulla, non renderizzare la mappa
  if (!position) {
    return <div>Loading...</div>;
  }


  const renderMarker = (attraction) => {
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
        <Marker position={[attraction.lat, attraction.lon]} icon={icon}>
        </Marker>
      );
    }
  };
 
return (
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
          })}>
          </Marker>
        )}
    </MapContainer>

    {/*Bottone Start Hunt*/}
    <Link to="/free-roam">
      <button  className="start-hunt-button">
        Start Hunt
      </button>
    </Link>
  </div>
  );

};

export default MainPage;