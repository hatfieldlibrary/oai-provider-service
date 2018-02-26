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

        } catch (err) {
            throw new Error('Creating the backend module failed: ' + err.message);
        }
    }

    public recordsQuery(parameters: any): Promise<any> {
        let whereClause: string = "";
        if (parameters.from && parameters.until) {
            const until = this.connection.escape(parameters.until);
            const from = this.connection.escape(parameters.from);
            whereClause = " c.published = true AND c.updatedAt >= "
                + from + " AND c.updatedAt <= " + until;
        }
        else if (parameters.from) {
            const from = this.connection.escape(parameters.from);
            whereClause = " c.published = true AND c.updatedAt >= " + from;
        } else {
            whereClause = " c.published = true ";
        }
        logger.info(whereClause)
        return new Promise((resolve: any, reject: any) => {
            this.connection.query('Select c.updatedAt, c.title, c.description, c.url, c.id, c.restricted, ' +
                'cr.title AS category FROM Collections c JOIN CategoryTargets ct on ct.CollectionId=c.id ' +
                'JOIN Categories cr on ct.CategoryId=cr.id WHERE ' + whereClause,
                (err: Error, rows: any[]) => {
                    if (err) {
                        logger.debug(err);
                        return reject(err);
                    }
                    resolve(rows);
                });
        });

    }

    public identifiersQuery(parameters: any): Promise<any> {
        let query: string = "";
        if (parameters.from && parameters.until) {
            const until = this.connection.escape(parameters.until);
            const from = this.connection.escape(parameters.from);
            query = "Select id, updatedAt FROM Collections WHERE published = true AND updatedAt >= '"
                + from + "' AND updatedAt <= '" + until + "'";
        }
        else if (parameters.from) {
            const from = this.connection.escape(parameters.from);
            query = "Select id, updatedAt FROM Collections WHERE published = true AND updatedAt >= " + from;
        } else {
            query = "Select id, updatedAt FROM Collections WHERE published = true ";
        }
        return new Promise((resolve: any, reject: any) => {
            this.connection.query(query,
                (err: Error, rows: any[]) => {
                    if (err) {
                        logger.debug(err);
                        return reject(err);
                    }
                    resolve(rows);
                });
        });
    }

    public getRecord(id: string): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            this.connection.query('Select c.updatedAt, c.title, c.description, c.url, c.id, c.restricted, ' +
                'cr.title AS category FROM Collections c JOIN CategoryTargets ct on ct.CollectionId=c.id ' +
                'JOIN Categories cr on ct.CategoryId=cr.id WHERE c.id=' +
                this.connection.escape(id) + ' AND c.published = true',
                (err: Error, rows: any[]) => {
                    if (err) {
                        logger.debug(err);
                        return reject(err);
                    }
                    logger.info(rows);
                    resolve(rows);
                });
        });
    }

    public close(): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            this.connection.end((err: Error) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }

}