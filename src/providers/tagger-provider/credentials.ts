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

/**
 * Parses the JSON contents of the tagger database
 * credentials file and exports the object.
 *
 * The location of the credentials file on the file system
 * is defined in .env
 *
 * We commit .env to version control since it contains no
 * compromising information about the system.  Note that if
 * you do add sensitive information to .env you will want
 * to remove it from the version control before committing.
 */
import logger from "../../server/logger";
import * as fs from 'fs';

const credFile = process.env.TAGGER_CONFIGURATION;

logger.debug(credFile);

const credentials = JSON.parse(fs.readFileSync(credFile, 'utf8'));

export default credentials;

