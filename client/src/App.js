import React, { useState } from 'react';
import { ChakraProvider, Grid, GridItem } from '@chakra-ui/react';
import Sidebar from './components/main/Sidebar';
import Main from './components/main/Main';
import { AppContext } from './AppContext';

export default function App() {
  const [appData, setAppData] = useState({});

  return (
    <ChakraProvider>
      <AppContext.Provider value={{ appData, setAppData }}>
        <Grid templateColumns="repeat(7, 1fr)" minH="100vh" overflowY="scroll">
          <GridItem colSpan="1" bg="#202324" p="30px">
            <Sidebar />
          </GridItem>
          <GridItem colSpan="6" p="30px" bg="#0B0E12">
            <Main />
          </GridItem>
        </Grid>
      </AppContext.Provider>
    </ChakraProvider>
  );
}
