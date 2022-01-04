import jwt from "jsonwebtoken";
import * as redis from "redis";
import { Request, Response } from "express";
import { Knex } from "knex";

type NoUndefinedField<T> = {
  [P in keyof T]: Exclude<T[P], undefined>;
};

//const redisClient = redis.createClient({ url: process.env.REDIS_URI });

export const connectDatabase = async () => {
  const client = redis.createClient({ url: process.env.REDIS_URI });
  client.on("error", (err) => console.log("Redis Client Error"));

  await client.connect();

  return client;
};

const handleSignin = (
  db: Knex<any, unknown[]>,
  bcrypt: any,
  req: Request,
  res: Response
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
    .then(async (data: Array<{ email: string; hash: string }>) => {
      const isValid = await await bcrypt.compare(password, data[0].hash);
      if (isValid) {
        console.log("valid");
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user: Array<any>) => user[0])
          .catch((err: any) => Promise.reject("unable to get user"));
      } else {
        console.log("not valid");
        Promise.reject("wrong credentials");
      }
    });
};

const getAuthTokenId = async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const redisClient = await connectDatabase();
  if (authorization) {
    const response = await redisClient.get(authorization);
    if (response) {
      return res.json({ id: response });
    } else {
      return res.status(400).json("Unauthorized");
    }
  } else {
    return res.status(400).json("Unauthorized");
  }
};

const signToken = (email: string) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, "JWT_SECRET", { expiresIn: "2 days" });
};

const setToken = async (
  key: string | Buffer,
  value: string | number | Buffer
) => {
  const redisClient = await connectDatabase();
  return Promise.resolve(redisClient.set(key, value));
};

const createSessions = (user: {
  id: number;
  name: string;
  email: string;
  entries: string;
  joined: string;
}) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => ({ success: "true", userId: id, token }))
    .catch(console.log);
};

export const signinAuthentication =
  (db: Knex<any, unknown[]>, bcrypt: any) => (req: Request, res: Response) => {
    const { authorization } = req.headers;

    return authorization
      ? getAuthTokenId(req, res)
      : handleSignin(db, bcrypt, req, res)
          .then((data) => {
            return data.id && data.email
              ? createSessions(data)
              : Promise.reject(data);
          })
          .then((session) => res.json(session))
          .catch((err) => res.status(400).json(err));
  };
