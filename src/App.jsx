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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAllowed, setIsAllowed] = useState(true);
  const [cigarCount, setCigarCount] = useState(0);
  const [magnifyCount, setMagnifyCount] = useState(0);
  const [isHealable, setIsHealable] = useState(true);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [doubleDamage, setDoubleDamage] = useState(false); // State for 2X damage
  // const [dealerItem, setDealerItem] = useState({
  //   cigar: 0,
  //   pill: 0,
  //   knife: 0,
  //   magnify: 0
  // });
  const [playerItem, setPlayerItem] = useState({
    cigar: 0,
    pill: 0,
    knife: 0,
    magnify: 0
  });

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
  // Dealer's Move starts
  useEffect(() => {
    console.log('Player Turn:', playerTurn);
    if (!playerTurn && currentBulletIndex < bullets.length) {
      dealersMove();
    }
  }, [playerTurn, currentBulletIndex]); // Trigger dealersMove when playerTurn changes

  // dealer's move predictor
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

  // dealer's move ends
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

  // starts ,Replay and reload section starts 
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
      assignRandomItems(); // Assign random items to player

      console.log('Bullets reloaded:', shuffledBullets);
      setPlayerTurn(true);

    }, 1000); // Delay of 1000ms
  };

  const handelStart = () => {
    setIsPlaying(true);
    reload(); // Call the reload function to handle bullet setup
    setPlayerTurn(true); // Reset to player's turn at the start
    setIsAllowed(true); // Allow player to start
    console.log('Game started.');
  };

  const handelReplay = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setIsAllowed(true);
    setPlayerTurn(true);
    setDoubleDamage(false);

    // Reset Player & Dealer Health
    setPlayerHealth(4);
    setDealerHealth(4);

    // Reset Bullets
    const liveCount = genRandomNumber();
    const blankCount = genRandomNumber();
    const shuffledBullets = shuffleBullets(liveCount, blankCount);

    setLiveBullet(liveCount);
    setBlankBullet(blankCount);
    setTotalBullet(liveCount + blankCount);
    setBullets(shuffledBullets);
    setCurrentBulletIndex(0); // Ensure bullets start from the first shot

    // Reset Player Items
    setPlayerItem({ cigar: 0, pill: 0, knife: 0, magnify: 0 });

    // Assign new items after bullets are set
    setTimeout(() => {
      assignRandomItems();
    }, 500); // Small delay ensures state update before assignment

    console.log('Game restarted. Welcome Again', shuffledBullets);
  };

  // starts and reload section ends 

  useEffect(() => {
    if (currentBulletIndex >= bullets.length && bullets.length > 0) {
      console.log('All bullets used. Reloading...');
      reload();
    }
  }, [currentBulletIndex, bullets.length]);

  //Player's move section starts
  const handelSelfShoot = () => {
    if (isPlaying && isAllowed && currentBulletIndex < bullets.length) {
      setIsAllowed(false);
      const currentBullet = bullets[currentBulletIndex];
      if (currentBullet === 'live') {
        (doubleDamage) ? setPlayerHealth((prev) => Math.max(prev - 2, 0)) : setPlayerHealth((prev) => Math.max(prev - 1, 0))
        setLiveBullet((prev) => prev - 1);
        setDoubleDamage(false); // Reset double damage
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
        (doubleDamage) ? setDealerHealth((prev) => Math.max(prev - 2, 0)) : setDealerHealth((prev) => Math.max(prev - 1, 0))
        setLiveBullet((prev) => prev - 1);
        setDoubleDamage(false); // Reset double damage
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
  //Player's move section ends


  // ItemHandler fuction starts
  const assignRandomItems = () => {
    // Define the total number of items to assign
    const totalItems = 5;

    // Initialize a temporary object to hold the items
    const tempItems = { cigar: 0, pill: 0, knife: 0, magnify: 0 };

    // Distribute items randomly
    let remainingItems = totalItems;
    const itemKeys = Object.keys(tempItems);

    while (remainingItems > 0) {
      const randomKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
      tempItems[randomKey] += 1;
      remainingItems -= 1;
    }

    // Update the playerItem state
    setPlayerItem(tempItems);

    console.log('Random items assigned:', tempItems);
  };

  useEffect(() => {
    if (playerHealth < 3) {
      setIsHealable(false);
    }
  }, [playerHealth])

  const useCigar = () => {
    if (isHealable) {
      setPlayerHealth((prev) => Math.min(prev + 1, 4)); // Heal by 1 if healable
      console.log('Cigar used: Player healed by 1');
    } else {
      console.log('Cigar used: Player is not healable');
    }
    setPlayerItem((prev) => ({ ...prev, cigar: prev.cigar - 1 })); // Deduct cigar
  };

  const usePill = () => {
    const chance = Math.random() < 0.5;
    if (chance) {
      setPlayerHealth((prev) => Math.min(prev + 2, 4)); // Heal by 2
      console.log('Pill used: Player healed by 2');
    } else {
      setPlayerHealth((prev) => Math.max(prev - 1, 0)); // Reduce 1 health
      console.log('Pill used: Backfired, reduced player health by 1');
    }
    setPlayerItem((prev) => ({ ...prev, pill: prev.pill - 1 })); // Deduct pill
  };

  const useKnife = () => {
    console.log('Knife activated: 2× damage for next bullet');
    setDoubleDamage(true); // Activate double damage
    setPlayerItem((prev) => ({ ...prev, knife: prev.knife - 1 })); // Deduct knife
  };

  const useMagnify = () => {
    const currentBullet = bullets[currentBulletIndex];
    console.log(`Magnifying Glass used: Next bullet is ${currentBullet}`);
    setPlayerItem((prev) => ({ ...prev, magnify: prev.magnify - 1 })); // Deduct magnifying glass
  };

  // ItemHandler fuction ends
  return (
    <div className={`w-screen h-screen flex flex-col justify-center items-center bg gap-2 p-6 bg-gray-500`}>
      {/* username */}
      {!isPlaying &&
        <input
          type='text'
          placeholder='Your Name'
          className='bg-gray-600 text-white'
          onChange={(e) => setPlayerName(e.target.value)}
        />}
      {!isPlaying &&
        <button className='bg-green-700 py-1 px-3 rounded-md' onClick={handelStart}>
          Start
        </button>}

      {/* game status */}
      {isPlaying &&
        <div>
          {playerName &&
            <h1 className="bg-black text-center font-semibold text-2xl player text-red-600 tracking-widest rounded-sm uppercase font-blood inline-block p-4 border-4 border-red-700 opacity-60">
              {playerName}  V/S Dealer
            </h1>
          }
          {/* health */}
          <div className='flex justify-between'>
            <div className='flex flex-col items-center gap-2 m-2 p-health bg-green-500 p-4'>
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
              {/* Items section starts */}

              <div className='flex justify-between gap-2 mt-3'>
                <button
                  className={`cursor-pointer rounded-lg bg-purple-700 p-2 ${playerTurn && isAllowed && playerItem.cigar > 0 ? '' : 'opacity-50'}`}
                  onClick={useCigar}
                  disabled={!playerTurn || !isAllowed || playerItem.cigar <= 0}
                >
                  Cigar<br />{playerItem.cigar}
                </button>

                <button
                  className={`cursor-pointer rounded-lg bg-purple-700 p-2 ${playerTurn && isAllowed && playerItem.pill > 0 ? '' : 'opacity-50'}`}
                  onClick={usePill}
                  disabled={!playerTurn || !isAllowed || playerItem.pill <= 0}
                >
                  Pill<br />{playerItem.pill}
                </button>

                <button
                  className={`cursor-pointer rounded-lg bg-purple-700 p-2 ${playerTurn && isAllowed && playerItem.knife > 0 ? '' : 'opacity-50'}`}
                  onClick={useKnife}
                  disabled={!playerTurn || !isAllowed || playerItem.knife <= 0}
                >
                  Knife<br />{playerItem.knife}
                </button>

                <button
                  className={`cursor-pointer rounded-lg bg-purple-700 p-2 ${playerTurn && isAllowed && playerItem.magnify > 0 ? '' : 'opacity-50'}`}
                  onClick={useMagnify}
                  disabled={!playerTurn || !isAllowed || playerItem.magnify <= 0}
                >
                  Magnifying Glass<br />{playerItem.magnify}
                </button>
              </div>

              {/* Items section ends */}
            </div>

            <div className='flex flex-col justify-center mt-5 gap-2 h-20 py-1 px-3 rounded-md bg-red-500 d-health'>
              <h1>Dealer's Health: {dealerHealth}</h1>
            </div>
          </div>

          {/* Bullets Info */}
          <div className='mt-4 py-2 px-6 rounded-sm bg-blue-800 bullet'>
            <h1>Remaining Bullets: {bullets.length - currentBulletIndex}</h1>
            <h2>Next Bullet: {bullets[currentBulletIndex] || 'None'}</h2>
          </div>
          <div className='dealer'>
            <img className='w-[120px]' src="/dealer.png" alt="" />
          </div>
        </div>}

      {/* Replay Option */}
      {isGameOver &&
        <button className='bg-blue-700 py-1 px-3 rounded-md' onClick={handelReplay}>
          Replay
        </button>
      }
      {/* dealer image  */}
    </div>

  );
}

export default App;
