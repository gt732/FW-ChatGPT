import express from "express";
import { spawn } from "child_process";

const router = express.Router();

export default function performanceRoutes(config) {
  // Route to run the high CPU script
  router.post("/high_cpu_script", (req, res) => {
    // Execute the script
    const command = `python ./scripts/performance/high_cpu.py --device-host ${config.host} --ssh-username ${config.username} --ssh-password ${config.password} --ssh-port ${config.sshPort}`;

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

  // Route to run the high memory script
  router.post("/high_memory_script", (req, res) => {
    // Execute the script
    const command = `python ./scripts/performance/high_memory.py --device-host ${config.host} --ssh-username ${config.username} --ssh-password ${config.password} --ssh-port ${config.sshPort}`;

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
