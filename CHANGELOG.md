# Changelog

本文件记录 Piano Trainer 各版本的重要功能与变更。

## [Unreleased]

### Added

- 扩展虚拟钢琴为 C4-B5 双八度。
- 音符数据增加 `pitchClass` 与 `octave` 信息。
- 根据 MIDI 音高自动计算音符频率。
- 增加从 C4 到 E5 的电脑键盘映射。
- 增加默认开启的浏览器声音开关。
- 增加 Header、Toolbar、Grand Staff 占位、Piano 和 Status Bar 基础布局。

### Changed

- 电脑键盘映射限制为 `A` 到 `;`，未覆盖的琴键留待 MIDI 输入支持。
- 双八度黑键位置根据数据自动布局。
- 关闭浏览器声音时停止活动音符，但保留输入和琴键动画。

## [0.1.0] - Piano Core

### Added

- 虚拟钢琴键盘。
- 白键与黑键显示。
- 电脑键盘输入。
- 鼠标输入。
- Web Audio 实时声音反馈。
- 多音同时播放。
