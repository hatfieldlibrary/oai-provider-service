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

import {Request, Response} from "express";
import {CoreOaiProvider, ExceptionCodes, ExceptionParams} from "../core/core-oai-provider";
import {generateException} from "../core/oai-response";
import logger from "../../common/logger";
import {factory} from "../sample-provider/repository/sample-data-repository";
import {Configuration} from "../sample-provider/repository/configuration";
import {SampleDcMapper} from "../sample-provider/repository/sample-dc-mapper";


/**
 * Set up the OAI provider to use the tagger repository implementation. Separate
 * controllers can instantiate providers with different repositories.
 * @type {CoreOaiProvider}
 */
const provider = new CoreOaiProvider(factory, new Configuration(), new SampleDcMapper());

/**
 * The OAI-PMH controller provides a single endpoint for OAI requests.
 * Repository methods for each verb will return a Promise.
 *
 * OAI exceptions that result from successful request processing are returned in
 * the Response with status code 200. The Promises will reject when unexpected
 * processing errors occur. These rejections are handled by returning an OAI
 * exception with a 500 status code. That seems to be the best approach
 * to exception handling, but might need to be revised if we learn otherwise.
 * @param {Request} req
 * @param {Response} res
 */
export let oai = (req: Request, res: Response) => {

    res.set('Content-Type', 'text/xml');

    switch (req.query.verb) {

        case 'Identify':
            logger.debug('Identify request.');
            provider.identify(req.query)
                .then((response) => {
                    res.send(response);
                })
                .catch((oaiError) => {
                    res.status(500);
                    res.send(oaiError);
                });

            break;

        case 'ListMetadataFormats':
            logger.debug('ListMetadataFormats request.');
            provider.listMetadataFormats(req.query)
                .then((response) => {
                    res.send(response);
                })
                .catch((oaiError) => {
                    res.status(500);
                    res.send(oaiError);
                });

            break;

        case 'ListIdentifiers':
            logger.debug('ListIdentifiers request.');
            provider.listIdentifiers(req.query)
                .then((response) => {
                    res.send(response)
                })
                .catch((oaiError) => {
                    res.status(500);
                    res.send(oaiError)
                });

            break;

        case 'ListRecords':
            logger.debug('ListRecords request.');
            provider.listRecords(req.query)
                .then((response) => {
                    res.send(response)
                })
                .catch((oaiError) => {
                    res.status(500);
                    res.send(oaiError)
                });

            break;

        case 'ListSets':
            logger.debug('ListSet request.');
            provider.listSets(req.query)
                .then((response) => {
                    res.send(response)
                })
                .catch((oaiError) => {
                    res.status(500);
                    res.send(oaiError)
                });
            break;

        case 'GetRecord':
            logger.debug('GetRecord request.');
            provider.getRecord(req.query)
                .then((response) => {
                    res.send(response)
                })
                .catch((oaiError) => {
                    res.status(500);
                    res.send(oaiError)
                });

            break;

        default:
            const exception: ExceptionParams = {
                baseUrl: req.protocol + '://' + req.get('host') +  req.path
            };
            res.send(generateException(exception, ExceptionCodes.BAD_VERB));
    }

};
