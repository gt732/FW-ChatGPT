import React, { useContext } from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { AppContext } from '../../AppContext';
import Vpn from '../vpn/Vpn';
import Highcpu from '../system/Highcpu';
import Highmemory from '../system/Highmemory';
import Bgp from '../routing/Bgp';
import Packetflow from '../connectivity/Packetflow';
import Interfaces from '../network/Interfaces';
import Fortiguard from '../system/Fortiguard';
import Chatbot from '../chatgpt/Chatbot';

export default function Main() {
  const { appData } = useContext(AppContext);
  let ComponentToRender;

  switch (`${appData.problemCategory}:${appData.problemType}`) {
    case 'problemcategory:problemtype':
      ComponentToRender = (
        <>
          {!appData.fortiGptChatMode && (
            <Text as="h1" color="white">
              👈 Please fill in the following information and choose a
              category/problem type on the sidebar to get started 👈
            </Text>
          )}
          <br />
        </>
      );
      break;
    case 'network:interfaces':
      ComponentToRender = <Interfaces />;
      break;
    case 'system:fortiguard':
      ComponentToRender = <Fortiguard />;
      break;
    case 'system:highcpu':
      ComponentToRender = <Highcpu />;
      break;
    case 'system:highmemory':
      ComponentToRender = <Highmemory />;
      break;
    case 'vpn:vpndown':
      ComponentToRender = <Vpn />;
      break;
    case 'routing:bgp':
      ComponentToRender = <Bgp />;
      break;
    case 'connectivity:packetflow':
      ComponentToRender = <Packetflow />;
      break;
    default:
      ComponentToRender = (
        <>
          {!appData.fortiGptChatMode && (
            <Text as="h1" color="white">
              👈 Please fill in the following information and choose a
              category/problem type on the sidebar to get started 👈
            </Text>
          )}
          <br />
        </>
      );
  }

  return (
    <Flex flexDirection="column" alignItems="center" justify="center">
      {!appData.fortiGptChatMode && (
        <Heading
          as="h1"
          fontSize="3xl"
          fontWeight="bold"
          color="white"
          pb="25px"
        >
          🤖 FortiGPT Troubleshooting Assistant 🤖
        </Heading>
      )}
      {appData.fortiGptChatMode ? <Chatbot /> : ComponentToRender}
    </Flex>
  );
}
