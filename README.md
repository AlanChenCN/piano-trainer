# Piano Trainer 🎹

A browser-based piano practice tool built with React and TypeScript.

## Features

- 🎹 Full 88-key virtual piano keyboard (`A0-C8`)
- ⌨️ Computer keyboard input with switchable ranges (`C3-E4`, `C4-E5`, `C5-E6`)
- 🖱️ Mouse click input
- 🎵 Real-time Web Audio playback
- 🔊 Browser sound toggle, enabled by default
- 🧩 Application layout with toolbar and status bar
- 🎼 Real-time treble staff note display
- 🏷️ Four keyboard label display modes
- 🎼 White and black key support
- 🎶 Multi-note playback

The computer keyboard keeps the physical `A` through `;` layout while the
mapping range can be changed with the Toolbar arrow buttons. The default
range is `C4-E5`. Future MIDI support will provide full keyboard input.

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
