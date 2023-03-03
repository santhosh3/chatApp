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
    IconButton,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
  } from '@chakra-ui/react'
import axios from 'axios'
import { useDisclosure } from '@chakra-ui/hooks'
import { CloseIcon, ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../userAvatar/UserBadgeItem'
import UserListItem from '../userAvatar/UserListItem'

function UpdateGroupChatModel({fetchAgain, setFetchAgain,fetchMessages}) {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const {selectedChat, setSelectedChat} = ChatState();
  const user = JSON.parse(localStorage.getItem("user"));
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

 async function handleRemove(user1){
    console.log(selectedChat,selectedChat.groupAdmin._id,user._id,user1._id)
    if (selectedChat.groupAdmin[0]._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const {data} = await axios.post(`http://localhost:5000/groupremove`,{
        chatId : selectedChat._id,
        userId : user1._id
      }, {
        headers : {
          Authorization : `Bearer ${user.token}`
        },
      });
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages()
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  async function handleAddUser(user1){
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin[0]._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const {data} = await axios.put(`http://localhost:5000/groupadd`,{
        chatId : selectedChat._id,
        userId : user1._id
      }, {
        headers : {
          Authorization : `Bearer ${user.token}`
        },
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
  async function handleRename(){
    if(!groupName) return
    try {
      setRenameLoading(true);
      const {data} = await axios.put(`http://localhost:5000/rename`,{
        chatId : selectedChat._id,
        chatName : groupName
      }, {
        headers : {
          Authorization : `Bearer ${user.token}`
        },
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false)
    } catch (error) {
      toast({
        title :"error occured",
        description: error.response.data.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom"
      });
    }
    setGroupName("");
  }


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

  return (
    <>
      <IconButton display={{base:"flex"}} icon={<ViewIcon />} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input 
                placeholder="Chat Name"
                mb={3}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
            <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModel

