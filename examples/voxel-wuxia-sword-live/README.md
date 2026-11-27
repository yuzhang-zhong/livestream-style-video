# 05 · Voxel 8x8x8 Wuxia Flying-Sword Cloud Commute Selfie Live / 体素像素风剑修御剑早高峰户外自拍（Minecraft 体素 × 仙侠跨题材）

15-second (`9:16`, 4-shot) **Livestream POV** package compiled with `--template voxel-wuxia-sword-live --engine hailuo --platform douyin`.

| 9:16 Animated Preview (Post-HUD) | 4-Shot Storyboard Contact Sheet |
| :---: | :---: |
| <a href="assets/voxel_wuxia_sword_live.mp4"><img src="assets/voxel_wuxia_sword_live.gif" width="210" alt="Voxel 8x8x8 Wuxia Flying-Sword Cloud Commute Selfie Live 9:16 preview" /></a> | <img src="assets/storyboard_sheet.zh.png" width="560" alt="Voxel 8x8x8 Wuxia Flying-Sword Cloud Commute Selfie Live 4-shot contact sheet" /> |

## Package contents

- [`assets/voxel_wuxia_sword_live.mp4`](assets/voxel_wuxia_sword_live.mp4): offline 720p `9:16` preview video (`H.264 MP4 + synthesized live audio + douyin HUD`)
- [`assets/storyboard_sheet.zh.png`](assets/storyboard_sheet.zh.png) · [`en`](assets/storyboard_sheet.en.png): Chinese and English HD 4-shot contact sheets
- [`rig_card.md`](rig_card.md): Camera Rig (`handheld-selfie-irl`) + Style (`voxel-sandbox`) DNA card and 3-state setup anchor prompt
- [`storyboard.md`](storyboard.md) · [`prompts.json`](prompts.json): Clean-Plate first-frame & `hailuo` motion prompts + Post-HUD popup timeline
- [`drift_report.md`](drift_report.md): 8-gate anti-drift verification report (**PASS**)

## Reproduce

```bash
node scripts/rig_spec.mjs --rig handheld-selfie-irl --style voxel-sandbox --host "青云像素剑修" --lang zh-en --out examples/voxel-wuxia-sword-live/rig_card.md
node scripts/shot_compiler.mjs --template voxel-wuxia-sword-live --duration 15 --engine hailuo --platform douyin --lang zh-en --out examples/voxel-wuxia-sword-live/storyboard.md
node scripts/shot_compiler.mjs --template voxel-wuxia-sword-live --duration 15 --engine hailuo --platform douyin --json --out examples/voxel-wuxia-sword-live/prompts.json
node scripts/drift_check.mjs --pack examples/voxel-wuxia-sword-live/prompts.json --engine hailuo --lang zh-en --out examples/voxel-wuxia-sword-live/drift_report.md
```
