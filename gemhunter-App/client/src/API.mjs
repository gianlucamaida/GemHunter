const SERVER_URL = 'http://localhost:3001/api';

// Funzione per gestire le risposte non valide
function handleInvalidResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response;
}

async function getAttractions(){
    const attractions = await fetch(SERVER_URL+'/attractions',{
        method:'GET',
    })
    .then(handleInvalidResponse)
    .then(response => response.json());
    return attractions;
}

async function addGem(name,image,lat,lon,comment){
    const gemData = {
        name: name,
        image: image, 
        lat: lat, 
        lon: lon, 
        comment: comment
    };
    const response = await fetch(SERVER_URL+"/addedGems",{
        method: 'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify(gemData),
    })
    .then(handleInvalidResponse)
    .then(response => response.json());
    return response;
}

async function getItinerary(time, n_attractions, n_gems, ini_lat, ini_lon) {
    const requestBody = {
        time: time,
        n_attractions: n_attractions,
        n_gems: n_gems,
        ini_lat: ini_lat,
        ini_lon: ini_lon,
    };

    try {
        const attractions = await fetch(SERVER_URL + '/attractions', {
            method: 'POST',  // Usa POST per inviare dati nel corpo
            headers: {
                'Content-Type': 'application/json',  // Indica che i dati sono in formato JSON
            },
            body: JSON.stringify(requestBody),  // Converte il corpo in JSON
        })
        .then(handleInvalidResponse)
        .then(response => response.json());

        return attractions;
    } catch (error) {
        console.error('Error fetching attractions:', error);
        throw error;  // Rilancia l'errore per gestirlo fuori dalla funzione
    }
}


const API = {getAttractions, addGem, getItinerary};
export default API;