import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Signup() {

  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmPassword] = useState('');
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(false);

  const toast = useToast();

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }
  function handlePasswordChange1(event) {
    setconfirmPassword(event.target.value);
  }
  function handleImageChange(event) {
    setImage(event.target.files[0]);
  }

  function handleClick(){
    setShow(!show)
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name || !email || !password || !confirmpassword) {
    toast({
    title: "Please Fill all the Feilds",
    status: "warning",
    duration: 5000,
    isClosable: true,
    position: "bottom",
  });
  return;
  }
  if (password !== confirmpassword) {
    toast({
      title: "Passwords Do Not Match",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/post', {
        method: 'POST',
        body: formData
      });
      const resp = await response.json();
      console.log(resp)
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
          title: "registered successfully",
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
      <FormLabel>Name</FormLabel>
        <Input type="text" value={name} onChange={handleNameChange} />
      </label>
      </FormControl>

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
     
     <FormControl isRequired>
     <label>
     <FormLabel>confirmpassword</FormLabel>
       <InputGroup>
        <Input type={show ? "text" : "password"} value={confirmpassword} onChange={handlePasswordChange1} />
        <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </Button>
        </InputRightElement>
       </InputGroup>
      </label>
     </FormControl>
    
     <FormControl isRequired>
     <label>
        <FormLabel>Image</FormLabel>
        <Input type="file" p={1.5} accept="image/*" onChange={handleImageChange} />
      </label>
     </FormControl>
      
      <Button
        type='submit'
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
      >
        Sign Up
      </Button>
    </form>
    </VStack>
  );
}

export default Signup;