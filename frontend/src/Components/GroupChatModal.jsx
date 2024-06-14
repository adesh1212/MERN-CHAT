import {
  Box,
  Button,
  FormControl,
  Image,
  Input,
  ModalFooter,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
import { server } from "../config/Server";

function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [grploading, setGrpLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  // display users as per the search query
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${server}/api/user?search=${search}`, config);
      const resp = await data.data;
      //   console.log(resp);
      setLoading(false);
      setSearchResult(resp);
    } catch (error) {
      toast({
        title: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // create group
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setGrpLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${server}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      const resp = await data.data;
      // console.log(resp);
      setChats([resp, ...chats]);
      setGrpLoading(false);
      onClose();
      toast({
        title: "New group created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      // console.log(error);
      setGrpLoading(false);
      const msg = await error.response.data.msg;
      toast({
        title: "Failed to create the group",
        description: msg,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // Add users to the group
  const handleGroup = (user) => {
    if (selectedUsers && selectedUsers.includes(user)) {
      toast({
        title: "User already Added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleDelete = (user) => {
    const data = selectedUsers.filter((u) => u._id !== user._id);
    // console.log(data);
    setSelectedUsers(data);
  };

  return (
    <div>
      <span onClick={onOpen}>{children}</span>
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Group Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex">
              {selectedUsers &&
                selectedUsers.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                ))}
            </Box>
            {loading ? (
              <div>Loading..</div>
            ) : (
              searchResult &&
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={grploading}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default GroupChatModal;
