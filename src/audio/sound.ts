const audioContext = new AudioContext()


interface ActiveNote {
  oscillator: OscillatorNode
  gain: GainNode
}


const activeNotes: Record<string, ActiveNote> = {}


export function startNote(
  name: string,
  frequency: number
) {

  if (audioContext.state === "suspended") {
    audioContext.resume()
  }


  const oscillator =
    audioContext.createOscillator()


  const gain =
    audioContext.createGain()


  oscillator.frequency.value = frequency

  oscillator.type = "sine"


  gain.gain.value = 0.3


  oscillator.connect(gain)

  gain.connect(
    audioContext.destination
  )


  oscillator.start()


  activeNotes[name] = {
    oscillator,
    gain
  }

}


export function stopNote(name:string) {

  const note =
    activeNotes[name]


  if (note) {

    const now =
      audioContext.currentTime


    note.gain.gain.cancelScheduledValues(now)


    note.gain.gain.setValueAtTime(
      note.gain.gain.value,
      now
    )


    note.gain.gain.linearRampToValueAtTime(
      0,
      now + 0.15
    )


    note.oscillator.stop(
      now + 0.15
    )


    delete activeNotes[name]

  }

}