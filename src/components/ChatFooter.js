import recordAudio from "@/app/recordAudio";
import {
  CancelRounded,
  CheckCircleRounded,
  MicRounded,
  Send,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

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

  function stopRecording() {
    clearInterval(timerInterval.current);
    setRecording(false);
    record.current.stop();
    setDuration("00:00");
  }

  const canRecord =
    !!navigator.mediaDevices.getUserMedia && !!Window.MediaRecorder;
  const canSendMessage = input.trim() || (input === "" && file);
  const Icons = (
    <div className="flex items-center justify-center m-1 bg-green-600 rounded-full text-white w-8 h-8 ">
      <button onClick={canSendMessage ? sendMessage : startRecording}>
        {" "}
        {input ? (
          <Send fontSize="small" />
        ) : (
          <>
            <MicRounded />{" "}
            <input
              className=" hidden "
              type="file"
              id="capture"
              accept="audio/*"
              capture
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
      <CheckCircleRounded color="success" />
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
