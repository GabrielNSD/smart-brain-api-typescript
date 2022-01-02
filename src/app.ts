import { createServer } from "./server";

const PORT = 3005;

createServer()
  .then((server) => {
    server.listen(PORT, () => {
      console.info(`Executando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro: ", err);
  });
