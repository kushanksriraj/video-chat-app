import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const translate = async (text = "", from = "en", to = "ru") => {
  return fetch("https://translater.kushanksriraj.repl.co/translate", {
    method: "post",
    body: JSON.stringify({
      text,
      lang: from,
      target_lang: to
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

const Message = ({ message }) => {
  const [user] = useAuthState(auth);
  const { text } = message;

  const [translatedText, setTranslatedText] = React.useState(text);

  React.useEffect(() => {
    translate(text, "en", "ru").then((data) =>
      setTranslatedText(data.translatedText)
    );
  }, [text]);

  return (
    <div className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">{message.name}</p>
        <p className="user-message">{text}</p>
        <p className="user-message">{translatedText}</p>
      </div>
    </div>
  );
};

export default Message;
