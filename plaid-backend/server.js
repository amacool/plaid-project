import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { authenticate, authError } from './app/middleware';
import Config from './config';
const { port } = Config;
const app = express();
const { establishConnection } = require('./app/db');
const loadRoutes = require('./app/routes');
let isConnectionEstablished = false;

app
	.use(bodyParser.urlencoded({ useNewUrlParser: true }))
	.use(bodyParser.json())
	.use(cors());

app.use((req, res, next) => {
	if (!isConnectionEstablished) {
		res.status(200).json({status: false, error: 'connecting to db...'});
		return;
	}
  console.log('Time:', Date.now());
  next()
});

loadRoutes(app);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!')
});

app.listen(port, () => {
  !isConnectionEstablished && establishConnection().then(
    () => {
      isConnectionEstablished = true;
      console.log(`started on port ${port}`);
      console.log("Database connection established!");
    },
		(err) => {
      console.log("Error	 connecting Database instance due to: ", err);
    }
	);
});