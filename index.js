require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

const OBJECT_TYPE = '2-231359614';

/*
|--------------------------------------------------------------------------
| ROUTE 1 - Homepage
|--------------------------------------------------------------------------
*/

app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=game_name,game_genre,game_rating`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers });

        res.render('homepage', {
            title: 'Homepage',
            data: response.data.results
        });

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error fetching records');
    }
});

/*
|--------------------------------------------------------------------------
| ROUTE 2 - Form Page
|--------------------------------------------------------------------------
*/

app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

/*
|--------------------------------------------------------------------------
| ROUTE 3 - Create Record
|--------------------------------------------------------------------------
*/

app.post('/update-cobj', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;

    const newGame = {
        properties: {
            game_name: req.body.game_name,
            game_genre: req.body.game_genre,
            game_rating: req.body.game_rating
        }
    };

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(url, newGame, { headers });

        res.redirect('/');

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error creating record');
    }
});

app.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});