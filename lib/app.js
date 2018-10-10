const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./util/error-handler');
const ensureAuth = require('./auth/ensure-auth')();

require('./models/register-plugins');
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(express.json());

const auth = require('./routes/auth');
const flashcards = require('./routes/flashcards');
const profile = require('./routes/profiles');

app.use('/api/auth', auth);
app.use('/api/flashcards', flashcards);
app.use('/api/profile', ensureAuth, profile);

app.use((req, res) => {
    res.sendFile('index.html', { root: './public' });
});

app.use(errorHandler());

module.exports = app;