const express = require('express');
const keys = require('./config/keys');
const app = express();



const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
});



//controllers
const authenticationRoutes = require('./controllers/authenticationRoutes');


// Routes
app.get('/account', authenticationRoutes.auth);

const port = 13756

app.listen(keys.port, () => {
    console.log("Listening on " + keys.port);
});
