/** White-key positions in the computer keyboard layout. */
export const whiteKeyboardKeys = [
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  ";",
  "'",
] as const

/**
 * Candidate black-key positions between adjacent white-key positions.
 * Some positions intentionally remain unmapped where the piano has no black
 * key, such as between E-F and B-C.
 */
export const blackKeyboardKeys = [
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "[",
] as const
