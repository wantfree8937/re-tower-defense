import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import router from './routes/user.router.js';
import { testAllConnections } from './utils/db/testConnection.js';
import pools from './db/database.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT_NUMBER;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', [router]);
app.use(express.static('tower_defense_client'));

initSocket(server);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

loadGameAssets();

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    testAllConnections(pools);
    const assets = await loadGameAssets();
    //console.log(assets);
    console.log('Assets loaded successfully');
  } catch (error) {
    console.error('Failed to load game assets:', error);
  }
});
