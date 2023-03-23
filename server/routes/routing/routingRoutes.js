import express from 'express';
import got from 'got';
import { spawn } from 'child_process';

const router = express.Router();

export default function routingRoutes(config) {

    router.get('/get_bgp_list', async (req, res) => {
        // Get the cookies from the request cookies object
        const cookies = req.cookies;
        // Construct the cookie header value
        const cookieHeaderValue = Object.keys(cookies)
          .map(key => `${key}=${cookies[key].replace(/\r?\n|\r/g, '')}`)
          .join('; ');
    
        try {
          // Make a request to the firewall device with the cookies and CSRF token
          const response = await got.get(`${config.transport}://${config.host}:${config.port}/api/v2/monitor/router/bgp/neighbors`, {
            headers: {
              'X-CSRFTOKEN': req.headers['x-csrftoken'],
              'Cookie': cookieHeaderValue
            },
            responseType: 'json'
          });
    
          // Return the response from the firewall device to the client
          res.json(response.body);
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      });

      router.post('/bgp_down_script', (req, res) => {
        const { bgpNeighbor } = req.body;
        // Execute the script
        const command = `python ./scripts/routing/bgp_down.py --device-host ${config.host} --ssh-username ${config.username} --ssh-password ${config.password} --ssh-port ${config.sshPort} --bgp-neighbor ${bgpNeighbor}`;
        const process = spawn(command, [], { shell: true });
      
        // Handle output from the script
        let output = '';
        process.stdout.on('data', (data) => {
          output += data;
        });
        // Handle errors from the script
        let error = '';
        process.stderr.on('data', (data) => {
          error += data;
        });
        // Handle the script exiting
        process.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
          if (code !== 0 || error) {
            console.error(`stderr: ${error}`);
            res.status(500).send(error || 'Internal Server Error');
          } else {
            res.send(output);
          }
        });
      });
  return router;
}