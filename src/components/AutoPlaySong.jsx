import { useEffect, useRef } from "react";

const AutoPlaySong = ({ src }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const playAudio = async () => {
      try {
        await audioRef.current.play();
      } catch (err) {
        console.log("Autoplay failed: User interaction required", err);
      }
    };
    playAudio();
  }, []);

  return (
    <audio ref={audioRef} src={src} autoPlay loop controls />
  );
};

export default AutoPlaySong;