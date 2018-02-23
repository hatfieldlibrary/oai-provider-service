import logger from "../../common/logger";

export class OaiDcMapper {

    private static getRightsMessage(restricted: boolean): string {
        if (restricted) {
            return "Restricted to University users."
        }
        return "Available to the public."
    }

    public static mapOaiDcListRecords(records: any[], verb: string): any {

        const list = [];
        const response = {};
        response[verb] = [];

        for (let record of records) {

            let item =
                {
                    record: [
                        {
                            'header': [
                                {'identifier': record.id.toString()},
                                {'metadata': new Date().toISOString()}
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

        response[verb] = list;

        return response;

    }

}