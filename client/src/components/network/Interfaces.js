import React, { useState, useEffect } from 'react';
import { Box, Button, Text, Textarea } from '@chakra-ui/react';
import Disclaimer from '../main/Disclaimer';
import Chatgpt from '../chatgpt/Chatgpt';

export default function Interfaces() {
  const [intfs, setIntfs] = useState([]);
  const [buttonLoading, setButtonLoading] = useState([]);
  const [debugOutput, setDebugOutput] = useState('');
  const [ChatGptPrompt, setChatGptPrompt] = useState('');
  const [documentationLink, setDocumentationLink] = useState('');

  function getInterfaces() {
    fetch(`/express/network/get_interface_list`)
      .then(response => response.json())
      .then(data => {
        const interfaceValuesArray = Object.values(data.results);
        setIntfs(interfaceValuesArray);
        setButtonLoading(interfaceValuesArray.map(() => false));
      })
      .catch(error => {
        console.error(error);
      });
  }

  function handleClick(intf, index) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intf: intf,
      }),
    };
    setButtonLoading(buttonLoading.map((val, i) => (i === index ? true : val)));

    fetch('/express/network/interface_issue_script', requestOptions)
      .then(response => response.text())
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
    fetch('/express/chatgpt_prompts/network/interface_issue.txt')
      .then(response => response.text())
      .then(text => {
        setChatGptPrompt(text);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    fetch('/express/chatgpt_prompts/network/interface_issue_link.txt')
      .then(response => response.text())
      .then(text => {
        setDocumentationLink(text);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    getInterfaces();
  }, []);

  return [
    <Text p="10px" fontSize={15} color="white">
      👉 Instructions: Click on the Interface to gather debugs and statistics,
      once complete click on Run FortiGPT 👈
    </Text>,

    <Box my="4">
      {intfs.map((intf, index) => (
        <Button
          onClick={() => handleClick(intf.name, index)}
          colorScheme={intf.link == true ? 'green' : 'red'}
          key={intf.name}
          borderRadius="full"
          m="2"
          isLoading={buttonLoading[index]}
          loadingText={intf.name}
        >
          {intf.name}
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
