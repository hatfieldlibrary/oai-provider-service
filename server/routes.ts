/*
 * Copyright 2018 Willamette University
 *
 * This file is part of commons-oai-provider.
 *
 * commons-oai-provider is based on the Modular OAI-PMH Server, University of Helsinki, The National Library of Finland.
 *
 *     commons-oai-provider is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     Foobar is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with commons-oai-provider.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Application } from 'express';
import * as controller from "./api/controllers/oai/controller";
export default function routes(app: Application): void {
  // app.use('/oai', controllerRouter);
  app.get('/oai', controller.oai);
};