# Prom-GraphQL
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is an open source GraphQL wrapper for the [Prometheus REST API](https://prometheus.io/docs/prometheus/latest/querying/api/).

## Usage
This module exports an executable schema (built with [graphql-tools](https://www.graphql-tools.com/)) that can be used either with the graphql or express-graphql to contruct a graphql server. The module, when required, brings a factory function that accepts an optional **base** URL (the URL of the Prometheus service). If not supplied, the prometheus base query will require an argument to be passed informing the URL of the service. The following snippet demostrates a simple use of the module (passing a pseudo URL) with the express-graphql.

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

All the available operations are wrapped in a top level type called prometheus. Every operation in the prometheus type has been modelled as close as possible to the descriptions available in the [Prometheus REST docs](https://prometheus.io/docs/prometheus/latest/querying/api/) and in the [source code](https://github.com/prometheus/prometheus/blob/master/promql/value.go) as well. For example, the prometheus type has a field called query (just like the REST endpoint) that, when issued in a query(pun intended), executes an **instant query**; this operation receives the same set of arguments (with the same nomenclature) described in the Prometheus docs. The image bellow shows an example of an **instant query** being used in the GraphiQL interface to query the *container_memory_usage_bytes* metric in that specific moment; note that an inline fragment was needed inside the data field since the result can be of types: **Scalar**, **String**, **Vector**, or **Matrix** (following Prometheus result types); also, since every type in the schema implements a common interface, the **resultType** field can be used outside the inline fragment.  

![Example 1 - Instant Query](https://user-images.githubusercontent.com/4553211/96196434-b6340080-0f25-11eb-9d06-82310d441eab.png)

Due to GraphQL's type system, some adaptations had to be made. For example, every metric result in an instant/range query carries an attribute called \_\_name\_\_ that denotes the name of the metric. Unfortunately, GraphQL doesn't allow identifiers starting with \_\_, so **\_\_name\_\_** is just **name**. Also, since each metric may have an undefined number of labels+values, each label/value is represented with a type, and each metric can have an array of those types.

## Examples
### Instant Query
![Example 2 - Instant Query](https://user-images.githubusercontent.com/4553211/96198098-38262880-0f2a-11eb-8378-e944a01c9b63.png)

### Range Query
![GraphiQL_3](https://user-images.githubusercontent.com/4553211/96198866-57be5080-0f2c-11eb-997d-aeba65b484dd.png)

### Mixing Instant and Range Queries
![Example 4 - Mixing Queries](https://user-images.githubusercontent.com/4553211/96197936-bb934a00-0f29-11eb-958d-388ac7d088b0.png)

## Current Support
By now, the module only wraps the expression queries. Shortly, all the remaining endpoints will be included.

## License
Prom-GraphQL is available under the MIT license. See the [LICENSE](https://github.com/carloszimm/prom-graphql/blob/main/LICENSE) file for more info.
