import express from "express";
import { config } from "dotenv";
import { postgraphile } from "postgraphile";
import cors from "cors";
import helmet from "helmet";
import path from "path";

const app = express();

config({
  path: path.resolve(process.cwd(), `.env${process.env.NODE_ENV}`),
});

// CORS
app.use(cors({ credentials: true, origin: process.env.CORS }));

app.use(helmet());

// postgraphile
app.use(
  postgraphile(process.env.DATABASE_URL, "public", {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    jwtSecret: process.env.JWT_SECRET,
    jwtPgTypeIdentifier: "public.jwt_token",
    pgDefaultRole: "guest",
  })
);

app.listen(process.env.PORT, () =>
  console.log("Server started on port " + process.env.PORT)
);
