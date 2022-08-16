const mongoose = require("mongoose");

const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const app = express();
const typeDefs = require("./gql/schema");
const resolvers = require("./gql/resolver");
const db = require("./config/connection");
require("dotenv").config({ path: ".env" });
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
});

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
  await db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

startApolloServer(typeDefs, resolvers);
