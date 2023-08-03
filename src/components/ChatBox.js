import React, { useEffect, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit
} from "firebase/firestore";
import { db } from "../firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";
import NavBar from "./NavBar";

import styled from "styled-components";

const Wrapper = styled.main`
  height: 60vh;
  color: #4c768d;
  overflow-y: scroll;
  background-color: #1c2c4c;
`;

const ChatBox = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe;
  }, []);

  useEffect(() => {
    document
      .getElementById("in-view-div")
      .scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Wrapper>
      <NavBar />
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <div id="in-view-div"> </div>
      <SendMessage />
    </Wrapper>
  );
};

export default ChatBox;
