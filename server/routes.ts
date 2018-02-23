import { Application } from 'express';
import controllerRouter from './api/controllers/oai/router'
export default function routes(app: Application): void {
  app.use('/oai', controllerRouter);
};