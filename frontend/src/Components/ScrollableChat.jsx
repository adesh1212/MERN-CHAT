import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/ChatProvider";
import {
  isFirstMessage,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogic";
import { Avatar, Tooltip } from "@chakra-ui/react";

function ScrollableChat({ messages }) {
  // console.log("msgs ",messages)
  const { user } = ChatState();
  return (
    <ScrollableFeed className="messages">
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt={3}
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.avatar}
                />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {isFirstMessage(messages, m, i, user._id) &&
                m.chat.isGroupChat && (
                  <div style={{ fontWeight: "bolder" }}>{m.sender.name}</div>
                )}
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
