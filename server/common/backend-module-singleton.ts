import {BackendProvider, factory} from "../api/repository/commons-oai-provider";
import {Configuration} from "../config/configuration";
import logger from './logger';

export class BackendModule {

    public static instance: BackendModule;

    parameters: Configuration;

    backendProvider: BackendProvider;

    MANDATORY_PARAMETERS = ['repositoryName', 'baseURL', 'adminEmail'];
    DEFAULT_PARAMETERS = {
        port: 1337,
        description: '',
        backendModule: {}
    };

    private constructor() {
        const configuration = new Configuration();
        this.parameters = this.initParameters(configuration)
    }

    private initParameters(parameters: Configuration): any {

        const missingParameters = this.MANDATORY_PARAMETERS.filter(key => {
            return !Object.hasOwnProperty.call(parameters, key);
        });

        if (missingParameters.length > 0) {
            throw new Error('Mandatory parameters missing: ' + missingParameters.join());
        } else {
            parameters = Object.assign(JSON.parse(JSON.stringify(this.DEFAULT_PARAMETERS)),
                JSON.parse(JSON.stringify(parameters)));
            const invalidParameters = Object.keys(parameters).filter(key => {
                let result;

                switch (key) {
                    case 'repositoryName':
                        result = typeof parameters[key] !== 'string';
                        break;
                    case 'baseURL':
                        result = typeof parameters[key] !== 'string';
                        break;
                    case 'port':
                        result = typeof parameters[key] !== 'number';
                        break;
                    case 'adminEmail':
                        result = typeof parameters[key] !== 'string' && !Array.isArray(parameters[key]);
                        break;
                    case 'description':
                        result = Object.hasOwnProperty.call(parameters, key) && typeof parameters[key] !== 'string';
                        break;
                    case 'backendModule':
                        result = Object.hasOwnProperty.call(parameters, key) && typeof parameters[key] !== 'object';
                        break;
                    default:
                        break;
                }
                return result;
            });

            if (invalidParameters.length > 0) {
                throw new Error('Invalid parameters: ' + invalidParameters.join());
            } else {
                return parameters;
            }
        }
    }

    public static getInstance(): BackendModule {
        try {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new BackendModule();
            this.instance.backendProvider = factory(this.instance.parameters);
            return this.instance;

        } catch(err) {
            throw new Error('Creating the backend module failed: ' + err.message);
        }
    }

    public getParameters(): Configuration {
        return this.parameters;
    }

    public getProvider(): BackendProvider {
        return this.backendProvider;
    }
}


