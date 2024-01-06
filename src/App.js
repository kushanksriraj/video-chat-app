import "./styles.css";
import { useEffect } from "react";
import { auth } from "./firebase";
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import { useAuthState } from "react-firebase-hooks/auth";
import { createLocalVideoTrack, connect as twillioConnect } from "twilio-video";
import SendMessage from "./components/SendMessage";

import styled from "styled-components";

const TWILLIO_API = 'https://f40a022f-4750-4573-8dbc-8b48888f4b55-00-d762gz67likb.asia-a.replit.dev'

const Wrapper = styled.div`
  text-align: center;
  position: relative;
`;

const ParticipantsContainer = styled.div`
  top: 0;
  width: 100%;
  z-index: 50;
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 500px) {
    flex-direction: column;
  }
`;

const Participant = styled.div`
  width: 25vw;
  overflow: hidden;
  margin: 0.625rem;
  position: relative;
  border-radius: 0.625rem;
  background-color: black;

  @media only screen and (max-width: 500px) {
    width: 100vw;
    height: 65vw;
    margin: 0 auto;
    border-radius: 0;
  }
`;

const Form = styled.form`
  right: 0;
  bottom: 0;
  z-index: 5;
  display: flex;
  flex-wrap: wrap;
  padding: 1rem 5rem;
  position: absolute;
  justify-content: center;

  @media only screen and (max-width: 500px) {
    padding: 1rem;
    padding-top: 12px;
    padding-bottom: 0;
  }
`;

const Button = styled.button`
  width: 10rem;
  height: 4rem;
  border: none;
  font-size: 1rem;
  color: rgb(255, 255, 255);
  background: rgb(247, 120, 184);
  transition: background-color 0.3s ease;
  :hover {
    background: rgb(184, 77, 132);
  }
  :active {
    background: rgb(184, 77, 132);
  }

  @media only screen and (max-width: 500px) {
    height: 32px;
    padding: 0 12px;
    font-size: 14px;
    border-radius: 5px;
    width: max-content;
    background: rgb(247, 120, 184);
  }
`;

const Spacer = styled.div`
  width: 100%;
  height: 8px;
  background-color: black;
`;

const init = () => {
  const localParticipant = document.getElementById("localParticipant");
  const remoteParticipant = document.getElementById("remoteParticipant");
  const login = document.getElementById("login");
  const joinLeaveButton = document.getElementById("joinOrLeave");

  let connected = false;
  let room;

  const addLocalVideo = async () => {
    const videoTrack = await createLocalVideoTrack();
    const trackElement = videoTrack.attach();
    localParticipant.appendChild(trackElement);
  };

  const connectOrDisconnect = async (event) => {
    event.preventDefault();
    if (!connected) {
      const identity = Date.now().toString();
      joinLeaveButton.disabled = true;
      joinLeaveButton.innerHTML = "Connecting...";

      try {
        await connect(identity);
      } catch (error) {
        console.log(error);
        alert("Failed to connect to video room.");
        joinLeaveButton.innerHTML = "Join Call";
        joinLeaveButton.disabled = false;
      }
    } else {
      disconnect();
    }
  };

  const connect = async (identity) => {
    const response = await fetch(
      `${TWILLIO_API}/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          identity: identity,
          room: "My Video Room"
        })
      }
    );

    const data = await response.json();
    room = await twillioConnect(data.token);
    room.participants.forEach(participantConnected);
    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    connected = true;
    joinLeaveButton.innerHTML = "Leave Call";
    joinLeaveButton.disabled = false;
  };

  const disconnect = () => {
    room.disconnect();
    connected = false;
    joinLeaveButton.innerHTML = "Join Call";
  };

  const participantConnected = (participant) => {
    const tracksDiv = document.createElement("div");
    tracksDiv.setAttribute("id", participant.sid);
    tracksDiv.setAttribute("class", 'remote-video-container');
    remoteParticipant.appendChild(tracksDiv);
    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed) {
        trackSubscribed(tracksDiv, publication.track);
      }
    });

    participant.on("trackSubscribed", (track) =>
      trackSubscribed(tracksDiv, track)
    );
    participant.on("trackUnsubscribed", trackUnsubscribed);
  };

  const participantDisconnected = (participant) => {
    document.getElementById(participant.sid).remove();
  };

  const trackSubscribed = (div, track) => {
    const trackElement = track.attach();
    div.appendChild(trackElement);
  };

  const trackUnsubscribed = (track) => {
    track.detach().forEach((element) => {
      element.remove();
    });
  };

  login.addEventListener("submit", connectOrDisconnect);
  addLocalVideo();
};

export default function App() {
  useEffect(() => {
    init();
  }, []);

  const [user] = useAuthState(auth);

  const renderChat = () => {
    if (user) {
      return (
        <>
          <ChatBox />
          <Spacer />
          <SendMessage />
        </>
      );
    }
    return <Welcome />;
  };

  return (
    <Wrapper className="App">
      <ParticipantsContainer id="participants">
        <Participant id="localParticipant" className="participant">
          <div className="identity" id="localIdentity"></div>
        </Participant>
        <Participant id="remoteParticipant" className="participant">
          <Form id="login">
            <Button id="joinOrLeave">Join Call</Button>
          </Form>
        </Participant>
      </ParticipantsContainer>
      {renderChat()}
    </Wrapper>
  );
}
