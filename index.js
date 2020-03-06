const API_URL = 'https://alsamya-rest-exercise-code.apps.cac.preview.pcf.manulife.com';
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fetch = require('node-fetch');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    patient(id: ID!) : Patient
  }

  type Patient {
    id: ID!
    name: String!
    doctors: [Doctor]
  }

  type Doctor {
    id: ID!
    name: String!

  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    patient: async (parent, args, context, info) => {
      console.log('Query -> patient resolver');
      const { id } = args;
      const response = await (fetch(`${API_URL}/patients/${id}`));
      const result = await (response.json());
      return result;
    }
  },


Patient: {

      doctors: async (parent, args, context, info) => {
        console.log('Patient -> doctors resolver')
      const visitResponse = await (fetch(`${API_URL}/visits/patient_id/${parent.id}`));
      const visitResult = await visitResponse.json();
      console.log(visitResult);

      const doctors = [];


      for(let visit of visitResult){

        const doctorResponse = await fetch((`${API_URL}/doctors/${visit.doctor_id}`))
        const doctorResult = await doctorResponse.json();
        doctors.push(doctorResult);
      }

      return doctors;
    }


  },
};


const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

