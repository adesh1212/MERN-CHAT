import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";

function Chat() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  // const navigate = useNavigate();
  // useEffect(() => {
  //   // console.log(user);
  //   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  //   if (!userInfo) {
  //     navigate("/login");
  //   }
  //   setUser(userInfo)
  // }, [setUser,navigate]);

  return (
    <div style={{ width: "100%" }}>
      {user && (
        <SideDrawer
          // user={user}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
        />
      )}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default Chat;
