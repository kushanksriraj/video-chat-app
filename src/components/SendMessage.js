import React, { useState } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const SendMessage = () => {
  const [inputMessage, setMessage] = useState("");

  const sendMessage = async (event) => {
    event.preventDefault();
    const message = event.target.elements.messageInput.value;
    setMessage("");
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    await addDoc(collection(db, "messages"), {
      text: message,
      name: displayName || "User",
      avatar: photoURL || "https://video-chat-11.vercel.app/girl-avatar.avif",
      createdAt: serverTimestamp(),
      uid
    });
  };
  return (
    <form onSubmit={(event) => sendMessage(event)} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="type message..."
        value={inputMessage}
        onChange={(e) => setMessage(e.target.value)}
        autoComplete="off"
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessage;
