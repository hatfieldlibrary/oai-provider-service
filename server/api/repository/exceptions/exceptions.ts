/*
 *  Copyright 2018 Willamette University
 *
 *  This file is part of tagger-oai-provider.
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

import {ExceptionMessages} from "./exception-messages";
import {ExceptionCodes} from "../core-oai-provider";


export class Exceptions  {

    static UNKNOWN_CODE = "unknown code";

    public static getException(code: string) : string {
        switch(code) {
            case ExceptionCodes.BAD_ARGUMENT: {
               return ExceptionMessages.BAD_ARGUMENT;
            }
            case ExceptionCodes.BAD_RESUMPTION_TOKEN: {
                return ExceptionMessages.BAD_RESUMPTION_TOKEN;
            }
            case ExceptionCodes.BAD_VERB: {
                return ExceptionMessages.BAD_VERB;
            }
            case ExceptionCodes.CANNOT_DISSEMINATE_FORMAT: {
                return ExceptionMessages.CANNOT_DISSEMINATE_FORMAT;
            }
            case ExceptionCodes.ID_DOES_NOT_EXIST: {
                return ExceptionMessages.ID_DOES_NOT_EXIST;
            }
            case ExceptionCodes.NO_RECORDS_MATCH: {
                return ExceptionMessages.NO_RECORDS_MATCH;
            }
            case ExceptionCodes.NO_METADATA_FORMATS: {
                return ExceptionMessages.NO_METADATA_FORMATS;
            }
            case ExceptionCodes.NO_SET_HIERARCHY: {
                return ExceptionMessages.NO_SET_HEIRARCHY;
            }
            default: {
                return this.UNKNOWN_CODE;
            }

        }
    }
}
