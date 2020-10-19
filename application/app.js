const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const db = require('./utils/database');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));
app.use('/assets', express.static(__dirname + '/assets')); // Serves public assets folder
app.set('views', [__dirname + '/views', __dirname + '/views/personal']);

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

//Bodyparser
app.use(express.urlencoded({ extended: false }))

//Routes
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));