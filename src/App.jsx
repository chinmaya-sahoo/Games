import { useState ,useEffect} from 'react';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [playerHealth, setPlayerHealth] = useState(4);
  const [dealerHealth, setDealerHealth] = useState(4);
  const [isLive, setIsLive] = useState(true);
  const [isBlank, setIsBlank] = useState(true);
  const [liveBullet, setLiveBullet] = useState(4);
  const [blankBullet, setBlankBullet] = useState(4);
  const [totalBullet, setTotalBullet] = useState(8);
  const [bullets, setBullets] = useState([]); // Array to store the bullet sequence
  const [currentBulletIndex, setCurrentBulletIndex] = useState(0);// Tracks the current bullet being fired
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAllowed, setIsAllowed] = useState(true);
  const [cigarCount, setCigarCount] = useState(0);
  const [magnifyCount, setMagnifyCount] = useState(0);
  const [isHealable, setIsHealable] = useState(true);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  /*
lunch page ->
states(health ,live , blank ,isPlaying , total , isAllowed , cigarCount , magnifyCount , isHealable , playerTurn , isGameOver , playerName)
*/

 //Dealer's Move starts
  useEffect(() => {
    if (!playerTurn) {
      dealersMove();
    }
  }, [playerTurn]); // Trigger dealersMove when playerTurn changes

  const dealersMove = () => {
    const randomDecision = Math.random(); // Generate a random value between 0 and 1
    if (randomDecision < 0.5) {
      // 50% chance of shooting themselves
      handelPlayerShoot(); // Dealer shoots you
      console.log("dealer chose to shoot you")
    } else {
      // 50% chance of shooting the player
      setTimeout(() => handelOwnShoot(), 3000); // Call player's self-shoot function
      console.log("dealer chose to shoot him")
    }
  };

  const handelPlayerShoot = () => {
    // Dealer shoots themselves
    if (isPlaying && currentBulletIndex < bullets.length) {
      const currentBullet = bullets[currentBulletIndex];
      if (currentBullet === 'live') {
        setPlayerHealth((prev) => Math.max(prev - 1, 0)); // Player loses health
        setLiveBullet((prev) => prev - 1);
      } else {
        setBlankBullet((prev) => prev - 1);
      }
      setTotalBullet((prev) => prev - 1);
      setCurrentBulletIndex((prev) => prev + 1);
      setPlayerTurn(true); // Switch turn back to the player
    }
  };
  
  const handelOwnShoot = () => {
    // Dealer shoots the player
    if (isPlaying && currentBulletIndex < bullets.length) {
      const currentBullet = bullets[currentBulletIndex];
      if (currentBullet === 'live') {
        setDealerHealth((prev) => Math.max(prev - 1, 0)); // Dealer loses health
        setLiveBullet((prev) => prev - 1);
        setPlayerTurn(true); // Switch turn back to the player
      } else {
        setBlankBullet((prev) => prev - 1);
        setTimeout(() => dealersMove(), 3000);  // hold the turn from the player
      }
      setTotalBullet((prev) => prev - 1);
      setCurrentBulletIndex((prev) => prev + 1);
    }
  };
  
 //Dealer's Move ends
  const genRandomNumber = () => {
    return Math.floor(Math.random() * 4) + 1;
  };

  const shuffleBullets = (liveCount, blankCount) => {
    const bulletArray = [];
    for (let i = 0; i < liveCount; i++) bulletArray.push('live');
    for (let i = 0; i < blankCount; i++) bulletArray.push('blank');

    // Fisher-Yates Shuffle
    for (let i = bulletArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bulletArray[i], bulletArray[j]] = [bulletArray[j], bulletArray[i]];
    }
    return bulletArray;
  };

  const handelStart = () => {
    setIsPlaying(true);
    //bulletes arranging starts
    const liveCount = genRandomNumber();
    const blankCount = genRandomNumber();
    const shuffledBullets = shuffleBullets(liveCount, blankCount);
    setLiveBullet(liveCount);
    setBlankBullet(blankCount);
    setTotalBullet(liveCount + blankCount);
    setBullets(shuffledBullets);
    setCurrentBulletIndex(0);
    //bulletes arranging ends
    setPlayerTurn(true); // Reset to player's turn at the start
    setIsAllowed(true); // Allow player to start
    console.log('Game started with bullets:', shuffledBullets);
  };

  const handelSelfShoot = () => {
    if (isPlaying && isAllowed && currentBulletIndex < bullets.length) {
      setIsAllowed(false);
      const currentBullet = bullets[currentBulletIndex];
      if (currentBullet === 'live') {
        setPlayerHealth((prev) => Math.max(prev - 1, 0));
        setLiveBullet((prev) => prev - 1);
        setPlayerTurn(false);
      } else {
        setBlankBullet((prev) => prev - 1);
      }
      setTotalBullet((prev) => prev - 1);
      setCurrentBulletIndex((prev) => prev + 1);
      // setPlayerTurn(false);

      setTimeout(() => {
        setIsAllowed(true);
      }, 1000);
    }
  };

  const handelDealerShoot = () => {
    if (isPlaying && isAllowed && currentBulletIndex < bullets.length) {
      setIsAllowed(false);
      const currentBullet = bullets[currentBulletIndex];
      if (currentBullet === 'live') {
        setDealerHealth((prev) => Math.max(prev - 1, 0));
        setLiveBullet((prev) => prev - 1);
      } else {
        setBlankBullet((prev) => prev - 1);
      }
      setTotalBullet((prev) => prev - 1);
      setCurrentBulletIndex((prev) => prev + 1);
      setPlayerTurn(false);

      setTimeout(() => {
        setIsAllowed(true);
      }, 1000);
    }
  };

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center gap-2 bg-gray-500'>
      {/* username */}
      <input
        type='text'
        placeholder='Your Name'
        className='bg-gray-600 text-white'
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button className='bg-green-700 w-8' onClick={handelStart}>
        Start
      </button>
      {playerName && <h1>Welcome {playerName}</h1>}
      {/* health */}
      {/* set shooting */}
      <div className='flex justify-between'>
        <div className='flex flex-col gap-2 w-15 h-15 m-2 bg-green-500 p-4'>
          <h1>Your Health: {playerHealth}</h1>
          <div className="flex justify-between gap-4">
            <button
              className={`cursor-pointer rounded-lg bg-purple-700 p-2 ${playerTurn && isAllowed ? '' : 'opacity-50'}`}
              onClick={handelSelfShoot}
              disabled={!playerTurn || !isAllowed}
            >
              Shoot-Self
            </button>
            <button
              className={`cursor-pointer rounded-lg bg-purple-700 p-2 ${playerTurn && isAllowed ? '' : 'opacity-50'}`}
              onClick={handelDealerShoot}
              disabled={!playerTurn || !isAllowed}
            >
              Shoot-Dealer
            </button>

          </div>
        </div>

        <div className='flex flex-col mt-5 gap-2 w-20 h-20 m-2 bg-red-500'>
          <h1>Dealer's Health: {dealerHealth}</h1>
        </div>
      </div>

      {/* Bullets Info */}
      <div className='mt-4'>
        <h1>Remaining Bullets: {bullets.length - currentBulletIndex}</h1>
        <h2>Next Bullet: {bullets[currentBulletIndex] || 'None'}</h2>
      </div>
    </div>
  );
}

export default App;
