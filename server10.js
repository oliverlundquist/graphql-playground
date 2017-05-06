var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');

var categoryType = new graphql.GraphQLObjectType({
  name: 'Categories',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString }
  }
});

var productType = new graphql.GraphQLObjectType({
  name: 'Product',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    image: { type: graphql.GraphQLString },
    categories: {
      type: new graphql.GraphQLList(categoryType),
      resolve: function () { return [{ id: 'b', name: 'cat a' }] }
    }
  }
});

var queryType = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    getProducts: {
      type: new graphql.GraphQLList(productType),
      resolve: function () { return [{ id: 'a', name: 'hey' }]; }
    }
  }
});

var productInput = new graphql.GraphQLInputObjectType({
  name: 'ProductInput',
  fields: {
    name: { type: graphql.GraphQLString }
  }
});

var mutationType = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updateProduct: {
      type: productType,
      args: {
        id: { type: graphql.GraphQLString },
        input: { type: productInput }
      },
      resolve: function () { return { id: 'c', name: 'updated product'}; }
    }
  }
});

var schema = new graphql.GraphQLSchema({ query: queryType, mutation: mutationType });
var app = express();
app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
