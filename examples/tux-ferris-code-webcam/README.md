# 03 · Open-Source Mascot Deploy Stream: Linux Tux & Rust Ferris Crab / 开源吉祥物深夜敲代码直播：Linux 企鹅 Tux 与 Rust 螃蟹踩回车（开源 IP）

15-second (`9:16`, 4-shot) **Livestream POV** package compiled with `--template tux-ferris-code-webcam --engine wan --platform x`.

| 9:16 Animated Preview (Post-HUD) | 4-Shot Storyboard Contact Sheet |
| :---: | :---: |
| <a href="assets/tux_ferris_code_webcam.mp4"><img src="assets/tux_ferris_code_webcam.gif" width="210" alt="Open-Source Mascot Deploy Stream: Linux Tux & Rust Ferris Crab 9:16 preview" /></a> | <img src="assets/storyboard_sheet.zh.png" width="560" alt="Open-Source Mascot Deploy Stream: Linux Tux & Rust Ferris Crab 4-shot contact sheet" /> |

## Package contents

- [`assets/tux_ferris_code_webcam.mp4`](assets/tux_ferris_code_webcam.mp4): offline 720p `9:16` preview video (`H.264 MP4 + synthesized live audio + x HUD`)
- [`assets/storyboard_sheet.zh.png`](assets/storyboard_sheet.zh.png) · [`en`](assets/storyboard_sheet.en.png): Chinese and English HD 4-shot contact sheets
- [`rig_card.md`](rig_card.md): Camera Rig (`desktop-webcam`) + Style (`opensource-mascot`) DNA card and 3-state setup anchor prompt
- [`storyboard.md`](storyboard.md) · [`prompts.json`](prompts.json): Clean-Plate first-frame & `wan` motion prompts + Post-HUD popup timeline
- [`drift_report.md`](drift_report.md): 8-gate anti-drift verification report (**PASS**)

## Reproduce

```bash
node scripts/rig_spec.mjs --rig desktop-webcam --style opensource-mascot --host "@tux_kernel" --lang zh-en --out examples/tux-ferris-code-webcam/rig_card.md
node scripts/shot_compiler.mjs --template tux-ferris-code-webcam --duration 15 --engine wan --platform x --lang zh-en --out examples/tux-ferris-code-webcam/storyboard.md
node scripts/shot_compiler.mjs --template tux-ferris-code-webcam --duration 15 --engine wan --platform x --json --out examples/tux-ferris-code-webcam/prompts.json
node scripts/drift_check.mjs --pack examples/tux-ferris-code-webcam/prompts.json --engine wan --lang zh-en --out examples/tux-ferris-code-webcam/drift_report.md
```
