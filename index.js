const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const axios = require("axios");
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');

//middleware
app.use(cors());
app.use(express.json()); //req.body
app.use(expressCspHeader({
  directives: {
      'default-src': [expressCspHeader.NONE],
      'img-src': [expressCspHeader.SELF]
  }
}));

//ROUTES//

//create a todo

app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO users (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all todos

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM users");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id
    ]);

    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE users SET description = $1 WHERE user_id = $2",
      [description, id]
    );

    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM users WHERE user_id = $1", [
      id
    ]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

// create a dream

app.post("/dream", async (req, res) => {
  try {
    const { user_id, role, gender, content } = req.body;
    const endpoint = process.env.AWS_APIGATEWAY_LAMBDA_CHATGPT_ENDPOINT;
    const api_key = process.env.AWS_APIGATEWAY_LAMBDA_CHATGPT_API_KEY;

    const lambda_res = await axios.post(endpoint, {
                        user_id: user_id,
                        role: role,
                        gender: gender,
                        content: content
                      },
                      {
                        headers: {
                            "Content-Type": "application/json",
                            "x-api-key": api_key
                        }
                      }).catch(function(error) {
                        console.log(error)
                      })
    
    console.log(lambda_res['data']['body']['content'])

    const newTodo = await pool.query(
      "INSERT INTO dreams (user_id, role, gender, content, dream) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [user_id, role, gender, lambda_res['data']['body']['content'], content]
    );
                      
    res.json(lambda_res['data']);
  } catch (err) {
    console.error(err.message);
  }
});

// get a dream

app.get("/dream/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dream = await pool.query("SELECT * FROM dreams WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1", [
      id
    ]);

    res.json(dream.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Start Server
app.set('port', (process.env.PORT || 5001));
app.listen(app.get('port'), () => {
  console.log("server has started on port", app.get('port'));
});
