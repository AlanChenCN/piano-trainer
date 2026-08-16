interface PianoKeyProps {

  note: string

  type: "white" | "black"

  position?: number

  pressed: boolean

  onPress: () => void

  onRelease: () => void
}


function PianoKey({
  note,
  type,
  position,
  pressed,
  onPress,
  onRelease
}: PianoKeyProps) {


  return (

    <button

      style={
        type === "black"
          ? {
              left: `${position! * 60 + 42}px`
            }
          : {}
      }


      className={
        `piano-key ${type} ${pressed ? "pressed" : ""}`
      }


      onMouseDown={onPress}

      onMouseUp={onRelease}

      onMouseLeave={onRelease}

    >

      {note}

    </button>

  )

}


export default PianoKey