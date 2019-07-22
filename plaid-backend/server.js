import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { authenticate, authError } from './app/middleware';
import Config from './config';
const { port } = Config;
const app = express();
const { establishConnection } = require('./app/db');
const loadRoutes = require('./app/routes');
const http = require("http");
let isConnectionEstablished = false;

app
	.use(bodyParser.urlencoded({ useNewUrlParser: true }))
	.use(bodyParser.json())
	.use(cors());

app.use((req, res, next) => {
	// if (!isConnectionEstablished) {
	// 	res.status(200).json({status: false, error: 'connecting to db...'});
	// 	return;
	// }
  console.log('Time:', Date.now());
  next()
});

loadRoutes(app);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!')
});

app.use(express.static(path.resolve(__dirname, "../plaid-frontend/", "build")));
app.use("/static", express.static(path.resolve(__dirname, "..", "static")));


app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../plaid-frontend/', 'build', 'index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    });
});

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
