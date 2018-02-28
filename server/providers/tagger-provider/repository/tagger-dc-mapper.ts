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

import logger from "../../../common/logger";
import {ProviderDCMapper} from "../../core/core-oai-provider";

export class TaggerDcMapper implements ProviderDCMapper {

    /**
     * The Universal Coordinated Time (UTC) date needs to be modifed
     * to match the local timezone.
     * @param record the raw data returned by the mysql dao query
     * @returns {string}
     */
    private setTimeZoneOffset(record: any): string {
        const date = new Date(record.updatedAt);
        const timeZoneCorrection = new Date(date.getTime() + date.getTimezoneOffset() * -60000);
        return timeZoneCorrection.toISOString().split('.')[0] + "Z";

    }

    private getRightsMessage(restricted: boolean): string {
        if (restricted) {
            return "Restricted to University users."
        }
        return "Available to the public."
    }

    private createItemRecord(record: any): any {

        const updatedAt: string = this.setTimeZoneOffset(record);
        let item =
            {
                record: [
                    {
                        'header': [
                            {'identifier': record.id.toString()},
                            {'datestamp': updatedAt}
                        ]
                    },
                    {
                        'metadata': [
                            {
                                'oai_dc:dc': [{
                                    '_attr':
                                        {
                                            'xmlns:oai_dc': 'http://www.openarchives.org/OAI/2.0/oai_dc/',
                                            'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
                                            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                                            'xsi:schemaLocation': 'http://www.openarchives.org/OAI/2.0/oai_dc/ ' +
                                            'http://www.openarchives.org/OAI/2.0/oai_dc.xsd'
                                        }
                                },
                                    {'dc:title': record.title},
                                    {'dc:description': {_cdata: record.description}},
                                    {'dc:identifier': record.url},
                                    {'dc:source': record.category},
                                    {'dc:rights': this.getRightsMessage(record.restricted)}]
                            }]
                    }]
            };
        return item;
    }

    public mapOaiDcListRecords(records: any[]): any {

        const list = [];
        const response = {
            ListRecords: <any>[]
        };

        for (let record of records) {
            let item = this.createItemRecord(record);
            list.push(item);
        }

        logger.debug('Parsed ' + list.length + " records into OAI xml format.");

        response.ListRecords = list;

        return response;

    }

    public mapOaiDcGetRecord(records: any): any {

        const record = records.pop();
        if (!record) {
            throw new Error("Record not found");
        }

        let item = this.createItemRecord(record);
        logger.debug('Got item with id ' + record.id + ", title: " + record.title);
        return item;

    }

    public mapOaiDcListIdentifiers(records: any[]): any {

        const list = [];
        const response = {
            ListIdentifiers: <any>[]
        };

        for (let record of records) {
            const updatedAt: string = this.setTimeZoneOffset(record);
            let item =
                {
                    record: [
                        {
                            'header': [
                                {'identifier': record.id.toString()},
                                {'datestamp': updatedAt}
                            ]
                        }
                    ]
                };

            list.push(item);
        }

        response.ListIdentifiers = list;

        return response;

    }

}