# 01 · Feather-Green Owl Mascot Midnight Streak-Check Webcam Live / 多邻国风翠羽猫头鹰午夜查岗直播（Duolingo 几何萌宠风）

15-second (`9:16`, 4-shot) **Livestream POV** package compiled with `--template duolingo-owl-streak-cam --engine kling --platform douyin`.

| 9:16 Animated Preview (Post-HUD) | 4-Shot Storyboard Contact Sheet |
| :---: | :---: |
| <a href="assets/duolingo_owl_streak_cam.mp4"><img src="assets/duolingo_owl_streak_cam.gif" width="210" alt="Feather-Green Owl Mascot Midnight Streak-Check Webcam Live 9:16 preview" /></a> | <img src="assets/storyboard_sheet.zh.png" width="560" alt="Feather-Green Owl Mascot Midnight Streak-Check Webcam Live 4-shot contact sheet" /> |

## Package contents

- [`assets/duolingo_owl_streak_cam.mp4`](assets/duolingo_owl_streak_cam.mp4): offline 720p `9:16` preview video (`H.264 MP4 + synthesized live audio + douyin HUD`)
- [`assets/storyboard_sheet.zh.png`](assets/storyboard_sheet.zh.png) · [`en`](assets/storyboard_sheet.en.png): Chinese and English HD 4-shot contact sheets
- [`rig_card.md`](rig_card.md): Camera Rig (`desktop-webcam`) + Style (`duolingo-mascot`) DNA card and 3-state setup anchor prompt
- [`storyboard.md`](storyboard.md) · [`prompts.json`](prompts.json): Clean-Plate first-frame & `kling` motion prompts + Post-HUD popup timeline
- [`drift_report.md`](drift_report.md): 8-gate anti-drift verification report (**PASS**)

## Reproduce

```bash
node scripts/rig_spec.mjs --rig desktop-webcam --style duolingo-mascot --host "LingoOwl" --lang zh-en --out examples/duolingo-owl-streak-cam/rig_card.md
node scripts/shot_compiler.mjs --template duolingo-owl-streak-cam --duration 15 --engine kling --platform douyin --lang zh-en --out examples/duolingo-owl-streak-cam/storyboard.md
node scripts/shot_compiler.mjs --template duolingo-owl-streak-cam --duration 15 --engine kling --platform douyin --json --out examples/duolingo-owl-streak-cam/prompts.json
node scripts/drift_check.mjs --pack examples/duolingo-owl-streak-cam/prompts.json --engine kling --lang zh-en --out examples/duolingo-owl-streak-cam/drift_report.md
```
