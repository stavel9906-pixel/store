import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { ChatBubble } from "../../components/ChatBubble";
import { useGetUserFromToken } from "../../api/hooks/useGetUserFromToken";
import type { Chat, Message } from "../../utils/types";
import { UsersRole } from "../../utils/enums";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { getDateLabel } from "./getDateLabel";

const socket: Socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

export const ChatPage = () => {
  const { user } = useGetUserFromToken();
  const [openChats, setOpenChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const currentChatRef = useRef<Chat | null>(null);

  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  useEffect(() => {
    if (currentChat) {
      socket.emit("joinChat", currentChat.id);
    }
  }, [currentChat]);

  useEffect(() => {
    if (!user) return;
    console.log(user);

    socket.emit("identify", { userId: user.id, role: user.role });

    if (user.role === UsersRole.USER) {
      socket.emit("getOpenChatsForUser", user.id);
      socket.on("getOpenChatsForUser", (chat) => {
        if (chat) {
          setCurrentChat(chat);
          socket.emit("joinChat", chat.id);
        }
      });
    }

    if (user.role === UsersRole.ADMIN) {
      socket.emit("getOpenChats");
      socket.on("openChatsForAdmin", (chats) => setOpenChats(chats));
      socket.on("newChatForAdmin", (chat) =>
        setOpenChats((prev) =>
          prev.some((c) => c.id === chat.id) ? prev : [...prev, chat]
        )
      );
    }
  }, [user]);

  useEffect(() => {
    socket.on("history", (msgs) => setMessages(msgs));

    socket.on("newMessage", (msg) => {
      if (msg.chat.id === currentChatRef.current?.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("chatClosed", (chat) => {
      if (currentChatRef.current?.id === chat.id) {
        setCurrentChat(null);
        setMessages([]);
      }
    });

    socket.on("chatClosedForAdmin", (chat) => {
      setOpenChats((prev) => prev.filter((c) => c.id !== chat.id));
    });

    return () => {
      socket.off("history");
      socket.off("newMessage");
      socket.off("chatClosed");
      socket.off("chatClosedForAdmin");
    };
  }, []); // רק פעם אחת!

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // JOIN CHAT
  const joinChat = (chat: Chat) => {
    if (currentChat?.id === chat.id) return;

    setCurrentChat(chat);
    setMessages([]);

    socket.emit("joinChat", chat.id);
  };

  const openNewChat = () => {
    if (!user || user.role !== UsersRole.USER) return;
    if (currentChat) return;

    socket.emit("openChat", user.id, (chat: Chat) => {
      joinChat(chat);
    });
  };

  // SEND MESSAGE
  const sendMessage = () => {
    if (!text.trim() || !currentChat || !user) return;

    socket.emit("sendMessage", {
      chatId: currentChat.id,
      senderId: user.id,
      text,
    });

    setText("");
  };

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 4 }}
    >
      <Typography
        variant="h4"
        gutterBottom
      >
        Chat Support
      </Typography>

      {user && user.role === UsersRole.USER && !currentChat && (
        <Button
          variant="contained"
          color="primary"
          onClick={openNewChat}
          startIcon={
            <AddCommentOutlinedIcon
              sx={{ width: "4rem", height: "4rem", mr: 2 }}
            />
          }
          sx={{
            mt: 4,
            alignSelf: "center",
            width: "80%",
            height: "60%",
            fontSize: "3rem",
            fontWeight: "bold",
            borderRadius: 3,
            boxShadow: 3,
            textTransform: "none",
          }}
        >
          Need Help?
        </Button>
      )}

      {user && (user.role === UsersRole.ADMIN || currentChat) && (
        <Box
          display="flex"
          gap={2}
        >
          {/* SIDEBAR */}
          <Paper sx={{ width: 250, p: 1, height: "70vh", overflowY: "auto" }}>
            {user.role === UsersRole.USER && currentChat && (
              <>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, justifyContent: "center" }}
                >
                  Finish Conversation
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mb: 1 }}
                  onClick={() => {
                    if (currentChat) {
                      socket.emit("closeChat", currentChat.id);
                      setCurrentChat(null);
                      setMessages([]);
                    }
                  }}
                >
                  Close Chat
                </Button>
              </>
            )}
            {user.role === UsersRole.ADMIN && (
              <Typography
                variant="h6"
                sx={{ mb: 1 }}
              >
                Open Chats
              </Typography>
            )}
            {user?.role === UsersRole.ADMIN &&
              openChats.map((chat) => (
                <>
                  <Box
                    key={chat.id}
                    sx={{
                      p: 1,
                      mb: 1,
                      bgcolor:
                        chat.id === currentChat?.id
                          ? "primary.light"
                          : "grey.200",
                      cursor: "pointer",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onClick={() => joinChat(chat)}
                  >
                    <Typography>{chat.user.userName}</Typography>
                    <IconButton
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation(); // עוצר את ההפצה ל-Box
                        socket.emit("closeChat", chat.id);
                      }}
                    >
                      <CancelOutlinedIcon />
                    </IconButton>
                  </Box>
                </>
              ))}
          </Paper>

          {/* MAIN CHAT */}
          <Paper
            sx={{
              flex: 1,
              p: 2,
              height: "70vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
              {messages.map((msg, index) => {
                const prevMsg = messages[index - 1];
                const currentLabel = getDateLabel(msg.timestamp);
                const prevLabel = prevMsg
                  ? getDateLabel(prevMsg.timestamp)
                  : null;

                const showDateLabel = currentLabel !== prevLabel;

                return (
                  <div key={msg.id}>
                    {showDateLabel && (
                      <Typography
                        sx={{
                          textAlign: "center",
                          color: "gray",
                          fontSize: "0.9rem",
                          my: 1,
                        }}
                      >
                        {currentLabel}
                      </Typography>
                    )}

                    <ChatBubble
                      avatarUrl={msg.sender.profile || ""}
                      name={msg.sender.userName}
                      text={msg.text}
                      timestamp={new Date(msg.timestamp).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                      isOwn={msg.sender.userId === user.id}
                    />
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </Box>

            <Box
              display="flex"
              gap={1}
            >
              <TextField
                fullWidth
                label="Message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
}
