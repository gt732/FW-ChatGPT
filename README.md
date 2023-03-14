# FortiGPT
![alt text](https://i.imgur.com/benUs5x.png)

FortiGPT Troubleshooting Assistant is a web app that helps network administrators troubleshoot common networking issues using natural language processing. This app uses the FortiGate API and SSH to gather debug commands and sends them to the ChatGPT API for analysis. The app then provides troubleshooting advice based on the analysis results.

# Tested on 7.2.4 VM
## Getting Started

To use FortiGPT Troubleshooting Assistant, simply select a problem category (e.g. VPN issues) from the sidebar menu, and choose the problem type. The app will gather the debug output from your FortiGate firewall and send it to the ChatGPT API for analysis. The app will then provide you with troubleshooting advice based on the analysis results. If you are not happy with the response from chatGPT you can modify the prompts used in the app folder.

## Categories currently available
- Performance - High Memory
- VPN - Tunnel Down

## Future Development
- If the community expresses interest in this tool, I will incorporate additional categories and problem types.

## Requirements

FortiGPT Troubleshooting Assistant requires no dependencies to be installed. Instead, it can be run as a Docker container.

## Installation

To run FortiGPT Troubleshooting Assistant, simply follow the steps below:

Clone the repo
```
git clone https://github.com/gt732/FortiGPT.git
```
Change into the app directory
```
cd FortiGPT/app/
```
Run the docker command. Local volumes allows you to modify the chatgpt prompts and debug commands.
This will be synced to the container.
```
docker run -d \
  -p 8501:8501 \
  -v $(pwd)/chatgpt_prompts:/app/chatgpt_prompts \
  -v $(pwd)/debug_commands:/app/debug_commands \
  -e OPENAI_API_KEY=your_api_key \
  gt732/fortigpt
```

## Login Screen

![alt text](https://i.imgur.com/4Je8TrR.png)
## Demo
VPN Phase1 Settings mis-match
![alt text](https://i.imgur.com/CJnhDhJ.png)

VPN Phase1 pre-share key mis-match
![alt text](https://i.imgur.com/zDaKm0Y.png)

High Memory False Positive
![alt text](https://i.imgur.com/NxeiA6B.png)
## Contributing
Contributions are welcome! To contribute to FortiGPT Troubleshooting Assistant, simply fork the GitHub repository and submit a pull request with your changes.

## License
FortiGPT Troubleshooting Assistant is licensed under the MIT license. See LICENSE for more information.