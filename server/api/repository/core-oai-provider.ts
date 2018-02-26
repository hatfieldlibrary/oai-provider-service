import {Request, Response} from "express";
import {generateException, generateResponse} from "./oai-response";
import {BackendModule} from '../../common/backend-module-singleton';
import {Configuration} from "../../config/configuration";
import {findKey} from 'lodash';
import {ERRORS, Record} from "./commons-oai-provider";
import logger from "../../common/logger";
import {OaiDcMapper} from "./oai-dc-mapper";

interface Formats {
    prefix: string;
    schema: string;
    namespace: string;
}

export class OaiProviderRepository {

    // Singleton of the core oai module. This module validates
    // the Configuration and instantiates the oai provider.
    backendModule: BackendModule;
    // The core oai module validates oai configuration
    // for this server.
    parameters: Configuration;

    constructor() {
        this.backendModule = BackendModule.getInstance();
        this.parameters = this.backendModule.getParameters();
    }

    private hasKey(object: object, key: string): boolean {
        return Object.prototype.hasOwnProperty.call(object, key);
    }

    public oai(req: Request, res: Response): any {

        res.set('Content-Type', 'text/xml');
        /**
         * All provided recordsQuery parameters are collected into the 'queryParameters' array.
         */
        const queryParameters = Object.keys(req.query).map(key => req.query[key]);

        logger.debug("Query Parameters: " + queryParameters);
        logger.debug("req.query.verb: " + req.query.verb);
        logger.debug("Server parameters: " + this.parameters);

        /**
         * A list of possible parameters that ListIdentifiers or ListRecords can take.
         */
        const possibleParams = ['verb', 'from', 'until', 'metadataPrefix', 'set', 'resumptionToken'];
        switch (req.query.verb) {
            case 'Identify':
                /**
                 * Parameters: none
                 * exceptions: badArgument
                 */
                if (queryParameters.length > 1) {
                    res.send(generateException(req, 'badArgument'));
                } else {
                    this.backendModule.getProvider().getCapabilities().then((capabilities: any) => {
                        const responseContent = {
                            Identify: [
                                {repositoryName: this.parameters.repositoryName},
                                {baseURL: this.parameters.baseURL},
                                {protocolVersion: this.parameters.protocolVersion},
                                {adminEmail: this.parameters.adminEmail},
                                {earliestDatestamp: capabilities.earliestDatestamp},
                                {deletedRecord: capabilities.deletedRecordsSupport},
                                {granularity: capabilities.harvestingGranularity}
                            ]
                        };
                        res.send(generateResponse(req, responseContent));
                    });
                }
                break;
            case 'ListMetadataFormats':
                /**
                 * Parameters: identifier (optional)
                 * exceptions: badArgument, idDoesNotExist, noMetadataFormats
                 */
                if (queryParameters.length > 2 || (queryParameters.length === 2 &&
                        !this.hasKey(req.query, 'identifier'))) {
                    res.send(generateException(req, 'badArgument'));
                } else {
                    const args = this.hasKey(req.query, 'identifier') ? req.query.identifier : undefined;
                    this.backendModule.getProvider().getMetadataFormats(args).then((formats: any[]) => {
                        const responseContent = {
                            ListMetadataFormats: formats.map((format: Formats) => {
                                return {
                                    metadataFormat: [
                                        {metadataPrefix: format.prefix},
                                        {schema: format.schema},
                                        {metadataNamespace: format.namespace}
                                    ]
                                };
                            })
                        };
                        res.send(generateResponse(req, responseContent));
                    });
                }
                break;
            case 'ListSets':
                /**
                 * Parameters: resumptionToken (exclusive)
                 * exceptions: badArgument, badResumptionToken, noSetHierarchy
                 */
                if (queryParameters.length > 2 || (queryParameters.length === 2 &&
                        !this.hasKey(req.query, 'resumptionToken'))) {
                    res.send(generateException(req, 'badArgument'));
                } else {
                    /**
                     * @todo: Implement set functionality. Currently not supported by
                     * the backend.
                     */
                    const args = this.hasKey(req.query, 'resumptionToken') ? req.query.resumptionToken : undefined;
                    res.send(generateException(req, 'noSetHierarchy'));
                }
                break;
            case 'ListIdentifiers':
                /**
                 * Parameters: from (optional),
                 * until (optional),
                 * metadataPrefix (required),
                 * set (optional),
                 * resumptionToken (exclusive)
                 *
                 * exceptions: badArgument,
                 * badResumptionToken,
                 * cannotDisseminateFormat,
                 * noRecordsMatch,
                 * noSetHierarchy
                 */
                if (
                    (queryParameters.length > 6 || queryParameters.length < 2) ||
                    (queryParameters.length === 2 && (!this.hasKey(req.query, 'metadataPrefix') &&
                        !this.hasKey(req.query, 'resumptionToken'))) ||
                    (!Object.keys(req.query).every(key => possibleParams.indexOf(key) >= 0))) {
                    res.send(generateException(req, 'badArgument'));
                } else {
                    try {
                        this.backendModule.getProvider().getIdentifiers(req.query)
                            .then((result: any) => {
                                try {
                                    const mapped = OaiDcMapper.mapOaiDcListIdentifiers(result);
                                    res.send(generateResponse(req, mapped));
                                } catch (err) {
                                    logger.error(err);
                                    res.send(generateException(req, 'noRecordsMatch'));
                                }

                            })
                            .catch((err: Error) =>
                                logger.error(err))

                    } catch (err) {
                        throw new Error(err);
                    }

                }
                break;
            case 'ListRecords':
                /**
                 * Parameters: from (optional),
                 * until (optional),
                 * metadataPrefix (required),
                 * set (optional),
                 * resumptionToken (exclusive)
                 *
                 * exceptions: badArgument,
                 * badResumptionToken,
                 * cannotDisseminateFormat,
                 * noRecordsMatch,
                 * noSetHierarchy
                 */
                if ((queryParameters.length > 6 || queryParameters.length < 2) ||
                    (queryParameters.length === 2 && (!this.hasKey(req.query, 'metadataPrefix') &&
                        !this.hasKey(req.query, 'resumptionToken'))) ||
                    (!Object.keys(req.query).every(key => possibleParams.indexOf(key) >= 0))) {
                    res.send(generateException(req, 'badArgument'));
                } else {
                    try {
                        this.backendModule.getProvider().getRecords(req.query)
                            .then((result: any) => {
                                try {
                                    const mapped = OaiDcMapper.mapOaiDcListRecords(result);
                                    res.send(generateResponse(req, mapped))
                                } catch (err) {
                                    logger.error(err);
                                    res.send(generateException(req, 'noRecordsMatch'));
                                }

                            })
                            .catch((err: Error) =>
                                logger.error(err))

                    } catch (err) {
                        throw new Error(err);
                    }

                }
                break;
            case 'GetRecord':
                /**
                 * Parameters: identifier (required),
                 * metadataPrefix (required)
                 *
                 * exceptions: badArgument,
                 * cannotDisseminateFormat,
                 * idDoesNotExist
                 */
                if (queryParameters.length !== 3 || !this.hasKey(req.query, 'identifier') ||
                    !this.hasKey(req.query, 'metadataPrefix')) {
                    res.send(generateException(req, 'badArgument'));
                } else {
                    this.backendModule.getProvider().getRecord(req.query.identifier, req.query.metadataPrefix)
                        .then((record: any) => {
                                const mapped = OaiDcMapper.mapOaiDcGetRecord(record);
                                res.send(generateResponse(req, mapped));

                        })
                        .catch((err: Error) => {
                            res.send(generateException(req, 'noRecordsMatch'));
                            logger.error(err)
                        });
                }
                break;
            default:
                res.send(generateException(req, 'badVerb'));
        }
    }
}
