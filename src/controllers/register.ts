import express from "express";

const handleRegister = (
  req: express.Request,
  res: express.Response,
  db: any,
  bcrypt: any
) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password)
    return res.status(400).json("incorrect form submission");

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  db.transaction((trx: any) => {
    trx
      .insert({ hash: hash, email: email })
      .into("login")
      .returning("email")
      .then((loginEmail: any) => {
        return trx("users")
          .returning("*")
          .insert({ email: loginEmail[0], name: name, joined: new Date() });
      })
      .then((user: any) => {
        res.json(user);
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err: any) => {
    res.status(400).json("unable to register");
    console.log(err);
  });
};

export default handleRegister;
