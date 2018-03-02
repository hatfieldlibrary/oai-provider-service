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

/**
 * Sample respository DAO. Returns dummy data.
 */
export class SampleDaoConnector {

    /**
     * Responds to OAI ListRecords requests.
     * @param parameters
     * @returns {Promise<any>}
     */
    public recordsQuery(parameters: any): Promise<any> {

        return new Promise((resolve: any, reject: any) => {
            // If metadataPrefix is not oai_dc the promise will reject.
            // This allows you to verify the error response.
            if (parameters.metadataPrefix === 'oai_dc') {
                resolve([
                    {
                        "updatedAt": "2017-10-17T09:51:07.000Z",
                        "title": "Sample Item One",
                        "description": "Sample Item One description is short and non-descriptive..",
                        "url": "http://localhost:3000/item/1",
                        "id": 1,
                    },

                    {
                        "updatedAt": "2017-11-17T09:51:07.000Z",
                        "title": "Sample Item Two",
                        "description": "Sample Item Two description is short and non-descriptive, like Item One.",
                        "url": "http://localhost:3000/item/2",
                        "id": 2,
                    },

                    {
                        "updatedAt": "2017-08-17T09:51:07.000Z",
                        "title": "Sample Item Three",
                        "description": "Sample Item Three description is short and not descriptive. But it is " +
                        "at least longer than some other descriptions",
                        "url": "http://localhost:3000/item/3",
                        "id": 3
                    },
                ]);
            } else {
                reject("sample rejection");
            }
        });
    }

    /**
     * Responds to OAI GetRecord requests.
     * @param parameters
     * @returns {Promise<any>}
     */
    public getRecord(parameters: any): Promise<any> {

        return new Promise((resolve: any, reject: any) => {

            // If metadataPrefix is not oai_dc the promise will reject.
            // This allows you to verify the error response.
            if (parameters.metadataPrefix === 'oai_dc') {
                resolve([
                    {
                        "updatedAt": "2017-10-17T09:51:07.000Z",
                        "title": "Sample Item One",
                        "description": "Sample Item One description is short and non-descriptive..",
                        "url": "http://localhost:3000/item/1",
                        "id": 1
                    }
                ]);
            } else {
                reject("sample rejection on GetRecord");
            }
        });
    }

    /**
     * Responds to OAI ListIdentifiers requests.
     * @param parameters
     * @returns {Promise<any>}
     */
    public identifiersQuery(parameters: any): Promise<any> {

        return new Promise((resolve: any, reject: any) => {
            if (parameters.metadataPrefix === 'oai_dc') {
                resolve([
                    {
                        "id": 135,
                        "updatedAt": "2017-10-17T03:01:45.000Z"
                    },
                    {
                        "id": 137,
                        "updatedAt": "2017-10-20T04:15:33.000Z"
                    },
                    {
                        "id": 138,
                        "updatedAt": "2017-10-17T09:51:07.000Z"
                    }
                ]);
            } else {
                reject("sample rejection");
            }
        });
    }

}
