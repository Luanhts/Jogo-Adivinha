import styles from "./app.module.css";
import { useEffect, useState } from "react";
import { WORDS, Challenge } from "./utils/words"

import { Tip } from "./components/Tip";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { Letter } from "./components/Letter";
import { Header } from "./components/Header";
import { LettersUsed, LetterUsedProps } from "./components/LettersUsed";
function App() {
  const [score, setScore] = useState(0)
  const [letter, setLetter] = useState("")
  const [lettersUsed, setLettersUsed] = useState<LetterUsedProps[]>([])
  const [challenge, setChallenge] = useState<Challenge | null>()

  const ATTEMPTS_MARGIN = 3
  function handleRestartGame() {
    const isConfirmed = window.confirm("Deseja realmente reiniciar o jogo?")

    if (isConfirmed) {
      startGame()
    }
  }

  //Função para iniciar o jogo
  function startGame() {
    const index = Math.floor(Math.random() * WORDS.length);
    const randomWord = WORDS[index];

    setChallenge(randomWord)

    setScore(0)
    setLetter("")
    setLettersUsed([])
  }

  //botao de confirmar
  function handleConfirm() {
    if (!challenge) {
      return
    }

    if (!letter.trim()) {
      alert("Informe uma letra")
    }

    const value = letter.toUpperCase()
    const exists = lettersUsed.find((used) => used.value.toUpperCase() === value)

    if (exists) {
      setLetter("")
      alert(`A letra ${value} já foi utilizada`)
      return
    }


    const hits = challenge.word.toUpperCase().split("").filter((char) => char === value).length

    const correct = hits > 0
    const currentScore = score + hits


    setLettersUsed((prevState) => [...prevState, { value, correct }])
    setScore(currentScore)

    setLetter("")
  }


  function endGame(message: string) {
    alert(message)
    startGame()
  }


  useEffect(() => {
    startGame()
  }, [])

  useEffect(() => {
    if (!challenge) {
      return
    }

    setTimeout(() => {
      if (score === challenge.word.length) {
        return endGame("Você ganhou!")
      }

      const attemptLimit = challenge.word.length + ATTEMPTS_MARGIN

      if (lettersUsed.length === attemptLimit) {
        return endGame("Você usou todas as suas tentativas")
      }
    }, 200)
  }, [score, lettersUsed.length])

  if (!challenge) {
    return
  }


  return (
    <>
      <div className={styles.container}>
        <main>
          <Header current={lettersUsed.length} max={challenge.word.length + ATTEMPTS_MARGIN} onRestart={handleRestartGame} />

          <Tip tip={challenge.tip} />

          <div className={styles.word}>
            {
              challenge.word.split("").map((letter, index) => {
                const letterUsed = lettersUsed.find((used) => used.value.toUpperCase() === letter.toUpperCase())
                return <Letter key={index} value={letterUsed?.value} color={letterUsed?.correct ? "correct" : "default"} />
              })}
          </div>

          <h4>Palpite</h4>

          <div className={styles.guess}>
            <Input
              autoFocus maxLength={1}
              placeholder="?"
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
            />
            <Button title="Confirmar" onClick={handleConfirm} />
          </div>

          <LettersUsed data={lettersUsed} />
        </main>
      </div>
    </>
  );
}

export default App;
