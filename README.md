# Piano Trainer 🎹

A browser-based piano practice and manual score-writing tool built with React and TypeScript.

一个基于 React 和 TypeScript 构建的浏览器钢琴练习与手动录谱工具。

## Score Editor / 乐谱编辑（未发布）

新增独立的「乐谱编辑」选项卡，与 Trainer 共用底部 Keyboard / MIDI 输入。
先自由试音，松键后会在实际插入锚点高亮预览音高与输入时值，再确认写入；预览不推移已有谱面。“插入 / 当前”两行分别处理新增内容和已选事件，当前音高通过最近试音替换。
Editor 与 Trainer 共用大谱表纵向几何，中央 C 位于高低音谱之间的正中。
支持乐谱本地手动保存、刷新恢复及 JSON 导入导出，以及单按钮播放 / 暂停、可拖动的播放进度和可输入或每次 ±10 调整的 30–240 BPM。

第一版为固定 4/4、单声部（支持同时起止的和弦），适合分开记录旋律和和弦。
乐谱以 MIDI 音高和拍位保存，为后续简谱、吉他谱展示留出扩展空间；这些转换尚未实现。

使用方法、数据格式和限制见 [SCORE_EDITOR.md](SCORE_EDITOR.md)。Trainer 的练习流程继续保留。

## Features / 功能

- 🎹 Responsive 88-key virtual piano keyboard (`A0-C8`)<br>
  响应式 88 键虚拟钢琴键盘
- ⌨️ Computer keyboard input with an adjustable white-key base note<br>
  支持电脑键盘输入，并可调整白键基准音
- 🖱️ Mouse click input<br>
  支持鼠标点击输入
- 🔗 Unified Input Layer for Keyboard, Mouse, USB MIDI, and Bluetooth LE MIDI<br>
  Keyboard、Mouse、USB MIDI 和 Bluetooth LE MIDI 统一经过 Input Layer
- 🎵 Real-time Web Audio playback<br>
  基于 Web Audio 的实时声音播放
- 🔊 Browser sound toggle, enabled by default<br>
  浏览器声音开关，默认开启
- 🎹 USB MIDI input through the shared Unified Input Layer<br>
  通过统一 Input Layer 接入 USB MIDI
- 📡 Bluetooth LE MIDI input through the shared Unified Input Layer<br>
  通过统一 Input Layer 接入 Bluetooth LE MIDI
- 🧩 Application layout with toolbar, Input & Piano Dock, and status bar<br>
  包含工具栏、Input & Piano Dock 和状态栏的应用布局
- 🎼 Complete Grand Staff with treble/bass staves for the full 88-key range<br>
  支持完整 88 键音域的高音谱表与低音谱表
- 🏷️ Five keyboard label display modes<br>
  五种琴键音名显示模式：Hidden、White Keys、Letter、Solfege、All
- 🎼 Independent Note Info area below Grand Staff with Off, Letter, and Solfege modes<br>
  Grand Staff 下方提供独立 Note Info 区域，支持 Off、Letter 和 Solfege 显示模式
- 🎯 Practice Canvas with a 16-note static 4/4 phrase, white-key range bounds, and configurable note pool<br>
  支持 16 音符静态 4/4 练习乐句、白键范围上下界和可配置音符池的 Practice Canvas
- 🔁 Practice Target lifecycle with release-gated cursor advancement<br>
  支持等待当前目标音符释放后再推进 Cursor 的 Practice Target 生命周期
- 🎼 White and black key support<br>
  支持白键和黑键
- 🎶 Multi-note playback<br>
  支持多音同时播放
- 🖥️ Responsive desktop layout with a fixed 88-key Input & Piano Dock<br>
  响应式桌面布局和固定底部 88 键 Input & Piano Dock
- 🪟 Anchored Popover interaction for settings, USB MIDI, and Bluetooth MIDI<br>
  设置、USB MIDI 和 Bluetooth MIDI 使用锚定 Popover 交互
- 🎨 Dark / Light / Custom themes with Follow System and Reset behavior<br>
  支持 Dark、Light、Custom 主题，以及跟随系统和 Reset 行为
- 🎨 Theme Token and CSS Variable system for semantic visual colors<br>
  使用 Theme Token 和 CSS Variable 统一管理语义视觉颜色
- 🎨 Note Color drives Grand Staff notes and derived white/black Piano highlights<br>
  Note Color 同步驱动 Grand Staff 音符，并派生白键、黑键高亮颜色

The computer keyboard maps white keys from `A` through `'` and uses
`WERTYUIOP[` as candidate black-key positions. Keyboard Mapping in the Input &
Piano Dock selects the base note and moves it by one octave with the arrow buttons.
The default base is `E3`, placing middle C (`C4`) on `H`. Web Sound, MIDI Input,
and Bluetooth MIDI controls are grouped in the same dock. MIDI Input can drive the
same Piano, Grand Staff, and Browser Sound flow through the shared Input Layer.
Bluetooth LE MIDI uses the Web Bluetooth API and is available through the
Bluetooth button in the Input & Piano Dock in supported secure Chromium browsers.

电脑键盘使用 `A` 到 `'` 映射白键，并使用 `WERTYUIOP[` 作为黑键候选位置。
Input & Piano Dock 中的 Keyboard Mapping 可以选择基准音，并通过方向按钮按八度移动。
默认基准音为 `E3`，因此中央 C（`C4`）位于 `H` 键。Web Sound、MIDI Input 和 Bluetooth MIDI
控制集中在同一个 Dock 中。MIDI Input 可以通过统一 Input Layer 驱动 Piano、Grand Staff
和 Browser Sound。在支持且使用安全上下文的 Chromium 浏览器中，可以通过 Input & Piano Dock
中的 Bluetooth 按钮使用 Web Bluetooth API 连接 Bluetooth LE MIDI。

## Tech Stack / 技术栈

- React
- TypeScript
- Vite
- Web Audio API

## Current Status / 当前状态

当前开发分支增加了乐谱编辑第一版；P6-001 至 P6-007 已完成。以下 `v0.4.0-alpha` 描述的是已发布的 P5 范围。

Version `v0.4.0-alpha` contains the completed P5 product scope: responsive 88-key
piano, Keyboard / Mouse / USB MIDI / Bluetooth LE MIDI input, the Unified Input
Layer, Complete Grand Staff, Input & Piano Dock, anchored Popover interaction,
and the Theme Token / CSS Variable appearance system. Bluetooth LE MIDI has been
verified with the ES120G.

版本 `v0.4.0-alpha` 已包含 P5 阶段的完整产品范围：响应式 88 键钢琴、Keyboard / Mouse /
USB MIDI / Bluetooth LE MIDI 输入、统一 Input Layer、完整 Grand Staff、Input & Piano Dock、
锚定 Popover 交互，以及 Theme Token / CSS Variable 外观系统。Bluetooth LE MIDI 已通过 ES120G
完成验证。

## Development / 开发

Install dependencies / 安装依赖：

```bash
npm install
```

Start the development server / 启动开发服务器：

```bash
npm run dev
```

Build and lint the project / 构建并检查项目：

```bash
npm run build
npm run lint
npm test
```

自动化测试使用 Node.js 24 的内置测试运行器及已有 TypeScript 编译器，无新增依赖。
