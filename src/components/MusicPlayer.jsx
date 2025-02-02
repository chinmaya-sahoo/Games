import { useState, useRef } from "react";
import { CirclePlay, Pause } from "lucide-react";


export default function MusicPlayer() {
  // const [isPlaying, setIsPlaying] = useState(false);
  const [isSong, setIsSong] = useState(false);
  const audioRef = useRef(new Audio("/02. Surrounded.mp3"));

  const togglePlayPause = () => {
    if (isSong) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsSong(!isSong);
  };

  return (
    <div className="flex items-center justify-center rounded-[50%] bg-transparent z-10 absolute top-5 left-5">
      <button
        onClick={togglePlayPause}
        className="p-4 bg-black text-white rounded-full shadow-lg focus:outline-none"
      >
        {isSong ? <Pause size={32} /> : <CirclePlay size={32} />}
      </button>
    </div>
  );
}
