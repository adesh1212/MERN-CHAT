import { Image, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

function ProfileModal({ user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <span onClick={onOpen}>{children}</span>
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="310px">
          <ModalHeader
            fontSize="30px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user.name && user.name.toUpperCase()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            paddingBottom="1rem"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.avatar}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "18px", md: "23px" }}
              fontFamily="Work sans"
            >
              Email:{user.email}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ProfileModal;
