require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs/promises');
const port = process.env.PORT | 3000;
//app.use(express.static (__dirname + '/public'));
app.use('/css', express.static(__dirname + '/../resource'));
app.use(express.urlencoded ({ extended: true }));
const arrSkip = [ 'settings', '_locals', 'cache' ];
app.engine('html', async (filePath, options, callback) => { // define the template engine
    const content = await fs.readFile(filePath, { encoding: 'utf-8' });
    console.log(options);
    let rendered = content;
    for (const key in options) {
        console.log(key)
        if (options.hasOwnProperty(key) && arrSkip.indexOf(key) === -1){
             rendered = rendered.replace(`{{${key}}}`, options [key]);
        }
    }
    return callback(null, rendered);
})

app.set('views', './public');
app.set('view engine', 'html');

app.get('/', async (req, res) => {
    //const data = await fs.readFile('./public/index.html', { encoding: 'utf-8' });
    //res.send(data);
    //console.log(req);
    const x = parseFloat(req.query.x);
    const y = parseFloat(req.query.y);
    const opt = req.query.opt;
    let rs = 0;
    switch (opt) {
        case 'plus':
        rs = x + y;
        break;
        case 'minus':
        rs = x - y;
        break;
        case 'multi':
        rs = x * y;
        break;
        case 'divide':
        rs = x / y;
        break;
    } 
    res.render('index', { xv: x, yv: y, result: rs }); 
});
app.get('/ab/:x/:y', (req, res) => { 
    //console.log('requested', req.params);
    res.end();
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));