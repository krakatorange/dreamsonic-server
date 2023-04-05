const Pool = require("pg").Pool;
const path = require('path')
const dotenv = require('dotenv').config()

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME
});

console.log("Connected to database");

module.exports = pool;
