# Piano Trainer 🎹

A browser-based piano practice tool built with React and TypeScript.

## Features

- 🎹 Two-octave virtual piano keyboard (`C4-B5`)
- ⌨️ Computer keyboard input for `C4-E5` (`A` through `;`)
- 🖱️ Mouse click input
- 🎵 Real-time Web Audio playback
- 🎼 White and black key support
- 🎶 Multi-note playback

The remaining visible piano keys are intentionally not mapped to the
computer keyboard. Future MIDI support will provide full keyboard input.

## Tech Stack

- React
- TypeScript
- Vite
- Web Audio API

## Current Status

Version `v0.2.0` is under development. The two-octave keyboard expansion is
complete; audio controls, UI improvements, sight reading, MIDI, and practice
features remain on the roadmap.

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
