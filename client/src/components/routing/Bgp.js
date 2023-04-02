import React, { useState, useEffect } from 'react';
import { Box, Button, Text, Textarea } from '@chakra-ui/react';
import Disclaimer from '../main/Disclaimer';
import Chatgpt from '../chatgpt/Chatgpt';

export default function Bgp() {
  const [bgpNei, setBgpNei] = useState([]);
  const [buttonLoading, setButtonLoading] = useState([]);
  const [debugOutput, setDebugOutput] = useState('');
  const [ChatGptPrompt, setChatGptPrompt] = useState('');
  const [documentationLink, setDocumentationLink] = useState('');

  function getBgpNeighbors() {
    fetch(`/express/routing/get_bgp_list`)
      .then(response => response.json())
      .then(data => {
        setBgpNei(data.results);
        setButtonLoading(data.results.map(() => false));
      })
      .catch(error => {
        console.error(error);
      });
  }

  function handleClick(bgpNeighbor, index) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bgpNeighbor: bgpNeighbor,
      }),
    };
    setButtonLoading(buttonLoading.map((val, i) => (i === index ? true : val)));
    setDebugOutput('');
    fetch('/express/routing/bgp_down_script', requestOptions)
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
    fetch('/express/chatgpt_prompts/routing/bgp_down.txt')
      .then(response => response.text())
      .then(text => {
        setChatGptPrompt(text);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    fetch('/express/chatgpt_prompts/routing/bgp_down_link.txt')
      .then(response => response.text())
      .then(text => {
        setDocumentationLink(text);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    getBgpNeighbors();
  }, []);

  return [
    <Text p="10px" fontSize={15} color="white">
      👉 Instructions: Click the BGP Neighbor to gather debugs, once complete
      click on Run FortiGPT 👈
    </Text>,

    <Box my="4">
      {bgpNei.map((bgp, index) => (
        <Button
          onClick={() => handleClick(bgp.neighbor_ip, index)}
          colorScheme={bgp.state == 'Established' ? 'green' : 'red'}
          key={bgp.neighbor_ip}
          borderRadius="full"
          m="2"
          isLoading={buttonLoading[index]}
          loadingText={bgp.neighbor_ip}
        >
          {bgp.neighbor_ip}
        </Button>
      ))}
    </Box>,

    <Text p="15px" color="white" fontWeight="bold">
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
        <Chatgpt debugOutput={debugOutput} chatGptPrompt={ChatGptPrompt} />
      )}
    </>,
  ];
}
