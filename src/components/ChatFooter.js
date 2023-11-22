import { MicRounded, Send } from "@mui/icons-material";

export default function ChatFooter() {
  const CanRecord = true;
  const recordIcons = (
    <>
      <Send className="m-1" />
      <MicRounded />
    </>
  );
  return (
    <form className="flex gap-1 h-10">
      <input
        className="rounded-lg flex-grow p-2"
        placeholder="Type your message..."
      />
      {CanRecord ? (
        <button type="submit" className=" text-white ">
          {recordIcons}
        </button>
      ) : (
        <>
          <label htmlFor="capture" className=" text-white cursor-pointer">
            {recordIcons}
          </label>
          <input
            className="hidden"
            type="file"
            id="capture"
            accept="audio/*"
            capture
          />
        </>
      )}
    </form>
  );
}
