
import * as mysql from 'mysql';
import {Connection} from "mysql";
import logger from '../../common/logger';

export class MysqlConnector {

    private connection: Connection;
    public static instance: MysqlConnector;

    private constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'tagger-test',
            password: 'taggertest',
            database: 'tagger_option_one'
        });
    }

    public static getInstance(): MysqlConnector {
        try {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new MysqlConnector();
            return this.instance;

        } catch(err) {
            throw new Error('Creating the backend module failed: ' + err.message);
        }
    }

    public recordsQuery(): Promise<any> {
        return new Promise( ( resolve: any, reject: any ) => {
            this.connection.query('Select c.title, c.description, c.url, c.id, c.restricted, cr.title AS category ' +
                'FROM Collections c JOIN CategoryTargets ct on ct.CollectionId=c.id ' +
                'JOIN Categories cr on ct.CategoryId=cr.id WHERE c.published = true',
                ( err: Error, rows: any[] ) => {
                if ( err ) {
                    logger.debug(err);
                    return reject(err);
                }
                resolve( rows );
            } );
        } );

    }

    public close(): Promise<any> {
        return new Promise( ( resolve: any, reject: any ) => {
            this.connection.end( (err: Error) => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }

}