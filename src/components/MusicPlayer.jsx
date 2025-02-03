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
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-transparent z-10 absolute top-5 left-5">
  <button
    onClick={togglePlayPause}
    className="w-12 h-12 bg-black text-white rounded-full shadow-lg flex items-center justify-center focus:outline-none"
  >
    {isSong ? <Pause size={32} /> : <CirclePlay size={32} />}
  </button>
</div>

  );
}
