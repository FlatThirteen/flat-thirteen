/* tslint:disable no-console */
const compression = require('compression');
import 'zone.js/dist/zone-node';
import './polyfills.server';
import './rxjs.imports';

import * as express from 'express';
import * as path from 'path';

import { ServerAppModule } from './main/main-app.server.module';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { routes } from './server.routes';
import { enableProdMode } from '@angular/core';
import { UNIVERSAL_PORT } from '../../constants';
enableProdMode();
const app = express();
const baseUrl = `http://localhost:${UNIVERSAL_PORT}`;

const ROOT = path.join(path.resolve(__dirname, '..'));

// Express View
app.engine('html', ngExpressEngine({ bootstrap: ServerAppModule }));

app.set('views', __dirname);
app.set('view engine', 'html');
app.use(compression());

// Serve static files

app.use('/assets', express.static(path.join(__dirname, 'assets'), {maxAge: 30}));
app.use(express.static(path.join(ROOT, 'dist/client'), {index: false}));

function ngApp(req, res) {
  res.render('main', {
    req,
    res,
    baseUrl: '/',
    requestUrl: req.originalUrl,
    originUrl: req.hostname
  });
}

app.get('/', ngApp);
routes.forEach(route => {
  app.get(`/${route}`, ngApp);
  app.get(`/${route}/*`, ngApp);
});

app.get('*', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const pojo = { status: 404, message: 'No Content' };
  const json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

// Server
app.listen(UNIVERSAL_PORT, () => {
  console.log(`Listening at ${baseUrl}`);
});
