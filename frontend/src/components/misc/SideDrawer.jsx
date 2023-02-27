import React,{useState} from 'react'
import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/hooks';
import ChatLoading from '../ChatLoading';
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem';
import { ChatState } from "../../Context/ChatProvider";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
 // const [, set] = useState([]);

  const {isOpen, onOpen, onClose} = useDisclosure()
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"))
   
  const {
    set,
    notification,
    setNotification,
    chats,
    setChats,
   // user
  } = ChatState();

  function searchBox(e){
    const {value} = e.target
    setSearch(value)
  }
  const toast = useToast();
  async function handleSearch(){
    if(!search){
      toast({
        title :"please enter something to search",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top-left"
      });
    }
    try {
      setLoading(true);
      const {data} = await axios.get(`http://localhost:5000/users?search=${search}`, {
        headers : {
          Authorization : `Bearer ${user.token}`
        },
      });
      console.log(data)
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title :"Error Occured",
        description :"Failed to load the search results",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left"
      })
    }
  }
  function logOutHandler(){
    localStorage.removeItem("user");
    navigate("/")
  }
  async function accessChat(userId){
    try {
      setLoadingChat(true);
      const {data} = await axios.post(`http://localhost:5000/`,{userId},{
        headers : {
          Authorization : `Bearer ${user.token}`,
          "Content-Type" : "application/json",
        },
      });
      console.log(data)
      if(!chats.find((c) => c._id === data._id)) setChats([data,...chats]);
      set(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  return (
    <>
      <Box
       display="flex"
       justifyContent="space-between"
       alignItems="center"
       bg="white"
       w="100%"
       p="5px 10px 5px 10px"
       borderWidth="5px"
      >
        <Tooltip label="Search User to chat" hasArrow placement='bottom-end'>
          <Button variant="ghost" onClick={onOpen}>
           <i class="fa fa-search" aria-hidden="true"></i>
           <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}><BellIcon fontSize={"2xl"} m={1}/></MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton
             as={Button}
             rightIcon={<ChevronDownIcon/>}
            >
            <Avatar
             variant="ghost"
             size="sm"
             cursor="pointer"
             name={user.name}
             src={user.pic}
            />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
              <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider/>
              <MenuItem onClick={logOutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>
            Search User
          </DrawerHeader>
          <DrawerBody>
          <Box display={"flex"} pb={2}>
            <Input 
             placeholder='Search by name or email'
             mr={2}
             onChange={(e) => searchBox(e)}
            />
            <Button onClick={handleSearch}>Go</Button>
          </Box>
          {
            loading ? (<ChatLoading/>) : (
              <span>
               {
                searchResult?(
                  searchResult.map((user,index) => (
                    <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                  ))
                ):("null")
               }
              </span>
            )
          }
          {loadingChat && <Spinner ml="auto" display="flex" />}
        </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer
