import {Request, Response} from "express";
import {OaiProviderRepository} from "../../repository/core-oai-provider";

const provider = new OaiProviderRepository();

export let oai = (req: Request, res: Response) => {

    res.set('Content-Type', 'text/xml');

    switch (req.query.verb) {

        case 'Identify':
            provider.identify(req.query, req.originalUrl, req.protocol, req.get('host'))
                .then((response) => {
                    res.send(response);
                })
                .catch((err) => {
                    res.send(err);
                });
            break;
        case 'ListMetadataFormats':

            break;
        case 'ListIdentifiers':

            break;
        case 'ListRecords':
            provider.listRecords(req.query, req.originalUrl, req.protocol, req.get('host'))
                .then((response) => {
                    res.send(response)
                })
                .catch((err) => {
                    res.send(err)
                });

            break;
        case 'ListSets':

            break;
        case 'GetRecord':

            break;

    }


};
