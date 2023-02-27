import React from 'react'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/misc/SideDrawer'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'
import { useState } from 'react'

function ChatPage() {
  const user = localStorage.getItem("user");
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
    <Box 
     display="flex"
     justifyContent="space-between"
     p="10px"
     w="100%"
     h="91.5vh"
    >
      {user && <MyChats fetchAgain={fetchAgain}/>}
      {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    </Box>
    </div>
  )
}

export default ChatPage
