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
import {CoreOaiProvider, ExceptionCodes, ExceptionParams} from "../repository/core-oai-provider";
import {generateException} from "../repository/oai-response";
import logger from "../../common/logger";

const provider = new CoreOaiProvider();

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
