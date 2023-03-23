// Third-party dependencies
import express from 'express';
import cookieParser from 'cookie-parser';
import got from 'got';
import tough from 'tough-cookie';
import { Configuration, OpenAIApi } from 'openai';

// Node.js built-in modules
import path from 'path';
import { fileURLToPath } from 'url';


// All routes are defined here
import vpnRoutes from './routes/vpn/vpnRoutes.js';
import performanceRoutes from './routes/performance/performanceRoutes.js';
import routingRoutes from './routes/routing/routingRoutes.js';
import connectivityRoutes from './routes/connectivity/connectivityRoutes.js';

// All Constants are defined here
const router = express();
const config = {};
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const root = path.join(__dirname, '..', 'client', 'build');

// All Express middleware are defined here
router.use(express.json());
router.use(cookieParser());
router.use(express.static(path.join(__dirname, './chatgpt_prompts')));

// All Express routes are defined here
router.use('/vpn', vpnRoutes(config));
router.use('/performance', performanceRoutes(config));
router.use('/routing', routingRoutes(config));
router.use('/connectivity', connectivityRoutes(config));
router.use(express.static(root));











// Login route
router.post('/login', async (req, res) => {
  const { username, secretkey, host, port, transport, sshPort } = req.body;

  // Store the values in the config object
  config.host = host;
  config.username = username;
  config.port = port;
  config.password = secretkey;
  config.transport = transport;
  config.sshPort = parseInt(sshPort);

  try {
    const cookieJar = new tough.CookieJar();
    // Make a request to the firewall device to get the session cookies
    const response = await got.post(`${transport}://${host}:${port}/logincheck`, {
      form: {
        username,
        secretkey
      },
      responseType: 'text',
      followRedirect: true,
      cookieJar,
      https: {
        rejectUnauthorized: false
      }
    });

    // Extract the cookies from the response
    const cookies = response.headers['set-cookie'];

    // Set the X-CSRFTOKEN header in the response
    res.set('X-CSRFTOKEN', response.headers.ccsrftoken);

    // Set the cookies in the response headers
    res.set('Set-Cookie', cookies);

    // Return a success response to the client
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// ChatGPT route
router.post('/chatgpt', async (req, res) => {
  const { model, messages } = req.body;
  
  try {
    const completion = await openai.createChatCompletion({
      model,
      messages,
    });
    
    res.json(completion.data.choices[0].message);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Home route
router.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Start the server
router.listen(5005, () => {
  console.log('Listening on port 5005');
});
