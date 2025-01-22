import { useState } from 'react'
import './App.css'

function App() {
  const [playerName, setPlayerName] = useState('')
  const [playerHealth, setPlayerHealth] = useState(4)
  const [dealerHealth, setDealerHealth] = useState(4)
  const [isLive, setIsLive] = useState(true)
  const [isBlank, setIsBlank] = useState(true)
  const [liveBullet, setLiveBullet] = useState(4)
  const [blankBullet, setBlankBullet] = useState(4)
  const [totalBullet, setTotalBullet] = useState(8)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isAllowed, setIsAllowed] = useState(true)
  const [cigarCount, setCigarCount] = useState(0)
  const [magnifyCount, setMagnifyCount] = useState(0)
  const [isHealable, setIsHealable] = useState(true)
  const [playerTurn, setPlayerTurn] = useState(true)
  // const [dealerTurn, setDealerTurn] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)


  /*
  lunch page ->
  states(health ,live , blank ,isPlaying , total , isAllowed , cigarCount , magnifyCount , isHealable , playerTurn , isGameOver , playerName)
  */
  const genRandomNumber = () => {
    return Math.floor(Math.random() * 4) + 1;
  }
  const suffuleBullet = (liveBullet, blankBullet, totalBullet) => {
    const bullets = [];
    for (let i = 0; i < liveBullet; i++) {
      bullets.push("live");
    }
    for (let i = 0; i < blankBullet; i++) {
      bullets.push("blank");
    }
    
    // Shuffle the bullets array randomly
    for (let i = bullets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bullets[i], bullets[j]] = [bullets[j], bullets[i]];
    }
    console.log(bullets);
  }

  const handelStart = () => {
    setIsPlaying(true);
    setLiveBullet(genRandomNumber());
    setBlankBullet(genRandomNumber());
    setTotalBullet(liveBullet + blankBullet);
    suffuleBullet(liveBullet , blankBullet , totalBullet);
  }
  const handelSelfShoot = () => {
    if (isPlaying && isAllowed) {
      setIsAllowed(false);
      if (isLive) {
        setPlayerHealth(playerHealth - 1);
        setLiveBullet(liveBullet - 1);
        setTotalBullet(totalBullet - 1);
        setPlayerTurn(false);
      }
      else {
        setBlankBullet(blankBullet - 1);
        setTotalBullet(totalBullet - 1);
        setPlayerTurn(false);
      }
      setTimeout(() => {
        setIsAllowed(true);
      }, 3000);
      setIsAllowed(true);
    }
  }
  //check
  const handelDealerShoot = () => {
    if (isPlaying && isAllowed) {
      setIsAllowed(false);
      if (dealerHealth > 0) {
        setDealerHealth(dealerHealth - 1);
        setLiveBullet(liveBullet - 1);
        setTotalBullet(totalBullet - 1);
        setPlayerTurn(true);
      }
      else {
        setBlankBullet(blankBullet - 1);
        setTotalBullet(totalBullet - 1);
        setPlayerTurn(true);
      }
      setTimeout(() => {
        setIsAllowed(true);
      }, 3000);
      setIsAllowed(true);
    }
  }

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center gap-2 bg-gray-500'>
      {/* username */}
      <input type="text" placeholder='Your Name' className='bg-gray-600 text-white' onChange={(e) => setPlayerName(e.target.value)} />
      <button className='bg-green-700 w-8' onClick={handelStart}>start</button>
      {(playerName) && <h1>Welcome {playerName}</h1>}
      {/* health  */}
      {/* set shooting */}
      <div className="flex justify-between">

        <div className='flex flex-col gap-2 w-15 h-15 m-2 bg-green-500 p-4'>
          <h1>Your Health : {playerHealth}</h1>
          <div className="flex justify-between gap-5">
            <button className='cursor-pointer rounded-lg bg-purple-700 p-2' onClick={handelSelfShoot}>Shoot-Self</button>
            <button className='cursor-pointer rounded-lg bg-purple-700 p-2' onClick={handelDealerShoot}>Shoot-Dealer</button>
          </div>
        </div>

        <div className='flex flex-col mt-5 gap-2 w-20 h-20 m-2 bg-red-500'>
          <h1>Dealer's Health : {dealerHealth}</h1>
        </div>

      </div>


    </div>
  )
}

export default App
