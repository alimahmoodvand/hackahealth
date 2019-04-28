import express from 'express';
import bodyParser from 'body-parser';
import routes from './src/routes/routes';
import fileUpload from 'express-fileupload'
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/hackahealth');

const app = express();
const PORT = 3010;
global.rootPath = __dirname + "/";
global.assetsPath = __dirname + "/assets/";
global.secretKey="G0nz@le$1043";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
// JWT setup
app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
    next();
});


routes(app);

// serving static files
app.use(express.static(__dirname+'/public'));
app.set('views', __dirname+'/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) =>
    res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, () =>
    console.log(`your server is running on port ${PORT}`)
);
