# FW-ChatGPT

FW-GPT Troubleshooting Assistant is a web app that helps network administrators troubleshoot common networking issues using natural language processing. This app uses the FW-Gate API and SSH to gather debug commands and sends them to the ChatGPT API for analysis. The app then provides troubleshooting advice based on the analysis results. Additionally, there is a chatbot available that enables you to use a LLM combined with the documentation.

# Tested on FW-gate 7.2.4 VM

## Getting Started

To use FW-GPT Troubleshooting Assistant, simply select a problem category (e.g. VPN issues) from the sidebar menu, and choose the problem type. The app will gather the debug output from your FW-Gate firewall and send it to the ChatGPT API for analysis. The app will then provide you with troubleshooting advice based on the analysis results. If you are not happy with the response from chatGPT you can modify the prompts used in the server folder and rebuild the docker image.

## Categories currently available
- System - FW-guard, High Memory, High CPU
- Connectivity - Packet Flow
- Routing - BGP Down
- VPN - VPN Down
- Network - Interfaces
- ChatMode

## Future Development
 If the community expresses interest in this tool, I will incorporate additional categories and problem types.

## Requirements

FW-GPT Troubleshooting Assistant requires no dependencies to be installed. Instead, it can be run as a Docker container using docker compose.

## Installation

To run FW-GPT Troubleshooting Assistant, simply follow the steps below:

## Docker Compose


Copy the docker-compose file from the repo and run docker compose up. Make sure to modify the env with your openai api key.
If you want to build the images locally, clone the repo and use the docker-compose-dev file.
```
docker compose up
```
Connect to the FW-gpt-nginx reverse proxy container on port 3050 and you are all set.

## Demo
ChatMode
![alt text](https://i.imgur.com/TNT8NAY.png)

![alt text](https://i.imgur.com/6HUbVjF.png)


VPN Phase1 pre-share key mis-match
![alt text](https://i.imgur.com/gew7aza.png)

Debug Flow
![alt text](https://i.imgur.com/BErqcs5.png)

BGP Down
![alt test](https://i.imgur.com/0k5XH4i.png)
## Contributing
Contributions are welcome! To contribute to FW-GPT Troubleshooting Assistant, simply fork the GitHub repository and submit a pull request with your changes.

## License
FW-GPT Troubleshooting Assistant is licensed under the MIT license. See LICENSE for more information.
