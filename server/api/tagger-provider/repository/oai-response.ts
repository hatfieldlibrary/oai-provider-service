
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

import * as xml from 'xml';
import {ExceptionParams} from "./core-oai-provider";
import {Exceptions} from "./exceptions/exceptions";

const responseTemplate = {
    'OAI-PMH': [
        {
            _attr:
                {
                    xmlns: 'http://www.openarchives.org/OAI/2.0/',
                    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                    'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
                    'xsi:schemaLocation': 'http://www.openarchives.org/OAI/2.0/ ' +
                    '\nhttp://www.openarchives.org/OAI/2.0/OAI-PMH.xsd'
                }
        },
        {responseDate: new Date().toISOString()}
    ]
};

/**
 * Parse and return an XML response to request.
 * @param {object} req - An HTTP request object
 * @param {object} responseContent - The body of the response
 * @return {string} - Parsed XML response
 */
function generateResponse(verb: string, url: string, responseContent: any) {
    const newResponse = JSON.parse(JSON.stringify(responseTemplate));
    newResponse['OAI-PMH'].push({request: [{_attr: verb}, url]});
    newResponse['OAI-PMH'].push(responseContent);
    return xml(newResponse, {declaration: true});
}

/**
 * Generate an XML exception.
 * @param {object} req - An HTTP request object
 * @param {string} code - The OAI-PMH error code
 * @return {string} - Parsed XML exception
 */
const generateException = (exception: ExceptionParams, code: string) => {
    /**
     * Validate the argument types.
     */
    if (code === undefined) {
        throw new Error(`Function arguments are missing:  code: ${code}`);
    }
    if (Exceptions.getException(code) === Exceptions.UNKNOWN_CODE) {
        throw new Error(`Unknown exception type: ${code}`);
    }
    const newException = JSON.parse(JSON.stringify(responseTemplate));

    if (exception.verb && exception.identifier && exception.metadataPrefix) {
        newException['OAI-PMH'].push({
            request: [
                {
                    _attr:
                        {
                            verb: exception.verb,
                            identifier: exception.identifier,
                            metadataPrefix: exception.metadataPrefix
                        }
                },
                exception.baseUrl
            ]
        });
    }
    else if (exception.verb && exception.identifier) {
        newException['OAI-PMH'].push({
            request: [
                {
                    _attr: {
                        verb: exception.verb,
                        identifier: exception.identifier
                    }
                },
                exception.baseUrl]
        });
    } else if (exception.verb) {
        newException['OAI-PMH'].push(
            {
                request: [
                    {
                        _attr:
                            {verb: exception.verb}
                    },
                    exception.baseUrl
                ]
            });
    } else {
        newException['OAI-PMH'].push({request: exception.baseUrl});
    }

    newException['OAI-PMH'].push({error: [{_attr: {code}}, Exceptions.getException(code)]});

    return xml(newException, {declaration: true});
};

export {generateException, generateResponse};
