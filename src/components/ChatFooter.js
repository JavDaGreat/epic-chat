import { db } from "@/app/firebase";
import recordAudio from "@/app/recordAudio";
import {
  CancelRounded,
  CheckCircleRounded,
  MicRounded,
  Send,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import {
  setDoc,
  addDoc,
  serverTimestamp,
  collection,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";

export default function ChatFooter({
  input,
  onChange,
  file,
  user,
  room,
  roomId,
  sendMessage,
  setAudioId,
}) {
  const [isRecording, setRecording] = useState(false);
  const [duration, setDuration] = useState("00:00");

  const record = useRef();
  const timerInterval = useRef();
  const storage = getStorage();

  useEffect(() => {
    if (isRecording) {
      record.current.start();
      startTimer();
    }

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function startTimer() {
      const start = Date.now();
      timerInterval.current = setInterval(setTime, 100);

      function setTime() {
        const timeElapsed = Date.now() - start;
        const totalSeconds = Math.floor(timeElapsed / 1000);
        const minutes = pad(Math.floor(totalSeconds / 60));
        const seconds = pad(totalSeconds % 60);
        const formattedDuration = `${minutes}:${seconds}`;
        setDuration(formattedDuration);
      }
    }
  }, [isRecording]);

  async function startRecording(e) {
    e.preventDefault();
    record.current = await recordAudio();
    setRecording(true);
    setAudioId("");
  }

  async function stopRecording() {
    clearInterval(timerInterval.current);
    setRecording(false);
    const audio = await record.current.stop();
    setDuration("00:00");
    return audio;
  }

  async function finishRecording() {
    const audio = await stopRecording();
    const { audioFile, audioName } = await audio;
    sendAudio(audioFile, audioName);
  }
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  async function sendAudio(audioFile, audioName) {
    await setDoc(doc(db, `users/${user.id}/chats/${roomId}`), {
      name: room.name,
      photoURL: room.photoURL,
      timestamp: serverTimestamp(),
    });

    const newDocRef = await addDoc(collection(db, `rooms/${roomId}/messages`), {
      name: user.displayName,
      uid: user.uid,
      timeStamp: serverTimestamp(),
      time: new Date().toLocaleString("en-GB", options),
      audioUrl: "uploading",
      audioName,
    });

    if (audioFile) {
      await uploadBytes(ref(storage, `audio/${audioName}`), audioFile);

      const url = await getDownloadURL(ref(storage, `audio/${audioName}`));

      await updateDoc(newDocRef, { audioUrl: url });
      console.log("Document updated with audio URL", url);
    }
  }

  function audioInputChange(e) {
    const audioFile = e.target.files[0];
    const audioName = nanoid();
    if (audioFile) {
      setAudioId("");
      sendAudio(audioFile, audioName);
    }
  }

  const canRecord =
    !!navigator.mediaDevices.getUserMedia && !!Window.MediaRecorder;
  const canSendMessage = input.trim() || (input === "" && file);
  const Icons = (
    <div className="flex items-center justify-center m-1 bg-green-600 rounded-full text-white w-8 h-8 ">
      <button onClick={canSendMessage ? sendMessage : startRecording}>
        {" "}
        {input || file ? (
          <Send fontSize="small" />
        ) : (
          <>
            <MicRounded />
            <input
              className=" hidden "
              type="file"
              id="capture"
              accept="audio/*"
              capture
              onChange={audioInputChange}
            />
          </>
        )}
      </button>
    </div>
  );

  const RecordIcons = (
    <div className="flex items-center ">
      <CancelRounded onClick={stopRecording} color="#f20519" />
      <div className="h-2 w-2 bg-red-700 rounded-full animate-blink mx-2"></div>
      <div>{duration}</div>
      <CheckCircleRounded color="success" onClick={finishRecording} />
    </div>
  );

  return (
    <div className="w-full">
      <form className="flex items-center w-full justify-center gap-1 ">
        <input
          value={input}
          onChange={onChange}
          className=" flex-grow p-2 rounded-lg max-w-[80%] md:w-full "
          placeholder="Type your message..."
        />
        {isRecording ? RecordIcons : Icons}
      </form>
    </div>
  );
}
