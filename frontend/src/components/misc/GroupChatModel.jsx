import { useDisclosure } from '@chakra-ui/hooks'
import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast,
    FormControl,
    Input,
    Box
  } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import UserBadgeItem from '../userAvatar/UserBadgeItem';


function GroupChatModel({children}) {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const {chats,setChats} = ChatState();
  const user = JSON.parse(localStorage.getItem("user"));

  const {isOpen, onOpen, onClose} = useDisclosure();

   async function handleSearch(query){
    if(!query){
        return;
    }
    try {
        setLoading(true);
        const {data} = await axios.get(`http://localhost:5000/users?search=${query}`, {
        headers : {
          Authorization : `Bearer ${user.token}`
        },
      });
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
     });
    }
  }
  async function handleSubmit(){
    console.log("santhosh")
    console.log(groupChatName, selectedUsers)
    if(!groupChatName && !selectedUsers){
        toast({
            title: "please fill all the fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
         });
         return;
    }
    try {
        const config = {
            headers : {
                Authorization :`Bearer ${user.token}`,
            },
        };
        const {data} = await axios.post(`http://localhost:5000/group`, {
            name : groupChatName,
            users : JSON.stringify(selectedUsers.map((u) => u._id)),
        },config);
        setChats([...chats,data]);
        onClose();
        toast({
            title: "New group created successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        })
    } catch (error) {
        toast({
            title: "failed to create the chat",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        })
    }
  }
  function handleGroup(userToAdd){
    if(selectedUsers.includes(userToAdd)){
        toast({
            title: "user Already Added!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        return;
    }
    setSelectedUsers([...selectedUsers,userToAdd]);
  }

  function handleDelete(user){
    setSelectedUsers(selectedUsers.filter(sel => sel._id !== user._id))
  }
  return (
    <>
      <Button onClick={onOpen}>{children}</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
           fontSize={"35px"}
           fontFamily="work sans"
           display={"flex"}
           justifyContent="center"
          >Create Group Chats</ModalHeader>
          <ModalCloseButton />
          <ModalBody
           display={"flex"}
           flexDirection="column"
           alignItems={"center"}
          >
            <FormControl>
                <Input 
                 placeholder='chat Name'
                 mb={3}
                 onChange={(e) => setGroupChatName(e.target.value)}
                />
            </FormControl>
            <FormControl>
                <Input 
                 placeholder='Add users eg: John,piyush,Jane'
                 mb={1}
                 onChange={(e) => handleSearch(e.target.value)}
                />
            </FormControl>
            <Box
            display={"flex"}
            w="100%"
            flexWrap={"wrap"}
            >
            {
                selectedUsers.map((u) => (
                    <UserBadgeItem
                     key={user._id}
                     user={u}
                     handleFunction={() => handleDelete(u)}
                    />
                ))
            }
            </Box>
            {loading ? <div>Loading</div> : (
                searchResult?.slice(0,4).map(user => (
                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)}/>
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    )
}

export default GroupChatModel
