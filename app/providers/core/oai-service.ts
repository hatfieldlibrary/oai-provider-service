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

import logger from '../../server/logger';
import {DataRepository, ProviderConfiguration} from "./core-oai-provider";

export class OaiService {

    public static instance: OaiService;

    oaiProvider: DataRepository;

    parameters: ProviderConfiguration;

    MANDATORY_PARAMETERS = [
        'repositoryName',
        'baseURL',
        'adminEmail',
        'protocolVersion',
        'deletedRecord',
        'granularity',
        'earliestDatestamp'];
    DEFAULT_PARAMETERS = {
        port: 3000,
        description: 'OAI-PMH Service',
        oaiService: {}
    };

    public constructor(factory: any, configuration: ProviderConfiguration) {

        logger.debug('Initializing the core OAI service.');

        this.parameters = this.initParameters(configuration);
        this.oaiProvider = factory(this.parameters);

    }

    private initParameters(parameters: ProviderConfiguration): any {

        const missingParameters: string[] = this.MANDATORY_PARAMETERS.filter(key => {
            return !Object.hasOwnProperty.call(parameters, key);
        });

        if (missingParameters.length > 0) {
            throw new Error('Mandatory parameters missing: ' + missingParameters.join(':'));
        } else {
            parameters = (<any>Object).assign(JSON.parse(JSON.stringify(this.DEFAULT_PARAMETERS)),
                JSON.parse(JSON.stringify(parameters)));
            const invalidParameters = Object.keys(parameters).filter(key => {
                let result;

                switch (key) {
                    case 'repositoryName':
                        result = typeof parameters[key] !== 'string';
                        break;
                    case 'baseURL':
                        result = typeof parameters[key] !== 'string';
                        break;
                    case 'port':
                        result = typeof parameters[key] !== 'number';
                        break;
                    case 'adminEmail':
                        result = typeof parameters[key] !== 'string' && !Array.isArray(parameters[key]);
                        break;
                    case 'description':
                        result = Object.hasOwnProperty.call(parameters, key) && typeof parameters[key] !== 'string';
                        break;
                    default:
                        break;
                }
                return result;
            });

            if (invalidParameters.length > 0) {
                throw new Error('Invalid parameters: ' + invalidParameters.join(':'));
            } else {
                return parameters;
            }
        }
    }

    /**
     * Returns information about the repository.
     * @returns {ProviderConfiguration}
     */
    public getParameters(): ProviderConfiguration {
        return this.parameters;
    }

    /**
     * Returns the OAI repository configured with this service.
     * @returns {DataRepository}
     */
    public getProvider(): DataRepository {
        return this.oaiProvider;
    }
}


