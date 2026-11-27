#!/usr/bin/env node
/**
 * shot_compiler.mjs
 * Zero-dependency Universal Plot-to-Livestream POV Storyboard & Multi-Engine Prompt Compiler.
 *
 * Supports:
 * 1. Built-in 8 flagship templates (5 General/Cross-Genre AI Video + 3 Roblox Livestream POV)
 * 2. Custom declarative episode specs (`--spec <episode.json>`)
 * 3. Arbitrary freeform story/plot translation (`--plot "<any story>" --style <id> --rig <id> --platform <id>`)
 * 4. Clean-Plate I2V/T2V prompt compilation for `local3d`, `kling`, `seedance`, `hailuo`, `wan`, `sora`, `veo`, `runway`
 * 5. Deterministic Post-HUD event timelines (`douyin`, `kuaishou`, `instagram`, `x`, `tiktok`, `clean`)
 */

import fs from "node:fs";
import path from "node:path";
import {
  RIG_PROFILES,
  STYLE_ADAPTERS,
  LIGHTING_PRESETS,
  buildRigSpec,
  normalizeLang
} from "./rig_spec.mjs";
import { resolvePlatformPreset, buildShotHudTimeline } from "./hud_presets.mjs";

export { normalizeLang };

export const ENGINE_PROFILES = {
  local3d: { nativeClipSeconds: 4.0, label: "Local 3D + Post-HUD Direct Video Engine (render_preview.mjs)" },
  kling: { nativeClipSeconds: 5.0, label: "Kling 2.0 I2V Clean-Plate (5s native -> trim to beat)" },
  seedance: { nativeClipSeconds: 5.0, label: "Seedance / Jimeng First+Last Frame I2V Clean-Plate" },
  hailuo: { nativeClipSeconds: 6.0, label: "Hailuo Director I2V ([Bracketed Camera] + Clean-Plate)" },
  wan: { nativeClipSeconds: 5.0, label: "Wan 2.6 14B I2V/T2V Clean-Plate" },
  sora: { nativeClipSeconds: 5.0, label: "Sora Physical Camera Rig I2V/T2V Clean-Plate" },
  veo: { nativeClipSeconds: 6.0, label: "Veo 3 Native Live-Audio + Clean-Plate Camera Rig" },
  runway: { nativeClipSeconds: 5.0, label: "Runway Gen-4 Camera-Locked I2V Clean-Plate" }
};

export const TEMPLATES = {
  "duolingo-owl-streak-cam": {
    slug: "duolingo_owl_streak_cam",
    category: "mascot-and-opensource-ip",
    titleZh: "多邻国风翠羽猫头鹰午夜查岗直播（Duolingo 几何萌宠风）",
    titleEn: "Feather-Green Owl Mascot Midnight Streak-Check Webcam Live",
    style: "duolingo-mascot",
    rig: "desktop-webcam",
    lighting: "ring-rgb-studio",
    platform: "douyin",
    host: "LingoOwl",
    backdrop: "owl_studio",
    subjectEn:
      "a plump, vibrant feather-green (#58CC02) Duolingo-inspired rounded geometric owl mascot streamer with a lime-green scalloped belly patch, golden-amber (#FFC800) two-part beak, oversized white pill-shaped eyes with thick floating green brow bars, wearing studio headphones behind a left-mounted matte-black condenser boom mic",
    subjectZh:
      "饱满圆润的多邻国风翠羽绿(#58CC02)几何猫头鹰萌宠主播（浅绿扇纹肚皮、琥珀黄立体圆喙、超大号胶囊白眼仁配粗线条悬浮表情眉、头戴监听耳机），坐在左置哑光黑悬臂麦直播台后",
    shots: [
      {
        role: "Hook / 午夜微笑查岗立Flag",
        durationSec: 3.5,
        actionEn:
          "waves one plump green wing cheerfully toward the 0° monitor-top webcam while pointing the other wing at a glowing '23:58' desk flip-clock",
        actionZh:
          "对着显示器顶端0°广角摄像头元气满满地挥动右侧翠绿圆翅膀打招呼，左翅指向桌面上显示「23:58」的发光翻页钟提醒打卡",
        eyeLineEn: "sweet 0° direct webcam lens eye-contact with arched cheerful brow bars",
        eyeLineZh: "弯起开心粗眉0°直视主摄像头温柔微笑催打卡",
        cameraEn: "Locked 24mm monitor-top webcam at 6° downward tilt, crisp vibrant matte-clay studio lighting",
        cameraZh: "锁死在显示器顶端的24mm广角摄像头，高饱和通透软陶棚拍布光",
        hailuoTag: "[Static shot]",
        sfxCue: "chime",
        sfx: "清脆打卡叮咚声 + 呆萌拍翅噗噗声",
        caption: "宝子们晚上好呀～距离断签还有最后两分钟哦！",
        hudPopup: "join_toast"
      },
      {
        role: "Proof / 偏轴扫视借口弹幕眯眼",
        durationSec: 4.0,
        actionEn:
          "leans closer to the desk mic and flicks its oversized pupils 15° right to read viewer excuses in live chat as its thick green brow bars lower into a suspicious squint",
        actionZh:
          "圆滚滚的身子凑近悬臂麦，超大号黑瞳孔向右侧15°副屏扫视满屏『明天一定学』的借口弹幕，头顶粗绿眉缓缓压低成怀疑凝视",
        eyeLineEn: "15° off-axis chat-monitor squint shifting slowly back toward 0° webcam",
        eyeLineZh: "15°偏轴半眯眼审视副屏弹幕，随即缓缓转回0°主镜头",
        cameraEn: "Identical locked 24mm webcam frame with green screen-glow reflection",
        cameraZh: "固定24mm桌面机位，副屏冷光映在圆润羽冠边缘",
        hailuoTag: "[Push in]",
        sfxCue: "clack",
        sfx: "低沉审视嗡鸣音 + 密集弹幕滚动声",
        caption: "弹幕说『在忙着刷视频没空背单词』？我记本本上了",
        hudPopup: "commerce_card"
      },
      {
        role: "Twist / 红光骤亮掏出365连胜火苗",
        durationSec: 4.0,
        actionEn:
          "studio RGB rim-lights snap to dramatic crimson as the green owl raises a giant glowing orange '365 STREAK' flame trophy right up to the lens with intense V-angled brows",
        actionZh:
          "背景RGB灯带瞬间切换为压迫感红光，绿鸟主播双眉倒竖呈犀利V字，双翅猛地举起一枚发光的「365连胜火苗」奖牌怼到镜头前震慑全场",
        eyeLineEn: "unblinking 0° extreme close-up lens stare behind the glowing flame icon",
        eyeLineZh: "隔着熊熊燃烧的连胜火苗0°不眨眼怼脸凝视摄像头",
        cameraEn: "Locked 24mm webcam shaking briefly from the trophy thump on the desk",
        cameraZh: "24mm固定机位随奖牌砸桌产生真实高频微震",
        hailuoTag: "[Shake, Push in]",
        sfxCue: "siren",
        sfx: "压迫感重低音咚声 + 火苗燃起呼啸声",
        caption: "断签还是现在立刻学五分钟？看着我的眼睛回答！",
        hudPopup: "gift_combo"
      },
      {
        role: "Payoff / 秒变星星眼拍翅撒花收尾",
        durationSec: 3.5,
        actionEn:
          "the instant chat completes the lesson, studio lights flip back to sunny rainbow pastel as the owl hops happily flapping both wings with sparkly joyful eyes",
        actionZh:
          "看到弹幕刷屏『已打卡保住连胜』瞬间，灯光秒回明快彩虹色，绿鸟一秒切换弯弯笑眼原地Q弹蹦跳拍翅庆祝",
        eyeLineEn: "15° happy check of streak counter back to 0° joyful wing-wave",
        eyeLineZh: "15°满意看一眼连胜后台，转回0°开心拍翅比心",
        cameraEn: "Locked 24mm studio webcam loop return",
        cameraZh: "固定24mm明快直播间构图无缝回扣开场",
        hailuoTag: "[Static shot]",
        sfxCue: "win",
        sfx: "经典通关胜利欢呼号角 + 满屏礼物连击叮声",
        caption: "连胜保住啦！明天23:58我们继续不见不散哦～",
        hudPopup: "gift_combo_peak"
      }
    ]
  },

  "duolingo-chill-night-market": {
    slug: "duolingo_chill_night_market",
    category: "mascot-and-opensource-ip",
    titleZh: "多邻国扁平3D风紫发酷妹夜市辣串自拍（几何角色风）",
    titleEn: "Duolingo-Style Geometric Cast Night-Market Chili Skewer Selfie",
    style: "duolingo-mascot",
    rig: "handheld-selfie-irl",
    lighting: "night-neon-irl",
    platform: "douyin",
    host: "Lila",
    backdrop: "night_market",
    subjectEn:
      "a bold Duolingo-world-inspired flat-3D geometric character ('Lila') with a rounded matte-clay peach head, rosy circular blush cheeks, sculpted deep-violet bob hair with straight geometric bangs, oversized half-lidded expressive pill eyes, and a chunky lavender striped sweater, extending right pill-arm to hold an 18mm selfie gimbal",
    subjectZh:
      "多邻国角色体系风格的扁平3D圆润几何酷妹「Lila」（柔和圆方粉肤头部配圆形珊瑚腮红、深紫几何齐刘海波波头、半耷拉死鱼眼大眼仁配紫粗眉、穿浅紫条纹宽松毛衣），右臂前伸一臂持18mm前置自拍云台",
    shots: [
      {
        role: "Hook / 死鱼眼酷妹夜市开播立Flag",
        durationSec: 3.5,
        actionEn:
          "strolls past glowing red-and-gold night-market lanterns while casually pointing left rounded hand at a sizzling chili-oil skewer stall and addressing the 0° selfie lens",
        actionZh:
          "慢悠悠走过挂满红金灯笼的霓虹夜市摊，左手圆润短臂随手反指身后的变态辣红油烤串摊，用标志性半耷拉酷眼0°直视前置镜头",
        eyeLineEn: "cool half-lidded 0° front-camera eye-contact, quick 8° downward glance at phone chat",
        eyeLineZh: "酷感半眯眼0°直视手持前置镜头，顺势向下8°扫视弹幕挑衅",
        cameraEn: "18mm ultra-wide arm's-length selfie tracking shot with warm lantern bokeh",
        cameraZh: "18mm一臂距离超广角自拍跟走机位，背景红黄夜市灯笼流光溢彩",
        hailuoTag: "[Pull out, Shake]",
        sfxCue: "chime",
        sfx: "夜市滋滋烟火声 + 酷感开播提示音",
        caption: "弹幕赌我吃不下一串十倍辣？呵，小看谁呢。",
        hudPopup: "join_toast"
      },
      {
        role: "Proof / 微距怼脸展示红油辣串",
        durationSec: 4.0,
        actionEn:
          "holds a bright-red chili skewer 20cm from the smartphone lens with her flat rounded left hand behind it so continuous autofocus locks onto the glistening spice coat",
        actionZh:
          "将裹满红亮辣椒油的烤串举到距镜头20厘米处，左手圆润手掌平摊在后方托底触发微距自动对焦",
        eyeLineEn: "peeks around the foreground skewer into 0° lens to confirm focus lock",
        eyeLineZh: "从前景烤串旁探出齐刘海脑袋0°确认微距合焦清晰",
        cameraEn: "Arm's-length 18mm selfie frame with crisp foreground macro focus pull",
        cameraZh: "手持前置超广角近景微距锁死红油烤串",
        hailuoTag: "[Static shot]",
        sfxCue: "boing",
        sfx: "烤串滋滋冒油声 + 对焦清脆锁定音",
        caption: "手掌托底给你们看清楚，满满一层魔鬼椒！",
        hudPopup: "commerce_card"
      },
      {
        role: "Twist / 一口破功全脸涨红破防",
        durationSec: 4.0,
        actionEn:
          "takes one bite and her cool half-lidded eyes instantly pop into giant wide circular shock as bright-coral blush spreads across her cheeks and the selfie arm trembles",
        actionZh:
          "淡定咬下一口后，原本高冷的半耷拉眼瞬间瞪成超大号震惊圆眼，珊瑚红晕一下漫过整张圆脸，举自拍杆的手臂疯狂发抖",
        eyeLineEn: "giant watering pill-eyes locked at 0° into the front lens in total panic",
        eyeLineZh: "破功瞪圆大眼0°死死盯住前置镜头，头顶呆毛炸起",
        cameraEn: "Close 18mm selfie framing with comedic spicy-tremor shake",
        cameraZh: "贴脸超广角前置构图伴随手抖高频微震",
        hailuoTag: "[Push in, Shake]",
        sfxCue: "buzz",
        sfx: "咔嚓咬下声 + 蒸汽喷发滑稽音效",
        caption: "等一下……我人设要崩了快拿水来！！",
        hudPopup: "gift_combo"
      },
      {
        role: "Payoff / 狂炫超大冰柠檬茶回血",
        durationSec: 3.5,
        actionEn:
          "hugs an oversized yellow iced lemon-tea boba cup and gulps furiously through the straw while darting her eyes down 8° at the laughing chat stream",
        actionZh:
          "双手抱住超大杯黄色手打冰柠檬茶疯狂吨吨猛吸，眼神往下8°瞟向满屏刷『酷妹破防』的哈哈弹幕",
        eyeLineEn: "8° downward read of laughing danmaku returning to grumpy 0° glare",
        eyeLineZh: "下瞥手机弹幕区后给出委屈又嘴硬的0°凝视",
        cameraEn: "Stabilized 18mm night-market selfie close-up",
        cameraZh: "恢复平稳的夜市灯笼夜景前置自拍收尾",
        hailuoTag: "[Static shot]",
        sfxCue: "win",
        sfx: "吨吨吸管猛喝声 + 满屏礼物飘屏叮声",
        caption: "刚刚那段不许录屏！！谁发切片我拉黑谁！",
        hudPopup: "gift_combo_peak"
      }
    ]
  },

  "tux-ferris-code-webcam": {
    slug: "tux_ferris_code_webcam",
    category: "mascot-and-opensource-ip",
    titleZh: "开源吉祥物深夜敲代码直播：Linux 企鹅 Tux 与 Rust 螃蟹踩回车（开源 IP）",
    titleEn: "Open-Source Mascot Deploy Stream: Linux Tux & Rust Ferris Crab",
    style: "opensource-mascot",
    rig: "desktop-webcam",
    lighting: "warm-desk-lamp",
    platform: "x",
    host: "@tux_kernel",
    backdrop: "study_room",
    subjectEn:
      "plump satin-matte Linux Tux penguin mascot (glossy obsidian-black feathers, crisp snow-white belly, golden-orange contoured beak, purple-cyan RGB studio headphones) seated at a warm-lit developer desk with a recessed-keycap RGB mechanical keyboard, accompanied by CC0 bright-tangerine (#F74C00) Rust Ferris the Crab",
    subjectZh:
      "圆润呆萌的开源Linux企鹅Tux主播（曜石黑羽绒配雪白圆肚皮、金黄立体扁嘴、头戴紫青双色RGB监听大耳机）坐在摆着背光机械键盘与双联代码屏的深夜书桌前，身旁藏着亮橙色(#F74C00)CC0开源吉祥物Rust小螃蟹Ferris",
    shots: [
      {
        role: "Hook / 企鹅Tux深夜敲内核读弹幕",
        durationSec: 3.5,
        actionEn:
          "Tux types briskly on the glowing RGB mechanical keyboard with both black flippers, glances 15° right at chat, and gives a cheerful flipper salute to the 0° monitor-top webcam",
        actionZh:
          "戴耳机的企鹅Tux双翅飞快敲击RGB背光机械键盘，眼神偏15°扫过一条弹幕后，对着显示器上方0°摄像头帅气拍翅敬礼",
        eyeLineEn: "15° chat-monitor read shifting cleanly to bright 0° webcam eye-contact",
        eyeLineZh: "15°扫副屏弹幕后切回0°主摄像头圆环眼神光对视",
        cameraEn: "Locked 24mm monitor-top webcam at 6° downward tilt, cyan shelf rim-light behind",
        cameraZh: "锁死在显示器顶端的24mm广角摄像头，背景书架透出极客青色灯带",
        hailuoTag: "[Static shot]",
        sfxCue: "clack",
        sfx: "清脆青轴机械键盘麻将音 + 深夜主机低鸣",
        caption: "2:00 AM kernel stream — running final checks before Friday freeze",
        hudPopup: "join_toast"
      },
      {
        role: "Proof / 企鹅举马克杯·小螃蟹偷探头",
        durationSec: 4.0,
        actionEn:
          "Tux lifts a white coffee mug toward the 0° webcam in a sleepy toast while bright-orange Rust Ferris the Crab quietly pops its stalk-eyes and cute claws up beside the mug",
        actionZh:
          "企鹅Tux举起白色咖啡马克杯朝0°镜头隔空干杯，而书桌右侧亮橙色小螃蟹Ferris悄悄探出两只圆眼睛与小钳子（弹幕疯狂预警）",
        eyeLineEn: "Tux looks 0° at webcam unaware as Ferris's glossy eyes peek at the glowing Enter key",
        eyeLineZh: "Tux看0°镜头浑然不觉，小螃蟹Ferris圆眼直勾勾盯上发光回车键",
        cameraEn: "Identical locked 24mm monitor-top webcam framing",
        cameraZh: "完全一致的24mm固定显示器机位展现戏剧反差",
        hailuoTag: "[Static shot]",
        sfxCue: "chime",
        sfx: "轻举瓷杯声 + 小螃蟹咔嗒碎步声",
        caption: "Just one sip of coffee, definitely NOT deploying on Friday night...",
        hudPopup: "join_toast"
      },
      {
        role: "Twist / 小螃蟹飞扑一钳子砸下回车",
        durationSec: 4.0,
        actionEn:
          "orange Ferris the Crab scuttle-leaps squarely onto the glowing mechanical keyboard, slamming both orange claws onto the Enter key as Tux's eyes widen in horror",
        actionZh:
          "亮橙色小螃蟹Ferris横着腾空一跃精准降落在机械键盘中央，两只橙色小蟹钳结结实实砸下回车键，Tux双眼瞬间瞪成铜铃",
        eyeLineEn: "screen deploy flash illuminates Tux's wide shocked eyes staring down at Ferris",
        eyeLineZh: "终端强制上线白光映亮企鹅Tux震惊放大的双眼",
        cameraEn: "Locked monitor-top webcam jolting briefly from Ferris landing on the desk",
        cameraZh: "24mm摄像头随小螃蟹落地产生真实桌面微震",
        hailuoTag: "[Shake, Static shot]",
        sfxCue: "drop",
        sfx: "蟹壳落地咔哒声 + 回车重击音 + 服务器警报叮声",
        caption: "FERRIS NO!! THAT WAS `git push --force origin main`!!",
        hudPopup: "gift_combo"
      },
      {
        role: "Payoff / 企鹅与小螃蟹同步盯镜头社死",
        durationSec: 3.5,
        actionEn:
          "Tux holds both flippers on its head while orange Ferris sits innocently on the keyboard waving a tiny claw—both staring straight up into the 0° webcam together",
        actionZh:
          "双翅抱头石化的企鹅Tux与端坐在键盘上无辜挥小钳子的橙色螃蟹Ferris同步抬头，齐刷刷0°死死盯住显示器顶端的摄像头",
        eyeLineEn: "synchronized 0° direct webcam stare from both Linux Tux and Rust Ferris",
        eyeLineZh: "一企鹅一螃蟹同步0°凝视主摄像头定格成开源名画",
        cameraEn: "Locked 24mm monitor-top webcam payoff",
        cameraZh: "固定24mm桌面机位神同步定格收尾",
        hailuoTag: "[Static shot]",
        sfxCue: "win",
        sfx: "螃蟹无辜夹钳咔嚓声 + 满屏六色飘心音效",
        caption: "Rewrite it in Rust they said... chat please don't clip this 💀",
        hudPopup: "gift_combo_peak"
      }
    ]
  },

  "godot-bot-unboxing-af": {
    slug: "godot_bot_unboxing_af",
    category: "mascot-and-opensource-ip",
    titleZh: "开源蓝齿轮机器人微距托底开箱弹飞直播（Godot 机器人风）",
    titleEn: "Open-Source Blue Gear-Bot [AF-C] Mystery Box Unboxing Live",
    style: "opensource-mascot",
    rig: "overhead-showcase-rig",
    lighting: "clean-beauty-softbox",
    platform: "kuaishou",
    host: "GodoBot",
    backdrop: "unboxing_desk",
    subjectEn:
      "an endearing MIT open-source-inspired cobalt-blue (#478CBF) chamfered gear-head robot mascot streamer ('GodoBot') with three chunky top gear cogs, glowing circular white LED eyes, a segmented white mouth-bar, and articulated white-and-blue studio arms seated behind a clean desk with a locked left boom mic",
    subjectZh:
      "讨喜的MIT开源风钴蓝色(#478CBF)倒角齿轮机器人主播「GodoBot」（头顶三枚圆润机械齿、发光圆形白环LED眼、白色分段机械嘴条、蓝白拼色圆角机械臂），端坐在带左置悬臂麦的高显色测评直播台后",
    shots: [
      {
        role: "Hook / 齿轮机器人敲盒开播测评",
        durationSec: 3.5,
        actionEn:
          "GodoBot taps a sealed brushed-silver mystery gadget cube twice with its rounded blue-and-white mechanical hand and tilts its gear-head cheerfully toward the 35mm lens",
        actionZh:
          "蓝色齿轮机器人用圆角蓝白机械手轻敲两下桌面密封银色机关盲盒，歪起齿轮脑袋对着35mm桌面镜头闪烁开心LED圆眼",
        eyeLineEn: "glowing LED eyes lock 0° into lens then flick 15° to side comment tablet",
        eyeLineZh: "发光LED圆眼0°直视主镜头互动，随后偏15°扫一眼平板弹幕",
        cameraEn: "Locked 35mm slightly high-angle desk-clamp camera, crisp f/4 studio softbox clarity",
        cameraZh: "固定35mm微俯角桌面夹持直播机位，双柔光箱通透高画质",
        hailuoTag: "[Static shot]",
        sfxCue: "clack",
        sfx: "清脆金属敲盒声 + 机器人欢快电子滴声",
        caption: "老铁们久等啦！今天实测全网最神秘的开源硬件盲盒！",
        hudPopup: "join_toast"
      },
      {
        role: "Proof / 机械手掌托底触发AF-C微距锁焦",
        durationSec: 4.0,
        actionEn:
          "holds the metallic gadget cube 18cm from the 35mm lens with its flat white mechanical left palm behind it so continuous autofocus locks sharply onto the red top button",
        actionZh:
          "右机械臂将银色盲盒递到距镜头18厘米处，左机械平掌稳稳立在盒子后方做网红托底对焦手势，触发[AF-C]秒锁盒顶红钮",
        eyeLineEn: "peeks glowing LED eyes around the held cube into 0° lens to verify focus",
        eyeLineZh: "从前景金属盒旁探出蓝色齿轮头0°确认微距合焦",
        cameraEn: "Locked 35mm desk-clamp shot with smooth continuous AF-C focus pull onto foreground cube",
        cameraZh: "固定桌面机位平滑拉近微距焦点锁死前景机关盒",
        hailuoTag: "[Push in]",
        sfxCue: "chime",
        sfx: "自动对焦马达合焦音 + 伺服关节轻响",
        caption: "专业机械手掌托底！这铝合金倒角细节够顶吧？",
        hudPopup: "commerce_card"
      },
      {
        role: "Twist / 弹簧金星玩偶炸开撞歪麦杆",
        durationSec: 4.0,
        actionEn:
          "presses the red button on the desk and a glowing golden star-slime mascot rockets upward on a coil spring, bumping the boom mic and jolting GodoBot backward in its chair",
        actionZh:
          "放回桌面按下红钮瞬间，盒内发光金色星星团子乘着弹簧猛窜升空擦碰悬臂麦，吓得齿轮机器人LED眼变成大圆圈往后仰倒",
        eyeLineEn: "wide ring-LED eyes track the upward pop then snap 0° to camera in shock",
        eyeLineZh: "LED眼瞬间缩成震惊圆环追随弹起金星，随即猛看0°镜头",
        cameraEn: "Locked desk-clamp camera with authentic brief desk-thump micro-shake",
        cameraZh: "固定桌面支架伴随弹簧炸开瞬间的真实高频微震",
        hailuoTag: "[Shake, Static shot]",
        sfxCue: "boing",
        sfx: "强力弹簧嘭声 + 电子惊呼哔哔声",
        caption: "警报！！弹射初速度超标！！差点把芯片吓掉线！",
        hudPopup: "gift_combo"
      },
      {
        role: "Payoff / 弯弯LED笑眼指弹幕求安慰",
        durationSec: 3.5,
        actionEn:
          "GodoBot cradles the bouncy golden star mascot on the desk as its LED eyes turn into happy '^_^' arcs while pointing right mechanical hand at the 15° chat screen",
        actionZh:
          "齿轮机器人按住Q弹金色星星玩偶，LED眼切换成弯弯开心弧线(^_^)，抬起右机械手指着侧方15°刷满666的弹幕屏互动",
        eyeLineEn: "15° chat-screen laugh returning to warm 0° webcam wave",
        eyeLineZh: "15°看满屏老铁弹幕乐开花，转回0°朝镜头挥手",
        cameraEn: "Locked 35mm studio desk framing matching Shot 1",
        cameraZh: "固定35mm明亮直播台构图完美回扣开场",
        hailuoTag: "[Static shot]",
        sfxCue: "win",
        sfx: "治愈电子合成笑声 + 黄金穿云箭连击音",
        caption: "刷『机器人吓出BUG』的老铁点个关注不过分吧！",
        hudPopup: "gift_combo_peak"
      }
    ]
  },

  "voxel-wuxia-sword-live": {
    slug: "voxel_wuxia_sword_live",
    category: "mascot-and-opensource-ip",
    titleZh: "体素像素风剑修御剑早高峰户外自拍（Minecraft 体素 × 仙侠跨题材）",
    titleEn: "Voxel 8x8x8 Wuxia Flying-Sword Cloud Commute Selfie Live",
    style: "voxel-sandbox",
    rig: "handheld-selfie-irl",
    lighting: "daylight-outdoor-autoexp",
    platform: "douyin",
    host: "青云像素剑修",
    backdrop: "cloud_sea",
    subjectEn:
      "a crisp Minecraft-style 8x8x8 cubic voxel wuxia swordsman (sharp 90-degree 1:1:1 head with unfiltered 8x8 pixel face, Fresh-Animations sliding pixel eyes, +0.5px stepped 3D pixel dark hair & cyan jade crown, 8x12x4 azure-white robe torso, flat 4x4 fingerless square pixel hands) riding a stepped 16x16x1 glowing cyan rune sword above cubic clouds while holding an 18mm pixel jade-slip selfie cam",
    subjectZh:
      "棱角分明的8x8x8体素像素风仙侠剑修（直角立方头配清晰邻近采样8x8像素五官与灵动像素眼、+0.5px立体像素黑发与青玉道冠、8x12x4青白像素道袍躯干、无手指4x4平头像素方手），脚踏16x16x1阶梯像素发光青霜飞剑穿梭在方块云海之上，右臂举像素玉简呈18mm超广角自拍",
    shots: [
      {
        role: "Hook / 方块云海早高峰开播吐槽",
        durationSec: 3.5,
        actionEn:
          "balances atop the hovering pixel rune sword above golden-white cubic cloud blocks while raising left 4x4 square block hand to greet the 0° held jade selfie lens",
        actionZh:
          "稳稳踩在悬浮像素符文飞剑上掠过金白方块云海，举起左侧4x4平头像素方手对着一臂外0°玉简前置镜头大声打招呼吐槽早高峰",
        eyeLineEn: "expressive 2x1 pixel eyes lock 0° into the held selfie lens",
        eyeLineZh: "灵动像素双眸0°直视手持玉简自拍镜头",
        cameraEn: "18mm ultra-wide arm's-length voxel selfie POV showing cubic cloud sea below",
        cameraZh: "18mm超广角一臂像素自拍微俯视角，完整收入脚下方块云海",
        hailuoTag: "[Pull out, Shake]",
        sfxCue: "chime",
        sfx: "像素风清脆提示音 + 高空呼啸风声 + 飞剑蜂鸣",
        caption: "御剑直播间家人们早！今天三环方块剑道又堵麻了！",
        hudPopup: "join_toast"
      },
      {
        role: "Proof / 下摇展示16x16x1阶梯像素飞剑",
        durationSec: 4.0,
        actionEn:
          "tilts the held selfie cam slightly downward to showcase his pixel boots balanced on the glowing 16x16x1 stepped cyan-and-gold rune sword skimming cubic clouds",
        actionZh:
          "手腕下倾展示双脚稳稳立在16x16x1阶梯边缘自发光青金符文飞剑上，剑气划开下方层叠方块白云",
        eyeLineEn: "camera tilts down to show glowing pixel sword underfoot while keeping 0° eye-contact with the selfie lens",
        eyeLineZh: "镜头下倾实拍脚下发光像素剑身，人物稳居安全区内0°直视镜头自证",
        cameraEn: "Continuous handheld 18mm selfie tilt with BSL warm sunlight & emissive cyan sword glow",
        cameraZh: "手持前置一臂机位配合BSL暖阳轮廓光与青色方块自发光",
        hailuoTag: "[Tilt down]",
        sfxCue: "boing",
        sfx: "清越像素破空剑鸣声 + 方块气流声",
        caption: "新锻造的附魔青霜剑，百公里仅耗两颗绿宝石！",
        hudPopup: "commerce_card"
      },
      {
        role: "Twist / 体素丹顶白鹤贴脸超车抢镜",
        durationSec: 4.0,
        actionEn:
          "a cubic voxel red-crowned white spirit crane swoops right behind the swordsman's right shoulder photobombing the selfie frame and tilting the sword 12 degrees in turbulence",
        actionZh:
          "一只立体像素风丹顶白鹤突然从剑修右肩后方贴脸超车闯入自拍画面，拍动的方块白翼卷起乱流震得飞剑倾斜12度",
        eyeLineEn: "spots the voxel crane in the 0° selfie screen as 8x8 pixel eyes widen in shock",
        eyeLineZh: "从自拍屏瞥见身后像素丹顶鹤贴脸，8x8像素眼瞬间放大震惊",
        cameraEn: "18mm handheld selfie frame rolling 12° with wing-gust turbulence shake",
        cameraZh: "18mm手持前置画面随仙鹤气流产生12°真实颠簸倾斜",
        hailuoTag: "[Shake, Pan left]",
        sfxCue: "siren",
        sfx: "清亮鹤唳声 + 方块翅膀扑扇强风声",
        caption: "卧槽哪位长老放养的像素仙鹤？！超车不打转向灯啊！",
        hudPopup: "gift_combo"
      },
      {
        role: "Payoff / 像素道冠吹歪死鱼眼盯弹幕",
        durationSec: 3.5,
        actionEn:
          "steadies the hovering rune sword with his 3D pixel jade hair-crown knocked crooked and stares deadpan (-_-) into the 0° selfie lens as chat spams laughs",
        actionZh:
          "重新稳住悬停像素飞剑但头顶立体青玉道冠已被吹歪，顶着歪冠切换为平面像素死鱼眼(-_-)0°凝视刷屏哈哈弹幕",
        eyeLineEn: "8° downward read of laughing danmaku locking into deadpan 0° pixel stare",
        eyeLineZh: "下瞥一眼满屏哈哈弹幕后定格0°无语像素死鱼眼",
        cameraEn: "Stabilized arm's-length 18mm voxel cloud-sea selfie shot",
        cameraZh: "恢复平稳的方块云海超广角自拍收尾",
        hailuoTag: "[Static shot]",
        sfxCue: "win",
        sfx: "经验球清脆叮声 + 满屏礼物连击音效",
        caption: "刷『方块御剑科目三』的道友踢出宗门了啊！",
        hudPopup: "gift_combo_peak"
      }
    ]
  },

  "roblox-obby-rage-pip": {
    slug: "roblox_obby_rage_pip",
    category: "roblox-livestream",
    titleZh: "Roblox 天空跑酷实况 + 右上主播小窗破防拍桌（双轨 PiP 样本）",
    titleEn: "Roblox Sky-Obby Speedrun + PiP Streamer Desk-Slam Rage",
    style: "roblox-blocky",
    rig: "pip-facecam-rig",
    lighting: "ring-rgb-studio",
    platform: "tiktok",
    host: "BloxyKai",
    backdrop: "obby_sky",
    subjectEn:
      "dual-track Roblox SmoothPlastic livestream: Track A shows an R6 blocky obby runner (2x2x1 torso, flush 1x2x1 legs, fingerless solid block hands, 1:1 barrel head) leaping across neon sky pads; Track B PiP corner shows a chibi-blocky streamer wearing cat-ear RGB headset and boom mic in a neon bedroom",
    subjectZh:
      "双轨合成Roblox SmoothPlastic实况直播：A轨主画面为标准R6方块跑酷小人（2x2x1躯干、并拢1x2x1方腿、无手指无乐高爪实心方手、1:1桶状头）跨越天空霓虹跳台；B轨右上画中画小窗为戴猫耳RGB耳机与悬臂麦的方块主播反应特写",
    shots: [
      {
        role: "Hook / 终点前立Flag挑衅弹幕",
        durationSec: 3.5,
        actionEn:
          "the R6 obby avatar stands poised on a floating pink SmoothPlastic sky pad as the PiP headset streamer grins smugly into the 0° facecam raising one solid 1x2x1 block hand",
        actionZh:
          "A轨跑酷方块小人在粉色高空平台上蓄势待发，B轨小窗方块主播对着0°摄像头露出挑眉坏笑贴图并高举1x2x1实心平头方手立Flag",
        facecamPromptEn:
          "Locked 28mm RGB bedroom webcam close-up: Roblox chibi-blocky streamer in cat-ear headset with Check-It smirk 2D decal raises solid 1x2x1 fingerless block hand confidently toward 0° lens",
        facecamPromptZh:
          "28mm固定RGB电竞房摄像头特写：戴猫耳耳机的Roblox方块主播呈现挑眉坏笑2D贴图，朝0°镜头自信举起1x2x1无手指实心方手",
        eyeLineEn: "PiP streamer locks 0° smug eye-contact with webcam before glancing at game monitor",
        eyeLineZh: "小窗主播先0°自信怼脸看镜头，再转回紧盯游戏屏幕",
        cameraEn: "Dual-track composited: Track A high-angle 3/4 sky obby follow; Track B locked 28mm corner webcam",
        cameraZh: "A/B双轨独立生成合成：A轨高空跑酷斜俯跟拍；B轨右上圆角固定电竞房反应窗",
        hailuoTag: "[Push in]",
        chatEn: "WORLD RECORD!",
        sfxCue: "chime",
        sfx: "清脆键盘敲击声 + 跑酷准备提示音",
        caption: "Watch chat — zero-death Stage 99 speedrun!",
        hudPopup: "join_toast",
        actors: [
          { castId: "runner", fromPos: [-0.45, 0.0, 0], toPos: [-0.25, 0.0, 0], yaw: 0.45, pose: "wave", expression: "smirk", theme: "obby", backProp: "jetpack" }
        ]
      },
      {
        role: "Proof / 连跳加速冲刺终点",
        durationSec: 4.0,
        actionEn:
          "the R6 runner performs a crisp Motor6D leap across the sky gap toward the glowing emerald finish pad while the PiP streamer leans close to the glowing monitor",
        actionZh:
          "A轨R6小人迈开刚性Motor6D方腿干脆跃过云端深渊冲向翠绿终点台，B轨小窗主播身体前倾紧贴显示器蓝光屏住呼吸",
        facecamPromptEn:
          "Locked 28mm RGB webcam: Roblox blocky streamer leans forward toward cool monitor glow, flat 2D decal showing intense focused eyes and a painted blue sweat drop",
        facecamPromptZh:
          "28mm固定摄像头：Roblox方块主播前倾贴近屏幕冷光，纯平2D贴图呈现专注眼神与一滴蓝色印刷汗珠",
        eyeLineEn: "focused forward screen gaze with blue monitor reflection on smooth 1:1 barrel head",
        eyeLineZh: "专注紧盯主屏幕，平滑1:1桶状头映出显示器蓝光",
        cameraEn: "Dual-track composited: Track A dynamic side-tracking jump arc; Track B locked corner facecam",
        cameraZh: "双轨合成：A轨侧面平移捕捉跳跃抛物线；B轨锁死反应小窗",
        hailuoTag: "[Pan right]",
        chatEn: "SO CLOSE!!",
        sfxCue: "boing",
        sfx: "经典Roblox弹簧跳跃音 + 极速敲空格键声",
        caption: "One last jump to the checkpoint!!",
        hudPopup: "commerce_card",
        actors: [
          { castId: "runner", fromPos: [-0.38, 0.05, 0], toPos: [0.28, 0.34, 0], yaw: 0.48, pose: "jump", expression: "grin", theme: "obby", backProp: "jetpack" }
        ]
      },
      {
        role: "Twist / 脚尖擦碰红砖瞬间归零",
        durationSec: 4.0,
        actionEn:
          "the R6 runner's flush 1x2x1 blocky foot clips the glowing neon-red Killbrick strip right in front of the flag, triggering an instant rigid plank tumble",
        actionZh:
          "就在距离终点旗半步处，A轨小人并拢的1x2x1方腿脚尖擦碰到发光红砖(Killbrick)，全身瞬间保持刚体直挺挺侧翻坠落",
        facecamPromptEn:
          "Locked 28mm RGB webcam with impact shake: Roblox blocky streamer switches to wide hollow shocked ring eyes (O_O) 2D decal as red screen flash illuminates the desk",
        facecamPromptZh:
          "28mm固定摄像头微震：屏幕红光映亮桌面，小窗方块主播2D贴图瞬间切换为空心白圈震惊眼(O_O)",
        eyeLineEn: "PiP streamer freezes in 0_0 disbelief then snaps head 15° toward exploding chat",
        eyeLineZh: "小窗主播O_O石化后猛转15°看向刷满问号的弹幕屏",
        cameraEn: "Dual-track composited: Track A close impact shot with red highlight flash; Track B startled recoil",
        cameraZh: "双轨合成：A轨红砖碰撞微震特写；B轨主播后仰震惊",
        hailuoTag: "[Shake, Static shot]",
        chatEn: "NOOOO!!",
        sfxCue: "buzz",
        sfx: "经典Oof闷响 + 失败蜂鸣音",
        caption: "BRO MY TOE BARELY TOUCHED THE RED BRICK?!",
        hudPopup: "gift_combo",
        actors: [
          { castId: "runner", fromPos: [0.18, 0.0, 0], toPos: [0.32, -0.35, 0], yaw: 0.35, pose: "plank_fall", expression: "shocked", theme: "obby", backProp: "jetpack" }
        ]
      },
      {
        role: "Payoff / 双手刚性拍桌瀑布泪收尾",
        durationSec: 3.5,
        actionEn:
          "while the R6 avatar respawns stiffly back at Stage 1, the PiP blocky streamer pivots both solid 1x2x1 rectangular arms down to slam the desk with streaming 2D waterfall tears",
        actionZh:
          "A轨小人刚性复活回第1关起点，B轨小窗方块主播双侧1x2x1实心方臂沿肩轴猛拍书桌，脸部浮现蓝色2D瀑布流泪贴图",
        facecamPromptEn:
          "Locked 28mm RGB webcam shaking from desk slam: Roblox blocky streamer slams both fingerless solid 1x2x1 block hands flat on the desk, 2D decal streaming blue waterfall tear strips and X_X dizzy eyes",
        facecamPromptZh:
          "28mm摄像头随拍桌剧烈微震：方块主播双侧无手指1x2x1实心方手平拍桌面，2D贴图挂满蓝色瀑布宽条眼泪",
        eyeLineEn: "0° direct webcam meltdown stare while chat spams Stage 1 jokes",
        eyeLineZh: "0°对着摄像头彻底破防流泪",
        cameraEn: "Dual-track composited: Track A wide Stage 1 reset; Track B desk-slam shake close-up",
        cameraZh: "双轨合成：A轨回到起点构成循环；B轨拍桌破防收尾",
        hailuoTag: "[Shake, Pull out]",
        chatEn: "STAGE 1...",
        sfxCue: "clack",
        sfx: "清脆塑料拍桌声 + 满屏礼物飘屏叮声",
        caption: "Back to Stage 1... goodnight chat 💀",
        hudPopup: "gift_combo_peak",
        actors: [
          { castId: "runner", fromPos: [-0.45, 0.0, 0], toPos: [-0.45, 0.0, 0], yaw: 0.0, pose: "faceplant", expression: "tears", theme: "obby", backProp: "jetpack" }
        ]
      }
    ]
  },

  "roblox-doors-irl-selfie": {
    slug: "roblox_doors_irl_selfie",
    category: "roblox-livestream",
    titleZh: "Roblox 惊悚走廊自拍杆直拍 · 身后白眼突脸（Roblox IRL 样本）",
    titleEn: "Roblox DOORS Corridor Handheld Selfie-Stick Live Scare",
    style: "roblox-blocky",
    rig: "handheld-selfie-irl",
    lighting: "flashlight-dim-exploration",
    platform: "instagram",
    host: "momo_rblx",
    backdrop: "hotel_corridor",
    subjectEn:
      "an authentic Roblox SmoothPlastic R6/chibi-blocky streamer in a sky-blue hoodie (2x2x1 torso, flush 1x2x1 legs, fingerless and clawless solid 1x2x1 block hands, smooth studless 1:1 barrel head, flat 2D decal face) holding a blocky selfie-stick smartphone forward in its right block hand",
    subjectZh:
      "穿天蓝连帽卫衣的纯正Roblox SmoothPlastic方块小人主播（2x2x1躯干、并拢1x2x1方腿、无手指无乐高爪1x2x1实心平头方手、1:1平滑桶状头、2D平面五官），右侧实心方手刚性贴合举着方块自拍杆手机前置直拍",
    shots: [
      {
        role: "Hook / 050号门前压低声音开播",
        durationSec: 3.5,
        actionEn:
          "walks cautiously on smooth dark-wood hotel planks holding the selfie stick forward while pointing its left solid 1x2x1 block hand back at brass-plaqued Door 050",
        actionZh:
          "踩在平滑无凸粒的深色酒店木地板上举着自拍杆慢走，左侧1x2x1实心方手反指身后的050号黄铜牌木门向观众小声解说",
        eyeLineEn: "0° direct stare into the held blocky selfie phone with nervous 2D sweat-drop decal",
        eyeLineZh: "带着2D蓝色汗珠贴图0°紧盯手持自拍手机镜头",
        cameraEn: "18mm ultra-wide arm's-length blocky selfie-stick perspective down the dim hotel corridor",
        cameraZh: "18mm超广角方块自拍杆一臂前置视角，纵深带入幽暗酒店走廊",
        hailuoTag: "[Pull out]",
        chatEn: "DOOR 050...",
        sfxCue: "chime",
        sfx: "木地板塑料踏步声 + 低沉走廊环境音",
        caption: "Chat dared me to stream Door 050 solo... totally fine!",
        hudPopup: "join_toast",
        actors: [
          { castId: "momo", fromPos: [0.0, 0, 0.25], toPos: [0.05, 0, 0.35], yaw: 0.15, pose: "walk", expression: "smirk", theme: "commuter", handPropL: "flashlight" }
        ]
      },
      {
        role: "Proof / 壁灯骤闪盯着弹幕发愣",
        durationSec: 4.0,
        actionEn:
          "stops mid-corridor as the warm brass wall sconces flicker twice; the blocky avatar tilts its 1:1 head down 8° reading frantic chat warnings on its phone screen",
        actionZh:
          "走到走廊中央时两侧黄铜壁灯突然明灭闪烁两下，方块小人微低1:1桶状脑袋阅读手机屏幕上疯狂刷出的『快躲柜子』弹幕",
        eyeLineEn: "8° downward read of glowing phone screen before snapping back to 0° lens",
        eyeLineZh: "低头8°读手机弹幕亮光，随后疑惑抬眼看向0°前置镜头",
        cameraEn: "Handheld selfie-stick close medium shot with flickering warm-to-red corridor wall light",
        cameraZh: "手持自拍杆中近景，走廊壁灯呈现暖黄转暗红闪烁光效",
        hailuoTag: "[Static shot]",
        chatEn: "WHY HIDE??",
        sfxCue: "buzz",
        sfx: "灯泡电流滋啦闪烁声 + 密集弹幕弹出音",
        caption: "Wait why is everyone spamming HIDE right now??",
        hudPopup: "qa_pinned",
        actors: [
          { castId: "momo", fromPos: [0.05, 0, 0.35], toPos: [0.05, 0, 0.35], yaw: 0.0, pose: "idle", expression: "deadpan", theme: "commuter", handPropL: "flashlight" }
        ]
      },
      {
        role: "Twist / 前置镜头拍到身后白眼",
        durationSec: 4.0,
        actionEn:
          "in the wide selfie background directly over the avatar's left shoulder, a pair of glowing white blocky eyes materializes in the dark hallway; the avatar spots it in the selfie preview and switches to O_O ring eyes",
        actionZh:
          "超广角自拍画面左肩正后方的黑暗走廊里悄然亮起一对发光白色方块眼；小人从自拍预览屏里看清身后异状，2D贴图瞬间变成空心白圈震惊眼(O_O)",
        eyeLineEn: "spots monster via the 0° front-camera screen reflection before rigidly rotating head",
        eyeLineZh: "直接通过前置自拍屏看清身后白眼，无需先转头即完成恐怖直播高潮",
        cameraEn: "18mm selfie-stick over-shoulder depth revealing dark figure behind host with sudden jolt shake",
        cameraZh: "18mm超广角自拍前置纵深构图，清晰拍到主播肩膀后方发光白眼并伴随手抖震动",
        hailuoTag: "[Push in, Shake]",
        chatEn: "BEHIND YOU!!",
        sfxCue: "siren",
        sfx: "低频恐怖重低音骤响 + 塑料关节急抖声",
        caption: "IT'S IN THE SELFIE CAM!! IT'S RIGHT BEHIND ME!!",
        hudPopup: "gift_combo",
        actors: [
          { castId: "momo", fromPos: [0.05, 0, 0.38], toPos: [0.08, 0.06, 0.42], yaw: -0.1, pose: "recoil", expression: "shocked", theme: "commuter", handPropL: "flashlight" },
          { castId: "shadow", fromPos: [-0.38, 0.08, -0.55], toPos: [-0.28, 0.08, -0.35], yaw: 0.2, pose: "idle", expression: "shocked", theme: "guest" }
        ]
      },
      {
        role: "Payoff / 刚性冲进木衣柜留缝直拍",
        durationSec: 3.5,
        actionEn:
          "sprints two rigid Motor6D strides into the slatted wooden wardrobe and pulls the doors shut, peering out through the narrow wooden slats with the selfie light illuminating streaming 2D tears",
        actionZh:
          "迈开两步干脆刚性的Motor6D方腿冲进百叶木衣柜猛地关门，仅剩手机自拍冷光在柜内照亮满脸2D瀑布流泪贴图",
        eyeLineEn: "whispering 0° extreme close-up inside dark closet lit only by phone screen",
        eyeLineZh: "衣柜内仅靠手机屏幕冷光照明的0°贴脸耳语特写",
        cameraEn: "Extreme close-up selfie cam inside slatted closet with rhythmic red light passing outside",
        cameraZh: "百叶木柜内贴脸前置大特写，柜门缝隙外掠过暗红光影",
        hailuoTag: "[Shake, Static shot]",
        chatEn: "SAFE...?",
        sfxCue: "clack",
        sfx: "木柜门砰然合拢声 + 压抑呼吸声",
        caption: "Nobody breathe... chat stop sending loud gifts!!",
        hudPopup: "gift_combo_peak",
        actors: [
          { castId: "momo", fromPos: [0.0, 0, 0.45], toPos: [0.0, 0, 0.48], yaw: 0.0, pose: "idle", expression: "tears", theme: "commuter" }
        ]
      }
    ]
  },

  "roblox-pet-hatch-pk": {
    slug: "roblox_pet_hatch_pk",
    category: "roblox-livestream",
    titleZh: "Roblox 双人连麦 PK 抽蛋开箱 · 氪金潮人 vs 黄皮新手出金（50/50 分屏样本）",
    titleEn: "Roblox Dual-Host PK Split-Screen Mystery Egg Hatch (Pro vs Noob)",
    style: "roblox-blocky",
    rig: "pk-cohost-split",
    lighting: "ring-rgb-studio",
    platform: "kuaishou",
    host: "Y2K_Queen",
    cohost: "ClassicNoob",
    backdrop: "adoption_plaza",
    subjectEn:
      "50/50 vertical co-host PK split-screen Roblox SmoothPlastic livestream: Left room shows a glossy Y2K streetwear blocky streamer in pink neon studio; Right room shows an untextured yellow-head blue-torso Classic R6 Noob in a plain starter room—both with solid fingerless 1x2x1 block hands and 2D face decals",
    subjectZh:
      "左右对称50/50双人连麦PK分屏Roblox直播：左屏粉色霓虹直播间为戴星形墨镜的Y2K潮牌方块主播，右屏简陋木屋为经典黄头蓝衣绿腿R6新手小人（均为无手指1x2x1实心平头方手与纯平2D五官贴图）",
    shots: [
      {
        role: "Hook / 双人连麦PK亮出宠物蛋",
        durationSec: 3.5,
        pkScoreRatio: 0.78,
        actionEn:
          "across the locked 50/50 webcam split, the Left Y2K streamer boasts beside a golden VIP egg while the Right Classic Noob sits stiffly beside a plain spotted starter egg",
        actionZh:
          "对称50/50连麦分屏中，左屏潮人主播拍着胸前金色VIP盲盒蛋向镜头炫耀（PK条遥遥领先），右屏黄皮新手木讷端坐在普通斑点新手蛋后",
        eyeLineEn: "Left host smirks 0° at lens; Right Noob keeps unchanging Default Smile staring straight ahead",
        eyeLineZh: "左屏自信挑眉0°看镜头；右屏新手保持永恒不变的默认微笑2D贴图",
        cameraEn: "Locked 50/50 dual-webcam split-screen (warm magenta studio left vs plain daylight room right)",
        cameraZh: "双直播间锁死28mm对称分屏（左暖粉霓虹房 vs 右极简新手房）",
        hailuoTag: "[Static shot]",
        chatEn: "EZ PK WIN!",
        sfxCue: "chime",
        sfx: "PK开局战鼓声 + 连麦接通提示音",
        caption: "PK赌注：谁孵出稀有度低谁当场改名叫小丑！",
        hudPopup: "join_toast",
        actors: [
          { castId: "y2k", fromPos: [-0.58, 0, 0.05], toPos: [-0.58, 0, 0.05], yaw: 0.22, pose: "cheer", expression: "smirk", theme: "y2k", handPropR: "mystery_egg" },
          { castId: "noob", fromPos: [0.58, 0, 0.05], toPos: [0.58, 0, 0.05], yaw: -0.18, pose: "idle", expression: "smile", theme: "noob", handPropL: "mystery_egg" }
        ]
      },
      {
        role: "Proof / 双方同步刚性拍蛋开裂",
        durationSec: 4.0,
        pkScoreRatio: 0.65,
        actionEn:
          "both blocky hosts pivot their solid 1x2x1 rectangular right arms down in unison to tap their Mystery Eggs on the desks as bright geometric cracks appear",
        actionZh:
          "左右分屏两位方块主播同步挥落1x2x1实心平头右方臂轻拍桌面宠物蛋，两枚方块蛋壳同时亮起几何裂纹发光线",
        eyeLineEn: "both hosts lean slightly toward their webcam lenses watching the glowing cracks",
        eyeLineZh: "双方同时前倾盯住桌面发光裂纹等待开奖",
        cameraEn: "Locked 50/50 dual-webcam split-screen with glowing egg light spill on both hosts",
        cameraZh: "对称50/50固定双机位，桌面盲盒蛋裂纹强光映亮双方桶状下巴",
        hailuoTag: "[Push in]",
        chatEn: "CRACKING!!",
        sfxCue: "clack",
        sfx: "双声道清脆敲蛋壳声 + 蓄力上升合成音",
        caption: "三、二、一，同时开蛋见证奇迹！！",
        hudPopup: "commerce_card",
        actors: [
          { castId: "y2k", fromPos: [-0.58, 0, 0.05], toPos: [-0.58, 0, 0.05], yaw: 0.22, pose: "slam", expression: "grin", theme: "y2k" },
          { castId: "noob", fromPos: [0.58, 0, 0.05], toPos: [0.58, 0, 0.05], yaw: -0.18, pose: "slam", expression: "smile", theme: "noob" }
        ]
      },
      {
        role: "Twist / 新手欧皇爆出传说霓虹神龙",
        durationSec: 4.0,
        pkScoreRatio: 0.16,
        actionEn:
          "Left Y2K streamer's golden egg pops into a tiny plain gray blocky pebble, while Right Noob's starter egg erupts into a floating cyan-and-gold blocky Mythic Neon Dragon!",
        actionZh:
          "左屏金色蛋噗地变成一块灰色普通方块鹅卵石，而右屏新手的普通蛋轰然金光炸裂，腾空浮现一只青金双色几何方块传说神龙（PK血条瞬间反杀拉满）！",
        eyeLineEn: "Left host jaw-drops with O_O ring eyes staring across split seam; Right Noob keeps exact same Default Smile",
        eyeLineZh: "左屏潮人O_O震惊扭头隔着分屏线死盯右屏神龙；右屏新手表情纹丝不动依然默认微笑",
        cameraEn: "Locked 50/50 split-screen with golden mythic rim light flooding Right Noob's room",
        cameraZh: "对称50/50分屏，右屏瞬间被金色传说神宠光效填满",
        hailuoTag: "[Shake, Static shot]",
        chatEn: "0.01% MYTHIC?!",
        sfxCue: "win",
        sfx: "左屏滑稽漏气音 vs 右屏史诗传说出金号角声",
        caption: "0.01%全服神宠被黄皮新手一发入魂？！PK条直接反杀！",
        hudPopup: "gift_combo",
        actors: [
          { castId: "y2k", fromPos: [-0.58, 0, 0.05], toPos: [-0.58, 0, 0.05], yaw: 0.55, pose: "recoil", expression: "shocked", theme: "y2k" },
          { castId: "noob", fromPos: [0.58, 0, 0.05], toPos: [0.58, 0, 0.05], yaw: -0.15, pose: "cheer", expression: "smile", theme: "noob" }
        ],
        props: [
          { type: "neon_dragon", pos: [0.58, 0.42, 0.35], moveTo: [0.58, 0.56, 0.35] }
        ]
      },
      {
        role: "Payoff / 左屏刚体栽倒 vs 右屏淡定喝可乐",
        durationSec: 3.5,
        pkScoreRatio: 0.08,
        actionEn:
          "Left Y2K streamer tips 90 degrees forward onto the studio desk in defeat, while Right Classic Noob calmly raises a red Bloxy Cola can to the webcam beside the hovering blocky dragon",
        actionZh:
          "左屏潮人主播沿腰部转轴90度刚体扑倒在直播台破防痛哭，右屏黄皮新手在悬浮方块神龙陪伴下淡定举起红色Bloxy Cola可乐罐向观众致意",
        eyeLineEn: "Left X_X faceplant; Right calm 0° Default Smile toast to chat",
        eyeLineZh: "左屏X_X扑街定格；右屏0°举罐淡定敬礼",
        cameraEn: "Locked 50/50 dual-webcam split-screen payoff",
        cameraZh: "50/50双机位强烈反差收尾",
        hailuoTag: "[Static shot]",
        chatEn: "GG NOOB WINS",
        sfxCue: "win",
        sfx: "汽水拉开清脆滋声 + PK胜利欢呼音效",
        caption: "氪金大佬当场自闭，老铁们把『欧皇』打在公屏！",
        hudPopup: "gift_combo_peak",
        actors: [
          { castId: "y2k", fromPos: [-0.58, 0, 0.05], toPos: [-0.58, 0, 0.05], yaw: 0.0, pose: "faceplant", expression: "dizzy", theme: "y2k" },
          { castId: "noob", fromPos: [0.58, 0, 0.05], toPos: [0.58, 0, 0.05], yaw: 0.0, pose: "idle", expression: "smile", theme: "noob", handPropR: "cola" }
        ],
        props: [
          { type: "neon_dragon", pos: [0.58, 0.54, 0.35], moveTo: [0.58, 0.48, 0.35] }
        ]
      }
    ]
  }
};

/**
 * Auto-infer best camera rig, style adapter, lighting, and HUD platform from an arbitrary user plot string
 * when not explicitly overridden on the CLI.
 */
export function inferLivestreamConfigFromPlot(plotText = "", overrides = {}) {
  const p = String(plotText || "");
  let style = overrides.style && STYLE_ADAPTERS[overrides.style] ? overrides.style : "";
  if (!style) {
    if (/roblox|\br6\b|\br15\b|方块小人|obby|doors|bloxy/i.test(p)) style = "roblox-blocky";
    else if (/duolingo|多邻国|绿鸟|猫头鹰|打卡|连胜|owl|streak/i.test(p)) style = "duolingo-mascot";
    else if (/\btux\b|\bferris\b|\bgodot\b|开源|企鹅|小螃蟹|齿轮机器人|linux|rust/i.test(p)) style = "opensource-mascot";
    else if (/minecraft|voxel|我的世界|体素|像素|苦力怕|红石/i.test(p)) style = "voxel-sandbox";
    else if (/vtuber|虚拟主播|live2d|二次元|动漫/i.test(p)) style = "anime-vtuber";
    else if (/盲盒|潮玩|黏土|皮克斯|vinyl|chibi/i.test(p)) style = "stylized-3d";
    else if (/仙侠|御剑|古装|武侠|骑士|巨龙|太空|赛博|末日|魔法|wuxia|medieval|dragon|cyberpunk|spaceship/i.test(p))
      style = "cinematic-genre-adapt";
    else style = "duolingo-mascot";
  }

  let rig = overrides.rig && RIG_PROFILES[overrides.rig] ? overrides.rig : "";
  if (!rig) {
    if (/连麦|\bpk\b|对决PK|双人分屏|versus\s+stream/i.test(p)) rig = "pk-cohost-split";
    else if (/实况|打游戏|跑酷|通关|speedrun|gameplay|画中画|pip/i.test(p)) rig = "pip-facecam-rig";
    else if (/开箱|测评|带货|美妆|试色|做饭|手工|unbox|review|cooking|asmr/i.test(p)) rig = "overhead-showcase-rig";
    else if (/监控|无人|24小时|超市夜班|cctv|security\s+cam/i.test(p)) rig = "cctv-obs-fixed";
    else if (/鬼屋|走廊|探险|密室|废墟|手电筒|haunted|corridor|abandoned/i.test(p)) rig = "chest-head-pov";
    else if (/街头|户外|夜市|御剑|旅行|爬山|屋顶|street|outdoor|rooftop|flight/i.test(p)) rig = "handheld-selfie-irl";
    else rig = "desktop-webcam";
  }

  const rigDef = RIG_PROFILES[rig] || RIG_PROFILES["desktop-webcam"];
  const lighting =
    overrides.lighting && LIGHTING_PRESETS[overrides.lighting]
      ? overrides.lighting
      : rigDef.defaultLighting;

  let platform = overrides.platform || "";
  if (!platform) {
    const hasZh = /[\u4e00-\u9fff]/.test(p);
    platform = hasZh ? (rig === "pk-cohost-split" ? "kuaishou" : "douyin") : "tiktok";
  }

  return { style, rig, lighting, platform: resolvePlatformPreset(platform).id };
}

/**
 * Translate ANY freeform storyline/plot into a structured 4-beat (15s) or 8-beat (30s)
 * Livestream Perspective spec, preserving the user's concrete plot elements while injecting
 * authentic camera rig physics, 0°/15° fourth-wall eye-lines, and unscripted live timing.
 */
export function translatePlotToLivestreamSpec(plotText, options = {}) {
  const cleanPlot = String(plotText || "Creator tests a mysterious gadget live on desk").trim();
  const { style, rig, lighting, platform } = inferLivestreamConfigFromPlot(cleanPlot, options);
  const styleDef = STYLE_ADAPTERS[style];
  const rigDef = RIG_PROFILES[rig];
  const isZhPlot = /[\u4e00-\u9fff]/.test(cleanPlot);
  const host = options.host || (style === "roblox-blocky" ? "Momo" : isZhPlot ? "阿泽" : "Alex");

  const slug =
    options.slug ||
    cleanPlot
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 32) ||
    "custom_livestream_pov";

  const subjectEn =
    style === "roblox-blocky"
      ? `an authentic 3D Roblox SmoothPlastic avatar ("${host}", 2x2x1 rectangular torso, flush 1x2x1 blocky legs, fingerless and clawless solid 1x2x1 rectangular block hands, smooth studless 1:1 barrel head, flat 2D face decal)`
      : `a ${styleDef.labelEn} livestream host ("${host}") framed via ${rigDef.labelEn} (${styleDef.geometryLockEn})`;

  const subjectZh =
    style === "roblox-blocky"
      ? `纯正3D Roblox SmoothPlastic方块主播「${host}」（2x2x1长方体躯干、并拢同宽1x2x1方腿、无手指无乐高C型爪的1x2x1实心平头方手、平滑无颗粒1:1桶状头、纯平2D贴图脸）`
      : `采用【${rigDef.labelZh}】直拍的【${styleDef.labelZh}】主播「${host}」（${styleDef.geometryLockZh}）`;

  const plotSummaryEn = isZhPlot ? `live scenario "${cleanPlot}"` : cleanPlot;
  const plotSummaryZh = cleanPlot;

  const baseFourShots = [
    {
      role: "Hook / 开播暴击立Flag",
      durationSec: 3.5,
      actionEn: `opens the live broadcast right inside the world of ${plotSummaryEn}, leaning toward the 0° live lens to greet viewers and point out the setup`,
      actionZh: `在「${plotSummaryZh}」现场直接开播，身体朝0°直播镜头前倾打招呼并抬手向弹幕展示当前处境`,
      eyeLineEn: "direct 0° lens eye-contact with a quick 15° glance toward the live chat feed",
      eyeLineZh: "0°直视主镜头立Flag互动，顺势偏转15°扫一眼实时滚动的弹幕",
      cameraEn: `${rigDef.lensEn}, crisp opening framing`,
      cameraZh: `${rigDef.lensZh}，极具临场感的开播第一镜`,
      hailuoTag: "[Push in]",
      chatEn: "WE ARE LIVE!",
      sfxCue: "chime",
      sfx: "开播提示音 + 近距离真实收音环境声",
      caption: isZhPlot ? `直播实测：${plotSummaryZh}！` : `Chat, we are actually doing this live: ${cleanPlot}!`,
      hudPopup: "join_toast"
    },
    {
      role: "Proof / 怼脸实测与细节推进",
      durationSec: 4.0,
      actionEn: `brings the key prop or scene detail of ${plotSummaryEn} close toward the lens for live inspection while narrating to skeptical chat`,
      actionZh: `围绕「${plotSummaryZh}」将关键道具或现场细节凑近直播镜头自证，边操作边回应弹幕质疑`,
      eyeLineEn: "alternates between the close-up action and 0° camera confirmation",
      eyeLineZh: "视线在近景操作物与0°直播镜头之间来回确认对焦",
      cameraEn: `${rigDef.lensEn}, continuous live autofocus and physical mount truth`,
      cameraZh: `${rigDef.lensZh}，真实连续自动对焦与物理支架反馈`,
      hailuoTag: "[Static shot]",
      chatEn: "LOOK CLOSE!",
      sfxCue: "clack",
      sfx: "近场操作细节声 + 弹幕快速刷屏轻响",
      caption: isZhPlot ? "零剪辑零剧本，镜头拉近给家人们看清楚！" : "Zero cuts, zero script — look right at the lens!",
      hudPopup: "commerce_card"
    },
    {
      role: "Twist / 突发直播事故与剧情高潮",
      durationSec: 4.0,
      actionEn: `at the climax of ${plotSummaryEn}, an unscripted live twist erupts right on camera, jolting the rig as the host freezes in live shock`,
      actionZh: `「${plotSummaryZh}」推进到最高潮时突发意外反转，物理直播机位随之产生真实震动，主播当场瞳孔地震定格`,
      eyeLineEn: "startled snap toward the live anomaly then wide-eyed 0° stare back at camera",
      eyeLineZh: "猛地看向突发异变方向，随即瞪大双眼0°回看镜头确认全被播了出去",
      cameraEn: `${rigDef.lensEn} with authentic startled micro-shake (${rigDef.physicsEn})`,
      cameraZh: `${rigDef.lensZh}，触发真实物理惊吓微震（${rigDef.physicsZh}）`,
      hailuoTag: "[Shake, Pull out]",
      chatEn: "WAIT WHAT?!",
      sfxCue: "buzz",
      sfx: "突发碰撞/异响声 + 麦克风瞬态收音反馈",
      caption: isZhPlot ? "等一下？？这不在计划里啊！！" : "WAIT A SECOND THAT WAS NOT SUPPOSED TO HAPPEN?!",
      hudPopup: "gift_combo"
    },
    {
      role: "Payoff / 满屏问号看弹幕破防定格",
      durationSec: 3.5,
      actionEn: `amid the aftermath of ${plotSummaryEn}, the host stares speechlessly between the exploding 15° chat screen and the 0° live lens for a viral clip-that freeze`,
      actionZh: `在「${plotSummaryZh}」翻车余波中，主播在15°刷爆问号的弹幕屏与0°主摄像头之间无语凝视，定格成神级直播切片结尾`,
      eyeLineEn: "15° frantic chat-screen read locking into deadpan 0° lens freeze",
      eyeLineZh: "先偏15°看满屏哈哈弹幕，再转回0°生无可恋盯住镜头收尾",
      cameraEn: `${rigDef.lensEn}, holding steady for clip-worthy reaction payoff`,
      cameraZh: `${rigDef.lensZh}，稳定接住主播破防微表情形成循环点`,
      hailuoTag: "[Static shot]",
      chatEn: "CLIP THAT!!",
      sfxCue: "win",
      sfx: "礼物连击刷屏叮声 + 憋笑叹气收音",
      caption: isZhPlot ? "录屏的兄弟手下留情，直播间要炸了…" : "Chat please stop clipping this 💀💀",
      hudPopup: "gift_combo_peak"
    }
  ];

  return {
    slug,
    category: style === "roblox-blocky" ? "roblox-livestream" : "general-ai-video",
    titleZh: isZhPlot ? `直播视角：${cleanPlot}` : `直播视角改编：${cleanPlot}`,
    titleEn: `Livestream POV: ${cleanPlot}`,
    style,
    rig,
    lighting,
    platform,
    host,
    backdrop: style === "roblox-blocky" ? "studio" : "study_room",
    subjectEn,
    subjectZh,
    shots: baseFourShots
  };
}

/**
 * Expand a 4-shot base storyboard to 8 unique shots (for 30s) or 12 unique shots (for 45s)
 * with zero duplicate action strings so every single clip has its own distinct single-action beat.
 */
function expandShotsToCount(baseShots, targetShotCount, baseTemplate) {
  if (baseShots.length >= targetShotCount) {
    return baseShots.slice(0, targetShotCount);
  }
  const expanded = [];
  for (let i = 0; i < baseShots.length; i++) {
    const s = baseShots[i];
    expanded.push({ ...s, durationSec: 3.75 });
    if (expanded.length < targetShotCount) {
      expanded.push({
        ...s,
        role: `${s.role.split("/")[0].trim()} Reaction Beat ${i + 1} / 弹幕实时反馈镜`,
        durationSec: 3.75,
        actionEn: `following beat ${i + 1}, ${baseTemplate.host || "the host"} glances 15° off-axis at the surging live chat reaction and leans closer to the lens to respond in real time (beat-${i + 1} reaction cut)`,
        actionZh: `承接第${i + 1}拍动作，主播「${baseTemplate.host || "Alex"}」偏转15°扫视暴涨的实时弹幕区，随即凑近0°镜头做出即时嘴硬回应（第${i + 1}组互动反应切镜）`,
        hailuoTag: "[Static shot]",
        hudPopup: i % 2 === 0 ? "join_toast" : "gift_combo"
      });
    }
  }
  while (expanded.length < targetShotCount) {
    const idx = expanded.length + 1;
    expanded.push({
      ...baseShots[baseShots.length - 1],
      role: `Encore Live Beat ${idx} / 下播前返场互动`,
      durationSec: 3.75,
      actionEn: `waves toward the 0° live lens during encore beat ${idx} while thanking top gifters before cutting the stream`,
      actionZh: `在第${idx}拍返场互动中朝0°直播镜头挥手感谢榜一礼物并准备光速下播`,
      hailuoTag: "[Pull out]"
    });
  }
  return expanded.slice(0, targetShotCount);
}

function formatEngineCleanPromptEn(engine, rigSpec, base, shot) {
  const cleanTail =
    "9:16 vertical raw livestream camera plate, clean camera feed, zero burned-in UI text, zero scrolling comments, zero platform watermarks.";
  const core = `${rigSpec.rig.lensEn}. Subject: ${base.subjectEn}. Action: ${shot.actionEn}. Eye-line: ${shot.eyeLineEn}. Camera physics: ${shot.cameraEn}. Lighting: ${rigSpec.lighting.promptEn}. ${cleanTail}`;

  switch (engine) {
    case "hailuo":
      return `${shot.hailuoTag || "[Static shot]"} ${core}`;
    case "runway":
      return `Camera: ${shot.cameraEn} (${rigSpec.rig.lensEn}). Subject & Action: ${base.subjectEn} ${shot.actionEn}. ${shot.eyeLineEn}. ${cleanTail}`;
    case "sora":
      return `Physical Livestream Capture (${rigSpec.rig.labelEn}): ${core}`;
    case "veo":
      return `${core} Live Audio: ${shot.sfx || "close-mic streamer voice and room ambience"}.`;
    default:
      return core;
  }
}

function formatEngineCleanPromptZh(engine, rigSpec, base, shot) {
  const engineTag =
    engine === "kling"
      ? "【可灵I2V纯净直播底片】"
      : engine === "seedance"
      ? "【即梦I2V首尾帧纯净底片】"
      : engine === "wan"
      ? "【万相2.6竖屏直播底片】"
      : `【${engine.toUpperCase()} 直播视角纯净底片】`;

  return `${engineTag}9:16竖屏，${rigSpec.rig.lensZh}。主体：${base.subjectZh}。单一动作：${shot.actionZh}。互动眼神轴：${shot.eyeLineZh}。机位反馈：${shot.cameraZh}。补光：${rigSpec.lighting.promptZh}。100%纯净无UI文字底片（严禁AI直出滚动弹幕文字、礼物按钮或平台台标水印，所有直播边框由后置HUD叠加）。`;
}

export function compileStoryboard(options = {}) {
  const engine = ENGINE_PROFILES[options.engine] ? options.engine : "kling";
  let base;

  if (options.specObject) {
    base = { ...options.specObject };
  } else if (options.spec) {
    const abs = path.resolve(options.spec);
    base = JSON.parse(fs.readFileSync(abs, "utf8").replace(/^\uFEFF/, ""));
  } else if (options.plot) {
    base = translatePlotToLivestreamSpec(options.plot, options);
  } else {
    const tplKey = TEMPLATES[options.template] ? options.template : "duolingo-owl-streak-cam";
    base = structuredClone(TEMPLATES[tplKey]);
  }

  const style = options.style && STYLE_ADAPTERS[options.style] ? options.style : base.style || "realistic-irl";
  const rig = options.rig && RIG_PROFILES[options.rig] ? options.rig : base.rig || "desktop-webcam";
  const lighting =
    options.lighting && LIGHTING_PRESETS[options.lighting]
      ? options.lighting
      : base.lighting || RIG_PROFILES[rig].defaultLighting;
  const platformPreset = resolvePlatformPreset(options.platform || base.platform || "douyin");

  const rigSpec = buildRigSpec({
    rig,
    style,
    lighting,
    hud: platformPreset.id === "clean" ? "raw-clean" : "clean-post-hud",
    host: options.host || base.host || "Alex",
    cohost: options.cohost || base.cohost || "Momo",
    robloxRig: options.robloxRig || base.robloxRig || "chibi-blocky"
  });

  const durationSec = Number(options.duration || base.durationSeconds || 15);
  const targetShotCount = durationSec >= 45 ? 12 : durationSec >= 30 ? 8 : (base.shots?.length || 4);
  const rawShots = expandShotsToCount(base.shots || [], targetShotCount, base);

  const sumRaw = rawShots.reduce((a, s) => a + (Number(s.durationSec) || 3.75), 0);
  const scale = durationSec / sumRaw;

  let cursor = 0;
  const compiledShots = rawShots.map((sh, idx) => {
    const d = Number(((Number(sh.durationSec) || 3.75) * scale).toFixed(2));
    const start = cursor;
    const end = idx === rawShots.length - 1 ? durationSec : Number((cursor + d).toFixed(2));
    cursor = end;

    const subjectAnchorEn =
      base.subjectEn ||
      `${rigSpec.style.labelEn} streamer "${rigSpec.hostName}" (${rigSpec.style.geometryLockEn})`;
    const subjectAnchorZh =
      base.subjectZh ||
      `${rigSpec.style.labelZh}主播「${rigSpec.hostName}」（${rigSpec.style.geometryLockZh}）`;

    const baseWithSubject = { ...base, subjectEn: subjectAnchorEn, subjectZh: subjectAnchorZh };

    const firstFramePromptEn = `9:16 vertical static keyframe, ${rigSpec.rig.lensEn}: ${subjectAnchorEn}, mid-setup before ${sh.actionEn}. ${rigSpec.lighting.promptEn}. Crisp room/world background, clean raw camera feed, zero UI text or watermarks.`;
    const firstFramePromptZh = `9:16竖屏首帧静态锚定图，${rigSpec.rig.lensZh}：${subjectAnchorZh}，处于「${sh.actionZh}」起始构图。${rigSpec.lighting.promptZh}。100%纯净无UI文字底片，零乱码弹幕，零水印。`;

    const i2vPromptEn = formatEngineCleanPromptEn(engine, rigSpec, baseWithSubject, sh);
    const i2vPromptZh = formatEngineCleanPromptZh(engine, rigSpec, baseWithSubject, sh);

    const hudOverlay = buildShotHudTimeline(sh, idx, rawShots.length, platformPreset.id, base.slug || "");

    return {
      shotNumber: idx + 1,
      role: sh.role || `Shot ${idx + 1}`,
      durationSec: Number((end - start).toFixed(2)),
      timeWindow: `${start.toFixed(1)}s–${end.toFixed(1)}s`,
      exactTimeWindow: `${start.toFixed(2)}s–${end.toFixed(2)}s`,
      actionEn: sh.actionEn,
      actionZh: sh.actionZh,
      eyeLineEn: sh.eyeLineEn || rigSpec.rig.eyeLineEn,
      eyeLineZh: sh.eyeLineZh || rigSpec.rig.eyeLineZh,
      cameraEn: sh.cameraEn || rigSpec.rig.lensEn,
      cameraZh: sh.cameraZh || rigSpec.rig.lensZh,
      hailuoTag: sh.hailuoTag || "[Static shot]",
      firstFramePromptEn,
      firstFramePromptZh,
      i2vPromptEn,
      i2vPromptZh,
      trackBFacecamPromptEn: sh.facecamPromptEn || null,
      trackBFacecamPromptZh: sh.facecamPromptZh || null,
      negativePromptEn: rigSpec.negativePromptEn,
      negativePromptZh: rigSpec.negativePromptZh,
      sfxCue: sh.sfxCue || "chime",
      sfx: sh.sfx || "近场收音 + 弹幕提示音",
      caption: sh.caption || "",
      chatEn: sh.chatEn || "",
      hudOverlay,
      actors: sh.actors || null,
      props: sh.props || null,
      pkScoreRatio: sh.pkScoreRatio
    };
  });

  return {
    slug: base.slug || "livestream_episode",
    titleEn: base.titleEn || "Livestream POV Short",
    titleZh: base.titleZh || "直播视角短片",
    category: base.category || (style === "roblox-blocky" ? "roblox-livestream" : "general-ai-video"),
    engine,
    engineLabel: ENGINE_PROFILES[engine].label,
    style,
    rig,
    lighting,
    platform: platformPreset.id,
    platformLabelEn: platformPreset.labelEn,
    platformLabelZh: platformPreset.labelZh,
    aspect: "9:16",
    durationSeconds: durationSec,
    shotCount: compiledShots.length,
    host: rigSpec.hostName,
    cohost: rigSpec.cohostName,
    backdrop: base.backdrop || "study_room",
    dualTrackNoteEn: rigSpec.dualTrackNoteEn,
    dualTrackNoteZh: rigSpec.dualTrackNoteZh,
    setupAnchorPromptEn: rigSpec.setupAnchorPromptEn,
    setupAnchorPromptZh: rigSpec.setupAnchorPromptZh,
    shots: compiledShots
  };
}

export function formatStoryboardMarkdown(plan, lang = "en") {
  const code = normalizeLang(lang);
  const includeZh = code === "zh" || code === "zh-tw" || code === "zh-en";

  const lines = [
    `<!-- lang: ${code} | engine: ${plan.engine} | rig: ${plan.rig} | style: ${plan.style} | platform: ${plan.platform} -->`,
    `# ${includeZh ? `${plan.titleZh} / ${plan.titleEn}` : plan.titleEn}`,
    "",
    `- **Aspect & Duration**: \`${plan.aspect}\` · \`${plan.durationSeconds}s\` (\`${plan.shotCount}\` non-repeating live beats)`,
    `- **Camera Rig**: \`${plan.rig}\` · **Style Pack**: \`${plan.style}\` · **Engine**: \`${plan.engine}\` (${plan.engineLabel})`,
    `- **Post-HUD Chrome Preset**: \`${plan.platform}\` — ${includeZh ? plan.platformLabelZh : plan.platformLabelEn}`,
    `- **Compositing Strategy**: ${includeZh ? plan.dualTrackNoteZh : plan.dualTrackNoteEn}`,
    "",
    "## Beat-by-Beat Livestream Storyboard / 分镜与弹幕时间轴",
    "",
    "| # | Window | Live Beat Role | Physical Action & 4th-Wall Eye-Line | Post-HUD Popup & Audio |",
    "| :---: | :---: | --- | --- | --- |"
  ];

  for (const s of plan.shots) {
    const act = includeZh ? `${s.actionZh}<br>*眼神轴*：${s.eyeLineZh}` : `${s.actionEn}<br>*Eye-line*: ${s.eyeLineEn}`;
    const hudSummary = s.hudOverlay.enabled
      ? `\`${s.hudOverlay.platform}\` · \`${s.hudOverlay.activePopup}\` · 👥 ${s.hudOverlay.viewerCount.toLocaleString()}<br>🔊 ${s.sfx}`
      : `Raw Clean Plate<br>🔊 ${s.sfx}`;
    lines.push(`| ${String(s.shotNumber).padStart(2, "0")} | \`${s.timeWindow}\` | ${s.role} | ${act} | ${hudSummary} |`);
  }

  lines.push("", "## Clean-Plate Shot Prompts / 逐镜无乱码纯净底片提示词", "");
  for (const s of plan.shots) {
    lines.push(`### Shot ${String(s.shotNumber).padStart(2, "0")} (\`${s.exactTimeWindow}\`) — ${s.role}`, "");
    lines.push("- **First-Frame Anchor (EN)**: `" + s.firstFramePromptEn + "`");
    if (includeZh) {
      lines.push("- **首帧静态锚定词 (ZH)**: `" + s.firstFramePromptZh + "`");
    }
    lines.push("- **Clean-Plate Motion Prompt (EN)**: `" + s.i2vPromptEn + "`");
    if (includeZh) {
      lines.push("- **视频动态生成词 (ZH)**: `" + s.i2vPromptZh + "`");
    }
    if (s.trackBFacecamPromptEn) {
      lines.push("- **Track-B Corner Facecam Prompt (EN)**: `" + s.trackBFacecamPromptEn + "`");
      if (includeZh && s.trackBFacecamPromptZh) {
        lines.push("- **B轨右上主播反应小窗提示词 (ZH)**: `" + s.trackBFacecamPromptZh + "`");
      }
    }
    lines.push("- **Negative Anti-Drift**: `" + (includeZh ? s.negativePromptZh : s.negativePromptEn) + "`");
    if (s.caption) {
      lines.push(`- **Post-HUD Caption / 直播花字**: "${s.caption}"`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function parseArgs(argv) {
  const opts = {
    template: "duolingo-owl-streak-cam",
    spec: "",
    plot: "",
    style: "",
    rig: "",
    lighting: "",
    platform: "",
    host: "",
    cohost: "",
    robloxRig: "",
    duration: 15,
    engine: "kling",
    lang: "en",
    out: "",
    json: false,
    help: false
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") opts.help = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--template" && argv[i + 1]) opts.template = argv[++i].toLowerCase().trim();
    else if (a === "--spec" && argv[i + 1]) opts.spec = argv[++i];
    else if (a === "--plot" && argv[i + 1]) opts.plot = argv[++i];
    else if (a === "--style" && argv[i + 1]) opts.style = argv[++i].toLowerCase().trim();
    else if (a === "--rig" && argv[i + 1]) opts.rig = argv[++i].toLowerCase().trim();
    else if (a === "--lighting" && argv[i + 1]) opts.lighting = argv[++i].toLowerCase().trim();
    else if (a === "--platform" && argv[i + 1]) opts.platform = argv[++i].toLowerCase().trim();
    else if (a === "--host" && argv[i + 1]) opts.host = argv[++i].trim();
    else if (a === "--cohost" && argv[i + 1]) opts.cohost = argv[++i].trim();
    else if (a === "--roblox-rig" && argv[i + 1]) opts.robloxRig = argv[++i].toLowerCase().trim();
    else if (a === "--duration" && argv[i + 1]) opts.duration = Number(argv[++i]) || 15;
    else if (a === "--engine" && argv[i + 1]) opts.engine = argv[++i].toLowerCase().trim();
    else if (a === "--lang" && argv[i + 1]) opts.lang = normalizeLang(argv[++i]);
    else if (a === "--out" && argv[i + 1]) opts.out = argv[++i];
  }
  return opts;
}

function printHelp() {
  console.log(`Usage:
  node scripts/shot_compiler.mjs --plot "<any story/plot>" [--style <id>] [--rig <id>] [--platform <id>] [options]
  node scripts/shot_compiler.mjs --template <id> [options]
  node scripts/shot_compiler.mjs --spec <episode.json> [options]

Compile any visual style and storyline into a 9:16 Livestream POV storyboard, clean-plate I2V/T2V prompts,
and multi-platform HUD timeline (Douyin, Kuaishou, Instagram Live, X Live, TikTok Live).

Built-in Templates:
  Duolingo / Open-Source Mascot / Voxel Styles:
    duolingo-owl-streak-cam | duolingo-chill-night-market | tux-ferris-code-webcam |
    godot-bot-unboxing-af   | voxel-wuxia-sword-live
  Roblox Blocky Livestream POV:
    roblox-obby-rage-pip    | roblox-doors-irl-selfie     | roblox-pet-hatch-pk

Options:
  --plot <text>       Translate any freeform Chinese/English plot into a 4/8-shot livestream storyboard
  --template <id>     Built-in template ID (default: duolingo-owl-streak-cam)
  --spec <file>       Custom declarative episode spec JSON
  --style <id>        Style override: roblox-blocky | duolingo-mascot | opensource-mascot | voxel-sandbox | stylized-3d | anime-vtuber | cinematic-genre-adapt | realistic-irl
  --rig <id>          Rig override: desktop-webcam | handheld-selfie-irl | pip-facecam-rig | overhead-showcase-rig | chest-head-pov | pk-cohost-split | cctv-obs-fixed | drone-follow-live
  --platform <id>     Post-HUD preset: douyin | kuaishou | instagram | x | tiktok | clean
  --duration <sec>    Target duration: 15 (4 shots) | 30 (8 shots) | 45 (12 shots)
  --engine <id>       Engine: local3d | kling | seedance | hailuo | wan | sora | veo | runway
  --lang <code>       Output language: en | zh | zh-tw | ja | ko | es | fr | de | pt | ru | zh-en
  --out <path>        Write UTF-8 output directly to file
  --json              Emit structured JSON (ready for drift_check.mjs and render_preview.mjs)
  --help              Show this help message`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]).endsWith("shot_compiler.mjs");
if (isMain) {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    process.exit(0);
  }
  const plan = compileStoryboard(opts);
  const outText = opts.json ? JSON.stringify(plan, null, 2) + "\n" : formatStoryboardMarkdown(plan, opts.lang);
  if (opts.out) {
    const abs = path.resolve(opts.out);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, outText, "utf8");
    console.log(`Wrote compiled storyboard (${plan.shotCount} shots, ${plan.platform} HUD) to ${abs}`);
  } else {
    process.stdout.write(outText);
  }
}
