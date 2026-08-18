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
- 🎹 Web MIDI device connection and Console monitor spike

The computer keyboard maps white keys from `A` through `'` and uses
`WERTYUIOP[` as candidate black-key positions. The base note can be selected
in the Toolbar, while the arrow buttons move it by one octave. The default
base is `E3`, placing middle C (`C4`) on `H`. The current Web MIDI spike can
verify a single MIDI Input connection; full MIDI keyboard input remains on the
roadmap.

## Tech Stack

- React
- TypeScript
- Vite
- Web Audio API

## Current Status

Version `v0.2.0` is under development. The full 88-key keyboard, browser sound
control, basic application layout, keyboard label modes, dynamic keyboard
mapping, source-agnostic input layer, and the Web MIDI connection spike are
complete; detailed UI improvements, full MIDI input, sight reading, and
practice features remain on the roadmap.

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
