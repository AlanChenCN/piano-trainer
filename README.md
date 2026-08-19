# Piano Trainer 🎹

A browser-based piano practice tool built with React and TypeScript.

## Features

- 🎹 Responsive 88-key virtual piano keyboard (`A0-C8`)
- ⌨️ Computer keyboard input with an adjustable white-key base note
- 🖱️ Mouse click input
- 🔗 Unified Input Layer for Keyboard, Mouse, USB MIDI, and Bluetooth LE MIDI
- 🎵 Real-time Web Audio playback
- 🔊 Browser sound toggle, enabled by default
- 🎹 USB MIDI input through the shared Unified Input Layer
- 📡 Bluetooth LE MIDI input through the shared Unified Input Layer
- 🧩 Application layout with toolbar, Input & Piano Dock, and status bar
- 🎼 Complete Grand Staff with treble/bass staves for the full 88-key range
- 🏷️ Four keyboard label display modes
- 🎼 White and black key support
- 🎶 Multi-note playback
- 🖥️ Responsive desktop layout with a fixed 88-key Input & Piano Dock
- 🪟 Anchored Popover interaction for settings, USB MIDI, and Bluetooth MIDI
- 🎨 Dark / Light / Custom themes with Follow System and Reset behavior
- 🎨 Theme Token and CSS Variable system for semantic visual colors
- 🎨 Note Color drives Grand Staff notes and derived white/black Piano highlights

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

Version `v0.4.0-alpha` contains the completed P5 product scope: responsive 88-key
piano, Keyboard / Mouse / USB MIDI / Bluetooth LE MIDI input, the Unified Input
Layer, Complete Grand Staff, Input & Piano Dock, anchored Popover interaction,
and the Theme Token / CSS Variable appearance system. Bluetooth LE MIDI has been
verified with the ES120G.

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
