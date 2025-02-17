import express from "express";
import loadAllDbs from "./db_conection/db.js";
import cors from "cors";
import { replaceUnderscores } from "./utils/replaceUnderscores.js";

const app = express();
app.use(express.json());
app.use(cors());

const dbs = loadAllDbs();

const PORT = 3000;
const HOST = "localhost";

const getData = async (dbName) => {
  const db = dbs[dbName];
  if (db) {
    await db.read();
    return db.data;
  }
  return null;
};

app.get("/api/:dbName", async (req, res) => {
  const dbName = decodeURIComponent(req.params.dbName);
  const data = await getData(dbName);
  if (data) {
    res.json(replaceUnderscores(data));
  } else {
    res.status(404).send("Database not found");
  }
});

app.get("/api/:dbName/departamentos", async (req, res) => {
  const dbName = decodeURIComponent(req.params.dbName);
  const data = await getData(dbName);
  if (data) {
    res.json(replaceUnderscores(data.departamentos));
  } else {
    res.status(404).send("Database not found");
  }
});

app.get("/api/:dbName/departamentos/:departamento", async (req, res) => {
  const dbName = decodeURIComponent(req.params.dbName);
  const departamento = decodeURIComponent(req.params.departamento);
  const data = await getData(dbName);
  if (data) {
    const dep = data.departamentos.find((d) => d.departamento === departamento);
    if (dep) {
      res.json(replaceUnderscores(dep));
    } else {
      res.status(404).send("Departamento not found");
    }
  } else {
    res.status(404).send("Database not found");
  }
});

app.get(
  "/api/:dbName/departamentos/:departamento/localidades",
  async (req, res) => {
    const dbName = decodeURIComponent(req.params.dbName);
    const departamento = decodeURIComponent(req.params.departamento);
    const data = await getData(dbName);
    if (data) {
      const dep = data.departamentos.find(
        (d) => d.departamento === departamento
      );
      if (dep) {
        res.json(replaceUnderscores(dep.localidades));
      } else {
        res.status(404).send("Departamento not found");
      }
    } else {
      res.status(404).send("Database not found");
    }
  }
);

app.get(
  "/api/:dbName/departamentos/:departamento/localidades/:localidad",
  async (req, res) => {
    const dbName = decodeURIComponent(req.params.dbName);
    const departamento = decodeURIComponent(req.params.departamento);
    const localidad = decodeURIComponent(req.params.localidad);
    const data = await getData(dbName);
    if (data) {
      const dep = data.departamentos.find(
        (d) => d.departamento === departamento
      );
      if (dep) {
        const loc = dep.localidades.find((l) => l.localidad === localidad);
        if (loc) {
          res.json(replaceUnderscores(loc));
        } else {
          res.status(404).send("Localidad not found");
        }
      } else {
        res.status(404).send("Departamento not found");
      }
    } else {
      res.status(404).send("Database not found");
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
