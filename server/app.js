const express = require('express');
const dotenv = require("dotenv")
const { postgraphile } = require("postgraphile");
const cors = require('cors')
const helmet = require("helmet");

const app = express()
dotenv.config()

// CORS
app.use(cors({ credentials: true, origin: process.env.CORS }));

app.use(helmet());

// postgraphile
app.use(
  postgraphile(
    process.env.DATABASE_URL,
    "public",
    {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      jwtSecret: process.env.JWT_SECRET,
      jwtPgTypeIdentifier: "public.jwt_token",
      pgDefaultRole: "guest",
    }
    
  )
);

app.listen(process.env.PORT, ()=> console.log("Server started on port " + process.env.PORT ))



