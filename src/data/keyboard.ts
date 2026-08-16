/**
 * Computer keyboard layout for the two-octave range C4-B5.
 *
 * The mapping follows the chromatic keyboard layout from A to ;:
 * white keys use the home-row letters and black keys use the letters above
 * them. The available computer keys cover C4-E5; the remaining piano keys
 * are intentionally left for future MIDI input.
 */
export const keyboardMap: Record<string, string> = {
  a: "C4",
  w: "C#4",
  s: "D4",
  e: "D#4",
  d: "E4",
  f: "F4",
  t: "F#4",
  g: "G4",
  y: "G#4",
  h: "A4",
  u: "A#4",
  j: "B4",

  k: "C5",
  o: "C#5",
  l: "D5",
  p: "D#5",
  ";": "E5",
}
