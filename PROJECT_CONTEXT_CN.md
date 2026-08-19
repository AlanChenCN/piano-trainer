# Piano Trainer 项目上下文

## 1. 项目简介

Piano Trainer 是一个基于 React + TypeScript 开发的 Web 钢琴练习工具。

项目目标不是单纯模拟钢琴，而是逐步构建一个可扩展的钢琴学习平台：

-   虚拟钢琴键盘
-   电脑键盘输入
-   鼠标操作
-   实时声音反馈
-   MIDI 键盘支持
-   视奏训练
-   练习数据统计

------------------------------------------------------------------------

# 2. 当前版本

## v0.2.0 钢琴训练工具（开发中）

第 3.1 阶段（双八度键盘）已完成。
第 3.2 阶段（声音控制）已完成。
P3-003（应用主布局）已完成。
P3-004（高音谱表实时音符显示）已完成。
P4-001（完整 88 键钢琴）已完成。
键盘音名显示模式已完成。
P4-002（输入系统重构）已完成。
P4-003（Web MIDI 技术验证）已完成。
P4-004（MIDI 输入接入）已完成。
P4-005（原生 Bluetooth LE MIDI 支持）已完成，ES120G 实机验证通过。
P5-001（主页面布局重构）已完成。
P5-002（完整 Grand Staff）已完成。
P5-003（主界面交互布局重构）已完成。

v0.1.0 已完成：

## 钢琴键盘系统

-   白键显示
-   黑键显示
-   数据驱动生成键盘布局
-   按键动画反馈
-   多音同时播放

## 输入系统

支持：

-   电脑键盘输入
-   鼠标点击输入

当前电脑键盘映射：

白键使用：

    A S D F G H J K L ; '

黑键候选位置使用：

    W E R T Y U I O P [

默认基准音为 `E3`，因此 H 键对应中央 C（C4）。白键按照顺序映射，
黑键根据相邻白键之间是否存在钢琴黑键决定是否生成映射。W、Y、O 等
位于 E-F 或 B-C 之间的候选键不会生成映射。

Input & Piano Dock 提供基准自然音下拉菜单，可选择 `A0-G6` 范围内的基准音；
左右箭头每次将基准音移动一个八度。显示出的其余琴键暂时不绑定电脑按键，
目前可通过 MIDI Input 接入完整 A0-C8 范围。

USB MIDI 和 Bluetooth MIDI 均通过 Input Layer 统一驱动 Piano、Grand Staff
和 Browser Sound。当前 USB MIDI 和 Bluetooth MIDI 各自支持一个输入设备，
且不处理 Velocity 响应。

## 音频系统

基于 Web Audio API 实现。

当前支持：

-   实时声音生成
-   多音同时播放
-   按下持续发声
-   松开停止
-   浏览器声音开关，默认开启
-   关闭声音时保持琴键动画与输入功能

------------------------------------------------------------------------

# 3. 当前项目结构

    src/

    ├── audio/
    │   └── sound.ts
    │       音频引擎

    ├── components/
    │   ├── Header.tsx
    │   ├── Toolbar.tsx
    │   ├── Modal.tsx
    │   │   通用锚定 Popover、Escape、外部点击和背景滚动锁定
    │   ├── KeyLabelsModal.tsx
    │   │   琴键音名显示模式选择
    │   ├── KeyboardBaseModal.tsx
    │   │   Keyboard Base 选择 Popover
    │   ├── InputPianoDock.tsx
    │   │   底部输入控制和 88 键 Piano 区域
    │   ├── InputDeviceButton.tsx
    │   │   USB MIDI、Bluetooth MIDI 紧凑状态按钮
    │   ├── GrandStaff.tsx
    │   ├── Piano.tsx
    │   ├── StatusBar.tsx
    │   │   状态栏组件
    │   ├── MidiMonitor.tsx
    │   │   USB MIDI 连接和调试 Popover
    │   ├── BluetoothMidiPanel.tsx
    │   │   Bluetooth MIDI 连接 Popover
    │   └── PianoKey.tsx
    │       单个琴键组件

    ├── data/
    │   ├── piano.ts
    │   │   钢琴音符数据
    │   │
    │   ├── keyboard.ts
    │   │   电脑键盘物理键位数据
    │   │
    │   └── staff.ts
    │       统一 diatonicStep、Staff Assignment、staffStep 和 Ledger Lines 计算

    ├── input/
    │   ├── inputLayer.ts
    │   │   与输入来源无关的 pressNote/releaseNote 边界
    │   │
    │   ├── keyboardMapper.ts
    │   │   电脑键盘到音符的动态映射
    │   │
    │   ├── keyboardController.ts
    │   │   浏览器键盘事件、基准音和活动键释放
    │   ├── midiNoteController.ts
    │   │   统一 MIDI 音符状态和 Input Layer 调用
    │   ├── midiController.ts
    │   │   USB MIDI 消息适配
    │   └── bluetoothMidiController.ts
    │       Bluetooth MIDI 通知到 MIDI 音符控制器的适配

    ├── midi/
    │   ├── webMidi.ts
    │   │   Web MIDI API 适配、设备枚举和连接
    │   │
    │   ├── webBluetooth.ts
    │   │   Web Bluetooth GATT 连接适配
    │   ├── bleMidiParser.ts
    │   │   BLE MIDI 时间戳、Running Status 和消息解析
    │   └── midiMessage.ts
    │       通用 MIDI 音符消息类型

    ├── App.tsx
    │   主应用逻辑

    └── App.css
        页面样式

项目文档：

    README.md
        面向首次访问项目的介绍

    PROJECT_CONTEXT_CN.md
        当前项目状态、架构与设计原则

    ROADMAP.md
        下一步计划与开发阶段完成情况

    CHANGELOG.md
        各版本变更记录

------------------------------------------------------------------------

# 4. 开发原则

## 保持简单

当前阶段不追求复杂架构。

优先：

-   清晰的数据结构
-   容易理解的代码
-   方便调试和扩展

## 数据驱动

琴键信息应该来自数据文件，而不是手写 UI。

例如：

``` ts
{
  name: "C4",
  pitchClass: "C",
  octave: 4,
  frequency: 261.63,
  type: "white"
}
```

界面根据数据生成。

未来扩展：

-   MIDI
-   乐谱

都依赖这个数据模型。

## 统一输入边界

所有输入源必须统一经过 Input Layer：

    Keyboard、Mouse、USB MIDI、Bluetooth MIDI、Playback
                            ↓
                        Input Layer
                            ↓
                 Application State、Piano、Grand Staff、Browser Sound

输入源不得直接驱动 Piano、Grand Staff 或 Browser Sound。Input Layer 只提供
`pressNote()` 和 `releaseNote()`，不感知具体输入来源。

------------------------------------------------------------------------

# 5. 当前限制

## 键盘范围

当前：

-   完整 88 键钢琴（A0-C8）
-   音符包含完整音高信息，例如 A0、C4、C#5、C8

当前已通过 USB MIDI 和 Bluetooth MIDI 支持完整键盘输入。

## 音频系统

当前：

-   使用电脑 Web Audio API 发声

计划：

-   支持外部 MIDI 设备自带音源
-   后续优化钢琴音色

## UI界面

当前：

-   基础应用布局
-   Header、Toolbar、Grand Staff、Piano、Status Bar
-   高音谱表实时显示当前按下的音符
-   A0-C8 完整 88 键钢琴
-   键盘音名显示模式：隐藏、仅白键、仅 C 音、全部
-   88 键钢琴在 Piano 区域内横向滚动，保持现有琴键尺寸
-   电脑键盘基准音控制和当前映射范围状态显示
-   Bluetooth MIDI 独立连接面板和设备状态显示
-   桌面端全宽布局、固定底部 88 键 Piano 和响应式黑键位置

计划：

-   UI 精细美化
-   真正的训练模式
-   更好的视觉反馈

------------------------------------------------------------------------

# 6. 第 3 阶段开发计划

## 钢琴训练工具 v0.2

------------------------------------------------------------------------

## 6.1 双八度键盘

状态：已完成

目标：

扩展当前单八度键盘。

已完成：

-   修改钢琴数据模型，增加 `pitchClass` 与 `octave`
-   支持 C4-B5 共两个八度
-   根据音高自动生成频率
-   扩展电脑键盘映射
-   保持鼠标与电脑键盘输入系统

设计原因：

当前结构已经需要支持：

    C3
    C4
    C5

因此音符数据不能只使用：

    C
    D
    E

而需要包含完整音高信息。

------------------------------------------------------------------------

## 6.2 声音控制

状态：已完成

增加：

-   电脑声音开关
-   默认开启浏览器声音
-   关闭后不播放声音，但保留琴键动画、鼠标输入和电脑键盘输入

原因：

部分 MIDI 键盘拥有自己的音源。

如果：

    MIDI键盘发声
    +
    电脑Web Audio发声

可能产生重复声音。

因此用户应该可以选择：

-   使用电脑声音
-   使用外部设备声音

------------------------------------------------------------------------

## 6.3 界面重构

状态：基础主布局已完成，精细美化仍在计划中

目标：

从 Demo 界面升级为完整应用。

已完成：

-   应用标题
-   基础控制面板
-   Grand Staff 占位区域
-   状态栏

计划：

-   模式选择
-   更好的钢琴布局

------------------------------------------------------------------------

## 6.4 视奏模式

状态：第一版高音谱表实时显示已完成

目标：

逐步增加五线谱训练。

已完成：

-   显示高音谱表
-   将 C4-B5 映射到音头位置
-   同步当前按下的多个音符
-   松开琴键后立即移除音符
-   同一音头位置的自然音和升号音合并显示
-   支持升号（♯）显示

当前限制：

-   暂不显示低音谱表
-   仅支持升号（♯），暂不支持降号（♭）、重升号和重降号
-   暂不显示符干、拍号和小节线
-   不记录音符历史，不滚动，不播放动画

未来考虑：

-   增加低音谱表
-   增加变音记号
-   评估是否使用专业乐谱渲染库，例如 VexFlow

------------------------------------------------------------------------

## 6.5 输入系统重构（P4-002）

状态：已完成

已完成：

-   建立统一 Input Layer，仅负责 `pressNote()` 和 `releaseNote()`
-   将电脑键盘映射计算移动到 Keyboard Mapper
-   由 Keyboard Controller 管理浏览器键盘事件和活动键
-   支持 `A0-G6` 范围内的任意合法自然音基准
-   白键使用 `A` 到 `'`，黑键使用 `WERTYUIOP[` 候选位置
-   左右箭头按 12 个半音移动基准音
-   切换基准音时释放仍按下的电脑键盘音符
-   鼠标输入和电脑键盘输入均经过 Input Layer

输入链路：

    Keyboard Controller
            ↓
    Keyboard Mapper
            ↓
    Input Layer
            ↓
    App 音符状态、音频和 Grand Staff

Input Layer 不感知 Keyboard、基准音或具体输入来源，便于未来接入 MIDI、
Playback 等输入源。

本阶段不包含 MIDI、Playback、Practice Mode、Metronome 或 Toolbar 整体重构。

------------------------------------------------------------------------

## 6.6 Web MIDI 技术验证（P4-003）

状态：已完成

已完成：

-   检测浏览器 Web MIDI API 支持情况
-   通过用户操作请求 MIDI 权限
-   获取 MIDI Input 设备名称、制造商和连接状态
-   支持用户选择并连接一个 MIDI Input
-   连接成功后在 Status Bar 显示设备状态
-   在 Console 输出 Note On、Note Off、Note Number 和 Velocity

架构边界：

-   Web MIDI 逻辑位于 `src/midi/webMidi.ts`
-   MIDI 面板位于 `src/components/MidiMonitor.tsx`
-   当前不接入 Input Layer
-   当前不驱动 Piano、Grand Staff 或 Audio
-   当前只监听一个 MIDI Input

本阶段是技术验证，不包含 MIDI 演奏逻辑、MIDI Output、Bluetooth MIDI、
Sustain Pedal 或完整 Velocity 处理。

------------------------------------------------------------------------

## 6.7 MIDI 输入接入（P4-004）

状态：已完成

已完成：

-   MIDI Input 通过 `MidiInputController` 接入 Input Layer
-   USB MIDI 通过独立的 `MidiNoteController` 处理 MIDI 音符状态
-   使用 `midiNumberToPianoNote()` 将 MIDI Note Number 转换为 Piano Note
-   使用 `pianoNoteToMidiNumber()` 提供反向转换能力
-   Note On 调用 `pressNote()`
-   Note Off 或 Note On + Velocity 0 调用 `releaseNote()`
-   支持 MIDI 多键同时按下
-   忽略 A0-C8 之外的 MIDI 音符
-   防止重复 Note On、重复 Note Off 和设备断开卡键
-   保持 Browser Sound 开关逻辑不变

输入链路：

    MIDI Input
          ↓
    Web MIDI Adapter
          ↓
    MidiInputController
          ↓
    MidiNoteController
          ↓
    Input Layer
          ↓
    Piano、Grand Staff、Browser Sound

明确不包含：

-   MIDI Velocity 响应
-   Bluetooth MIDI、MIDI Output、Sustain Pedal、Aftertouch、Pitch Bend
-   Program Change
-   多个 MIDI Input 同时监听

技术债：

-   当前 Input Layer 按音名管理状态。
-   Keyboard、Mouse、USB MIDI、Bluetooth MIDI 同时按下同一个音符时，释放顺序可能存在冲突。
-   后续可通过 Input Source 或引用计数机制解决。
-   本 Issue 不处理该问题。

------------------------------------------------------------------------

## 6.8 原生 Bluetooth LE MIDI 支持（P4-005）

状态：已完成

已完成：

-   检测 Web Bluetooth API 和安全上下文
-   通过浏览器原生设备选择窗口选择一个 BLE MIDI 设备
-   连接 BLE MIDI Service 和 Data I/O Characteristic
-   解析 BLE MIDI 时间戳、Running Status 和多消息数据包
-   支持 Note On、Note Off 和 Note On + Velocity 0
-   通过 `BluetoothMidiController` 接入 Input Layer
-   使用独立的 `MidiNoteController` 管理 Bluetooth MIDI 活动音符
-   支持多键同时按下
-   断开设备后释放所有 Bluetooth MIDI 活动音符
-   Status Bar 显示 Bluetooth MIDI 设备连接状态
-   已通过 ES120G 实机验证连接、Note On、Note Off 和断开释放

输入链路：

    Bluetooth Device
            ↓
    Web Bluetooth Adapter
            ↓
    BLE MIDI Parser
            ↓
    BluetoothMidiController
            ↓
    MidiNoteController
            ↓
    Input Layer
            ↓
    Piano、Grand Staff、Browser Sound

职责边界：

-   `webBluetooth.ts` 负责浏览器 API、GATT 连接、Characteristic Notification
    和设备断开事件。
-   `bleMidiParser.ts` 只负责 BLE MIDI 协议解析，不负责连接和音符状态。
-   `BluetoothMidiController` 负责 Bluetooth 连接、接收 Notification 并调用 Parser。
-   `MidiNoteController` 统一负责 MIDI Note On、Note Off、Velocity 0、音符转换、
    Active Note 管理和 Input Layer 调用。
-   USB MIDI 与 Bluetooth MIDI 各自持有独立的 `MidiNoteController` 实例。

浏览器限制：

-   第一版目标为支持 Web Bluetooth 的 Chrome / Edge。
-   Web Bluetooth 需要安全上下文，并且设备选择必须由用户操作触发。
-   Firefox、Safari 等不支持浏览器显示明确提示。

明确不包含：

-   Bluetooth MIDI Output
-   Sustain Pedal、Aftertouch、Pitch Bend 和 Velocity 响应
-   自动重连
-   多个 Bluetooth MIDI 设备同时连接
-   其他非 Note On / Note Off MIDI 消息

技术债：

-   当前 Input Layer 按音名管理状态。
-   Keyboard、Mouse、USB MIDI、Bluetooth MIDI 同时按下同一个音符时，释放顺序可能冲突。
-   多输入源同音符引用计数作为后续独立 Issue 处理。

------------------------------------------------------------------------

# 7. 第 5 阶段开发计划

## P5-001 主页面布局重构

状态：已完成

已完成：

-   页面主体扩展为桌面端全宽布局，内容最大宽度约 `1920px`
-   Grand Staff 扩展为主要视觉区域，高度约 `320px`
-   88 键虚拟钢琴固定在 viewport 底部
-   Main Content 使用与 Piano Dock 共用的底部安全空间变量
-   52 个白键根据可用宽度自适应显示
-   黑键位置基于白键索引计算百分比，不依赖旧版像素宽度
-   默认无需横向滚动即可显示完整 A0-C8
-   保持 Hidden、White Keys、C Notes、All 四种 Key Labels 模式
-   保持 Keyboard、Mouse、USB MIDI、Bluetooth MIDI 输入功能

布局结构：

    Header / Toolbar
            ↓
    Main Content
      ├── Grand Staff
      └── Status Bar
            ↓
    Fixed Piano Dock

设计边界：

-   Piano Dock 与主内容使用统一的最大宽度体系。
-   黑键位置完全基于白键索引和百分比，不依赖旧版像素宽度。
-   Grand Staff 仅扩大容器，保留现有 SVG viewBox 和音符坐标逻辑。
-   不使用全局 `overflow-x: hidden` 掩盖布局溢出。

明确不包含：

-   Bass Staff、Ledger Lines、Recording、Playback、Practice Mode 或 Metronome
-   完整视觉主题重设计或移动端专项适配
-   Input Layer、MidiNoteController、Browser Sound 和现有音符业务逻辑重构

------------------------------------------------------------------------

## P5-002 完整 Grand Staff

状态：已完成

已完成：

-   使用一个统一 SVG 绘制 Treble Staff 和 Bass Staff。
-   增加 Treble Clef、Bass Clef 和左侧 Grand Staff 连接结构。
-   支持完整 A0-C8 音域，超出五线范围的音符使用完整 Ledger Lines。
-   `C4` 及以上分配到高音谱表，`B3` 及以下分配到低音谱表。
-   使用 `diatonicStep → Staff Assignment → staffStep` 计算音符位置。
-   Sharp 不改变 staffStep，只在音符左侧显示升号。
-   不同实际音高保留独立音符头，即使它们拥有相同 staffStep。
-   当前和弦共享主要横向位置，仅在相邻音符或同 staffStep 发生碰撞时局部错位。
-   Ledger Lines 按 `staff + staffStep` 去重，避免重复绘制。
-   保持 `viewBox`、`preserveAspectRatio` 和响应式页面布局。

数据流：

    App pressedNotes
            ↓
    GrandStaff
            ↓
    staff.ts 音高位置模型
            ↓
    Staff Assignment / staffStep
            ↓
    SVG 音符、升号和 Ledger Lines

设计边界：

-   Grand Staff 只负责当前活动音符的实时显示。
-   不实现音符时值、符干、符尾、节奏、小节线、调号或谱面滚动。
-   不直接连接 Keyboard、Mouse、USB MIDI 或 Bluetooth MIDI Controller。
-   不修改 Input Layer、MidiNoteController、Piano 或 Browser Sound。

------------------------------------------------------------------------

## P5-003 主界面交互布局重构

状态：已完成

页面结构：

    Header
    Toolbar
    Main Stage
      ├── Grand Staff
      └── Status Bar
    Input & Piano Dock
      ├── Keyboard Mapping
      ├── USB MIDI
      ├── Bluetooth MIDI
      ├── Web Sound
      └── 88-Key Piano
    Popover Layer

已完成：

-   Toolbar 仅保留 Practice、Metronome，并统一使用 Button 风格。
-   Web Sound 移动到 Input & Piano Dock 右侧，与 USB MIDI、Bluetooth MIDI 同组，声音逻辑保持不变。
-   Key Labels 移动到 Input & Piano Dock，通过锚定 Popover 选择 Hidden、White Keys、C Notes、All。
-   Browser Sound 通过 Button 的 Active / Inactive 状态表达开关。
-   Keyboard Base 从 Toolbar 移动到 Input & Piano Dock，映射逻辑保持不变。
-   Keyboard Base 与 Keyboard Range 合并为一个带边框的 Keyboard Mapping 复合控件。
-   Keyboard Mapping 中间按钮直接显示完整 Range；点击后通过 Keyboard Base Popover 选择 Base，左右按钮使用三角方向图标按八度移动。
-   USB MIDI、Bluetooth MIDI 入口移动到 Input & Piano Dock。
-   顶部与底部按钮统一高度、内边距、圆角、边框、字号和状态样式。
-   状态型按钮使用“功能名称 + 当前状态”双行结构，状态变化不改变按钮尺寸。
-   Dock 左侧放置 Keyboard Mapping、Key Labels，右侧放置 Web Sound、USB MIDI、Bluetooth。
-   USB MIDI、Bluetooth MIDI 使用紧凑的统一状态按钮，完整设备名称仅在 Popover 内显示。
-   MIDI、Bluetooth 和 Key Labels 管理界面改为锚定触发按钮的 Popover，不进入页面文档流。
-   所有 Popover 支持 Close Button、Escape、外部点击关闭和背景滚动锁定。
-   Popover 按内容分为紧凑和宽面板，并使用统一内容留白与 viewport 安全边距。
-   Input Controls 增加垂直空间，避免按钮边框或圆角被 Dock 容器裁切。
-   Grand Staff 通过统一比例放大 SVG 内容，P5-002 音高几何模型保持不变。

连接状态原则：

-   `midiConnectionState` 和 `bluetoothConnectionState` 仅作为真实连接流程的 UI 映射。
-   连接开始、成功、失败、用户取消、主动断开和设备物理断开均同步更新状态。
-   不形成独立于真实设备连接的第二套 MIDI / Bluetooth 状态机。

设计边界：

-   不修改 Input Layer、MidiNoteController、Keyboard Mapper、Keyboard Controller。
-   不修改 Web MIDI、Web Bluetooth、BLE MIDI Parser 或 Browser Sound 架构。
-   不实现 Theme、Practice Mode、Recording、Playback、Metronome 逻辑或移动端专项设计。

------------------------------------------------------------------------

# 8. 后续规划

## 练习模式

可能加入：

-   随机音符练习
-   正确率统计
-   分数系统
-   反应时间统计

## MIDI支持

已完成基础 USB MIDI 和 Bluetooth MIDI Input 接入，后续可能加入：

-   MIDI键盘输入
-   MIDI力度（Velocity）
-   外部乐器支持

------------------------------------------------------------------------

# 9. 开发流程

新增功能时：

1.  讨论需求和设计方案
2.  确认架构影响
3.  修改代码
4.  测试功能
5.  Git提交版本
6.  提交开发总结，并明确记录 `Technical Debt`
7.  等待 Product 验收和 Tech Lead Review
8.  验收通过后关闭 Issue

每次提交总结必须包含：

-   Commit 信息
-   修改文件
-   实现内容
-   没有修改的范围
-   验证结果
-   `Technical Debt`：填写“无”或列出明确的技术债

避免：

-   一次性大规模重构
-   为未来需求过度设计

------------------------------------------------------------------------

# 10. 当前Git版本

当前开发版本：

    v0.2.0 钢琴训练工具
    第 3.1 阶段、第 3.2 阶段、P3-003、P4-001、P4-002、P4-003、P4-004、P4-005、P5-001、P5-002、P5-003 已完成，尚未正式发布

最新稳定版本：

    v0.1.0
    钢琴核心

------------------------------------------------------------------------

# 11. 文档职责

| 文件 | 作用 | 更新频率 |
| --- | --- | --- |
| `README.md` | 给第一次访问项目的人看 | 很少改，仅在主要功能或使用方式变化时更新 |
| `PROJECT_CONTEXT_CN.md` | 当前项目状态、架构、设计原则 | 每个大版本更新 |
| `ROADMAP.md` | 下一步计划、任务完成情况 | 每个开发阶段更新 |
| `CHANGELOG.md` | 记录每个版本新增和变更内容 | 每次发布更新 |
