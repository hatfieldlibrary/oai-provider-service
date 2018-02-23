import {Request, Response} from "express";
import {OaiProviderRepository} from "../../repository/core-oai-provider";

const provider = new OaiProviderRepository();

export let oai = (req: Request, res: Response) => {
    provider.oai(req, res);

};
