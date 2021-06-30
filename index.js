const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config");

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }),
});

// connect to database
mongoose
    .connect(MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("CONNECTED TO DATABASE");
        return server.listen({ port: 5000 });
    })
    .then(res => {
        console.log(`🚀 Server ready at ${res.url}`);
    });

// server.listen().then(({ url }) => {
//     console.log(`🚀 Server ready at ${url}`);
//   });
