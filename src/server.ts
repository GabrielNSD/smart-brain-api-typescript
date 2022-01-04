import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";
import morgan from "morgan";

import { Express } from "express-serve-static-core";

import register from "./controllers/register";
import { signinAuthentication } from "./controllers/signin";
import { handleProfileGet, handleProfileUpdate } from "./controllers/profile";
import { handleApiCall, handleImage } from "./controllers/image";
import { requireAuth } from "./controllers/authorization";

const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI,
});

export async function createServer(): Promise<Express> {
  const server = express();

  server.use(morgan("combined"));
  server.use(express.json());
  server.use(cors());

  server.get("/", (req, res) => {
    res.send("oi");
  });

  server.post("/register", (req, res) => {
    register(req, res, db, bcrypt);
  });

  server.post("/signin", signinAuthentication(db, bcrypt));

  server.get("/profile/:id", requireAuth, (req, res) => {
    handleProfileGet(req, res, db);
  });

  server.post("/profile/:id", requireAuth, (req, res) => {
    handleProfileUpdate(req, res, db);
  });

  server.put("/image", requireAuth, (req, res) => {
    handleImage(req, res, db);
  });

  server.post("/imageurl", requireAuth, (req, res) => {
    handleApiCall(req, res);
  });

  return server;
}
