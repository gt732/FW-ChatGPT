import React, { useState } from 'react';
import { Button, HStack, Text } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react';

export default function Chatgpt(props) {
  const [chatGptResponse, setChatGptResponse] = useState('');
  const [loading, setLoading] = useState(false);

  function fetchChatGptResponse() {
    // Fetch the chatgpt response from the API
    setLoading(true);
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: props.chatGptPrompt },
          { role: 'user', content: props.debugOutput },
        ],
      }),
    };

    fetch('/chatgpt', options)
      .then(response => response.json())
      .then(data => {
        setChatGptResponse(data.content);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }

  return (
    <>
      <HStack pl="10px">
        <Text ml={2} color="white" fontWeight="bold">
          🤖 FortiGPT RESPONSE 🤖
        </Text>
        <Button
          borderRadius="full"
          colorScheme="blue"
          size="md"
          ml={4}
          isLoading={loading}
          loadingText="Run FortiGPT"
          onClick={fetchChatGptResponse}
        >
          Run FortiGPT
        </Button>
      </HStack>
      <Textarea
        color="white"
        bg="gray.800"
        defaultValue={chatGptResponse}
        my={4}
        size="md"
        maxWidth="2xl"
        maxLength="100px"
      />
    </>
  );
}
