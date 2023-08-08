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

import NavBar from "./NavBar";

import styled from "styled-components";

const Wrapper = styled.main`
  bottom: 0;
  width: 100%;
  height: 25vh;
  color: #4c768d;
  overflow-y: scroll;
  position: absolute;
  background: transparent;
`;

const MessageWrapper = styled.div`
  padding: 12px;
  padding-bottom: 0;
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
      <MessageWrapper>
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div id="in-view-div"> </div>
      </MessageWrapper>
    </Wrapper>
  );
};

export default ChatBox;
