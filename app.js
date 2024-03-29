const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');

app.use(cors());
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use('public/uploads', express.static(__dirname + 'public/uploads'));

app.use(require('./routes'));

const port = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME,
    })
    .then(() => console.log('Database is connected'))
    .catch((err) => console.log('error', err));

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
