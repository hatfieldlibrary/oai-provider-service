# OAI-PMH Service

This Nodejs Express application can support multiple, configurable OAI-PMH version 2.0 providers. We are using a specific
configuration for one of our local services `(tagger-provider)`. The service is configured with a second, 
very simple provider with dummy data `(sample-provider)`.  

This code is based on the [Modular OAI-PMH Server](https://github.com/NatLibFi/oai-pmh-server), University of Helsinki, 
The National Library of Finland.

The `tagger-provider` uses a Domain Access Object (DAO) with mysql support for querying the 
[Tagger-2](https://github.com/hatfieldlibrary/tagger-2) database.  The provider supports `Identify`, `ListMetadataFormats`, `GetRecord`, `ListIdentifiers` and `ListRecords`. The optional
`from` and `until` arguments are supported for selective harvesting with `YYYY-MM-DDThh:mm:ssZ` granularity.  ListSets is not supported.  

The `sample-provider` DAO returns dummy data. Repository modules use this data to provide the same OAI-PMH services as `tagger-provider`
minus selective harvesting.  The main purpose of `sample-provider` is to verify that OAI-PMH Service is designed for multiple providers via different 
Express routes.  It could also be used as the template for implementing a new provider service for real data.

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

#### Run in *production* mode:

```
npm run compile
npm start
```




