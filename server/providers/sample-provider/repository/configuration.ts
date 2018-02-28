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

import {OaiService} from "../../core/oai-service";
import {ProviderConfiguration} from "../../core/core-oai-provider";

export class Configuration implements ProviderConfiguration {

    public repositoryName: string = "Sample Provider";
    public baseURL: string =  "http://localhost:3000/sample/oai";
    public protocolVersion: string = '2.0';
    public adminEmail: string = "mspalti@willamette.edu";
    public port: number = 0;
    public description: string = "";
    public oaiService: OaiService = null;


}