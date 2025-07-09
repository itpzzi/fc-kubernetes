import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

const name = process.env.USER_NAME || "Invalid Name";
const age = process.env.USER_AGE || "Invalid Age";

app.get('/', (_req, res) => {
  res.send(`Hello I'm ${name} and I'm ${age} years old.`);
});

app.get('/family', (_req, res) => {
  // read file family.txt and send it as response "My Family: [member1, member2, ...]"
  const fs = require('fs');
  const data = fs.readFileSync('./myfamily/family.txt', 'utf8');
  res.send(`My family: ${data}`);
});

app.get('/secret', (req, res) => {
  // exposes the secret env variables that are defined in the container for learning purposes
  const user = process.env.USER;
  const password = process.env.PASSWORD;
  res.send(`User: ${user}, Password: ${password}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
