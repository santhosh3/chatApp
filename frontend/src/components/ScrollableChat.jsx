import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isSameSender,isLastMessage, isSameSenderMargin, isSameUser } from './Config/ChatLogics';

function ScrollableChat({messages}) {

  const user = JSON.parse(localStorage.getItem("user"));
  console.log(messages)
  return (   
    <ScrollableFeed>
      {
        messages && messages.map((m,i) => (
          <div key={m._id} style={{display:"flex"}}>
           {
            (isSameSender(messages,m,i,user._id) || isLastMessage(messages,i,user._id)) && (
              <Tooltip
               label={m.sender.name}
               placement="bottom-start"
               hasArrow
              >
              <Avatar 
              mt={"7px"}
              mr={1}
              size="sm"
              cursor={"pointer"}
              name={m.sender.name}
              src={m.sender.pic}
              />
              </Tooltip>
            )
           }
           {/* <span
            style={{
              backgroundColor: `${
                m.sender._id === user._id ? "#8EE3F8" : "#B9F5D0"
              }`, borderRadius: "20px", padding: "5px 15px", maxWidth: "75%",
              marginLeft : isSameSenderMargin(messages,m,i,user._id),
              marginTop : isSameUser(messages,m,i,user._id) ? 3 : 10,
            }}
           >
            {m.content}
           </span> */}
           {m.content}
          </div>
        ))
      }
    </ScrollableFeed>
  )
}

export default ScrollableChat
