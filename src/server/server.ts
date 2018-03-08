/*
 *  Copyright 2018 Willamette University
 *
 *  This file is part of OAI-PHM Service.
 *  
 *  @author Michael Spalti
 *
 *  OAI-PHM Service is based on the Modular OAI-PMH Server, University of Helsinki, 
 *  The National Library of Finland.
 *
 *  OAI-PHM Service is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  OAI-PHM Service is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of 
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with OAI-PHM Service.  If not, see <http://www.gnu.org/licenses/>.
 */

import express = require('express');
import {Application} from 'express';
import bodyParser = require('body-parser');
import http = require('http');
import os = require('os');
import logger from './logger';
import {getHostConfiguration, hasHostConfigurationFile} from "./host-config";

const app = express();


export default class ExpressServer {

    constructor() {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
    }

    router(routes: (app: Application) => void): ExpressServer {
        routes(app);
        return this;
    }

    listen(): Application {

        const config = this.getConfiguration();
        const port = this.getPort(config);

        const welcome: any = () => {
            logger.info(`Up and running in ${process.env.NODE_ENV || 
            'development'} @: ${os.hostname() } on port: ${port}}`);
        };

        http.createServer(app).listen(port, welcome());
        return app;
    }

    /**
     * Returns default port if host configuration is not available.
     * @returns {number}
     */
    private getConfiguration(): object {

        if (hasHostConfigurationFile()) {
            return getHostConfiguration();
        } else {
            logger.warn("No configuration provided. Using default port. See documentation for details.");
            return {port: 3000};
        }

    }

    /**
     * Return configuration port or default port.
     * @param configuration
     * @returns {number}
     */
    private getPort(configuration: any): number {
        if (configuration) {
            if (configuration.port) {
                return configuration.port;
            }
        }
        return 3000;
    }


}