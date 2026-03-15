import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  Sidebar,
  ConversationList,
  Conversation,
  Avatar,
  ChatContainer,
  ConversationHeader,
  MessageList,
  Message,
  MessageInput,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import useAuth from "./Hooks/useAuth";
import { ExpansionPanel } from "@chatscope/chat-ui-kit-react";

const Chat = ({ onNewMessage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const { auth } = useAuth();


  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/chat/sessions/${auth.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, [auth.accessToken, auth.id]);

  useEffect(() => {
    if (selectedSession) {
      const q = query(
        collection(db, "chatMessages"),
        where("sessionId", "==", selectedSession.id)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort in memory bypassing the need for a composite index
        firestoreMessages.sort((a, b) => a.timestamp - b.timestamp);

        setMessages(firestoreMessages);

        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const addedMsg = change.doc.data();
            if (onNewMessage && addedMsg.senderId !== auth.id) {
              onNewMessage(addedMsg);
            }
          }
        });
      });

      return () => unsubscribe();
    }
  }, [selectedSession, onNewMessage, auth.id]);

  const sendMessage = async () => {
    try {
      if (!newMessage.trim()) return;

      const payload = {
        sessionId: selectedSession.id,
        senderId: auth.id,
        message: newMessage,
        timestamp: Date.now(),
      };

      await addDoc(collection(db, "chatMessages"), payload);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message to Firestore:", error);
    }
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };

  return (
    <MainContainer responsive style={{ height: "600px" }}>
      <Sidebar position="left">
        {/* <Search placeholder="Search..." /> */}
        {sessions.length > 0 ? (
          <ConversationList>
            {sessions.map((session) => {
              const otherUser =
                session.user.id === auth.id ? session.staff : session.user;
              return (
                <Conversation
                  key={session.id}
                  name={`${otherUser.name}`}
                  info={session.product.name}
                  onClick={() => handleSessionClick(session)}
                >
                  <Avatar
                    name={otherUser.firstName}
                    src={otherUser.avatarUrl}
                    status="available"
                  />
                </Conversation>
              );
            })}
          </ConversationList>
        ) : (
          <div style={{ padding: "20px", textAlign: "center" }}>
            No chat sessions available.
          </div>
        )}
      </Sidebar>

      {selectedSession ? (
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar
              name={
                selectedSession.user.id === auth.id
                  ? `${selectedSession.staff.name} `
                  : `${selectedSession.user.name} `
              }
              src={
                selectedSession.user.id === auth.id
                  ? selectedSession.staff.avatarUrl
                  : selectedSession.user.avatarUrl
              }
            />
            <ConversationHeader.Content
              userName={
                selectedSession.user.id === auth.id
                  ? `${selectedSession.staff.name} `
                  : `${selectedSession.user.name} `
              }
            />
            <ConversationHeader.Actions>
              {/* Add any actions like call buttons if needed */}
            </ConversationHeader.Actions>
          </ConversationHeader>

          <MessageList>
            <MessageSeparator />
            {messages.map((msg) => (
              <Message
                key={msg.id}
                model={{
                  direction: msg.senderId === auth.id ? "outgoing" : "incoming",
                  message: msg.message,
                  position: "single",
                  sender: msg.senderId,
                  sentTime: msg.timestamp,
                }}
              >
                <Avatar name="User" src={auth.avatarUrl} />
              </Message>
            ))}
          </MessageList>

          <MessageInput
            attachDisabled
            value={newMessage}
            onChange={(e) => setNewMessage(e)}
            onSend={sendMessage}
            placeholder="Type a message..."
          />
        </ChatContainer>
      ) : (
        <div style={{ padding: "20px", textAlign: "center" }}>
          Please select a chat session
        </div>
      )}

      {selectedSession && (
        <Sidebar position="right">
          <ExpansionPanel open title="INFO">
            <p>
              <strong>Pruduct Name:</strong> {selectedSession.product.name}
            </p>
            <p>
              <strong>Brand:</strong> {selectedSession.product.category}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedSession.product.description}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedSession.product.status ? "Available" : "Not Available"}
            </p>
            <p>
              <strong>Price:</strong>{" "}
              {selectedSession.product.price
                ? `${selectedSession.product.price}đ`
                : "N/A"}
            </p>
            <p>
              <strong>Created Date:</strong>{" "}
              {new Date(selectedSession.product.createdDate).toLocaleString()}
            </p>
            <img
              src={selectedSession.product.imageUrl[0]}
              alt={selectedSession.product.name}
              style={{ width: "60%", height: "auto" }}
            />
          </ExpansionPanel>
        </Sidebar>
      )}
    </MainContainer>
  );
};

export default Chat;
