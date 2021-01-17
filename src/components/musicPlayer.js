import React from "react";

const MusicPlayer = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginRight: "12px",
      }}
    >
      <audio controls autoPlay loop>
        <source src="instrumental.mp3" type="audio/mpeg"></source>
        <source src="../instrumental.mp3" type="audio/mpeg"></source>
      </audio>
    </div>
  );
};

export default MusicPlayer;
