const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');
const { customAlphabet } = require('nanoid');
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const dotenv = require('dotenv').config();

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 14);

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

// create a dream
app.post("/dream", async (req, res) => {
  try {
    const { user_id, role, content } = req.body;
    const dream_id = nanoid(14);
    const gender = "";
    const endpoint = process.env.AWS_APIGATEWAY_LAMBDA_CHATGPT_ENDPOINT;
    const api_key = process.env.AWS_APIGATEWAY_LAMBDA_CHATGPT_API_KEY;

    console.log(req.body);

    const lambda_res = await axios.post(endpoint, {
                        user_id: user_id,
                        role: role,
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
    
    console.log(lambda_res)

    const newTodo = await pool.query(
      "INSERT INTO dreams (user_id, dream_id, role, gender, content, content_eng, dream) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [user_id, dream_id, role, gender, lambda_res['data']['body']['content'], lambda_res['data']['body']['content_eng'], content]
    );

    console.log(lambda_res['data']);
                      
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

// get a shared dream
app.get("/share_dream/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dream = await pool.query("SELECT * FROM dreams WHERE dream_id = $1", [
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