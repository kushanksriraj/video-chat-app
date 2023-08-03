import "./styles.css";
import { createLocalVideoTrack, connect as twillioConnect } from "twilio-video";
import { useEffect } from "react";

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
        joinLeaveButton.innerHTML = "Join Video Call";
        joinLeaveButton.disabled = false;
      }
    } else {
      disconnect();
    }
  };

  const connect = async (identity) => {
    const response = await fetch(
      "https://twillio.kushanksriraj.repl.co/token",
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
    joinLeaveButton.innerHTML = "Leave Video Call";
    joinLeaveButton.disabled = false;
  };

  const disconnect = () => {
    room.disconnect();
    connected = false;
    remoteParticipant.lastElementChild.remove();
    joinLeaveButton.innerHTML = "Join Video Call";
  };

  const participantConnected = (participant) => {
    const tracksDiv = document.createElement("div");
    tracksDiv.setAttribute("id", participant.sid);
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

  return (
    <div className="App">
      <div id="participants">
        <div id="localParticipant" className="participant">
          <div className="identity" id="localIdentity"></div>
        </div>
        <div id="remoteParticipant" className="participant">
          <div className="identity" id="remoteIdentity"></div>
        </div>
      </div>
      <form id="login">
        <button id="joinOrLeave">Join Video Call</button>
      </form>
      <iframe
        title="chat-app"
        src="https://react-chat-ru.vercel.app/"
        sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation"
      />
    </div>
  );
}
