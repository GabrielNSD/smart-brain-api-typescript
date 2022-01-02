import jwt from "jsonwebtoken";
import redis from "redis";
import express from "express";

type NoUndefinedField<T> = {
  [P in keyof T]: Exclude<T[P], undefined>;
};

const handleSignin = (
  db: any,
  bcrypt: any,
  req: express.Request,
  res: express.Response
) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }

  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data: Array<any>) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user: Array<any>) => user[0])
          .catch((err: any) => Promise.reject("unable to get user"));
      } else {
        Promise.reject("wrong credentials");
      }
    });
};

interface DataType {
  id: number;
  email: string;
}

export const signinAuthentication =
  (db: any, bcrypt: any) => (req: express.Request, res: express.Response) => {
    //const { authorization } = req.headers;

    return handleSignin(db, bcrypt, req, res)
      .then((data: DataType) => {
        return data.id && data.email ? null : Promise.reject(data);
      })
      .catch((err: any) => res.status(400).json(err));
  };
