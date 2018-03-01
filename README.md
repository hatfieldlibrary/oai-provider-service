# OAI-PMH Service

This Nodejs Express application can support multiple, configurable OAI-PMH providers. We are using it in a specific
configuration for one of our local services `(tagger-provider)`. The service is also configured with a second, 
very simple provider with dummy data `(sample-provider)`.  

This code is based on the [https://github.com/NatLibFi/oai-pmh-server](Modular OAI-PMH Server), University of Helsinki, 
The National Library of Finland.

Our `tagger-provider` uses a Domain Access Object (DAO) with mysql support.  It supports `Identify`, `ListMetadataFormats`, `GetRecord`, `ListIdentifiers` and `ListRecords`. The optional
`from` and `until` arguments are supported for selective harvesting with `YYYY-MM-DDThh:mm:ssZ` granularity.  
ListSets is not supported.  

The `sample-provider` DAO returns dummy data and provides the same services as `tagger-provider`.  The main purpose
of `sample-provider` is to verify that the OAI-PMH Service is correctly designed to support multiple providers.  It
could also be used as the template for implementing a new provider service for a real data source.

## Install It
```
npm install
```

## Run It
#### Run in *development* mode:

```
npm run dev
```

#### Run in *production* mode:

```
npm run compile
npm start
```




