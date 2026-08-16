import { useState, useEffect, useRef } from 'react'
import PianoKey from './components/PianoKey'
import { startNote, stopNote } from './audio/sound'
import { pianoNotes } from './data/piano'
import { keyboardMap } from './data/keyboard'
import './App.css'

function App() {

  const whiteKeys =
    pianoNotes.filter(
      note => note.type === "white"
    )

  const blackKeys =
    pianoNotes.filter(
      note => note.type === "black"
    )


  const [pressedNotes, setPressedNotes] = useState<string[]>([])

  const activeKeys = useRef<string[]>([])


  function pressNote(noteName: string) {

    const note = pianoNotes.find(
      item => item.name === noteName
    )


    if (!note) {
      return
    }


    setPressedNotes(prev => {

      if (prev.includes(noteName)) {
        return prev
      }


      return [
        ...prev,
        noteName
      ]

    })


    startNote(
      note.name,
      note.frequency
    )

  }


  function releaseNote(noteName: string) {

    setPressedNotes(prev =>
      prev.filter(
        item => item !== noteName
      )
    )


    stopNote(noteName)

  }


  useEffect(() => {

    function handleKeyDown(event: KeyboardEvent) {

      const key = event.key.toLowerCase()

      if (activeKeys.current.includes(key)) {
        return
      }


      const noteName = keyboardMap[key]


      if (noteName) {

        activeKeys.current.push(key)

        pressNote(noteName)

      }

    }


    function handleKeyUp(event: KeyboardEvent) {

      const key = event.key.toLowerCase()
      const noteName = keyboardMap[key]


      if (noteName) {

        releaseNote(noteName)

        activeKeys.current =
          activeKeys.current.filter(
            activeKey => activeKey !== key
          )

      }

    }


    window.addEventListener(
      "keydown",
      handleKeyDown
    )


    window.addEventListener(
      "keyup",
      handleKeyUp
    )


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      )


      window.removeEventListener(
        "keyup",
        handleKeyUp
      )

    }

  }, [])


  return (
    <div className="piano">

      <div className="white-keys">

        {
          whiteKeys.map(note => (

            <PianoKey

              key={note.name}

              note={note.name}

              type={note.type}

              position={note.position}

              pressed={
                pressedNotes.includes(note.name)
              }

              onPress={() =>
                pressNote(note.name)
              }

              onRelease={() =>
                releaseNote(note.name)
              }

            />

          ))
        }

      </div>


      <div className="black-keys">

        {
          blackKeys.map(note => (

            <PianoKey

              key={note.name}

              note={note.name}

              type={note.type}

              position={note.position}

              pressed={
                pressedNotes.includes(note.name)
              }

              onPress={() =>
                pressNote(note.name)
              }

              onRelease={() =>
                releaseNote(note.name)
              }

            />

          ))
        }

      </div>

    </div>
  )
}

export default App
