import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import router from './routes/user.router.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.static('tower_defense_client'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', [router]);
initSocket(server);

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    const assets = await loadGameAssets();
    console.log(assets);
    console.log('Assets loaded successfully');
  } catch (error) {
    console.error('Failed to load game assets:', error);
  }
});
