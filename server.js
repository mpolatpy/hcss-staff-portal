const express = require('express');
const path = require('path');
const axios = require('axios');
const { PowerSchoolClient } = require('./external_apis/powerschool');
const { getGoogleSheetsData } = require('./external_apis/google-sheets');
const { getTokens, generateAuthUrl, listEvents, insertEvent } = require('./external_apis/google-calendar');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const CANVAS_ACCESS_KEY = process.env.CANVAS_ACCESS_KEY;
const PS_CLIENT_ID = process.env.PS_CLIENT_ID;
const PS_CLIENT_SECRET = process.env.PS_CLIENT_SECRET;
const powerSchool = new PowerSchoolClient(PS_CLIENT_ID, PS_CLIENT_SECRET);

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {

    app.all('*', function (req, res, next) {
        if (req.get('x-forwarded-proto') != "https") {
            res.set('x-forwarded-proto', 'https');
            res.redirect('https://' + req.get('host') + req.url);
        } else {
            next();
        }
    });

    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, error => {
    if (error) throw error;
    console.log('Server running on port ' + port);
});

app.post('/canvas-courses', (req, res) => {
    const teacherId = req.body.teacherId;
    const URL = `https://hcss.instructure.com/api/v1/users/${teacherId}/courses?state[]=available&per_page=100`;

    axios.get(URL, { headers: { Authorization: 'Bearer ' + CANVAS_ACCESS_KEY } })
        .then((response) => res.status(200).send(response.data))
        .catch(e => res.send({ error: e.message }))
});

app.post('/get-powerschool-data', (req, res) => {
    const url = req.body.url;
    const queryParam = req.body.queryParam;

    powerSchool.fetchData(url, queryParam)
        .then((response) => res.send(response))
        .catch(e => res.send({ error: e }))
});

app.post('/read-google-sheets-data', (req, res) => {
    const options = req.body.options;

    getGoogleSheetsData(options)
        .then((response) => res.send(response))
        .catch((e) => res.send({ error: e }));
});

app.post('/generate-auth-url', (req, res) => {
    try {
        const url = generateAuthUrl();
        res.send(url);
    } catch (e) {
        res.send({ error: e })
    }
});

app.post('/get-tokens-for-calendar', (req, res) => {
    const code = req.body.code;

    getTokens(code)
        .then((response) => res.send(response))
        .catch((e) => res.send({ error: e }));
});

app.post('/list-calendar-events', (req, res) => {
    const {token, timeMin, timeMax } = req.body;
    
    listEvents(token, timeMin, timeMax)
        .then((response) => res.send(response))
        .catch((e) => res.send({ error: e }));
});

app.post('/create-calendar-event', (req, res) => {
    const {token, event, sendUpdates } = req.body;
    
    insertEvent(token, event, sendUpdates)
        .then((response) => res.send(response))
        .catch((e) => res.send({ error: e }));
});

