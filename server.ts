const path = require("path");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} = require("graphql");
const app = express();
const cors = require("cors");
const buildPath = path.join(__dirname, "build");
app.use(express.static(buildPath));
app.use(cors());

const words = require("./data/words.js");

const WordType = new GraphQLObjectType({
  name: "Words",
  description: "This is the list of words for the test",
  fields: () => ({
    word: { type: new GraphQLList(GraphQLString) },
  }),
});

const rootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    words: {
      type: new GraphQLList(WordType),
      description: "List of words",
      resolve: () => words,
    },
  }),
});

const schema = new GraphQLSchema({
  query: rootQueryType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.get("/*", (req: any, res: any) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(process.env.PORT || 3000, () => console.log("Server running"));
