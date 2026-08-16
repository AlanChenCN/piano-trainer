/**
 * Computer keyboard layout for the two-octave range C4-B5.
 *
 * The original C4-B4 mapping is kept intact. The second octave uses the
 * adjacent letter cluster K/O/L/P/;/Z/Q/X/R/C/V/B so both octaves can be
 * played without changing modes.
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
  z: "F5",
  q: "F#5",
  x: "G5",
  r: "G#5",
  c: "A5",
  v: "A#5",
  b: "B5",
}
