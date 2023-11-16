require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const port = process.env.PORT || 3000;
const path = require('path');

const app = express();

// Parsing middleware
app.use(express.urlencoded({extended: true})); // New

// Parse application/json
app.use(express.json()); 

// Static file
app.use(express.static(path.join(__dirname, 'public')));

//Template engine
const handlebars = exphbs.create({ extname: '.hbs',});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));

const routes = require('./routes/users')
app.use('/', routes)

app.listen(port, () => console.log(`Listening on port ${port}`));