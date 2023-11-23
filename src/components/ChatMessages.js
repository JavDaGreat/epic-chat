export default function ChatMessages({ messages, user, roomId }) {
  if (!messages) return null;

  return messages.map((message) => {
    const isSender = message.uid === user.uid;
    console.log(message.message);

    return (
      <div
        key={`${message.uid}.${message.name}.${message.time}${message.id}`}
        className={`${
          isSender
            ? "bg-white text-black rounded-lg p-2 self-end"
            : "bg-blue-800 text-white rounded-lg p-2 self-start"
        }`}
        style={{ maxWidth: "70%", wordBreak: "break-word" }}>
        <div className="flex flex-col">
          {!isSender && (
            <span className="text-xs font-semibold mb-1">{message.name}</span>
          )}

          {message.fileURL === "uploading" ? (
            <div>
              <CircularPrgress />
            </div>
          ) : message.fileURL ? (
            <div>
              <img src={message.fileURL} alt={message.name} />
              <span>{message.message}</span>
            </div>
          ) : (
            <span>{message.message}</span>
          )}

          <span className="text-xs self-end mt-1">{message.time}</span>
        </div>
      </div>
    );
  });
}
