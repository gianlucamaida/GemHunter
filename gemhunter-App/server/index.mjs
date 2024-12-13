import GemDAO from "./attractions_dao.mjs";
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const gemDAO = new GemDAO();
const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

const corsOptions = { 
    origin: 'http://localhost:5173',
    optionSuccessStatus:200,
    credentials:true
};
app.use(cors(corsOptions));



app.get('/api/attractions',(req,res) => {
    try{
        gemDAO.getAttractions().then(attractions => {
            res.json(attractions);
        }).catch(err => {
            res.status(500).json({ error: 'Error getting attractions' })
        })
    }catch (err) {
        res.status(500).end();
    }
});

app.post('/api/addedGems', (req, res) => {
    const { name, image, lat, lon, comment } = req.body;  // Estrai i dati dalla richiesta

    // Verifica che tutti i campi siano presenti
    if (!name || !image || !lat || !lon || !comment) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Chiama il metodo per inserire i dati nel database
    gemDAO.insertAddedGem(name, image, lat, lon, comment)
        .then(result => {
            // Rispondi con l'ID dell'AddedGem appena inserita
            res.status(201).json({ message: 'AddedGem inserted successfully', id: result.id });
        })
        .catch(err => {
            // In caso di errore, rispondi con l'errore
            console.error('Error inserting AddedGem:', err);
            res.status(500).json({ error: 'Error inserting AddedGem' });
        });
});

app.get('/api/getItinerary',(req,res) => {
    try{
        gemDAO.getItinerary(req.body.time, req.body.n_attractions,req.body.n_gems,req.body.ini_lat,req.body.ini_lon).then(itinerary => {
            res.json(itinerary);
        }).catch(err => {
            res.status(500).json({ error: 'Error getting attractions' })
        })
    }catch (err) {
        res.status(500).end();
    }
});



app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });