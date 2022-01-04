import { Request, Response } from "express";
import { Knex } from "knex";
import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: process.env.API_CLARIFAI,
});

export const handleApiCall = (req: Request, res: Response) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data: any) => {
      console.log(data);
      res.json(data);
    })
    .catch((err: any) => res.status(500).json("unable to work with api"));
};

export const handleImage = (
  req: Request,
  res: Response,
  db: Knex<any, unknown[]>
) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries: any) => {
      res.json(entries[0]);
    })
    .catch((err: any) => res.status(400).json("unable to get entries"));
};
