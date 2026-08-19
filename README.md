# Piano Trainer 🎹

A browser-based piano practice tool built with React and TypeScript.

## Features

- 🎹 Full 88-key virtual piano keyboard (`A0-C8`)
- ⌨️ Computer keyboard input with an adjustable white-key base note
- 🖱️ Mouse click input
- 🎵 Real-time Web Audio playback
- 🔊 Browser sound toggle, enabled by default
- 🧩 Application layout with toolbar, input dock, and status bar
- 🎼 Real-time Grand Staff note display for the full 88-key range
- 🏷️ Four keyboard label display modes
- 🎼 White and black key support
- 🎶 Multi-note playback
- 🎹 MIDI Input through the shared Input Layer
- 📡 Bluetooth LE MIDI Input through the shared Input Layer
- 🖥️ Responsive desktop layout with a fixed 88-key piano dock
- 🪟 Anchored Popover controls for key labels, USB MIDI, and Bluetooth MIDI

The computer keyboard maps white keys from `A` through `'` and uses
`WERTYUIOP[` as candidate black-key positions. Keyboard Mapping in the Input &
Piano Dock selects the base note and moves it by one octave with the arrow buttons.
The default base is `E3`, placing middle C (`C4`) on `H`. Web Sound, MIDI Input,
and Bluetooth MIDI controls are grouped in the same dock. MIDI Input can drive the
same Piano, Grand Staff, and Browser Sound flow through the shared Input Layer.
Bluetooth LE MIDI uses the Web Bluetooth API and is available through the
Bluetooth button in the Input & Piano Dock in supported secure Chromium browsers.

## Tech Stack

- React
- TypeScript
- Vite
- Web Audio API

## Current Status

Version `v0.4.0-dev` is under development. The full 88-key keyboard, browser sound
control, application layout, keyboard label modes, dynamic keyboard mapping,
source-agnostic input layer, Web MIDI connection, MIDI Input integration,
Bluetooth LE MIDI input, responsive desktop layout, real-time Grand Staff
display, and the unified input dock are complete. Bluetooth LE MIDI has been
verified with the ES120G; detailed UI improvements, advanced MIDI features,
sight reading, and practice features remain on the roadmap.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build and lint the project:

```bash
npm run build
npm run lint
```
