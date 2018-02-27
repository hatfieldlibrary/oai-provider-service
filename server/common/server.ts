/*
 * Copyright 2018 Willamette University
 *
 * This file is part of commons-oai-provider.
 *
 * commons-oai-provider is based on the Modular OAI-PMH Server, University of Helsinki, The National Library of Finland.
 *
 *     commons-oai-provider is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     Foobar is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with commons-oai-provider.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as express from 'express';
import { Application } from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import * as cookieParser from 'cookie-parser';
import logger from './logger';

const app = express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));
  }

  router(routes: (app: Application) => void): ExpressServer {
    routes(app);
    return this;
  }

  listen(port: number = parseInt(process.env.PORT)): Application {
    const welcome = (port: number) => () => logger.info(`up and running in ${process.env.NODE_ENV || 
      'development'} @: ${os.hostname() } on port: ${port}}`);
    http.createServer(app).listen(port, welcome(port));
    return app;
  }


}