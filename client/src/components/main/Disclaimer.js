import React from 'react';
import { Text, Link, HStack } from '@chakra-ui/react';

export default function Disclaimer(props) {
  // Display the disclaimer
  return (
    <HStack pl="10px">
      <Text color="white" m="10px" fontSize={15} maxWidth="2xl">
        ⚠️ DISCLAIMER ⚠️ The advice provided is intended to be helpful, but
        should not be considered as 100% accurate or applicable in all
        situations. It is important to consult official documentation and seek
        additional guidance as needed before making important decisions. 📚 👀
        Please refer to the {'  '}
        <Link isExternal color="teal.500" href={props.documentationLink}>
          TROUBLESHOOTING GUIDE 📑
        </Link>
      </Text>
    </HStack>
  );
}
