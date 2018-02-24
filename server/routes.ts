import { Application } from 'express';
import * as controller from "./api/controllers/oai/controller";
export default function routes(app: Application): void {
  // app.use('/oai', controllerRouter);
  app.get('/oai', controller.oai);
};