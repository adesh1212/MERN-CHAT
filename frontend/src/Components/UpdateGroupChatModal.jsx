import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import UserListItem from "./UserListItem";
import { server } from "../config/Server";

function UpdateGroupChatModal({ fetchAgain, setFetchAgain,fetchMessages }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const toast = useToast();

  const handleDelete = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "You are not the admin",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${server}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      const resp = await data.data;
      // console.log(resp);
      setSelectedChat(resp);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      const msg = await error.response.data.msg;
      toast({
        title: "Error Occured",
        description: msg,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Please enter the group name",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "You are not the admin",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setRenameLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${server}/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      const resp = await data.data;
      // console.log(resp);
      setSelectedChat(resp);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      onClose();
    } catch (error) {
      const msg = await error.response.data.msg;
      toast({
        title: "Error Occured",
        description: msg,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setRenameLoading(false);
    }
  };

  const handleSearch = async (val) => {
    setSearch(val);
    if (!val) return;
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${server}/api/user?search=${val}`, config);

      const res = await data.data;
      // console.log(res);
      setSearchResult(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // add users
  const handleGroup = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User already in the group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
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
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${server}/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      const resp = await data.data;

      //   console.log(resp);
      setSelectedChat(resp);
      setLoading(false);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const LeaveGroup = async (user1) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      const resp = await data.data;
      // console.log(resp);
      setSelectedChat(resp);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      onClose();
    } catch (error) {
      const msg = await error.response.data.msg;
      toast({
        title: "Error Occured",
        description: msg,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        icon={<ViewIcon />}
        display={{ base: "flex" }}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex">
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Group Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display="flex">
              <Input
                placeholder="Add Users to the Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Text display="flex" justifyContent="center">
                Loading...{" "}
              </Text>
            ) : (
              searchResult.map((u) => (
                <UserListItem user={u} handleFunction={() => handleGroup(u)} />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => LeaveGroup(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
