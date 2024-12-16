import { Attraction } from "./attractions_model.mjs";
import db from './db.mjs';

export default function GemDAO(){
    // Funzione per ottenere tutti i dati dalla tabella `locations`
    this.getAttractions = () => {
        return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM attractions';
        db.all(sql,(err,rows) => {
            if(err) {
                reject(err);
                return;
            }

            let attractions = [];

            if (!rows || rows.length === 0) {
                console.error('No rows returned or rows is undefined.');
                reject(new Error('No rows returned.'));
                return;
            }

            rows.forEach(row => {
                const attraction = new Attraction(row.id,row.name,`http://localhost:3001/${row.icon}`,row.lat,row.lon,row.description,row.isGem,row.isFound);
                attractions.push(attraction);
            })

            resolve(attractions);
        })       
        });
    };

    this.insertAddedGem = (name,image,lat,lon,comment) => {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO addedGems ( name, image, lat,lon ,comment)
                VALUES (?, ?, ?, ?, ?)
            `;
    
            // Esegui l'inserimento nel database
            db.run(sql, [
                name, 
                image, 
                lat, 
                lon, 
                comment
            ], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
    
                // Restituisci l'ID dell'attrazione appena inserita
                resolve({ id: this.lastID });
            });
        });
    }

    this.getItinerary = (time, n_attractions, n_gems, ini_lat, ini_lon) => {
        return new Promise((resolve, reject) => {
            // Query per ottenere l'itinerario in base ai parametri
            const sql = 'SELECT * FROM itineraries WHERE tempo =? AND numero_gemme=? AND numero_attractions=? AND posizione_lat=? AND posizione_lng=?';
            
            db.get(sql, [time, n_attractions, n_gems, ini_lat, ini_lon], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
    
                // Verifica se l'itinerario è stato trovato
                if (!row) {
                    reject(new Error('No itinerary found.'));
                    return;
                }
    
                // Parso la lista delle attrazioni dal campo 'lista_attractions'
                let attractionIds = JSON.parse(row.lista_attractions);
    
                // Ora recupero le informazioni sulle attrazioni
                let attractions = [];
                let completedAttractions = 0;
    
                attractionIds.forEach(id => {
                    // Recupero i dettagli di ogni attrazione usando il suo id
                    db.get('SELECT * FROM attractions WHERE id = ?', [id], (err, attractionRow) => {
                        if (err) {
                            reject(err);
                            return;
                        }
    
                        if (attractionRow) {
                            const attraction = new Attraction(
                                attractionRow.id,
                                attractionRow.name,
                                `http://localhost:3001/${attractionRow.icon}`,
                                attractionRow.lat,
                                attractionRow.lon,
                                attractionRow.description,
                                attractionRow.isGem,
                                attractionRow.isFound
                            );
                            attractions.push(attraction);
                        }
    
                        completedAttractions++;
    
                        // Se sono state recuperate tutte le attrazioni, restituisci l'itinerario
                        if (completedAttractions === attractionIds.length) {
                            resolve(attractions);
                        }
                    });
                });
    
                // Se non ci sono attrazioni da recuperare, risolvi subito
                if (attractionIds.length === 0) {
                    resolve( attractions);
                }
            });
        });
    };

    //Metodo per aggiornare isFound
    this.updateAttraction = (id) => {
        return new Promise((resolve,reject) => {
            const sql = "UPDATE attraction SET isFound = 1 WHERE id = ?";

            db.query(sql,[id],(err,result) => {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });

        });

    };
}