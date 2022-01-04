import { Response, Request } from "express";
import { Knex } from "knex";

export const handleProfileGet = (
  req: Request,
  res: Response,
  db: Knex<any, unknown[]>
) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user: Array<any>) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch((err: any) => res.status(400).json("error getting user"));
};

export const handleProfileUpdate = (
  req: Request,
  res: Response,
  db: Knex<any, unknown[]>
) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;
  db("users")
    .where({ id })
    .update({ name })
    .then((resp: any) => {
      if (resp) {
        res.json("success");
      } else {
        res.status(400).json("Unable to update");
      }
    })
    .catch((err: any) => res.status(400).json("error updateing user"));
};
