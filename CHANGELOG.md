# Changelog

## 2.0.0

- Replaced all uncanny human-mannequin sample characters with charismatic, non-uncanny **Duolingo-inspired geometric mascots & flat-3D casts** (`LingoOwl`, `Lila`), **Open-Source Mascot IPs** (`Linux Tux`, `CC0 Rust Ferris the Crab`, `MIT Godot-inspired Gear-Bot`), **Crisp `8×8×8` Nearest-Neighbor Voxel Wuxia**, and **Sculpted-UGC Roblox R6** (`3D bangs`, `pigtails`, `backwards cap`, `Speed Coil`, `hoodie pockets`).
- Expanded orthogonal visual style matrix to `8 Rigs × 8 Styles` (`duolingo-mascot`, `opensource-mascot`, `roblox-blocky`, `voxel-sandbox`, `stylized-3d`, `anime-vtuber`, `cinematic-genre-adapt`, `realistic-irl`) with dedicated anti-drift protections in `scripts/drift_check.mjs`.
- Upgraded `scripts/render_preview.mjs` & `scripts/compose_hud.py` to HD rendering: soft shadows, 2-tap ambient occlusion, procedural hotel/night-market/wood floors, `540×960` vector HUD rasterization, `720×1280` (720p) `crf 19` H.264 MP4 output, and 2-pass `ffmpeg palettegen + paletteuse` 256-color GIFs.
- Redesigned `platform_hud_atlas` and `camera_rigs_atlas` into large `3×2` (`360×640` per card) high-contrast layouts so every HUD pill, danmaku comment, and popup is effortlessly readable directly inside GitHub's README width.

## 1.1.0

- Added bespoke plot-reactive bilingual danmaku streams, commerce item titles, and Q&A questions across all 8 sample packages, 5-platform HUD atlas, and 6-rig camera atlas.
- Upgraded `scripts/compose_hud.py` with pixel-width text fitting (`fit_text_px`), Kuaishou inline danmaku combo badges (`x18`), unobstructed background heart-fountain layering, and calibrated `[AF-C LOCK]` macro brackets.
- Enhanced 3D raymarched props in `scripts/render_preview.mjs` (sculpted red-crowned white spirit crane, blocky cyan-gold mythic dragon, palm-backed autofocus gesture, mechanical RGB keycap grid, and dark-bezel chat smartphone).
- Added a real-time 60fps 3-scene `<canvas>` clean-plate camera previewer (`studio-irl`, `wuxia-sword`, `roblox-obby`) + synced PiP facecam to `studio/index.html`, verified via REA static & Playwright browser scenarios.

## 1.0.0

- Initial release of `livestream-style-video` Agent Skill.
- Universal 8-Rig × 6-Style Livestream Perspective Engine supporting general/realistic AI video (`realistic-irl`), canonical Roblox blocky rigs (`roblox-blocky`), anime/VTuber (`anime-vtuber`), stylized 3D (`stylized-3d`), voxel sandbox (`voxel-sandbox`), and cross-genre/period plot adaptation (`cinematic-genre-adapt`).
- Freeform `--plot` to 4-beat / 8-beat Livestream POV storyboard translator and multi-engine prompt compiler (`local3d`, Kling, Seedance/Jimeng, Hailuo, Wan, Sora, Veo, Runway) in `scripts/shot_compiler.mjs`.
- Clean-Plate vs. Post-HUD separation workflow and 8-gate Unicode-safe anti-drift linter in `scripts/drift_check.mjs`.
- Cross-platform offline 9:16 3D raymarched livestream preview renderer with detachable HUD overlays, synchronized PiP facecam, 50/50 PK split-screen, WAV live SFX, GIF, and H.264 MP4 export in `scripts/render_preview.mjs`.
- 8 complete checked-in sample packages (`5` general/cross-genre AI video samples + `3` Roblox livestream samples) and showcase atlases.
