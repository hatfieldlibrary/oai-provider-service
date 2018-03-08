/*
 *  Copyright 2018 Willamette University
 *
 *  This file is part of OAI-PHM Service.
 *  
 *  @author Michael Spalti
 *
 *  OAI-PHM Service is based on the Modular OAI-PMH Server, University of Helsinki, 
 *  The National Library of Finland.
 *
 *  OAI-PHM Service is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  OAI-PHM Service is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of 
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with OAI-PHM Service.  If not, see <http://www.gnu.org/licenses/>.
 */


import logger from "../../server/logger";
import * as fs from 'fs';


/**
 * Do a synchronous check for a DAO credentials file.
 * @param credFile the path to the credentials file
 * @returns {boolean}
 */
function hasCredentialsFile(credFile: string): boolean {

    if (!credFile) {
        logger.warn("A credential file has not been registered.  See .env");
        return false;
    }
    try {
        fs.statSync(credFile);
        return true;
    } catch (err) {
        logger.warn("Could not find the credentials file.");
        return false;
    }

}

/**
 /**
 * Parses the JSON contents of a DAO
 * credentials file and exports the object.
 *
 * The path to the credentials file on the file system
 * is defined in .env
 *
 * We commit .env to version control since it contains no
 * compromising information about the system.  Note that if
 * you do add sensitive information to .env you will want
 * to remove it from the version control before committing.
 * @param credFile the path to the credentials file
 * @returns {any}
 */
function getCredentials(credFile: string): any {

    try {
        return JSON.parse(fs.readFileSync(credFile, 'utf8'));

    } catch (error) {
        logger.warn("Could not parse the credentials file.")
    }

}

export {hasCredentialsFile, getCredentials};




