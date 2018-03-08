# OAI-PMH Service

OAI-PMH Service is a Nodejs Express application that supports multiple, configurable [OAI-PMH version 2.0](https://www.openarchives.org/OAI/openarchivesprotocol.html) data providers.

OAI-PMH Service borrows from the [Modular OAI-PMH Server](https://github.com/NatLibFi/oai-pmh-server), University of Helsinki, 
The National Library of Finland. 

This project includes a provider module for one of our local services `(tagger-provider)`. The project
 includes a second, very simple module with dummy data `(sample-provider)`.  

## Dependenices

* Node 8.9.4+
* Typescript 2.7.2+
* npm 5.6.0+

## Capabilities

The `tagger-provider` repository module implements a data access object (DAO) with support for querying the 
[Tagger-2](https://github.com/hatfieldlibrary/tagger-2) MySQL database.  The Tagger-2 provider supports `Identify`, `ListMetadataFormats`, `GetRecord`, `ListIdentifiers` and `ListRecords`. The optional
`from` and `until` arguments are supported for selective harvesting with `YYYY-MM-DDThh:mm:ssZ` granularity.  `ListSets` is not supported.  

The `sample-provider` module implements a DAO that returns dummy data. The `sample-provider` repository modules use this DAO to implement mock OAI-PMH services that are similar to`tagger-provider` -- minus the option of selective harvesting.  The main purpose of `sample-provider` is to verify that the OAI-PMH Service can offer multiple providers via different Express routes.  The sample repository can also be used as the template for implementing a another, 
 new OAI-PHM provider with real data.

## Install It
```
npm install
```

## Run It
#### Run in *development* mode:

```
npm run dev
```

#### Routes:

The Express server will start on default port 3000.  You should be able to access the sample repository 
using these links.

* [`http://localhost:3000/sample/oai?verb=Identify`](http://localhost:3000/sample/oai?verb=Identify)
* [`http://localhost:3000/sample/oai?verb=ListMetadataFormats`](http://localhost:3000/sample/oai?verb=ListMetadataFormats)
* [`http://localhost:3000/sample/oai?verb=GetRecord&identifier=1&metadataPrefix=oai_dc`](http://localhost:3000/sample/oai?verb=GetRecord&identifier=1&metadataPrefix=oai_dc)
* [`http://localhost/3000/sample/oai?verb=ListIdentifiers&metadataPrefix=oai_dc`](http://localhost/3000/tagger/oai?verb=ListIdentifiers&metadataPrefix=oai_dc)
* [`http://localhost:3000/sample/oai?verb=ListRecords&metadataPrefix=oai_dc`](http://localhost:3000/sample/oai?verb=ListRecords&metadataPrefix=oai_dc)

#### Server Configuration

You may require additional Express server configuration (e.g.: port number).  You can make changes in code, but you might consider an external configuration file for convenience and security. See `./server/host-config.ts`
for a peek at how we do it. The location of your host configuration file can be set in `.env` files for both development and production.


## Make Your Own

If you want to work on a new OAI provider, a good starting point would be to copy and rename the `.src/providers/sample-provider` 
 directory. 
 
 Next, copy and rename `.src/controllers/sample` and  instantiate it's `provider` with the factory, provider configuration, 
 and metadata mapper found in your new repository directory. (Be sure to inspect the import statements in your controller class
 to verify you are importing the correct files.)  
 
 Finally, add your new controller to Express routes (`/server/routes.ts`).

With this boilerplate out of the way, you should be able to restart and connect to your new repository.

You are on your own from this point, but here are a few things you should know.

*  You will need to define the OAI services you can provide from your data source and make necessary adjustments to your repository
classes and `Configuration`.
* You will need to connect to your data source. Create a dao module for this.
* Your dao will likely need it's own configuration information (e.g.: for a database connection).
* You probably don't want to hard-code database credentials, etc., into your app, so consider using an external configuration file. 
See `.src/providers/taggger-provider/credentials.ts`.
* You can specify the location of your external credential files using `.env`. Note that there are two `.env` files: 
one in the root directory for development, and a second in `./production`. The second file will be used for the compiled
application.  See next section.

## Run in *production* mode:

At the simplest level:
```
npm run compile
npm start
```

The gulp tasks compile Typescript and copy files to `dist`. 

The project can be deployed to a production server and started with `node index` from within `dist`. Runtime configurations
can be adjusted using `.env` and (recommended) external configuration files created for your environment. We typically run as server daemon using [forever](https://github.com/foreverjs/forever), or some tool 
to assure that the server runs continuously.  

### Docker Container

The Dockerfile can be used to create a Docker image.  An image can be created using:

`docker build -t oai-service .`

The image will run with something like the following command:

`docker run -p 3000:3000 -v /etc/tagger-provider:/etc/tagger-provider oai-service`

Our `tagger-provider` service needs access to an external MySQL database. We do not yet have the mysqld service working with the Docker
image.




