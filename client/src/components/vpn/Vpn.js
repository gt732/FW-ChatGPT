import { Box, Button, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Textarea } from '@chakra-ui/react';
import Disclaimer from '../main/Disclaimer';
import Chatgpt from '../chatgpt/Chatgpt';

export default function Vpn() {
  const [tunnels, setTunnels] = useState([]);
  const [buttonLoading, setButtonLoading] = useState([]);
  const [debugOutput, setDebugOutput] = useState('');
  const [vpnDownChatGpt, setVpnDownChatGpt] = useState('');
  const [documentationLink, setDocumentationLink] = useState('');

  function getVpnTunnels() {
    fetch('/express/vpn/get_tunnel_list')
      .then(response => response.json())
      .then(data => {
        setTunnels(data.results);
        setButtonLoading(data.results.map(() => false));
      })
      .catch(error => {
        console.error(error);
      });
  }

  function handleClick(tunnelName, index) {
    const phase2Name = tunnels.filter(tunnel => tunnel.name === tunnelName)[0]
      .proxyid[0].p2name;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p1Name: tunnelName,
        p2Name: phase2Name,
      }),
    };
    // Set loading state of the individual button to true
    setButtonLoading(buttonLoading.map((val, i) => (i === index ? true : val)));
    setDebugOutput('');
    fetch('/express/vpn/tunnel_down_script', requestOptions)
      .then(response => response.text()) // get the response as text
      .then(data => {
        setDebugOutput(data);

        setButtonLoading(
          buttonLoading.map((val, i) => (i === index ? false : val))
        );
      })

      .catch(error => {
        setDebugOutput('Try Logging in again');

        setButtonLoading(
          buttonLoading.map((val, i) => (i === index ? false : val))
        );
      });
  }

  useEffect(() => {
    fetch('/express/chatgpt_prompts/vpn/tunnel_down.txt')
      .then(response => response.text())
      .then(text => {
        setVpnDownChatGpt(text);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    fetch('/express/chatgpt_prompts/vpn/tunnel_down_link.txt')
      .then(response => response.text())
      .then(text => {
        setDocumentationLink(text);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    getVpnTunnels();
  }, []);

  return [
    <Text fontSize={15} color="white">
      👉 Instructions: Click the VPN tunnel to gather debugs, once complete
      click on Run FortiGPT 👈
    </Text>,

    <Box my="4">
      {tunnels.map((tunnel, index) => (
        <Button
          onClick={() => handleClick(tunnel.name, index)}
          colorScheme={tunnel.proxyid[0].status == 'down' ? 'red' : 'green'}
          key={tunnel.name}
          borderRadius="full"
          m="2"
          isLoading={buttonLoading[index]}
          loadingText={tunnel.name}
        >
          {tunnel.name}
        </Button>
      ))}
    </Box>,

    <Text ml={2} color="white" fontWeight="bold">
      ✨ DEBUG OUTPUT ✨
    </Text>,

    <Textarea
      color="white"
      bg="gray.800"
      defaultValue={debugOutput}
      my={4}
      size="md"
      maxWidth="2xl"
    />,
    <>
      <Disclaimer documentationLink={documentationLink} />
    </>,
    <>
      {debugOutput && (
        <Chatgpt debugOutput={debugOutput} chatGptPrompt={vpnDownChatGpt} />
      )}
    </>,
  ];
}
