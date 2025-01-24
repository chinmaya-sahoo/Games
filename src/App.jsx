import { useState, useEffect } from 'react';
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
  const [currentBulletIndex, setCurrentBulletIndex] = useState(0); // Tracks the current bullet being fired
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAllowed, setIsAllowed] = useState(true);
  const [cigarCount, setCigarCount] = useState(0);
  const [magnifyCount, setMagnifyCount] = useState(0);
  const [isHealable, setIsHealable] = useState(true);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  // Dealer's Move starts
  useEffect(() => {
    console.log('Player Turn:', playerTurn);
    if (!playerTurn && currentBulletIndex < bullets.length) {
      dealersMove();
    }
  }, [playerTurn, currentBulletIndex]); // Trigger dealersMove when playerTurn changes

  // Winner tracker
  useEffect(() => {
    if (!isGameOver) {
      if (playerHealth <= 0) {
        setIsPlaying(false);
        setIsGameOver(true);
        alert("Game Over: Dealer Wins");
      } else if (dealerHealth <= 0) {
        setIsPlaying(false);
        setIsGameOver(true);
        alert("Game Over: Player Wins");
      }
    }
  }, [playerHealth, dealerHealth, isGameOver]);

  const dealersMove = () => {
    if (dealerHealth > 0) {
      const randomDecision = Math.random(); // Generate a random value between 0 and 1
      if (randomDecision < 0.5) {
        // 50% chance of shooting the player
        setTimeout(() => handleDealerShootPlayer(), 3000); // Dealer shoots player
      } else {
        // 50% chance of shooting themselves
        setTimeout(() => handleDealerShootSelf(), 3000); // Dealer shoots themselves
      }

    }
  };

  const handleDealerShootPlayer = () => {
    if (isPlaying && currentBulletIndex < bullets.length) {
      console.log('Dealer shoots player');
      const currentBullet = bullets[currentBulletIndex];
      if (currentBullet === 'live') {
        setPlayerHealth((prev) => Math.max(prev - 1, 0)); // Player loses health
        setLiveBullet((prev) => prev - 1);
      } else {
        setBlankBullet((prev) => prev - 1);
      }
      setPlayerTurn(true); // Player gets the next turn
      setTotalBullet((prev) => prev - 1);
      setCurrentBulletIndex((prev) => prev + 1);
    }
  };

  const handleDealerShootSelf = () => {
    if (isPlaying && currentBulletIndex < bullets.length) {
      console.log('Dealer shoots himself');
      const currentBullet = bullets[currentBulletIndex];
      if (currentBullet === 'live') {
        setDealerHealth((prev) => Math.max(prev - 1, 0)); // Dealer loses health
        setLiveBullet((prev) => prev - 1);
        setPlayerTurn(true); // Player gets the next turn
      } else {
        setBlankBullet((prev) => prev - 1);
        setPlayerTurn(false); // Dealer gets the next turn
      }
      setTotalBullet((prev) => prev - 1);
      setCurrentBulletIndex((prev) => prev + 1);
    }
  };

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

  const reload = () => {
    setTimeout(() => {
      const liveCount = genRandomNumber();
      const blankCount = genRandomNumber();
      const shuffledBullets = shuffleBullets(liveCount, blankCount);

      setLiveBullet(liveCount);
      setBlankBullet(blankCount);
      setTotalBullet(liveCount + blankCount);
      setBullets(shuffledBullets);
      setCurrentBulletIndex(0);

      console.log('Bullets reloaded:', shuffledBullets);
      setPlayerTurn(true);
    }, 1000); // Delay of 1000ms
  };

  useEffect(() => {
    if (currentBulletIndex >= bullets.length && bullets.length > 0) {
      console.log('All bullets used. Reloading...');
      reload();
    }
  }, [currentBulletIndex, bullets.length]);

  const handelStart = () => {
    setIsPlaying(true);
    reload(); // Call the reload function to handle bullet setup
    setPlayerTurn(true); // Reset to player's turn at the start
    setIsAllowed(true); // Allow player to start
    console.log('Game started.');
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

  const handelReplay = () => {
    setPlayerHealth(4);
    setDealerHealth(4);
    setIsGameOver(false);
    setIsPlaying(true);
    setIsAllowed(true);
    setPlayerTurn(true);
    setCurrentBulletIndex(0);
  
    // Generate new bullets and reset bullet states
    const liveCount = genRandomNumber();
    const blankCount = genRandomNumber();
    const shuffledBullets = shuffleBullets(liveCount, blankCount);
  
    setLiveBullet(liveCount);
    setBlankBullet(blankCount);
    setTotalBullet(liveCount + blankCount);
    setBullets(shuffledBullets);
  
    console.log('Game restarted. Welcome Again', shuffledBullets);
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
      <button className='bg-green-700 py-1 px-3 rounded-md' onClick={handelStart}>
        Start
      </button>
      {playerName && <h1>Welcome {playerName}</h1>}
      {/* health */}
      <div className='flex justify-between'>
        <div className='flex flex-col items-center gap-2 w-15 h-15 m-2 bg-green-500 p-4'>
          <h1>Your Health: {playerHealth}</h1>
          <div className="flex justify-between mt-3 gap-4">
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

        <div className='flex flex-col justify-center mt-5 gap-2 h-20 py-1 px-3 rounded-md bg-red-500'>
          <h1>Dealer's Health: {dealerHealth}</h1>
        </div>
      </div>

      {/* Bullets Info */}
      <div className='mt-4'>
        <h1>Remaining Bullets: {bullets.length - currentBulletIndex}</h1>
        <h2>Next Bullet: {bullets[currentBulletIndex] || 'None'}</h2>
      </div>
      {/* Replay Option */}
      {isGameOver && <button className='bg-blue-700 py-1 px-3 rounded-md' onClick={handelReplay}>Replay</button>}
    </div>
  );
}

export default App;
