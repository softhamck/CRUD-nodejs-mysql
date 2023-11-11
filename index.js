import express from "express";
import mysql from "mysql2";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "CrudNodejs",
});

app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Obtener todas las tareas
app.get("/tasks", (req, res) => {
  connection.query("SELECT * FROM tasks", (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error en la consulta MySQL" });
      return;
    }

    res.json(results);
  });
});

// Obtener una tarea por ID
app.get("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  connection.query("SELECT * FROM tasks WHERE id = ?", [taskId], (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error en la consulta MySQL" });
      return;
    }

    res.json(results[0]);
  });
});

// Crear una nueva tarea
app.post("/tasks", (req, res) => {
  const { title, description } = req.body;
  connection.query("INSERT INTO tasks (title, description) VALUES (?, ?)", [title, description], (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error en la consulta MySQL" });
      return;
    }

    res.json({ id: results.insertId });
  });
});

// Actualizar una tarea por ID
app.put("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const { title, description } = req.body;
  connection.query("UPDATE tasks SET title = ?, description = ? WHERE id = ?", [title, description, taskId], (error) => {
    if (error) {
      res.status(500).json({ error: "Error en la consulta MySQL" });
      return;
    }

    res.json({ message: "Tarea actualizada con éxito" });
  });
});

// Eliminar una tarea por ID
app.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  connection.query("DELETE FROM tasks WHERE id = ?", [taskId], (error) => {
    if (error) {
      res.status(500).json({ error: "Error en la consulta MySQL" });
      return;
    }

    res.json({ message: "Tarea eliminada con éxito" });
  });
});

app.listen(port, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${port}`);
});
