require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT | 3000;

const viewsPath = path.join(__dirname, './views');

const exphbs = require('express-handlebars');
app.engine('hbs', 
    exphbs.engine({
        defaultLayout: 'calculator.hbs',
        layoutsDir: viewsPath
    }
));
const hbs = exphbs.create({});
hbs.handlebars.registerHelper('isEqual', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

app.set('views', viewsPath);
app.set('view engine', 'hbs');

const calculatorR = require('./routes/calculator.r');
//const tObj = new calculator();

app.use('/', calculatorR.index);
app.use('/calculate', calculatorR.calculate);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));