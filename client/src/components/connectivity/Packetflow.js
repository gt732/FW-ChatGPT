import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  HStack,
  Text,
  Textarea,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import Disclaimer from '../main/Disclaimer';
import Chatgpt from '../chatgpt/Chatgpt';

export default function Packetflow() {
  const [debugOutput, setDebugOutput] = useState('');
  const [ChatGptPrompt, setChatGptPrompt] = useState('');
  const [documentationLink, setDocumentationLink] = useState('');

  const formik = useFormik({
    initialValues: {
      sourceip: '',
      destinationip: '',
      sourceport: '',
      destinationport: '',
    },
    onSubmit: (values, { setSubmitting }) => {
      // Run the packet flow debug script
      fetch('/connectivity/packet_flow_script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceIP: values.sourceip,
          destinationIP: values.destinationip,
          sourcePort: values.sourceport,
          destinationPort: values.destinationport,
        }),
      })
        .then(response => response.text())
        .then(data => {
          setDebugOutput(data);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => setSubmitting(false));
    },
  });

  useEffect(() => {
    // Get the chatgpt prompt
    fetch('/chatgpt_prompts/connectivity/packet_flow.txt')
      .then(response => response.text())
      .then(text => {
        setChatGptPrompt(text);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Get the documentation link
    fetch('/chatgpt_prompts/connectivity/packet_flow_link.txt')
      .then(response => response.text())
      .then(text => {
        setDocumentationLink(text);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Text p="10px" fontSize={15} color="white">
        👉 Instructions: Enter Any Combination of Source/Destination IP or
        Source/Destination Port, once Start Debug is complete click on Run
        FortiGPT 👈
      </Text>
      <Flex justifyContent="center" alignItems="center" p="10px">
        <FormLabel color={'white'}>Source IP:</FormLabel>
        <Input
          width="150px"
          id="host"
          placeholder="Source IP"
          color="white"
          type="text"
          name="sourceip"
          value={formik.values.sourceip}
          onChange={formik.handleChange}
        />
        <FormLabel pl="10px" color={'white'}>
          Destination IP:
        </FormLabel>
        <Input
          width="150px"
          id="username"
          placeholder="Destination IP"
          color="white"
          type="text"
          name="destinationip"
          value={formik.values.destinationip}
          onChange={formik.handleChange}
        />
      </Flex>

      <Flex justifyContent="center" alignItems="center" p="10px">
        <FormLabel color={'white'}>Source Port:</FormLabel>
        <Input
          width="150px"
          id="host"
          placeholder="Source Port"
          color="white"
          type="text"
          name="sourceport"
          value={formik.values.sourceport}
          onChange={formik.handleChange}
        />
        <FormLabel pl="10px" color={'white'}>
          Destination Port:
        </FormLabel>
        <Input
          width="150px"
          id="username"
          placeholder="Destination Port"
          color="white"
          type="text"
          name="destinationport"
          value={formik.values.destinationport}
          onChange={formik.handleChange}
        />
      </Flex>

      <HStack pt="10px">
        <Text p="15px" color="white" fontWeight="bold">
          ✨ DEBUG OUTPUT ✨
        </Text>
        <Button
          borderRadius="full"
          mt="20px"
          colorScheme="blue"
          type="submit"
          isLoading={formik.isSubmitting}
          isDisabled={formik.isSubmitting}
          onClick={formik.handleSubmit}
        >
          Start Debug
        </Button>
      </HStack>
      <Textarea
        color="white"
        bg="gray.800"
        defaultValue={debugOutput}
        my={4}
        size="md"
        maxWidth="2xl"
      />
      <Disclaimer documentationLink={documentationLink} />
      {debugOutput && (
        <Chatgpt debugOutput={debugOutput} chatGptPrompt={ChatGptPrompt} />
      )}
    </>
  );
}
