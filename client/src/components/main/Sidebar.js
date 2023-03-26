import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Select,
  VStack,
} from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import { useToast } from '@chakra-ui/react';
import { AppContext } from '../../AppContext';

export default function Sidebar() {
  const { appData, setAppData } = useContext(AppContext);
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      host: '',
      username: '',
      password: '',
      port: '',
      transport: '',
      sshPort: '',
    },
    onSubmit: (values, { setSubmitting }) => {
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          secretkey: values.password,
          host: values.host,
          port: values.port,
          transport: values.transport,
          sshPort: values.sshPort,
        }),
      })
        .then(response => {
          if (response.status === 200) {
            toast({
              title: `Login Successful`,
              status: 'success',
              duration: 20000,
              position: 'bottom-right',
              isClosable: true,
            });
          } else {
            toast({
              title: `Login Failed`,
              status: 'error',
              duration: 20000,
              position: 'bottom-right',
              isClosable: true,
            });
          }
        })
        .catch(error => {
          console.log(error);
          toast({
            title: `Login to ${values.host} Failed`,
            status: 'error',
            duration: 20000,
            position: 'bottom-right',
            isClosable: true,
          });
        })
        .finally(() => setSubmitting(false));
    },
  });

  useEffect(() => {
    setAppData({
      ...appData,
      problemCategory: 'problemcategory',
      problemType: 'problemtype',
    });
  }, []);

  function handleProblemCategory(e) {
    setAppData({
      ...appData,
      problemCategory: e.target.value,
      problemType: 'problemtype',
    });
  }

  function handleProblemType(e) {
    setAppData({
      ...appData,
      problemType: e.target.value,
    });
  }

  return (
    <Box maxW="480px">
      <Heading as="h1" color="white" size="xl">
        FortiGPT 🤖
      </Heading>
      <br />

      <FormControl
        as="form"
        mb="20px"
        maxW="300px"
        onSubmit={formik.handleSubmit}
        isRequired
      >
        <FormLabel id="host" color={'white'}>
          Device IP/Hostname:
        </FormLabel>
        <Input
          id="host"
          placeholder="IP/Hostname"
          color="white"
          type="text"
          name="host"
          value={formik.values.host}
          onChange={formik.handleChange}
        />

        <FormLabel id="username" paddingTop="5px" color={'white'}>
          Username:
        </FormLabel>
        <Input
          id="username"
          placeholder="Username"
          color="white"
          type="text"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
        />

        <FormLabel id="password" paddingTop="5px" color={'white'}>
          Password:
        </FormLabel>
        <Input
          id="password"
          placeholder="Password"
          color="white"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />

        <FormLabel id="transport" paddingTop="5px" color={'white'}>
          HTTP or HTTPS:
        </FormLabel>
        <Input
          id="transport"
          placeholder="HTTP or HTTPS"
          color="white"
          type="text"
          name="transport"
          value={formik.values.transport}
          onChange={formik.handleChange}
        />

        <FormLabel id="port" paddingTop="5px" color={'white'}>
          HTTP/HTTPS Port:
        </FormLabel>
        <Input
          id="port"
          placeholder="Enter HTTP or HTTPS Port"
          color="white"
          type="text"
          name="port"
          value={formik.values.port}
          onChange={formik.handleChange}
        />

        <FormLabel id="sshPort" paddingTop="5px" color={'white'}>
          SSH Port:
        </FormLabel>
        <Input
          id="sshPort"
          placeholder="Enter SSH Port"
          color="white"
          type="text"
          name="sshPort"
          value={formik.values.sshPort}
          onChange={formik.handleChange}
        />

        <Button
          borderRadius="full"
          mt="20px"
          colorScheme="blue"
          type="submit"
          isLoading={formik.isSubmitting}
          isDisabled={formik.isSubmitting}
        >
          Login to Fortigate
        </Button>
      </FormControl>

      <VStack maxW="300px" spacing={4}>
        <Select
          bg="#202324"
          pt="5px"
          color="white"
          onChange={handleProblemCategory}
        >
          <option style={{ background: '#202324' }} value="problemcategory">
            Problem Category
          </option>
          <option style={{ background: '#202324' }} value="network">
            Network
          </option>
          <option style={{ background: '#202324' }} value="system">
            System
          </option>
          <option style={{ background: '#202324' }} value="connectivity">
            Connectivity
          </option>
          <option style={{ background: '#202324' }} value="routing">
            Routing
          </option>
          <option style={{ background: '#202324' }} value="vpn">
            VPN
          </option>
        </Select>

        {appData.problemCategory === 'network' && (
          <>
            <Select
              py="20px"
              onChange={handleProblemType}
              bg="#202324"
              pt="5px"
              color="white"
            >
              <option style={{ background: '#202324' }} value="problemtype">
                Problem Type
              </option>
              <option style={{ background: '#202324' }} value="interfaces">
                Interfaces
              </option>
            </Select>
          </>
        )}

        {appData.problemCategory === 'system' && (
          <>
            <Select
              py="20px"
              onChange={handleProblemType}
              bg="#202324"
              pt="5px"
              color="white"
            >
              <option style={{ background: '#202324' }} value="problemtype">
                Problem Type
              </option>
              <option style={{ background: '#202324' }} value="highcpu">
                High CPU
              </option>
              <option style={{ background: '#202324' }} value="highmemory">
                High Memory
              </option>
            </Select>
          </>
        )}

        {appData.problemCategory === 'connectivity' && (
          <>
            <Select
              onChange={handleProblemType}
              bg="#202324"
              pt="5px"
              color="white"
            >
              <option style={{ background: '#202324' }} value="problemtype">
                Problem Type
              </option>
              <option style={{ background: '#202324' }} value="packetflow">
                Packet Flow
              </option>
            </Select>
          </>
        )}

        {appData.problemCategory === 'routing' && (
          <>
            <Select
              onChange={handleProblemType}
              bg="#202324"
              pt="5px"
              color="white"
            >
              <option style={{ background: '#202324' }} value="problemtype">
                Problem Type
              </option>
              <option style={{ background: '#202324' }} value="bgp">
                BGP Down
              </option>
            </Select>
          </>
        )}

        {appData.problemCategory === 'vpn' && (
          <>
            <Select
              onChange={handleProblemType}
              bg="#202324"
              pt="5px"
              color="white"
            >
              <option style={{ background: '#202324' }} value="problemtype">
                Problem Type
              </option>
              <option style={{ background: '#202324' }} value="vpndown">
                VPN Down
              </option>
            </Select>
          </>
        )}
      </VStack>
    </Box>
  );
}
