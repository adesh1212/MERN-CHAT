import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../config/ChatLogic";
import NotificationBadge, { Effect } from "react-notification-badge";
import { server } from "../config/Server";

function SideDrawer({ fetchAgain,setFetchAgain }) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    user,
  } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const toast = useToast();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    // window.location.reload();
    navigate("/login");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${server}/api/user?search=${search}`,
        config
      );

      const resp = await data.data;
      //   console.log(data);
      setLoading(false);
      setSearchResult(resp);
      setFetchAgain(true);
      //   console.log(searchResult);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${server}/api/chat`,
        {
          userId,
        },
        config
      );

      //   console.log(data);
      const resp = await data.data;

      //   if chat is not already present then append it.
      if (!chats.find((c) => c._id === resp._id)) setChats([resp, ...chats]);

      setSelectedChat(resp);
      setLoadingChat(false);
      setFetchAgain(true);
      onClose();
    } catch (error) {
      toast({
        title: "Failed to access the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

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
        <Tooltip label="Search Users" hasArrow placeSelf="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <FaSearch />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          MERN-Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification && notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" margin={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.length &&
                notification.map((n) => (
                  <MenuItem
                    key={n._id}
                    onClick={() => {
                      setSelectedChat(n.chat);
                      setNotification(
                        notification.filter((notif) => notif !== n)
                      );
                    }}
                  >
                    {n.chat && n.chat.isGroupChat
                      ? `New message in ${n.chat.chatName}`
                      : n.chat &&
                        `New message from ${getSender(user, n.chat.users)}`}
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton p={1} as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.avatar}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search users"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult &&
              searchResult.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
