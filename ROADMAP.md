# Piano Trainer Roadmap

## Current Version

v0.2.0 Piano Trainer（开发中）

- Phase 3.1 Keyboard Expansion 已完成
- 当前电脑键盘映射覆盖 `C4-E5`
- 完整 `C4-B5` 键盘等待后续 MIDI 输入支持

## v0.1.0 Piano Core ✅

Completed:

- Virtual piano keyboard
- White and black keys
- Computer keyboard input
- Mouse input
- Web Audio sound engine
- Multi-note playback
- Basic UI


---

# v0.2.0 Piano Trainer

目标：

从“虚拟钢琴”升级为“钢琴训练工具”。


---

## Phase 3.1 Keyboard Expansion

状态：

- [x] Completed


目标：

扩展当前单八度键盘到双八度。


Tasks:

- [x] Upgrade piano data model
- [x] Add octave information
- [x] Support C4-B5 (two octaves)
- [x] Extend keyboard mapping
- [x] Maintain current input system

当前电脑键盘映射从 `A` 到 `;`，覆盖 C4-E5。未映射的琴键保留给后续 MIDI 输入。


设计原因：

当前音符模型只有：

C D E F G A B

无法区分：

C3 / C4 / C5

因此需要升级音符数据结构。


---

## Phase 3.2 Audio Control

状态：

- [ ] Planned


目标：

增加电脑声音控制。


Tasks:

- [ ] Add sound enable/disable switch
- [ ] Separate input and audio output logic


Reason:

Some MIDI keyboards have their own sound source.

Users should choose:

- Computer generated sound
- External MIDI sound


---

## Phase 3.3 UI Improvement

状态：

- [ ] Planned


目标：

从 Demo 界面升级为完整应用。


Tasks:

- [ ] Application title
- [ ] Layout redesign
- [ ] Control panel
- [ ] Better visual feedback
- [ ] Mode selection


---

## Phase 3.4 Sight Reading Mode

状态：

- [ ] Planned


目标：

增加五线谱训练。


Tasks:

- [ ] Display grand staff
- [ ] Map notes to staff position
- [ ] Synchronize keyboard and notation


Future consideration:

- VexFlow integration


---

# Future Versions


## v0.3 MIDI Support

Possible features:

- MIDI keyboard input
- MIDI velocity
- External instrument support
- Full keyboard range


---

## v0.4 Practice System

Possible features:

- Random note exercises
- Accuracy tracking
- Score system
- Reaction time measurement


---

# Development Rules

Before implementing a feature:

1. Discuss requirement
2. Confirm design
3. Implement
4. Test
5. Commit


Avoid:

- Large uncontrolled refactoring
- Adding unnecessary dependencies
- Solving future problems too early
