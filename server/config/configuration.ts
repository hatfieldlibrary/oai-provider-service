import {BackendModule} from "../common/backend-module-singleton";

export class Configuration {

    public repositoryName: string = "Academic Commons";
    public baseURL: string =  "https://libmedia.willamette.edu/commons";
    public protocolVersion: string = '2.0';
    public adminEmail: string = "mspalti@willamette.edu";
    public port: number = 0;
    public description: string = "";
    public backendModule: BackendModule = null;


}