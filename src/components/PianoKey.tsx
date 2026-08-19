interface PianoKeyProps {

  note: string

  displayLabel: string

  type: "white" | "black"

  position?: number

  pressed: boolean

  onPress: () => void

  onRelease: () => void
}


function PianoKey({
  note,
  displayLabel,
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
              left: `${(((position ?? 0) + 0.7) / 52) * 100}%`,
            }
          : undefined
      }


      className={
        `piano-key ${type} ${pressed ? "pressed" : ""}`
      }


      onMouseDown={onPress}

      onMouseUp={onRelease}

      onMouseLeave={onRelease}

      aria-label={note}

    >

      {displayLabel}

    </button>

  )

}


export default PianoKey
