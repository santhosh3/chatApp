import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const toast = useToast();

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleClick(){
    setShow(!show)
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email || !password) {
    toast({
    title: "Please Fill all the Feilds",
    status: "warning",
    duration: 5000,
    isClosable: true,
    position: "bottom",
  });
  return;
  }
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const resp = await response.json();
      if (resp.status == false) {
        toast({
          title: resp.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      else{
        localStorage.setItem("user", JSON.stringify(resp));
        toast({
          title: "login successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        navigate('/chats')
      }
    } catch (error) {
      toast({
        title: "bad request",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  }

  return (
    <VStack spacing="5px">
    <form onSubmit={handleSubmit}>
      <FormControl isRequired>
      <label>
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={handleEmailChange} />
      </label>
      </FormControl>
      
      <FormControl isRequired>
      <label>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input type={show ? "text" : "password"} value={password} onChange={handlePasswordChange} />
          <InputRightElement width="4.5rem">
           <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
           </Button>
           </InputRightElement>
        </InputGroup>
      </label>
      </FormControl>

      <Button
        type='submit'
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}>
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </form>
    </VStack>
  );
}

export default Login;