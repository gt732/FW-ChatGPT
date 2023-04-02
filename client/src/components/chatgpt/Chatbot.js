import { useState, useEffect } from 'react';
import axios from 'axios';
import { Heading, HStack } from '@chakra-ui/react';
import {
  Text,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Box,
  Textarea,
  Button,
  Spinner,
  Link,
} from '@chakra-ui/react';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptTokens, setPromptTokens] = useState('');
  const [completionTokens, setCompletionTokens] = useState('');
  const [totalTokens, setTotalTokens] = useState('');

  const handleSubmit = () => {
    setChatLog(prevChatLog => [
      ...prevChatLog,
      { type: 'user', message: inputValue },
    ]);

    sendMessage(inputValue);

    setInputValue('');
  };

  const sendMessage = async message => {
    const url = '/api/chat';
    const headers = {
      'Content-type': 'application/json',
    };
    const data = {
      query: message,
    };
    setIsLoading(true);

    try {
      const response = await axios.post(url, data, { headers });
      setChatLog(prevChatLog => [
        ...prevChatLog,
        {
          type: 'bot',
          message: response.data.response.generations[0][0].message.content,
        },
      ]);
      setPromptTokens(
        response.data.response.llm_output.token_usage.prompt_tokens
      );
      setCompletionTokens(
        response.data.response.llm_output.token_usage.completion_tokens
      );
      setTotalTokens(
        response.data.response.llm_output.token_usage.total_tokens
      );

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    setPromptTokens('');
    setCompletionTokens('');
    setTotalTokens('');
  }, []);

  return (
    <>
      <Heading as="h1" fontSize="3xl" fontWeight="bold" color="white" pb="1px">
        🤖💬 FortiGPT Chatbot
      </Heading>
      <Text color="white" m="2" fontSize={15} maxWidth="2xl">
        FortiGPT has been "trained" using the following documentation guides 📚
      </Text>

      <HStack pl="10px" mb="2">
        <Link
          isExternal
          color="teal.500"
          href="https://docs.fortinet.com/document/fortigate/7.2.4/administration-guide/954635/getting-started"
        >
          FortiOS-7.2.4-Administration_Guide 📑
        </Link>
        <Link
          isExternal
          color="teal.500"
          href="https://docs.fortinet.com/document/fortigate/7.2.4/cli-reference/84566/fortios-cli-reference"
        >
          FortiOS-7.2.4-CLI_Reference 📑
        </Link>
        <Link
          isExternal
          color="teal.500"
          href="https://docs.fortinet.com/document/fortigate/7.2.4/fortios-log-message-reference/524940/introduction"
        >
          FortiOS_7.2.4_Log_Reference 📑
        </Link>
        <Link
          isExternal
          color="teal.500"
          href="https://docs.fortinet.com/document/fortigate/7.2.0/best-practices/587898/getting-started"
        >
          FortiOS-7.2-Best_Practices 📑
        </Link>
      </HStack>
      <Text color="white" mb="2" fontSize={15} maxWidth="4xl">
        Pro Tip: Use the documentation title in the query to influence the guide
        used, Example: "FortiOS-7.2.4-CLI_Reference" 💡
      </Text>
      <HStack spacing="40px">
        <Text color="white" fontWeight="extrabold" fontSize={20} maxWidth="2xl">
          Last Request
        </Text>
        <Stat color="white">
          <StatLabel>Prompt</StatLabel>
          <StatNumber>{promptTokens}</StatNumber>
          <StatHelpText>Tokens</StatHelpText>
        </Stat>
        <Stat color="white">
          <StatLabel textAlign="center">Completion</StatLabel>
          <StatNumber>{completionTokens}</StatNumber>
          <StatHelpText>Tokens</StatHelpText>
        </Stat>
        <Stat color="white">
          <StatLabel>Total</StatLabel>
          <StatNumber>{totalTokens}</StatNumber>
          <StatHelpText>Tokens</StatHelpText>
        </Stat>
      </HStack>
      <Box
        width="60%"
        height="70vh"
        overflowY="scroll"
        display="flex"
        flexDirection="column"
        backgroundColor="gray.900"
        marginBottom="5"
        rounded="lg"
      >
        <Flex flex="1" padding="6" flexDirection="column" spacing="4">
          {chatLog.map((message, index) => (
            <Flex
              key={index}
              justifyContent={
                message.type === 'user' ? 'flex-end' : 'flex-start'
              }
            >
              <Box
                backgroundColor={
                  message.type === 'user' ? 'gray.500' : 'gray.800'
                }
                rounded="lg"
                padding="4"
                color="white"
                maxWidth="sm"
                whiteSpace="pre-wrap"
                m="2"
                fontSize="sm"
              >
                {message.message}
              </Box>
            </Flex>
          ))}
          {isLoading && (
            <Flex justifyContent="flex-start" key={chatLog.length}>
              <Box
                backgroundColor="gray.800"
                rounded="lg"
                padding="4"
                color="white"
                maxWidth="sm"
              >
                <Spinner size="xl" />
              </Box>
            </Flex>
          )}
        </Flex>

        <Flex
          padding="6"
          flex="none"
          rounded="lg"
          border="1px"
          borderColor="gray.700"
          backgroundColor="gray.800"
        >
          <Textarea
            flex="1"
            paddingX="4"
            paddingY="2"
            backgroundColor="transparent"
            color="white"
            focusBorderColor="blue.500"
            focus="outline-none"
            resize="none"
            placeholder="Type your message..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSubmit(e);
              } else if (e.shiftKey && e.key === 'Enter') {
                setInputValue(prevValue => prevValue + '\n');
              }
            }}
          />
          <Button
            type="submit"
            backgroundColor="blue.500"
            rounded="lg"
            paddingX="4"
            paddingY="2"
            mt="5"
            ml="2"
            color="white"
            fontWeight="semibold"
            focus="outline-none"
            _hover={{ backgroundColor: 'blue.600' }}
            transitionDuration="300ms"
            onClick={handleSubmit}
          >
            Send
          </Button>
        </Flex>
      </Box>
    </>
  );
}
