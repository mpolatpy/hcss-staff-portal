const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const CANVAS_ACCESS_KEY = process.env.CANVAS_ACCESS_KEY;

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cors());

if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', function (req, res) {
        if (req.get('x-forwarded-proto') != "https") {
            res.set('x-forwarded-proto', 'https');
            res.redirect('https://' + req.get('host') + req.url);
        } else {
            res.sendFile(path.join(__dirname, 'client/build', 'index.html'));    
        }
    });
}

app.listen(port, error => {
    if (error) throw error;
    console.log('Server running on port ' + port);
});

app.post('/canvas-courses', (req, res) => {
    const teacherId = req.body.teacherId;
    const URL = `https://hcss.instructure.com/api/v1/users/${teacherId}/courses?state[]=available`;

    axios.get(URL, { headers: { Authorization: 'Bearer ' + CANVAS_ACCESS_KEY}})
        .then( (response) => res.status(200).send( response.data ) )
        .catch( err => res.send({ error: err.message  }))
})