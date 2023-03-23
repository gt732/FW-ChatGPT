import React, {useState, useEffect} from 'react'
import { Button, HStack, Text, Textarea, } from '@chakra-ui/react';
import Disclaimer from '../main/Disclaimer';
import Chatgpt from '../chatgpt/Chatgpt';

export default function Highmemory() {

    const [debugOutput, setDebugOutput] = useState("");
    const [loading, setLoading] = useState(false); 
    const [ChatGptPrompt, setChatGptPrompt] = useState("");
    const [documentationLink, setDocumentationLink] = useState("");


    function handleClick() {

      // Run the high memory debug script
        setLoading(true);
        setDebugOutput("");
        fetch("/performance/high_memory_script", {
            method: "POST",
        })
          .then((response) => response.text())
          .then((data) => {
            setDebugOutput(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setDebugOutput('Try Logging in again');
            setLoading(false);
          })
    }

    useEffect(() => {
      // Get the chatgpt prompt
        fetch('/chatgpt_prompts/performance/high_memory.txt')
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
        fetch('/chatgpt_prompts/performance/high_memory_link.txt')
          .then(response => response.text())
          .then(text => {
            setDocumentationLink(text);
          })
          .catch(error => {
            console.error(error);
          });
      }, []);

  return [

    <Text p='10px' fontSize={15} color="white">👉 Instructions: Click Start Debug to gather High Memory Debugs, once complete click on Run FortiGPT 👈</Text>,


    <HStack>
            <Text p='15px' color="white" fontWeight="bold">✨ DEBUG OUTPUT ✨</Text>,
            <Button 
          borderRadius="full"  
          colorScheme="blue" 
          size="md" 
          ml={4} 
          isLoading={loading} 
          onClick={handleClick}
          loadingText='Start Debug'
        >
          Start Debug
        </Button>
    </HStack>,



    <Textarea
          color='white'
          bg='gray.800'
          defaultValue={debugOutput}
          my={4}
          size="md"
          maxWidth='2xl'
        />,
        <>
        <Disclaimer documentationLink={documentationLink}/>
        </>,
        <>
        {debugOutput && <Chatgpt debugOutput={debugOutput} chatGptPrompt={ChatGptPrompt} />}
        </>



]
}
