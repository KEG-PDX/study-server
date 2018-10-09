const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./util/error-handler');

require('./models/register-plugins');
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(express.json());

const auth = require('./routes/auth');

app.use('/api/auth', auth);

app.use((req, res) => {
    res.sendFile('index.html', { root: './public' });
});

app.use(errorHandler());

module.exports = app;