import logger from "../../common/logger";

export class OaiDcMapper {

    /**
     * The Universal Coordinated Time (UTC) date needs to be modifed
     * to match the local timezone.
     * @param record the raw data returned by the mysql dao query
     * @returns {string}
     */
    private static setTimeZoneOffset(record: any): string {
        const date = new Date(record.updatedAt);
        const timeZoneCorrection = new Date(date.getTime() + date.getTimezoneOffset() * -60000);
        return timeZoneCorrection.toISOString().split('.')[0]+"Z";

    }
    private static getRightsMessage(restricted: boolean): string {
        if (restricted) {
            return "Restricted to University users."
        }
        return "Available to the public."
    }

    public static mapOaiDcListRecords(records: any[]): any {

        const list = [];
        const response = {
            ListRecords: <any>[]
        };

        for (let record of records) {
           const updatedAt: string = this.setTimeZoneOffset(record);
            let item =
                {
                    record: [
                        {
                            'header': [
                                {'identifier': record.id.toString()},
                                {'datestamp': updatedAt }
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

            list.push(item);
        }

        response.ListRecords = list;

        return response;

    }

    public static mapOaiDcGetRecord(records: any): any {

        const list = [];
        const response = {
            ListRecords: <any>[]
        };

        const record = records.pop();

        // TODO: this should be shared method for ListRecords and GetRecord.
        if (record) {

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

            list.push(item);

            response.ListRecords = list;
        }

        return response;

    }

    public static mapOaiDcListIdentifiers(records: any[]): any {

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