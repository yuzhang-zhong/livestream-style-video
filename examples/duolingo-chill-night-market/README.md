# 02 · Duolingo-Style Geometric Cast Night-Market Chili Skewer Selfie / 多邻国扁平3D风紫发酷妹夜市辣串自拍（几何角色风）

15-second (`9:16`, 4-shot) **Livestream POV** package compiled with `--template duolingo-chill-night-market --engine seedance --platform douyin`.

| 9:16 Animated Preview (Post-HUD) | 4-Shot Storyboard Contact Sheet |
| :---: | :---: |
| <a href="assets/duolingo_chill_night_market.mp4"><img src="assets/duolingo_chill_night_market.gif" width="210" alt="Duolingo-Style Geometric Cast Night-Market Chili Skewer Selfie 9:16 preview" /></a> | <img src="assets/storyboard_sheet.zh.png" width="560" alt="Duolingo-Style Geometric Cast Night-Market Chili Skewer Selfie 4-shot contact sheet" /> |

## Package contents

- [`assets/duolingo_chill_night_market.mp4`](assets/duolingo_chill_night_market.mp4): offline 720p `9:16` preview video (`H.264 MP4 + synthesized live audio + douyin HUD`)
- [`assets/storyboard_sheet.zh.png`](assets/storyboard_sheet.zh.png) · [`en`](assets/storyboard_sheet.en.png): Chinese and English HD 4-shot contact sheets
- [`rig_card.md`](rig_card.md): Camera Rig (`handheld-selfie-irl`) + Style (`duolingo-mascot`) DNA card and 3-state setup anchor prompt
- [`storyboard.md`](storyboard.md) · [`prompts.json`](prompts.json): Clean-Plate first-frame & `seedance` motion prompts + Post-HUD popup timeline
- [`drift_report.md`](drift_report.md): 8-gate anti-drift verification report (**PASS**)

## Reproduce

```bash
node scripts/rig_spec.mjs --rig handheld-selfie-irl --style duolingo-mascot --host "Lila" --lang zh-en --out examples/duolingo-chill-night-market/rig_card.md
node scripts/shot_compiler.mjs --template duolingo-chill-night-market --duration 15 --engine seedance --platform douyin --lang zh-en --out examples/duolingo-chill-night-market/storyboard.md
node scripts/shot_compiler.mjs --template duolingo-chill-night-market --duration 15 --engine seedance --platform douyin --json --out examples/duolingo-chill-night-market/prompts.json
node scripts/drift_check.mjs --pack examples/duolingo-chill-night-market/prompts.json --engine seedance --lang zh-en --out examples/duolingo-chill-night-market/drift_report.md
```
