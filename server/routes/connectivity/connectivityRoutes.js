import express from "express";
import { spawn } from "child_process";

const router = express.Router();

export default function connectivityRoutes(config) {
  // Route to run the packet flow script
  router.post("/packet_flow_script", (req, res) => {
    const { sourceIP, destinationIP, sourcePort, destinationPort } = req.body;
    const sourcePortInt = parseInt(sourcePort);
    const destinationPortInt = parseInt(destinationPort);

    // Construct the command with the required arguments
    let command = `python ./scripts/connectivity/packet_flow.py --device-host ${config.host} --ssh-username ${config.username} --ssh-password ${config.password} --ssh-port ${config.sshPort}`;

    if (sourceIP) {
      command += ` --source-ip ${sourceIP}`;
    }

    if (destinationIP) {
      command += ` --destination-ip ${destinationIP}`;
    }

    if (sourcePortInt) {
      command += ` --source-port ${sourcePortInt}`;
    }

    if (destinationPortInt) {
      command += ` --destination-port ${destinationPortInt}`;
    }

    const process = spawn(command, [], { shell: true });

    // Handle output from the script
    let output = "";
    process.stdout.on("data", (data) => {
      output += data;
    });

    // Handle errors from the script
    let error = "";
    process.stderr.on("data", (data) => {
      error += data;
    });

    // Handle the script exiting
    process.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      if (code !== 0 || error) {
        console.error(`stderr: ${error}`);
        res.status(500).send(error || "Internal Server Error");
      } else {
        res.send(output);
      }
    });
  });

  return router;
}
