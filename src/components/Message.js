import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const API = 'https://eca0e270-0495-4096-890e-b1886c36824e-00-1b9aao43odhlm.asia-b.replit.dev'

const translate = async (text = "", to = "ru") => {
  return fetch(`${API}/v2/translate`, {
    method: "post",
    body: JSON.stringify({
      text,
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
    if (user.email === "kushanksriraj@gmail.com") {
      translate(text, "en").then((data) =>
        setTranslatedText(data.translatedText)
      );
    } else {
      translate(text, "ru").then((data) =>
        setTranslatedText(data.translatedText)
      );
    }
  }, [text, user.email]);

  const firstName = message.name.split(" ")[0];

  return (
    <div className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
      <div className="chat-bubble__right">
        <p className="user-message">
          <span
            className={`user-name ${
              message.uid === user.uid ? "blue" : "pink"
            }`}
          >
            {firstName}:
          </span>
          {text}
        </p>
        <p className="user-message translated">{translatedText}</p>
      </div>
    </div>
  );
};

export default Message;
