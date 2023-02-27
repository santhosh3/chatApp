import React from 'react'
import {Box, Center, Container,Text,Tabs,Tab,TabPanel,TabList,TabPanels} from '@chakra-ui/react'
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/SignUp';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  // const navigate = useNavigate();
  // React.useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   if(user) navigate("/chats")
  // },[]);
  return (
    <Container maxW='xl' centerContent>
      <Box
       display="flex"
       justifyContent="center"
       p={3}
       bg={"white"}
       w="100%"
       m="40px 0 15px 0"
       borderRadius="1g"
       borderWidth="1px"
      >
        <Text 
        fontSize={"4xl"}
        fontFamily="work sans"
        color={"black"}
        >Talk-a-Tive</Text>
      </Box>
      <Box
      bg="white"
      p={4}
      borderRadius="1g"
      borderWidth="1px"
      width="100%"
      >
      <Tabs variant='soft-rounded' colorScheme='green'>
      <TabList mb="1em">
        <Tab width={"50%"}>Login</Tab>
        <Tab width={"50%"}>Signup</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <p><Login /></p>
        </TabPanel>
        <TabPanel>
          <p><Signup/></p>
        </TabPanel>
      </TabPanels>
    </Tabs>
      </Box>
      
    </Container>
  )
}

export default HomePage
