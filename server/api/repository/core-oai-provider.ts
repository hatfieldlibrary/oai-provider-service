
/*
 *  Copyright 2018 Willamette University
 *
 *  This file is part of tagger-oai-provider.
 *
 *  tagger-oai-provider is based on the Modular OAI-PMH Server, University of Helsinki,
 *  The National Library of Finland.
 *
 *  tagger-oai-provider is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  tagger-oai-provider is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with tagger-oai-provider.  If not, see <http://www.gnu.org/licenses/>.
 */

import {generateException, generateResponse} from "./oai-response";
import {OaiService} from './oai-service';
import {Configuration} from "../../provider-configuration/configuration";
import logger from "../../common/logger";
import {OaiDcMapper} from "./tagger-dc-mapper";
import {METADATA_FORMAT_DC} from "./tagger-data-repository";

interface Formats {
    prefix: string;
    schema: string;
    namespace: string;
}

export interface ExceptionParams {
    baseUrl: string;
    verb?: Verbs;
    identifier?: string;
    metadataPrefix?: string
}

export enum Verbs {
    IDENTIFY = 'Identify',
    LIST_METADATA_FORMATS = 'ListMetadataFormats',
    LIST_SETS = 'ListSets',
    GET_RECORD = 'GetRecord',
    LIST_IDENTIFIERS = 'ListIdentifiers',
    LIST_RECORDS = 'ListRecords'
}

export enum ExceptionCodes {
    BAD_ARGUMENT = "badArgument",
    BAD_RESUMPTION_TOKEN = "badResumptionToken",
    BAD_VERB = "badVerb",
    CANNOT_DISSEMINATE_FORMAT = "cannotDisseminateFormat",
    ID_DOES_NOT_EXIST = "idDoesNotExist",
    NO_RECORDS_MATCH = "noRecordsMatch",
    NO_METADATA_FORMATS = "noMetadataFormats",
    NO_SET_HIERARCHY = "noSetHierarchy"
}

export interface DataRepository {
    getCapabilities: any;
    getSets: any;
    getRecords: any;
    getMetadataFormats: any;
    getIdentifiers: any;
    getRecord: any;
}

/**
 * The core OAI provider class requires an instance of the OAI
 * service (oai-service) that is configured with a data repository
 * (tagger-data-repository).
 */
export class CoreOaiProvider {

    oaiService: OaiService;
    parameters: Configuration;

    possibleParams = ['verb', 'from', 'until', 'metadataPrefix', 'set', 'resumptionToken'];

    constructor() {
        // Singleton of the core oai service. This module validates
        // the Configuration and instantiates the oai provider.
        this.oaiService = OaiService.getInstance();
        this.parameters = this.oaiService.getParameters();
    }

    /**
     * Checks for key on the queryParameters object.
     * @param {object}
     * @param {string}
     * @returns {boolean}
     */
    private hasKey(queryParameters: object, key: string): boolean {
        return Object.prototype.hasOwnProperty.call(queryParameters, key);
    }

    /**
     * Gets the query parameters provided by the http Request.
     * @param query
     * @returns {any[]}
     */
    private getQueryParameters(query: any) {
        return Object.keys(query).map(key => query[key]);
    }

    /**
     * Validates that we have valid from and until value.
     * @param parameters
     * @returns {boolean}
     */
    private validateSelectiveParams(parameters: any): boolean {
        if (parameters.until) {
            if (!parameters.from) {
                return false;
            }
            return parseInt(parameters.from) <= parseInt(parameters.until);
        }
        return true;
    }

    /**
     * Handle OAI requests. The methods return configuration values or
     * retrieve data from the repository provider (tagger-oai-provider).
     * Data from the provider is mapped to json (tagger-dc-mapper) and
     * returned as xml (oai-response).
     */

    listSets(query: any): Promise<any> {
        /**
         * Parameters: resumptionToken (exclusive)
         * exceptions: badArgument, badResumptionToken, noSetHierarchy
         */
        return new Promise((resolve: any, reject: any) => {
            const queryParameters = this.getQueryParameters(query);
            const exception: ExceptionParams = {
                baseUrl:  this.parameters.baseURL,
                verb: Verbs.LIST_SETS
            };
            if (queryParameters.length > 2 || (queryParameters.length === 2 &&
                    !this.hasKey(query, 'resumptionToken'))) {
                resolve(generateException(exception, ExceptionCodes.BAD_ARGUMENT));
            } else {
                resolve(generateException(exception, ExceptionCodes.NO_SET_HIERARCHY));
            }
        });
    }

    listMetadataFormats(query: any): Promise<any> {
        /**
         * Parameters: identifier (optional)
         * exceptions: badArgument, idDoesNotExist, noMetadataFormats
         */
        return new Promise((resolve: any, reject: any) => {
            const queryParameters = this.getQueryParameters(query);
            const exception: ExceptionParams = {
                baseUrl:  this.parameters.baseURL,
                verb: Verbs.LIST_METADATA_FORMATS,
                metadataPrefix: METADATA_FORMAT_DC.prefix
            };
            if (queryParameters.length > 2 || (queryParameters.length === 2 &&
                    !this.hasKey(query, 'identifier'))) {
                resolve(generateException(exception, ExceptionCodes.BAD_ARGUMENT));
            } else {
                const args = this.hasKey(query, 'identifier') ? query.identifier : undefined;
                this.oaiService.getProvider().getMetadataFormats(args).then((formats: any[]) => {
                    try {
                        const responseContent = {
                            ListMetadataFormats: formats.map((format: Formats) => {
                                logger.debug(format);
                                return {
                                    metadataFormat: [
                                        {metadataPrefix: format.prefix},
                                        {schema: format.schema},
                                        {metadataNamespace: format.namespace}
                                    ]
                                };
                            })
                        };
                        resolve(generateResponse(query, this.parameters.baseURL, responseContent));
                    } catch (err) {
                        logger.error(err);
                        reject(generateException(exception, ExceptionCodes.NO_METADATA_FORMATS));
                    }
                });
            }
        });
    }

    getRecord(query: any): Promise<any> {
        /**
         * Parameters: identifier (required),
         * metadataPrefix (required)
         *
         * exceptions: badArgument,
         * cannotDisseminateFormat,
         * idDoesNotExist
         */
        return new Promise((resolve: any, reject: any) => {
            const queryParameters = this.getQueryParameters(query);
            const exception: ExceptionParams = {
                baseUrl:  this.parameters.baseURL,
                verb: Verbs.GET_RECORD,
                identifier: query.identifier,
                metadataPrefix: METADATA_FORMAT_DC.prefix
            };
            if (queryParameters.length !== 3 || !this.hasKey(query, 'identifier') ||
                !this.hasKey(query, 'metadataPrefix')) {
                resolve(generateException(exception, ExceptionCodes.BAD_ARGUMENT));
            } else {
                this.oaiService.getProvider().getRecord(query.identifier, query.metadataPrefix)
                    .then((record: any) => {
                        try {
                            if (record.length === 1) {
                                const mapped = OaiDcMapper.mapOaiDcGetRecord(record);
                                resolve(generateResponse(query, this.parameters.baseURL, mapped))
                            } else {
                                // There should be one matching record.
                                resolve(generateException(exception, ExceptionCodes.ID_DOES_NOT_EXIST));
                            }
                        } catch (err) {
                            logger.error(err);
                            reject(generateException(exception, ExceptionCodes.ID_DOES_NOT_EXIST));
                        }
                    })
                    .catch((err: Error) => {
                        logger.error(err);
                        // If dao query errs, return OAI error.
                        reject(generateException(exception, ExceptionCodes.ID_DOES_NOT_EXIST));
                    });
            }
        });
    }

    listIdentifiers(query: any): Promise<any> {
        /**
         * Parameters: from (optional),
         * until (optional),
         * metadataPrefix (required),
         * set (optional),
         * resumptionToken (exclusive)
         *
         * exceptions: badArgument,
         * badResumptionToken,
         * cannotDisseminateFormat,
         * noRecordsMatch,
         * noSetHierarchy
         */
        return new Promise((resolve: any, reject: any) => {

            const queryParameters = this.getQueryParameters(query);

            const exception: ExceptionParams = {
                baseUrl:  this.parameters.baseURL,
                verb: Verbs.LIST_IDENTIFIERS,
                metadataPrefix: METADATA_FORMAT_DC.prefix
            };

            if ((queryParameters.length > 6 || queryParameters.length < 2) ||
                (queryParameters.length === 2 && (!this.hasKey(query, 'metadataPrefix') &&
                    !this.hasKey(query, 'resumptionToken'))) ||
                !this.validateSelectiveParams(query) ||
                (!Object.keys(query).every(key => this.possibleParams.indexOf(key) >= 0))) {
                resolve(generateException(exception, ExceptionCodes.BAD_ARGUMENT));
            } else {
                this.oaiService.getProvider().getIdentifiers(query)
                    .then((result: any) => {
                        if (result.length === 0) {
                            resolve(generateException(exception, ExceptionCodes.NO_RECORDS_MATCH));
                        }
                        try {
                            const mapped = OaiDcMapper.mapOaiDcListIdentifiers(result);
                            resolve(generateResponse(query, this.parameters.baseURL, mapped))
                        } catch (err) {
                            // Log the error and return OAI error message.
                            logger.error(err);
                            reject(generateException(exception, ExceptionCodes.NO_RECORDS_MATCH));
                        }

                    })
                    .catch((err: Error) => {
                        logger.error(err);
                        // If dao query fails, return OAI error.
                        reject(generateException(exception, ExceptionCodes.NO_RECORDS_MATCH));
                    });

            }
        });
    }


    listRecords(query: any): Promise<any> {
        /**
         * Parameters: from (optional),
         * until (optional),
         * metadataPrefix (required),
         * set (optional),
         * resumptionToken (exclusive)
         *
         * exceptions: badArgument,
         * badResumptionToken,
         * cannotDisseminateFormat,
         * noRecordsMatch,
         * noSetHierarchy
         */
        return new Promise((resolve: any, reject: any) => {
            const queryParameters = this.getQueryParameters(query);
            logger.debug(queryParameters)
            const exception: ExceptionParams = {
                baseUrl:  this.parameters.baseURL,
                verb: Verbs.LIST_RECORDS,
                metadataPrefix: METADATA_FORMAT_DC.prefix
            };

            if ((queryParameters.length > 6 || queryParameters.length < 2) ||
                (queryParameters.length === 2 && (!this.hasKey(query, 'metadataPrefix') &&
                    !this.hasKey(query, 'resumptionToken'))) ||
                !this.validateSelectiveParams(query) ||
                (!Object.keys(query).every(key => this.possibleParams.indexOf(key) >= 0))) {
                resolve(generateException(exception, ExceptionCodes.BAD_ARGUMENT));
            } else {
                this.oaiService.getProvider().getRecords(query)
                    .then((result: any) => {
                        if (result.length === 0) {
                            resolve(generateException(exception, ExceptionCodes.NO_RECORDS_MATCH));
                        }
                        try {
                            const mapped = OaiDcMapper.mapOaiDcListRecords(result);
                            resolve(generateResponse(query, this.parameters.baseURL, mapped))
                        } catch (err) {
                            // Log the error and return OAI error message.
                            logger.error(err);
                            reject(generateException(exception, ExceptionCodes.NO_RECORDS_MATCH));
                        }

                    })
                    .catch((err: Error) => {
                        logger.error(err);
                        // If dao query fails, return OAI error.
                        reject(generateException(exception, ExceptionCodes.NO_RECORDS_MATCH));
                    });

            }
        });
    }

    identify(query: any): Promise<any> {
        /**
         * Parameters: none
         * exceptions: badArgument
         */
        return new Promise((resolve: any, reject: any) => {
            logger.debug("Identify");
            const queryParameters = this.getQueryParameters(query);
            const exception: ExceptionParams = {
                baseUrl:  this.parameters.baseURL,
                verb: Verbs.IDENTIFY
            };
            try {
                if (queryParameters.length > 1) {
                    resolve(generateException(exception, 'badArgument'));
                } else {
                    this.oaiService.getProvider().getCapabilities().then((capabilities: any) => {
                        logger.debug(this.parameters);
                        logger.debug(capabilities);
                        const responseContent = {
                            Identify: [
                                {repositoryName: this.parameters.repositoryName},
                                {baseURL: this.parameters.baseURL},
                                {protocolVersion: this.parameters.protocolVersion},
                                {adminEmail: this.parameters.adminEmail},
                                {earliestDatestamp: capabilities.earliestDatestamp},
                                {deletedRecord: capabilities.deletedRecordsSupport},
                                {granularity: capabilities.harvestingGranularity}
                            ]
                        };
                        resolve(generateResponse(query, this.parameters.baseURL, responseContent));
                    });
                }
            } catch (err) {
                logger.log(err);
                reject(generateException(exception, ExceptionCodes.BAD_ARGUMENT));
            }
        });
    }
}
