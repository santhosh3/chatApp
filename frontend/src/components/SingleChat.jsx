import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box,IconButton,Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'

function SingleChat() {
  const {selectedChat, setSelectedChat} = ChatState();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
    {
    selectedChat ? (
    <>
    <Text
      fontSize={{ base: "28px", md: "30px" }}
      pb={3}
      px={2}
      w="100%"
      fontFamily="Work sans"
      d="flex"
      justifyContent={{ base: "space-between" }}
      alignItems="center"
    >
          <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
          />
    </Text>
    </>) : (
    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
        Click on a user to start chatting
        </Text>
    </Box>
    )
    }
    </>
  )
}

export default SingleChat
