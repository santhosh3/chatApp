import React from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import { IconButton } from '@chakra-ui/react'
import { Button,Image,Text } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'


function ProfileModel({user,children}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //const user1 = JSON.parse(localStorage.getItem("user"))
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ):(
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen}/>
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height={"60%"} width={"100%"}>
          <ModalHeader
           fontSize={"40px"}
           fontFamily={"work sans"}
           display="flex"
           justifyContent={"center"}
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Image
              borderRadius={"full"}
              boxSize={"150px"}
              src={user.pic}
              alt={user.name}
              />
            <Text fontSize={{base:"28px", md:"30px"}} fontFamily="work sans">
            Email : {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModel
