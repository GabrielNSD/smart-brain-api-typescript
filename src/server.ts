import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";

import { Express } from "express-serve-static-core";

import register from "./controllers/register";
import { signinAuthentication } from "./controllers/signin";

const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI,
});

export async function createServer(): Promise<Express> {
  const server = express();

  server.use(express.json());
  server.use(cors());

  server.get("/", (req, res) => {
    res.send("oi");
  });

  server.post("/register", (req, res) => {
    register(req, res, db, bcrypt);
  });

  server.post("/signin", signinAuthentication(db, bcrypt));

  return server;
}
