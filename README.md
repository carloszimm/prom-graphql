# Prom-GraphQL
This is an open source GraphQL wrapper for the [Prometheus REST API](https://prometheus.io/docs/prometheus/latest/querying/api/).

## Usage
This module exports a executable schema (built with [graphql-tools](https://www.graphql-tools.com/)) that can be used either with the graphql or express-graphql to contruct a graphql server. The module, when required, brings a factory function that accepts an optional **base** URL (the URL of the Prometheus service). If not supplied, the prometheus base query will require an argument to be passed informing the URL of the service. The following snippet demostrates a simple of the module (passing a pseudo URL) with the express-graphql.

```javascript
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { schema } = require('prom-graphql')('http://prometheus:9090'); //no need to inform the /api/v1 endpoint's resource

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
```
Additionally, the type definition and the resolvers are also included in the exported object so prom-graphql can easily be extended or integrated with other schemas or tools (like [graphql-compose](https://graphql-compose.github.io/) - see Migration from graphql-tools section).

```javascript
const { schema, typeDefs, resolvers } = require('prom-graphql')('http://prometheus:9090');
```

## Types Definition

## Examples

## Current Support
By now, the module only wraps the expression queries. Shortly, all the remaining endpoints will be included.
