# 变更日志

本文件记录 Piano Trainer 各版本的重要功能与变更。

## [未发布]

### 新增

- 扩展虚拟钢琴为 C4-B5 双八度。
- 音符数据增加 `pitchClass` 与 `octave` 信息。
- 根据 MIDI 音高自动计算音符频率。
- 增加从 C4 到 E5 的电脑键盘映射。
- 增加默认开启的浏览器声音开关。
- 增加 Header、Toolbar、Grand Staff 占位、Piano 和 Status Bar 基础布局。
- 增加 C4-B5 高音谱表音头位置映射。
- 增加按下琴键时的高音谱表实时实心音符显示。
- 增加 A0-C8 标准 88 键钢琴数据和界面。
- 增加隐藏、白键、C 音和全部四档琴键音名显示模式。
- 增加 Input Layer、Keyboard Mapper 和 Keyboard Controller。
- 增加电脑键盘白键 `A` 到 `'` 的映射和 `WERTYUIOP[` 黑键候选位。
- 增加基准自然音下拉菜单，可在 `A0-G6` 范围内选择基准音。
- 增加 Toolbar 左右箭头按八度移动基准音的控制。
- 增加 Web MIDI API 支持检测和浏览器权限申请。
- 增加独立 MIDI 面板，支持选择并连接一个 MIDI Input。
- 增加 Device Name、Manufacturer、Connection State 显示。
- 增加连接成功后的 Status Bar 设备状态显示。
- 增加 Note On / Note Off、Note Number、Velocity 的 Console Monitor。
- 增加 `midiNumberToPianoNote()` 与 `pianoNoteToMidiNumber()` 双向转换接口。
- 增加 `MidiInputController`，将 MIDI Note On / Note Off 接入 Input Layer。
- 增加 MIDI 多键状态管理和设备断开时的活动音符释放。

### 变更

- 电脑键盘白键使用 `A` 到 `'`，黑键按相邻白键位置进行偏移，不存在钢琴黑键的位置不生成映射。
- 双八度黑键位置根据数据自动布局。
- 关闭浏览器声音时停止活动音符，但保留输入和琴键动画。
- Grand Staff 第一版仅显示当前按下的音符，不记录历史音符。
- 同一音头位置的自然音和升号音合并显示，并绘制升号（♯）。
- 88 键键盘在 Piano 区域内横向滚动，保留现有琴键尺寸。
- 电脑键盘默认基准音为 `E3`，使 H 键对应中央 C（C4）；基准音可通过下拉菜单切换，箭头每次移动 12 个半音。
- 切换电脑键盘基准音时释放当前仍按下的电脑键盘音符。
- 鼠标输入和电脑键盘输入统一经过 Input Layer；Input Layer 不感知具体输入来源。
- MIDI 输入通过同一个 Input Layer 驱动 Piano、Grand Staff 和 Browser Sound。

### 未修改

- 未加入 Playback、Practice Mode 或 Metronome 功能。
- 未支持多个 MIDI Input 同时监听、MIDI Output、Bluetooth MIDI、Sustain Pedal 或 Velocity 响应。
- 未处理 Keyboard、Mouse、MIDI 同时触发同一个音符时的来源归属冲突。
- 未修改钢琴、Grand Staff、Browser Sound 的既有音频和显示架构。

## [0.1.0] - 钢琴核心

### 新增

- 虚拟钢琴键盘。
- 白键与黑键显示。
- 电脑键盘输入。
- 鼠标输入。
- Web Audio 实时声音反馈。
- 多音同时播放。
