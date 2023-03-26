# FortiGPT
![alt text](https://i.imgur.com/benUs5x.png)

FortiGPT Troubleshooting Assistant is a web app that helps network administrators troubleshoot common networking issues using natural language processing. This app uses the FortiGate API and SSH to gather debug commands and sends them to the ChatGPT API for analysis. The app then provides troubleshooting advice based on the analysis results.

# Tested on Fortigate 7.2.4 VM
## The app uses ReactJS for frontend and NodeJS/Express for backend

## Getting Started

To use FortiGPT Troubleshooting Assistant, simply select a problem category (e.g. VPN issues) from the sidebar menu, and choose the problem type. The app will gather the debug output from your FortiGate firewall and send it to the ChatGPT API for analysis. The app will then provide you with troubleshooting advice based on the analysis results. If you are not happy with the response from chatGPT you can modify the prompts used in the server folder and rebuild the docker image.

## Categories currently available
- System - Fortiguard, High Memory, High CPU
- Connectivity - Packet Flow
- Routing - BGP Down
- VPN - VPN Down
- Network - Interfaces

## Future Development
- If the community expresses interest in this tool, I will incorporate additional categories and problem types.

## Requirements

FortiGPT Troubleshooting Assistant requires no dependencies to be installed. Instead, it can be run as a Docker container.

## Installation

To run FortiGPT Troubleshooting Assistant, simply follow the steps below:

## Docker


Run the docker command to download the image and simply browse to the container
```
docker run \
  -p 5005:5005 \
  -e OPENAI_API_KEY=your-api-key \
  gt732/fortigpt-react
```

## Login Screen

![alt text](https://i.imgur.com/0iEmaGU.png)
## Demo
- VPN Phase1 pre-share key mis-match
![alt text](https://i.imgur.com/gew7aza.png)

- Debug Flow
![alt text](https://i.imgur.com/BErqcs5.png)

- BGP Down
![alt test](https://i.imgur.com/0k5XH4i.png)
## Contributing
Contributions are welcome! To contribute to FortiGPT Troubleshooting Assistant, simply fork the GitHub repository and submit a pull request with your changes.

## License
FortiGPT Troubleshooting Assistant is licensed under the MIT license. See LICENSE for more information.