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
import {DataRepository} from "./core-oai-provider";

/**
 * The interface for the OAI provider description. All fields are
 * mandatory.  Define your configuration in separate repository
 * Configuration classes.
 */
export interface ProviderConfiguration {
    repositoryName: string;
    baseURL: string;
    protocolVersion: string;
    adminEmail: string;
    port: number;
    description: string;
    deletedRecord: string;
    granularity: string;
    earliestDatestamp: string;
}

export class OaiService {

    public static instance: OaiService;

    oaiProvider: DataRepository;

    parameters: ProviderConfiguration;

    /**
     * The service constructor requires a factory method and configuration
     * parameters as defined by an OAI data provider.
     * @param factory
     * @param {ProviderConfiguration} configuration
     */
    public constructor(factory: any, configuration: ProviderConfiguration) {

        logger.debug("Creating the OAI data provider for: " + configuration.repositoryName);

        this.parameters = configuration;
        this.oaiProvider = factory(this.parameters);

    }

    /**
     * Returns the repository configuration for this instance.
     * @returns {ProviderConfiguration}
     */
    public getParameters(): ProviderConfiguration {
        return this.parameters;
    }

    /**
     * Returns the OAI data provider configured for this instance.
     * @returns {DataRepository}
     */
    public getProvider(): DataRepository {
        return this.oaiProvider;
    }

}


