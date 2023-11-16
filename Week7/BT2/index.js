require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs/promises');
const port = process.env.PORT | 3000;
app.use(express.static('public')); // Serve static files from the 'public' directory

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/calculate', (req, res) => {
    const { x, y, opt } = req.query;
    let result;

    if (opt === 'plus') {
        result = parseInt(x) + parseInt(y);
    } else if (opt === 'minus') {
        result = parseInt(x) - parseInt(y);
    } else if (opt === 'multi') {
        result = parseInt(x) * parseInt(y);
    } else if (opt === 'divide') {
        result = parseInt(x) / parseInt(y);
    }

    res.json({ result });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));