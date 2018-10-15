const express = require('express');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth')();

require('./models/register-plugins');
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(express.json());

const auth = require('./routes/auth');
const flashcards = require('./routes/flashcards');
const profile = require('./routes/profiles');

app.use('/api/auth', auth);
app.use('/api/flashcards', ensureAuth, flashcards);
app.use('/api/profiles', ensureAuth, profile);

app.use((req, res) => {
    res.sendFile('index.html', { root: './public' });
});

const { handler, api404 } = require('./util/errors');

app.use('/api', api404);
app.use((req, res) => {
    res.sendStatus(404);
});

app.use(handler);

module.exports = app;