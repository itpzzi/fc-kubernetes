import express from 'express';
import fs from "fs";
import path from 'path';

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const name = process.env.USER_NAME || "Invalid Name";
const age = process.env.USER_AGE || "Invalid Age";

let dbIsHealthy = true;
let requestCount  = 0;

app.get('/', (_req, res) => {
  res.send(`Hello I'm ${name} and I'm ${age} years old.`);
});

app.get('/config/family', (_req, res) => {
  // read file family.txt and send it as response "My Family: [member1, member2, ...]"
  const data = fs.readFileSync('./myfamily/family.txt', 'utf8');
  res.send(`My family: ${data}`);
});

app.get('/config/secret', (req, res) => {
  // exposes the secret env variables that are defined in the container for learning purposes
  const user = process.env.USER;
  const password = process.env.PASSWORD;
  res.send(`User: ${user}, Password: ${password}`);
});

app.get('/probes/healthz', (_req, res) => {
  // simulate a breakdown after multiple requests
  requestCount++;
  const requestCountAsString = `Requests: ${requestCount}`;
  if (requestCount > 1000) {
    res.status(500).send(`${requestCountAsString}, Crash!`);
  } else {
    res.status(200).send(`${requestCountAsString}, OK!`);
  }
});

app.get('/probes/ready', (_req, res) => {
  if (dbIsHealthy) {
    res.status(200).send('DB is healthy');
  } else {
    res.status(503).send('DB is not healthy');
  }
});

app.get('/probes/break-db', (_req, res) => {
  // simulate a DB failure
  dbIsHealthy = false;
  res.status(503).send('DB break down');
});

app.post('/volumes', (req, res) => {
  const data = req.body;
  const filePath = path.join('/data', 'data.txt');

  try {
    fs.writeFileSync(filePath, JSON.stringify(data));
    res.status(200).send('Data saved to file with success!');
  } catch (error) {
    res.status(500).send('Error saving data to file');
  }
});

app.listen(port, () => {
  setTimeout(() => {
    console.log(`Server running at http://localhost:${port}`);
  }, 60 * 1000);
});
