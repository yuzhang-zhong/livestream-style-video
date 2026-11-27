<!-- lang: zh-en | rig: overhead-showcase-rig | style: opensource-mascot -->
# 直播视角机位与画风设定卡 / Livestream POV Rig & Style DNA Card

| Dimension / 维度 | Locked Specification / 锁定参数 |
| --- | --- |
| **Host / 主播** | `GodoBot` |
| **Camera Rig / 直播机位** | `overhead-showcase-rig` — 桌面带货 / 开箱微距对焦手势展示机位 (45° Desk-Clamp / Beauty-Tech Autofocus Showcase Rig) |
| **Visual Style / 画风适配包** | `opensource-mascot` — 经典开源吉祥物角色 IP 直播画风（Linux 企鹅 Tux · Rust 螃蟹 Ferris · Godot 齿轮机器人） (Iconic Open-Source Character IPs (Linux Tux, Rust Ferris CC0, Godot Bot MIT)) |
| **Optics & Mount / 镜头与架设** | 35mm俯拍/平视桌面夹持机位，快速连续自动对焦（AF-C），环形补光灯在展示物表面形成清晰圆环高光<br>35mm clean desk-clamp camera with fast continuous autofocus (AF-C), ring-light circular specular reflections on held item |
| **Shake & Physics / 物理运动反馈** | 桌面C型支架完全固定；主播将物品递至距镜头20cm处并以手掌托底触发网红微距对焦切换 |
| **4th-Wall Eye-Line / 眼神互动轴** | 主播视线在手中展示物、0°主镜头指点细节与侧方平板弹幕屏之间精准切换 |
| **Microphone Lock / 麦克风方位锁** | `lavalier` — 衣领处夹持一枚紧凑型无线领夹麦克风发射器 |
| **Lighting / 直播补光方案** | `clean-beauty-softbox` — 高显色度双柔光箱配合环形灯通透布光，商品材质高光锐利清晰，干净整洁直播台面 |
| **Style Invariants / 画风防崩几何锁** | 精致3D棚拍级开源吉祥物角色主播：圆润黑白配金黄扁嘴的戴耳机Linux企鹅Tux、活力亮橙色(#F74C00)圆壳大眼CC0开源小螃蟹Ferris，或钴蓝色(#478CBF)头顶齿轮配发光圆眼与分段嘴条的MIT开源机器人主播——哑光潮玩软胶质感配通透轮廓光，零恐怖谷人像感<br>charming 3D studio-lit open-source mascot streamer: plump obsidian-and-snow Linux Tux penguin with golden beak & studio headphones, bright-tangerine (#F74C00) CC0 Rust Ferris crab with round scalloped shell & cute pincers, or cobalt-blue (#478CBF) MIT gear-head robot mascot with top cogs, glowing circular LED eyes, and segmented mouth-bar—rendered in tactile satin-matte vinyl with crisp rim light and zero uncanny humanization |
| **HUD Strategy / 弹幕UI分层策略** | `clean-post-hud` — 在可灵/即梦/Sora/万相中生成100%无UI文字的纯净底片（严禁AI直出弹幕防乱码），再通过 `render_preview.mjs` 或剪辑软件无损叠加高清 LIVE 角标、在线人数、滚动弹幕与PK条。 |
| **Track Compositing / 分轨合成规范** | 单轨纯净底片原则：先生成无任何文字涂层的纯净镜头画面，后置叠加高清直播间角标与滚动弹幕。 |

## 三态首帧锚定提示词 / 3-State Setup Anchor Prompts

### English Setup Sheet Prompt (Midjourney / Flux / Sora / GPT-4o Image)

```text
9:16 Livestream Setup Reference Sheet (3-panel consistency anchor for host "GodoBot"): Panel 1 [0° Primary Live Frame]: 35mm clean desk-clamp camera with fast continuous autofocus (AF-C), ring-light circular specular reflections on held item, charming 3D studio-lit open-source mascot streamer: plump obsidian-and-snow Linux Tux penguin with golden beak & studio headphones, bright-tangerine (#F74C00) CC0 Rust Ferris crab with round scalloped shell & cute pincers, or cobalt-blue (#478CBF) MIT gear-head robot mascot with top cogs, glowing circular LED eyes, and segmented mouth-bar—rendered in tactile satin-matte vinyl with crisp rim light and zero uncanny humanization, compact clip-on wireless lavalier microphone transmitter clipped to collar/lapel, bright high-CRI dual studio softbox + ring-light illumination, crisp specular highlights on product packaging, clean clutter-free studio counter, direct eye-contact into the lens as if greeting live chat; Panel 2 [15° Chat-Read Glance]: exact same room, outfit, and mic position, eyes flicked 15 degrees off-axis reading a glowing secondary chat monitor with subtle smile; Panel 3 [Rig & Optical Side Diagram]: clean side-view showing camera mount distance, ring-light placement, and room background props. Clean raw camera feed, zero burned-in UI text, zero platform watermarks.
```

### 中文首帧直播间参考卡提示词 (即梦 / 可灵 / 通义万相)

```text
9:16 直播间跨镜头一致性三态锚定参考卡（主播「GodoBot」）：左格【0°主镜头直视态】：35mm俯拍/平视桌面夹持机位，快速连续自动对焦（AF-C），环形补光灯在展示物表面形成清晰圆环高光，精致3D棚拍级开源吉祥物角色主播：圆润黑白配金黄扁嘴的戴耳机Linux企鹅Tux、活力亮橙色(#F74C00)圆壳大眼CC0开源小螃蟹Ferris，或钴蓝色(#478CBF)头顶齿轮配发光圆眼与分段嘴条的MIT开源机器人主播——哑光潮玩软胶质感配通透轮廓光，零恐怖谷人像感，衣领处夹持一枚紧凑型无线领夹麦克风发射器，高显色度双柔光箱配合环形灯通透布光，商品材质高光锐利清晰，干净整洁直播台面，眼神0°直视镜头向直播间观众打招呼；中格【15°偏轴读弹幕态】：完全相同的房间陈设、穿搭与麦克风左右位置，视线偏转15°扫向副屏弹幕并露出实时反应；右格【机位与补光侧视锚点】：清晰交代摄像头架设距离、环形灯/霓虹光源方位与背景固定摆件。画面保持100%纯净无UI文字底片，零平台水印、零乱码弹幕。
```

## 负向防跑偏词 / Negative Prompts

- **EN Negative**: `uncanny human skin face on animal/robot mascot, creepy mannequin head, realistic slimy crustacean legs, rusty horror metal, extra human fingers, burned-in gibberish UI text, floating omniscient crane camera, detached movie scene ignoring the lens, garbled AI-generated chat text, fake TikTok/Douyin/Twitch logo watermarks, microphone switching sides`
- **ZH Negative**: `动物或机器人吉祥物长出恐怖谷真人脸，诡异假人头，写实粘液甲壳虫腿，恐怖生锈废铁，多余人类手指，画面内烘死的乱码UI，上帝视角电影摇臂空镜，角色无视镜头演戏，AI直出乱码弹幕文字，虚假平台Logo水印，麦克风跨镜头左右跳位`
