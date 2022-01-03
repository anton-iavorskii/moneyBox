"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _dotenv = require("dotenv");

var _postgraphile = require("postgraphile");

var _cors = _interopRequireDefault(require("cors"));

var _helmet = _interopRequireDefault(require("helmet"));

var _path = _interopRequireDefault(require("path"));

const app = (0, _express.default)();
(0, _dotenv.config)({
  path: _path.default.resolve(process.cwd(), `.env${process.env.NODE_ENV}`)
}); // CORS

app.use((0, _cors.default)({
  credentials: true,
  origin: process.env.CORS
}));
app.use((0, _helmet.default)()); // postgraphile

app.use((0, _postgraphile.postgraphile)(process.env.DATABASE_URL, "public", {
  watchPg: true,
  graphiql: true,
  enhanceGraphiql: true,
  jwtSecret: process.env.JWT_SECRET,
  jwtPgTypeIdentifier: "public.jwt_token",
  pgDefaultRole: "guest"
}));
app.listen(process.env.PORT, () => console.log("Server started on port " + process.env.PORT));