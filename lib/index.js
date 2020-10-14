const { makeExecutableSchema } = require('graphql-tools')

const exportSchema = require('./schema');
const exportResolvers = require('./resolvers');

module.exports = function (url) {

  let typeDefs = exportSchema(url);
  let resolvers = exportResolvers(url);

  return {
    schema: makeExecutableSchema({
      typeDefs,
      resolvers
    }),
    typeDefs,
    resolvers
  };
}