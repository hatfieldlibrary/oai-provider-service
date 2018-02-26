/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file.
 *
 * Backend module prototype for oai-pmh-server
 *
 * Copyright (c) 2017 University Of Helsinki (The National Library Of Finland)
 *
 * This file is part of oai-pmh-server-backend-module-prototype
 *
 * oai-pmh-server-backend-module-prototype is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * oai-pmh-server-backend-module-prototype is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 *
 */

/* eslint-disable no-unused-vars */

/**
 * @typedef {Object} metadataFormat
 * @property {string} prefix
 * @property {string} url
 */

/**
 * @typedef {number} error
 * @desc A bit field consisting of {@link ERRORS} values
 */

/**
 * @typedef {Object} set
 * @property {string} spec
 * @property {string} name
 * @property {string} [description]
 */

/**
 * @typedef {Object} flowControl
 * @property {string} resumptionToken
 * @property {Date} [expirationDate]
 * @property {number} [completeListSize]
 * @property {number} [cursor]
 */

/**
 * @external {Document} https://developer.mozilla.org/en-US/docs/Web/API/Document
 */
/**
 * @typedef {Object} record
 * @property {string} identifier
 * @property {Date} timestamp
 * @property {boolean} [deleted]
 * @property {Document} [metadata]
 * @property {string[]} [setSpec] - An array of {@link set} specs
 */

import {MysqlConnector} from "../dao/mysql";

/**
 * @typedef {Object} backendModule
 * @property {getCapabilities} getCapabilities - Get capabilities of the backend module
 * @property {getSets} getSets - Get the sets the backend supports
 * @property {getRecords} getRecords - xxx
 * @property {getIdentifiers} getIdentifiers - xxx
 * @property {getRecord} getRecord - xxx
 */
export interface BackendProvider {
    getCapabilities: any;
    getSets: any;
    getRecords: any;
    getMetadataFormats: any;
    getIdentifiers: any;
    getRecord: any;
    closeConnection: any;
}

export const HARVESTING_GRANULARITY = {
    DATE: 'YYYY-MM-DD',
    DATETIME: 'YYYY-MM-DDThh:mm:ssZ'
};
export const DELETED_RECORDS_SUPPORT = {
    NO: 'no',
    TRANSIENT: 'transient',
    PERSISTENT: 'persistent'
};
export const ERRORS = {
    badArgument: 0,
    badResumptionToken: 1,
    badVerb: 2,
    cannotDisseminateFormat: 4,
    idDoesNotExist: 8,
    noRecordsMatch: 16,
    noMetadataFormats: 32,
    noSetHierarchy: 64
};

export interface Record {
    id: number;
    title: string;
    image: string;
    url: string;
    browseType: string;
    description: string;
    dates: string;
    items: string;
    ctype: string;
    repoType: string;
    restricted: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    searchUrl: string;

}
/**
 * @type {metadataFormat}
 */
export const METADATA_FORMAT_DC = {
    prefix: 'oai_dc',
    schema: 'http://www.openarchives.org/OAI/2.0/oai_dc.xsd',
    namespace: 'http://www.openarchives.org/OAI/2.0/oai_dc/'
};

/**
 * Factory function to create a backend module
 * @param {Object} [options={}] - Implementation-specific options
 * @returns {backendModule} Backend module
 */
export function factory(options = {}): BackendProvider {

    const mysql: MysqlConnector = MysqlConnector.getInstance();

    return Object.freeze({
        /**
         * Backend module specific capabilities
         * @typedef {Object} capabilities
         * @property {DELETED_RECORDS_SUPPORT} deletedRecordsSupport
         * @property {HARVESTING_GRANULARITY} harvestingGranularity
         * @property {Date} earliestDatestamp - Earliest record modification time available
         */
        /**
         * @typedef {function} getCapabilities
         * @returns {Promise<capabilities>} Backend's capabilities
         */
        getCapabilities: () => {
            return Promise.resolve({
                deletedRecordsSupport: DELETED_RECORDS_SUPPORT.NO,
                harvestingGranularity: HARVESTING_GRANULARITY.DATETIME,
                earliestDatestamp: new Date()
            });
        },
        /**
         * @typedef {function} getRecord
         * @param {string} identifier - xxx
         * @param {string} metadataPrefix - xxx
         * @returns {Promise<record, number>} Resolves with a {@link record}
         */
        getRecord: (identifier: string, metadataPrefix: string) => {
            return mysql.getRecord(identifier);
        },

        /**
         * Returns the metadata formats supported by this repository.
         * @param {string} identifier (not used)
         * @returns {Promise<{prefix: string; schema: string; namespace: string}[]>}
         */
        getMetadataFormats: (identifier: string = undefined) => {
            return Promise.resolve([METADATA_FORMAT_DC]);
        },
        /**
         * @typedef {Object} getSetsResponse
         * @property {set[]} sets
         * @property {flowControl} [flowControl]
         */
        /**
         * Used to retrieve the set structure of a repository. Not supported currently.
         * Returns response indicating that the Commons repository does not have a set hierarchy.
         * @param {string} resumptionToken
         * @returns {Promise<never>}
         */
        getSets: (resumptionToken: string = undefined) => {
            return Promise.reject(resumptionToken ? ERRORS.badResumptionToken : ERRORS.noSetHierarchy);
        },
        /**
         * @typedef {Object} getRecordsResponse
         * @property {record[]} records - xxx
         * @property {flowControl} [flowControl]
         */
        /**
         * @typedef {Object} getRecordsParameters
         * @property {string} metadataPrefix - A {@link metadataFormat} prefix
         * @property {Date} [from] - xxx
         * @property {Date} [until] - xxx
         * @property {string} [set] - A {@link set} spec
         * @property {string} [resumptionToken] - Optional resumption token to get the next partition of records
         */
        /**
         * @typedef {function} getIdentifiers
         * @param {getRecordsParameters} parameters - xxx
         * @returns {Promise<getRecordsResponse, error>} Actual record metadata is not contained in the response
         */
        getIdentifiers: (parameters: any) => {
            return mysql.identifiersQuery(parameters);
        },
        /**
         * @typedef {function} getRecords
         * @param {Object} parameters - xxx
         * @param {string} metadataPrefix - A {@link metadataFormat} prefix
         * @param {Date} [from] - xxx
         * @param {Date} [until] - xxx
         * @param {string} [set] - A {@link set} spec
         * @param {string} [resumptionToken] - Optional resumption token to get the next partition of records
         * @returns {Promise<getRecordsResponse, error>} An array of records
         */
        getRecords: (parameters: any) => {
            return mysql.recordsQuery(parameters);

        },

        closeConnection: () => {
            return mysql.close();
        }
    });
}