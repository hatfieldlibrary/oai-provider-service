# OAI-PMH Service

OAI-PMH Service is a Nodejs Express application can support multiple, configurable OAI-PMH version 2.0 data providers.

OAI-PMH Service borrows from the [Modular OAI-PMH Server](https://github.com/NatLibFi/oai-pmh-server), University of Helsinki, 
The National Library of Finland. 

This project includes a data repository module for one of our local services `(tagger-provider)`. The project
 includes a second, very simple module with dummy data `(sample-provider)`.  

## Dependenices

* Node 8.9.4+
* Typescript 2.7.2+
* npm 5.6.0+

## Capabilities

The `tagger-provider` repository module implements a data access object (DAO) with mysql support for querying the 
[Tagger-2](https://github.com/hatfieldlibrary/tagger-2) database.  The provider supports `Identify`, `ListMetadataFormats`, `GetRecord`, `ListIdentifiers` and `ListRecords`. The optional
`from` and `until` arguments are supported for selective harvesting with `YYYY-MM-DDThh:mm:ssZ` granularity.  ListSets is not supported.  

The `sample-provider` module implements a DAO that returns dummy data. Sample repository modules use this data to provide mock OAI-PMH services that
 are similar to`tagger-provider` -- minus the option of selective harvesting.  The main purpose of `sample-provider` is to verify that the
 OAI-PMH Service can offer multiple providers via different Express routes.  The sample repository can also be used as the template for implementing a another, 
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

### Routes:
* [`http://localhost:3000/sample/oai?verb=Identify`](http://localhost:3000/sample/oai?verb=Identify)
* [`http://localhost:3000/sample/oai?verb=ListMetadataFormats`](http://localhost:3000/sample/oai?verb=ListMetadataFormats)
* [`http://localhost:3000/sample/oai?verb=GetRecord&identifier=1&metadataPrefix=oai_dc`](http://localhost:3000/sample/oai?verb=GetRecord&identifier=1&metadataPrefix=oai_dc)
* [`http://localhost/3000/sample/oai?verb=ListIdentifiers&metadataPrefix=oai_dc`](http://localhost/3000/tagger/oai?verb=ListIdentifiers&metadataPrefix=oai_dc)
* [`http://localhost:3000/sample/oai?verb=ListRecords&metadataPrefix=oai_dc`](http://localhost:3000/sample/oai?verb=ListRecords&metadataPrefix=oai_dc)

### Run in *production* mode:

At the simplest level:
```
npm run compile
npm start
```

The gulp tasks compile Typescript and copy files to `dist`. 

The project can be deployed to a production server and started with `node index` from within `dist`. Runtime configurations
can be adjusted using `.env`. We typically run as daemon with `forever` or anther tool to assure the script runs continuously.  

### Docker Container

The Dockerfile can be used to create a Docker image.  An image can be created using:

`docker build -t oai-service .`

The image will run with something like the following command:

`docker run -p 3000:3000 -v /etc/tagger-provider:/etc/tagger-provider oai-service`

Our `tagger-provider` service needs access to an external MySQL database. We do not yet have the mysqld service working with the Docker
image.




