# Piano Trainer 🎹

A browser-based piano practice tool built with React and TypeScript.

## Features

- 🎹 Full 88-key virtual piano keyboard (`A0-C8`)
- ⌨️ Computer keyboard input with an adjustable white-key base note
- 🖱️ Mouse click input
- 🎵 Real-time Web Audio playback
- 🔊 Browser sound toggle, enabled by default
- 🧩 Application layout with toolbar and status bar
- 🎼 Real-time treble staff note display
- 🏷️ Four keyboard label display modes
- 🎼 White and black key support
- 🎶 Multi-note playback

The computer keyboard maps white keys from `A` through `'` and uses
`WERTYUIOP[` as candidate black-key positions. The base note can be selected
in the Toolbar, while the arrow buttons move it by one octave. The default
base is `E3`, placing middle C (`C4`) on `H`. Future MIDI support will provide
full keyboard input.

## Tech Stack

- React
- TypeScript
- Vite
- Web Audio API

## Current Status

Version `v0.2.0` is under development. The full 88-key keyboard, browser sound
control, basic application layout, keyboard label modes, dynamic keyboard
mapping, and the source-agnostic input layer are complete; detailed UI
improvements, sight reading, MIDI, and practice features remain on the
roadmap.

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
