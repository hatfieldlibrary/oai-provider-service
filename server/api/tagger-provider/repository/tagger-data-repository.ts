/*
 *  Copyright 2018 Willamette University
 *
 *  This file is part of tagger-oai-provider.
 *
 *  @author Michael Spalti
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
 * @typedef {Object} getSetsResponse
 * @property {set[]} sets
 * @property {flowControl} [flowControl]
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
 * @typedef {Object} record
 * @property {string} resumptionToken
 * @property {number}id
 * @property {string} title
 * @property {string} image
 * @property {string} url
 * @property {string} browseType
 * @property {string} description
 * @property {string} dates
 * @property {string} items
 * @property {string} ctype
 * @property {string} repoType
 * @property {string} restricted
 * @property {boolean} published
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} searchUrl
 */


import {MysqlConnector} from "../dao/mysql";
import {DataRepository} from "./core-oai-provider";
import logger from "../../../common/logger";

export enum HARVESTING_GRANULARITY {
    DATE = 'YYYY-MM-DD',
    DATETIME = 'YYYY-MM-DDThh:mm:ssZ'
}

export enum DELETED_RECORDS_SUPPORT  {
    NO = 'no',
    TRANSIENT = 'transient',
    PERSISTENT = 'persistent'
}

// Not actually using these error defs in our responses.
export enum ERRORS  {
    badArgument = 0,
    badResumptionToken = 1,
    badVerb = 2,
    cannotDisseminateFormat = 4,
    idDoesNotExist = 8,
    noRecordsMatch = 16,
    noMetadataFormats = 32,
    noSetHierarchy = 64
}

export enum METADATA_FORMAT_DC  {
    prefix = 'oai_dc',
    schema = 'http://www.openarchives.org/OAI/2.0/oai_dc.xsd',
    namespace = 'http://www.openarchives.org/OAI/2.0/oai_dc/'
}

const EARLIEST_DATE = '2017-01-00T03:24:00';

/**
 * Factory function to create a oai service
 * @param {Object} [options={}] - Implementation-specific options
 * @param {{}} options
 * @returns {DataRepository}
 */
export function factory(options = {}): DataRepository {

    const mysql: MysqlConnector = MysqlConnector.getInstance();

    return Object.freeze({
        /**
         * @typedef {function} getCapabilities
         * @returns {Promise<capabilities>} Provider's capabilities
         */
        getCapabilities: () => {
            return Promise.resolve({
                deletedRecordsSupport: DELETED_RECORDS_SUPPORT.NO,
                harvestingGranularity: HARVESTING_GRANULARITY.DATETIME,
                earliestDatestamp: EARLIEST_DATE
            });
        },
        /**
         * @typedef {function} getRecord
         * @param {string} identifier - xxx
         * @param {string} metadataPrefix - xxx
         * @returns {Promise<record>} Resolves with a {@link record}
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
            // Since only DC is supported, safe to ignore the identifier param.
            return Promise.resolve([METADATA_FORMAT_DC]);
        },

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

        }

    });
}