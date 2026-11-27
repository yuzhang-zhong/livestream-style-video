<!-- lang: zh-en | rig: handheld-selfie-irl | style: duolingo-mascot -->
# 直播视角机位与画风设定卡 / Livestream POV Rig & Style DNA Card

| Dimension / 维度 | Locked Specification / 锁定参数 |
| --- | --- |
| **Host / 主播** | `Lila` |
| **Camera Rig / 直播机位** | `handheld-selfie-irl` — 手持自拍杆 / 口袋云台超广角户外移动直播机位 (Arm's-Length Ultra-Wide Handheld Selfie / Gimbal IRL Rig) |
| **Visual Style / 画风适配包** | `duolingo-mascot` — 多邻国风高饱和圆润几何萌宠 / 扁平 3D 角色直播画风 (Duolingo-Inspired Rounded Geometric Mascot & Bold Cast Style) |
| **Optics & Mount / 镜头与架设** | 18mm–20mm超广角手机前置/口袋云台一臂距离（55–70cm）自拍透视，带轻微近大远小畸变<br>18mm–20mm ultra-wide front-facing smartphone or pocket gimbal lens at arm's length (55–70cm), slight perspective foreshortening |
| **Shake & Physics / 物理运动反馈** | 机位与主播伸出的持机手臂物理绑定：随步伐自然呼吸起伏，急转身带轻微水平倾角与自动曝光过渡 |
| **4th-Wall Eye-Line / 眼神互动轴** | 主播边走边直视手持前置镜头互动，偶而向下偏8°扫视手机屏幕下半区滚动弹幕 |
| **Microphone Lock / 麦克风方位锁** | `lavalier` — 衣领处夹持一枚紧凑型无线领夹麦克风发射器 |
| **Lighting / 直播补光方案** | `night-neon-irl` — 中景街头霓虹灯牌流光溢彩，一臂距离的手机屏幕冷白光自然照亮主播面部，真实夜间手机自动曝光质感 |
| **Style Invariants / 画风防崩几何锁** | 高饱和多邻国风圆润几何萌宠与扁平3D角色美学：饱满胶囊球体几何比例、翠羽绿(#58CC02)/琥珀黄(#FFC800)/莓果紫(#CE82FF)哑光软陶质感、超大号胶囊白眼仁配灵动瞳孔与粗线条悬浮表情眉、Q弹翅膀/圆润几何短臂互动，彻底杜绝恐怖谷假人比例与写实毛孔<br>vibrant flat-shaded 3D rounded geometric mascot & bold world-character aesthetic: plump pill-and-sphere silhouette, feather-green (#58CC02) / beak-amber (#FFC800) / berry-violet (#CE82FF) matte-clay palette, oversized expressive white pill-shaped eyes with crisp pupils and thick floating geometric eyebrow bars, bouncy squash-and-stretch wing/flipper/pill-arm gestures, zero uncanny human skin pores or mannequin proportions |
| **HUD Strategy / 弹幕UI分层策略** | `clean-post-hud` — 在可灵/即梦/Sora/万相中生成100%无UI文字的纯净底片（严禁AI直出弹幕防乱码），再通过 `render_preview.mjs` 或剪辑软件无损叠加高清 LIVE 角标、在线人数、滚动弹幕与PK条。 |
| **Track Compositing / 分轨合成规范** | 单轨纯净底片原则：先生成无任何文字涂层的纯净镜头画面，后置叠加高清直播间角标与滚动弹幕。 |

## 三态首帧锚定提示词 / 3-State Setup Anchor Prompts

### English Setup Sheet Prompt (Midjourney / Flux / Sora / GPT-4o Image)

```text
9:16 Livestream Setup Reference Sheet (3-panel consistency anchor for host "Lila"): Panel 1 [0° Primary Live Frame]: 18mm–20mm ultra-wide front-facing smartphone or pocket gimbal lens at arm's length (55–70cm), slight perspective foreshortening, vibrant flat-shaded 3D rounded geometric mascot & bold world-character aesthetic: plump pill-and-sphere silhouette, feather-green (#58CC02) / beak-amber (#FFC800) / berry-violet (#CE82FF) matte-clay palette, oversized expressive white pill-shaped eyes with crisp pupils and thick floating geometric eyebrow bars, bouncy squash-and-stretch wing/flipper/pill-arm gestures, zero uncanny human skin pores or mannequin proportions, compact clip-on wireless lavalier microphone transmitter clipped to collar/lapel, vibrant night-street neon signage bokeh in mid-ground, cool-white smartphone screen glow illuminating the host's face from arm's length, natural night auto-ISO texture, direct eye-contact into the lens as if greeting live chat; Panel 2 [15° Chat-Read Glance]: exact same room, outfit, and mic position, eyes flicked 15 degrees off-axis reading a glowing secondary chat monitor with subtle smile; Panel 3 [Rig & Optical Side Diagram]: clean side-view showing camera mount distance, ring-light placement, and room background props. Clean raw camera feed, zero burned-in UI text, zero platform watermarks.
```

### 中文首帧直播间参考卡提示词 (即梦 / 可灵 / 通义万相)

```text
9:16 直播间跨镜头一致性三态锚定参考卡（主播「Lila」）：左格【0°主镜头直视态】：18mm–20mm超广角手机前置/口袋云台一臂距离（55–70cm）自拍透视，带轻微近大远小畸变，高饱和多邻国风圆润几何萌宠与扁平3D角色美学：饱满胶囊球体几何比例、翠羽绿(#58CC02)/琥珀黄(#FFC800)/莓果紫(#CE82FF)哑光软陶质感、超大号胶囊白眼仁配灵动瞳孔与粗线条悬浮表情眉、Q弹翅膀/圆润几何短臂互动，彻底杜绝恐怖谷假人比例与写实毛孔，衣领处夹持一枚紧凑型无线领夹麦克风发射器，中景街头霓虹灯牌流光溢彩，一臂距离的手机屏幕冷白光自然照亮主播面部，真实夜间手机自动曝光质感，眼神0°直视镜头向直播间观众打招呼；中格【15°偏轴读弹幕态】：完全相同的房间陈设、穿搭与麦克风左右位置，视线偏转15°扫向副屏弹幕并露出实时反应；右格【机位与补光侧视锚点】：清晰交代摄像头架设距离、环形灯/霓虹光源方位与背景固定摆件。画面保持100%纯净无UI文字底片，零平台水印、零乱码弹幕。
```

## 负向防跑偏词 / Negative Prompts

- **EN Negative**: `uncanny valley mannequin face, realistic human nose/ears/pores, creepy bald plastic doll, desaturated muddy colors, sharp realistic bird feathers/talons, official trademarked brand wordmarks, burned-in gibberish UI text, floating omniscient crane camera, detached movie scene ignoring the lens, garbled AI-generated chat text, fake TikTok/Douyin/Twitch logo watermarks, microphone switching sides`
- **ZH Negative**: `恐怖谷光头假人模型，写实真人鼻耳毛孔，阴暗脏污色调，写实尖锐鸟喙利爪，官方品牌字标水印，画面内烘死的乱码弹幕UI，上帝视角电影摇臂空镜，角色无视镜头演戏，AI直出乱码弹幕文字，虚假平台Logo水印，麦克风跨镜头左右跳位`
