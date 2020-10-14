const PromGraphql = require('./promGraphql');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let resolvers = {
  Query: {
    prometheus: ({ url }) => new PromGraphql(url)
  },
  Result: {
    __resolveType(obj) {

      let resultType = obj.resultType;

      return resultType && resultType !== 'none' ?
        capitalizeFirstLetter(resultType) : null;
    }
  }
};

const exportResolvers = url => {

  if (url) {
    resolvers.Query.prometheus = () => resolvers.Query.prometheus({ url })
  }

  return resolvers;
}

module.exports = exportResolvers;