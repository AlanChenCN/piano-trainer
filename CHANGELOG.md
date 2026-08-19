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
- 增加 Web Bluetooth 支持检测和 BLE MIDI 设备连接。
- 增加独立 Bluetooth MIDI 面板，使用浏览器原生设备选择窗口选择一个设备。
- 增加 BLE MIDI Service 和 Data I/O Characteristic 连接处理。
- 增加 BLE MIDI 时间戳、Running Status 和多消息数据包解析。
- 增加 `BluetoothMidiController` 和统一的 `MidiNoteController`。
- 增加 Bluetooth MIDI 设备连接状态和断开后的活动音符释放。
- 完成 ES120G Bluetooth MIDI 实机连接、演奏和断开释放验证。
- 增加桌面端全宽主布局和固定底部 88 键虚拟钢琴区域。
- 增加 Grand Staff 大尺寸主区域和页面底部安全空间。
- 增加 88 键白键自适应宽度及黑键比例定位。
- 增加完整 Grand Staff，包括高音谱表、低音谱表、谱号和统一连接结构。
- 增加 A0-C8 全音域自动分谱和高低音谱表 Ledger Lines。
- 增加基于 diatonicStep 和 staffStep 的统一音高位置模型。
- 增加统一 Toolbar Button、Key Labels Popover 和输入设备管理 Popover。
- 增加底部 Input & Piano Dock，集中显示 Keyboard Mapping、Key Labels、Web Sound、USB MIDI、Bluetooth MIDI 和 88 键 Piano。
- 增加 USB MIDI、Bluetooth MIDI 的紧凑连接状态 Indicator。
- 增加 Theme Token 层、Dark / Light / Custom 主题预设和 Toolbar Theme Popover。
- 增加跟随系统明暗偏好的 `system` 模式，以及清除自定义颜色并恢复系统主题的 Reset。
- 增加页面背景、谱面背景、谱线颜色、活动音符颜色和左右手颜色配置。
- 增加统一钢琴高亮颜色派生逻辑，分别生成白键和黑键高亮变体。

### 变更

- 电脑键盘白键使用 `A` 到 `'`，黑键按相邻白键位置进行偏移，不存在钢琴黑键的位置不生成映射。
- 双八度黑键位置根据数据自动布局。
- 关闭浏览器声音时停止活动音符，但保留输入和琴键动画。
- Grand Staff 第一版仅显示当前按下的音符，不记录历史音符。
- 第一版高音谱表按同一音头位置显示自然音和升号音；P5-002 改为保留不同实际音高的独立音符头，并继续绘制升号（♯）。
- 88 键键盘在 Piano 区域内横向滚动，保留现有琴键尺寸。
- 电脑键盘默认基准音为 `E3`，使 H 键对应中央 C（C4）；基准音可通过 Keyboard Base Popover 切换，三角按钮每次移动 12 个半音。
- 切换电脑键盘基准音时释放当前仍按下的电脑键盘音符。
- 鼠标输入和电脑键盘输入统一经过 Input Layer；Input Layer 不感知具体输入来源。
- Keyboard、Mouse、USB MIDI 和 Bluetooth MIDI 均通过同一个 Input Layer 驱动
  Piano、Grand Staff 和 Browser Sound。
- Layout 重构仅调整页面空间关系，不改变输入、音频和 Grand Staff 业务逻辑。
- Grand Staff 保留不同实际音高的独立音符头；相同 staffStep 的 Ledger Line 可以去重，
  和弦音符共享主要横向位置，仅在视觉碰撞时局部错位。
- MIDI / Bluetooth 连接状态仅映射真实连接流程，不改变 Web MIDI、Web Bluetooth 或 Input Layer 数据流。
- Grand Staff 仅通过统一比例放大显示，不改变 P5-002 的音高和谱面几何模型。
- 顶部 Toolbar 简化为 Practice、Metronome；Key Labels 移到底部 Input & Piano Dock。
- 顶部与底部按钮统一尺寸和双行状态样式，Dock 按应用设置与外部输入设备左右分组。
- Key Labels、USB MIDI、Bluetooth MIDI 面板改为靠近触发按钮的锚定 Popover，支持外部点击和 Escape 关闭。
- Web Sound 从顶部 Toolbar 移到 Input & Piano Dock 右侧，并保持原有声音开关逻辑。
- Keyboard Base 与 Keyboard Range 合并为统一的 Keyboard Mapping 控件。
- Keyboard Mapping 中间按钮直接显示完整 Range，点击后通过 Keyboard Base Popover 选择 Base。
- Keyboard Mapping 左右移动按钮改为统一样式的三角方向图标，并移除原生下拉框外观。
- Popover 增加紧凑 / 宽面板尺寸、内容留白和 viewport 安全边距；Dock Controls 增加垂直空间。
- Grand Staff 在保持 P5-002 音乐坐标模型不变的前提下整体放大，并扩大 A0-C8 极端音符的 SVG 安全区域。

### 未修改

- 未加入 Playback、Practice Mode 或 Metronome 功能。
- 未支持多个 MIDI Input 同时监听、MIDI Output、Sustain Pedal 或 Velocity 响应。
- Bluetooth MIDI 暂不支持自动重连、多个 BLE 设备和其他 MIDI 消息类型。
- 未处理 Keyboard、Mouse、USB MIDI、Bluetooth MIDI 同时触发同一个音符时的来源归属冲突；
  多输入源同音符引用计数作为后续独立 Issue。
- 未实现 Recording、Playback、Practice Mode、Metronome 逻辑或移动端专项适配。
- 未修改钢琴、Grand Staff、Browser Sound 的既有音频和显示架构。
- 未修改 Input Layer、Keyboard Mapper、Keyboard Controller、MIDI / Bluetooth MIDI 数据流或 Browser Sound 业务逻辑。

## [0.1.0] - 钢琴核心

### 新增

- 虚拟钢琴键盘。
- 白键与黑键显示。
- 电脑键盘输入。
- 鼠标输入。
- Web Audio 实时声音反馈。
- 多音同时播放。
