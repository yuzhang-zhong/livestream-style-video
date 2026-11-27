#!/usr/bin/env node
/**
 * hud_presets.mjs
 * Zero-dependency Multi-Platform Livestream Chrome, Safe-Zone, Interactive Popup,
 * and Particle FX specification library (Douyin, Kuaishou, Instagram Live, X Live, TikTok Live, Clean).
 *
 * Grounded in REA static/protocol evidence:
 * - Douyin / TikTok Webcast message topology (RoomUserSeq, Chat, Member, Gift combo slots, Like, LinkMicBattle/Armies, Shopping)
 * - Kuaishou SCWebFeedPush topology (CommentFeed, ComboCommentFeed, LikeFeed "点亮了红心", GiftFeed mergeKey, 1080x1920 safe zones)
 * - Instagram Live borderless drop-shadow comment stack, Story-ring LIVE header, Wave join pill, and frosted Live Q&A card
 * - X / Periscope Live dark obsidian glass pills and 6-color viewer-assigned sinusoidal heart fountain (flowOne/flowTwo/flowThree)
 *
 * Trademark-clean design: uses original geometric icons, neutral typography, and color tokens—zero official platform logos.
 */

import fs from "node:fs";
import path from "node:path";

export const PLATFORM_HUD_PRESETS = {
  douyin: {
    id: "douyin",
    labelZh: "抖音直播间风格 (Douyin Live Chrome)",
    labelEn: "Douyin Live Room Chrome & Commerce/Gift HUD",
    accentPrimary: [254, 44, 85],     // #FE2C55 rose-crimson
    accentSecondary: [37, 244, 238],  // #25F4EE electric cyan
    scrimTopAlpha: 0.46,
    scrimBottomAlpha: 0.62,
    safeZone1080x1920: {
      topAvoidPx: 290,
      bottomAvoidPx: 580,
      rightAvoidPx: 148,
      chatWidthRatio: 0.68,
      chatMaxHeightRatio: 0.23
    },
    headerLayout: {
      hostCapsule: true,
      followButtonTextZh: "关注",
      followButtonTextEn: "Follow",
      subRankRowZh: ["人气榜 No.3", "小时榜", "福袋 01:28"],
      subRankRowEn: ["Top #3", "Hourly Rank", "Lucky Bag 01:28"],
      topViewersCount: 3,
      viewerPillFormat: "compact-number"
    },
    commentStyle: {
      bubbleBgRgba: [0, 0, 0, 0.36],
      borderRadiusPx: 12,
      fanBadgeBg: [59, 130, 246],
      wealthBadgeBg: [139, 92, 246],
      nameColor: [147, 197, 253],
      textColor: [255, 255, 255],
      topFadeStop: 0.22
    },
    popups: {
      joinFormatZh: (u) => `✨ [钻粉 Lv.16] ${u} 来了`,
      joinFormatEn: (u) => `✨ [Fan Lv.16] ${u} joined`,
      giftSlots: 2,
      defaultGiftZh: { sender: "星河舰长", gift: "璀璨星舰", combo: 66 },
      defaultGiftEn: { sender: "NovaPilot", gift: "Starlight Cruiser", combo: 66 },
      commerceCard: {
        badgeZh: "讲解中",
        badgeEn: "LIVE DEAL",
        titleZh: "1号链接 · 限量盲盒礼盒",
        titleEn: "Link #1 · Limited Mystery Box",
        price: "¥39.9",
        ctaZh: "抢",
        ctaEn: "Buy"
      },
      pkColors: {
        left: [254, 44, 85],
        right: [37, 244, 238]
      }
    },
    heartPalette: [
      [254, 44, 85],
      [251, 113, 133],
      [244, 63, 94],
      [253, 164, 175]
    ]
  },

  kuaishou: {
    id: "kuaishou",
    labelZh: "快手直播间风格 (Kuaishou Warm-Iron HUD)",
    labelEn: "Kuaishou Live Room HUD (Combo Danmaku & Red-Heart Feed)",
    accentPrimary: [255, 80, 0],      // #FF5000 warm orange-flame
    accentSecondary: [250, 204, 21],  // #FACC15 gold coin accent
    scrimTopAlpha: 0.44,
    scrimBottomAlpha: 0.64,
    safeZone1080x1920: {
      // Exact Kuaishou Mini-Play open spec: top 340px, center 960px, bottom 620px, safe width 880px
      topAvoidPx: 340,
      bottomAvoidPx: 620,
      rightAvoidPx: 156,
      chatWidthRatio: 0.70,
      chatMaxHeightRatio: 0.24
    },
    headerLayout: {
      hostCapsule: true,
      followButtonTextZh: "+ 关注",
      followButtonTextEn: "+ Follow",
      subRankRowZh: ["🔥 红心热力 9.8万", "快币红包 00:45"],
      subRankRowEn: ["🔥 98K Hearts", "Red Packet 00:45"],
      topViewersCount: 3,
      viewerPillFormat: "laotie-count"
    },
    commentStyle: {
      bubbleBgRgba: [12, 10, 8, 0.44],
      borderRadiusPx: 10,
      fanBadgeBg: [249, 115, 22],
      wealthBadgeBg: [234, 179, 8],
      nameColor: [253, 224, 71],
      textColor: [255, 255, 255],
      topFadeStop: 0.20,
      supportsComboComment: true,
      supportsInlineLikeFeed: true
    },
    popups: {
      joinFormatZh: (u) => `🔥 [铁粉] ${u} 点亮了 ❤️`,
      joinFormatEn: (u) => `🔥 [Top Fan] ${u} lit a ❤️`,
      giftSlots: 2,
      defaultGiftZh: { sender: "榜一大哥", gift: "黄金穿云箭", combo: 18 },
      defaultGiftEn: { sender: "IronBro_01", gift: "Golden Sky Arrow", combo: 18 },
      commerceCard: {
        badgeZh: "小黄车热卖",
        badgeEn: "FLASH DROP",
        titleZh: "源头好物 · 秒杀福利款",
        titleEn: "Factory Direct · Flash Bundle",
        price: "¥19.9",
        ctaZh: "去抢购",
        ctaEn: "Grab"
      },
      pkColors: {
        left: [255, 80, 0],
        right: [24, 144, 255]
      }
    },
    heartPalette: [
      [255, 80, 0],
      [239, 68, 68],
      [250, 204, 21],
      [251, 146, 60]
    ]
  },

  instagram: {
    id: "instagram",
    labelZh: "Instagram Live 极简悬浮风格 (Ins Live)",
    labelEn: "Instagram Live Minimal Story-Ring & Q&A HUD",
    accentPrimary: [225, 48, 108],    // #E1306C magenta-rose
    accentSecondary: [247, 119, 55],  // #F77737 sunset story ring
    scrimTopAlpha: 0.36,
    scrimBottomAlpha: 0.52,
    safeZone1080x1920: {
      topAvoidPx: 230,
      bottomAvoidPx: 520,
      rightAvoidPx: 132,
      chatWidthRatio: 0.72,
      chatMaxHeightRatio: 0.22
    },
    headerLayout: {
      hostCapsule: false,
      storyRingAvatar: true,
      liveBadgeText: "LIVE",
      eyeViewerPill: true,
      closeCrossRight: true
    },
    commentStyle: {
      // Characteristic IG Live: ZERO bubble background, pure drop-shadowed white text!
      bubbleBgRgba: [0, 0, 0, 0.0],
      dropShadow: true,
      borderRadiusPx: 0,
      fanBadgeBg: [225, 48, 108],
      nameColor: [248, 250, 252],
      textColor: [241, 245, 249],
      topFadeStop: 0.25
    },
    popups: {
      joinFormatZh: (u) => `👋 ${u} 加入了直播 · 挥手`,
      joinFormatEn: (u) => `👋 ${u} joined · Wave`,
      giftSlots: 1,
      defaultGiftZh: { sender: "kaya.studio", gift: "直播徽章打赏", combo: 3 },
      defaultGiftEn: { sender: "kaya.studio", gift: "Live Badges", combo: 3 },
      qaCard: {
        headerZh: "来自观众的提问 · Q&A",
        headerEn: "Question from @mina.design",
        questionZh: "这套直播机位是怎么做到零乱码的？",
        questionEn: "Wait is this actually happening live right now?!"
      },
      pkColors: {
        left: [225, 48, 108],
        right: [131, 58, 180]
      }
    },
    heartPalette: [
      [225, 48, 108],
      [253, 29, 29],
      [193, 53, 132],
      [255, 110, 160]
    ]
  },

  x: {
    id: "x",
    labelZh: "X / Periscope 极夜多彩飘心风格 (X Live)",
    labelEn: "X / Periscope Dark Glass & 6-Color Heart Fountain HUD",
    accentPrimary: [249, 24, 128],    // #F91880 / coral-crimson LIVE pill
    accentSecondary: [53, 177, 209],  // #35B1D1 Periscope sky-cyan
    scrimTopAlpha: 0.42,
    scrimBottomAlpha: 0.56,
    safeZone1080x1920: {
      topAvoidPx: 220,
      bottomAvoidPx: 490,
      rightAvoidPx: 140,
      chatWidthRatio: 0.68,
      chatMaxHeightRatio: 0.21
    },
    headerLayout: {
      hostCapsule: true,
      liveBadgeText: "LIVE",
      watchingSuffixEn: "watching",
      watchingSuffixZh: "正在观看"
    },
    commentStyle: {
      // Individual dark obsidian rounded cards with viewer-assigned Periscope color avatar strip
      bubbleBgRgba: [15, 20, 25, 0.78],
      borderRadiusPx: 14,
      perViewerTint: true,
      nameColor: [148, 163, 184],
      textColor: [248, 250, 252],
      topFadeStop: 0.20
    },
    popups: {
      joinFormatZh: (u) => `@${u} 加入了直播并转发`,
      joinFormatEn: (u) => `@${u} joined & reposted`,
      giftSlots: 1,
      defaultGiftZh: { sender: "@dev_pulse", gift: "Super Heart Boost", combo: 12 },
      defaultGiftEn: { sender: "@dev_pulse", gift: "Super Heart Boost", combo: 12 },
      topicPin: {
        labelEn: "LIVE BROADCAST · RAW FEED",
        labelZh: "实时直拍信号 · 零延迟互动"
      },
      pkColors: {
        left: [249, 24, 128],
        right: [29, 155, 240]
      }
    },
    // Exact 6 Periscope viewer-assigned colors from REA Evidence ev_b0cb9e3c7367d554a845d39a207cc90d190d69459e69b8182eaa12fc274c71f7
    heartPalette: [
      [252, 228, 115], // #fce473 colOne
      [246, 139, 57],  // #f68b39 colTwo
      [237, 108, 99],  // #ed6c63 colThree
      [132, 123, 185], // #847bb9 colFour
      [151, 205, 118], // #97cd76 colFive
      [53, 177, 209]   // #35b1d1 colSix
    ]
  },

  tiktok: {
    id: "tiktok",
    labelZh: "TikTok Live 国际版直播间风格",
    labelEn: "TikTok Live Global Rose-Combo & Top-Gifter HUD",
    accentPrimary: [254, 44, 85],
    accentSecondary: [37, 244, 238],
    scrimTopAlpha: 0.45,
    scrimBottomAlpha: 0.60,
    safeZone1080x1920: {
      topAvoidPx: 280,
      bottomAvoidPx: 560,
      rightAvoidPx: 144,
      chatWidthRatio: 0.68,
      chatMaxHeightRatio: 0.22
    },
    headerLayout: {
      hostCapsule: true,
      followButtonTextZh: "+ Follow",
      followButtonTextEn: "+ Follow",
      subRankRowZh: ["Weekly Rank #5", "Treasure 00:58"],
      subRankRowEn: ["Weekly Rank #5", "Treasure 00:58"],
      topViewersCount: 3,
      viewerPillFormat: "compact-number"
    },
    commentStyle: {
      bubbleBgRgba: [0, 0, 0, 0.36],
      borderRadiusPx: 12,
      fanBadgeBg: [20, 184, 166],
      wealthBadgeBg: [99, 102, 241],
      nameColor: [186, 230, 253],
      textColor: [255, 255, 255],
      topFadeStop: 0.22
    },
    popups: {
      joinFormatZh: (u) => `🌟 [Gifter Lv.24] ${u} joined`,
      joinFormatEn: (u) => `🌟 [Gifter Lv.24] ${u} joined`,
      giftSlots: 2,
      defaultGiftZh: { sender: "pixel_kai", gift: "Galaxy Rose", combo: 99 },
      defaultGiftEn: { sender: "pixel_kai", gift: "Galaxy Rose", combo: 99 },
      commerceCard: {
        badgeZh: "PINNED",
        badgeEn: "PINNED",
        titleZh: "Creator Desk Kit · #01",
        titleEn: "Creator Desk Kit · #01",
        price: "$24.00",
        ctaZh: "Shop",
        ctaEn: "Shop"
      },
      pkColors: {
        left: [254, 44, 85],
        right: [37, 244, 238]
      }
    },
    heartPalette: [
      [254, 44, 85],
      [37, 244, 238],
      [251, 113, 133],
      [168, 85, 247]
    ]
  },

  clean: {
    id: "clean",
    labelZh: "100% 纯净无框底片 (Clean Diffusion Plate)",
    labelEn: "100% Clean Raw Camera Plate (Zero HUD Overlay)",
    accentPrimary: [148, 163, 184],
    accentSecondary: [100, 116, 139],
    scrimTopAlpha: 0,
    scrimBottomAlpha: 0,
    safeZone1080x1920: {
      topAvoidPx: 0,
      bottomAvoidPx: 0,
      rightAvoidPx: 0,
      chatWidthRatio: 0,
      chatMaxHeightRatio: 0
    },
    headerLayout: { hostCapsule: false },
    commentStyle: { bubbleBgRgba: [0, 0, 0, 0] },
    popups: { giftSlots: 0 },
    heartPalette: []
  }
};

export function resolvePlatformPreset(platformId = "douyin") {
  const key = String(platformId || "douyin").toLowerCase().trim();
  if (key === "ins" || key === "ig" || key === "ig-live") return PLATFORM_HUD_PRESETS.instagram;
  if (key === "twitter" || key === "periscope" || key === "x-live") return PLATFORM_HUD_PRESETS.x;
  if (key === "ks") return PLATFORM_HUD_PRESETS.kuaishou;
  if (key === "dy") return PLATFORM_HUD_PRESETS.douyin;
  if (key === "tt") return PLATFORM_HUD_PRESETS.tiktok;
  if (key === "off" || key === "none") return PLATFORM_HUD_PRESETS.clean;
  return PLATFORM_HUD_PRESETS[key] || PLATFORM_HUD_PRESETS.douyin;
}

/**
 * Compute deterministic per-shot HUD event state for any shot index (0..N-1) and normalized phase (0..1),
 * driving scrolling danmaku, viewer counter spikes, join banners, gift combo bounces, shopping popups,
 * Q&A cards, PK tug-of-war bars, and bezier heart particles.
 */
const EPISODE_DANMAKU_PACKS = {
  duolingo_owl_streak_cam: {
    commerceZh: "连胜冻结保护卡礼盒",
    commerceEn: "Streak Freeze Pack",
    qaZh: "绿鸟大大别锁我家门！我现在立刻背50个单词！！",
    qaEn: "PLEASE SPARE MY 365 STREAK I AM PRACTICING RIGHT NOW!!",
    zh: [
      [
        { user: "背词困难户", text: "救命23:58了！绿鸟亲自开播查岗了", lv: 16 },
        { user: "全勤打卡王", text: "这圆滚滚翠绿小翅膀好萌但好慌哈哈", lv: 11 },
        { user: "拖延症晚期", text: "再刷最后一个视频就去背单词！", lv: 21 }
      ],
      [
        { user: "眼神压迫感", text: "完了完了，它偏头看弹幕开始眯眼了", lv: 19 },
        { user: "求生欲拉满", text: "小黄车连胜冻结卡先囤两张保命！", lv: 14, combo: 9 },
        { user: "西语练习生", text: "谁在弹幕请假？绿鸟已经记小本本了", lv: 24 }
      ],
      [
        { user: "红温警报", text: "卧槽红灯亮了！！365火苗怼脸警告！！", lv: 32, combo: 28 },
        { user: "光速打开APP", text: "别盯了别盯了，我已经在拼写句子了", lv: 18 },
        { user: "名场面截图", text: "这倒八字粗绿眉压迫感拉满哈哈", lv: 27 }
      ],
      [
        { user: "连胜保卫军", text: "一秒变回弯弯星星眼拍翅太可爱了！", lv: 25, combo: 66 },
        { user: "榜一课代表", text: "全直播间集体保住连胜，星舰走起！", lv: 38 },
        { user: "明日再战", text: "川剧变脸大师非绿鸟莫属哈哈", lv: 16 }
      ]
    ],
    en: [
      [
        { user: "streak_panic", text: "11:58 PM AND THE GREEN OWL IS LIVE?!", lv: 16 },
        { user: "polyglot_99", text: "those big cheerful eyes hide pure power", lv: 11 },
        { user: "procrastinator", text: "one more scroll then Spanish I swear", lv: 21 }
      ],
      [
        { user: "side_eye", text: "UH OH HE JUST READ CHAT'S EXCUSES!!", lv: 19 },
        { user: "freeze_buyer", text: "copping a Streak Freeze just in case", lv: 14, combo: 9 },
        { user: "french_101", text: "those thick green brows are lowering...", lv: 24 }
      ],
      [
        { user: "red_alert", text: "RED RIM LIGHT + 365 FLAME TROPHY LMAO", lv: 32, combo: 28 },
        { user: "doing_lesson", text: "OKAY OKAY IM FINISHING MY LESSON RN!!", lv: 18 },
        { user: "meme_lord", text: "intense V-brow stare in 4K HD", lv: 27 }
      ],
      [
        { user: "streak_saved", text: "INSTANT HAPPY WING FLAPS SO CUTE!!", lv: 25, combo: 66 },
        { user: "NovaPilot", text: "Starlight Cruiser for keeping us accountable", lv: 38 },
        { user: "see_u_tmrw", text: "mood switch faster than compiler", lv: 16 }
      ]
    ]
  },
  duolingo_chill_night_market: {
    commerceZh: "秘制十倍魔鬼辣烤串",
    commerceEn: "10x Chili Skewers",
    zh: [
      [
        { user: "紫发酷妹粉", text: "这半耷拉死鱼眼酷姐气场两米八！", lv: 15 },
        { user: "夜市老饕", text: "十倍魔鬼辣？酷妹人设小心不保啊", lv: 10 },
        { user: "扁平3D美学", text: "紫波波头配红灯笼夜市配色绝了", lv: 22 }
      ],
      [
        { user: "微距考据党", text: "圆手掌托底对焦好稳，红油滋滋响！", lv: 18 },
        { user: "夜猫子07", text: "小黄车1号同款辣串夜宵已下单", lv: 13, combo: 8 },
        { user: "前排押注", text: "赌五毛钱三秒内高冷表情必破功", lv: 25 }
      ],
      [
        { user: "人设崩塌组", text: "哈哈哈哈死鱼眼一秒瞪成铜铃大圆眼！", lv: 29, combo: 26 },
        { user: "红温现场", text: "整张脸红成小番茄，自拍杆都在抖", lv: 17 },
        { user: "切片预定", text: "年度最反差萌吃播翻车没有之一", lv: 31 }
      ],
      [
        { user: "吨吨吨救命", text: "抱着超大冰柠檬茶猛吸太真实了哈哈", lv: 21, combo: 66 },
        { user: "嘴硬王者", text: "边喝冰茶边瞪弹幕，傲娇值拉满", lv: 16 },
        { user: "榜一随缘", text: "刷艘星舰给酷姐买十杯冰饮解辣！", lv: 36 }
      ]
    ],
    en: [
      [
        { user: "chill_vibes", text: "Lila's deadpan half-lidded aura is iconic", lv: 15 },
        { user: "night_bites", text: "10x ghost chili vs cool girl persona", lv: 10 },
        { user: "color_nerd", text: "violet bob + warm red lanterns looks crisp!", lv: 22 }
      ],
      [
        { user: "lens_nerd", text: "clean palm autofocus on that spice glaze!", lv: 18 },
        { user: "hungry_rn", text: "sizzling chili crust in full HD", lv: 13, combo: 8 },
        { user: "chat_bet", text: "3... 2... 1... goodbye poker face", lv: 25 }
      ],
      [
        { user: "persona_gone", text: "HER COOL EYES POPPED WIDE OPEN LMAO", lv: 29, combo: 26 },
        { user: "coral_blush", text: "FULL TOMATO BLUSH + SHAKING ARM", lv: 17 },
        { user: "vod_clipper", text: "funniest character break on live", lv: 31 }
      ],
      [
        { user: "lemon_tea", text: "CHUGGING THAT GIANT BOBA CUP FOR DEAR LIFE", lv: 21, combo: 66 },
        { user: "top_gifter", text: "Starlight Cruiser for the spicy recovery", lv: 36 },
        { user: "still_cool", text: "grumpy glare at chat is perfection", lv: 16 }
      ]
    ]
  },
  tux_ferris_code_webcam: {
    zh: [
      [
        { user: "内核守夜人", text: "戴大耳机的Linux企鹅Tux敲键盘太萌了！", lv: 14 },
        { user: "青轴发烧友", text: "小黑翅拍机械键盘这麻将音绝了", lv: 19 },
        { user: "周五不发版", text: "记住铁律：周五凌晨绝不碰生产分支", lv: 23 }
      ],
      [
        { user: "列文虎克", text: "等等！！马克杯后面探出一只橙色小螃蟹！", lv: 26 },
        { user: "Rust布道师", text: "是Ferris！！它两只小钳子盯上回车键了", lv: 18 },
        { user: "运维急救", text: "企鹅快回头！螃蟹要帮你内存安全上线了！", lv: 31 }
      ],
      [
        { user: "全站报警", text: "完了！！Ferris横跳一钳子砸中Enter！！", lv: 34 },
        { user: "Git惨案", text: "强制推送主分支？Tux眼珠子都快瞪出来了", lv: 22 },
        { user: "桌面微震", text: "连显示器摄像头都被蟹壳震晃了一下哈哈", lv: 20 }
      ],
      [
        { user: "开源世界名画", text: "企鹅抱头石化 + 小螃蟹无辜举钳神同步！", lv: 37 },
        { user: "用Rust重写", text: "Ferris：编译过了就能直接发生产呀哈哈", lv: 25 },
        { user: "录屏封神", text: "开源吉祥物联动直播节目效果满分！", lv: 30 }
      ]
    ],
    en: [
      [
        { user: "@kernel_hacker", text: "Tux in RGB headphones typing is peak cozy", lv: 14 },
        { user: "@thock_keys", text: "flipper WPM is unironically 140+", lv: 19 },
        { user: "@sre_oncall", text: "rule #1: never deploy on Friday 2AM", lv: 23 }
      ],
      [
        { user: "@crab_spotted", text: "WAIT FERRIS THE CRAB IS BEHIND THE MUG", lv: 26 },
        { user: "@rust_lang_fan", text: "LOOK AT THOSE TINY ORANGE PINCERS AIMING", lv: 18 },
        { user: "@lock_screen", text: "TUX TURN AROUND HE'S EYEING ENTER!!", lv: 31 }
      ],
      [
        { user: "@prod_deploy", text: "FERRIS SCUTTLE-SLAMMED THE ENTER KEY!!", lv: 34 },
        { user: "@git_blame", text: "shipped straight to production zero hesitation", lv: 22 },
        { user: "@tux_shock", text: "Tux's wide eyes reflecting terminal flash lol", lv: 20 }
      ],
      [
        { user: "@oss_hall_fame", text: "Tux flippers-on-head + Ferris claw wave!!", lv: 37 },
        { user: "@dev_pulse", text: "Super Heart Boost for the open-source duo", lv: 30 },
        { user: "@cargo_build", text: "if it compiles it ships — Ferris probably", lv: 25 }
      ]
    ]
  },
  godot_bot_unboxing_af: {
    commerceZh: "开源极客弹簧盲盒魔方",
    commerceEn: "Open-Hardware Cube",
    zh: [
      [
        { user: "独立游戏人", text: "蓝齿轮机器人GodoBot开播测评了！前排！", lv: 16 },
        { user: "机甲颜值党", text: "头顶三枚圆齿轮配发光白环眼好精致", lv: 12 },
        { user: "老铁蹲坑", text: "快拆快拆，看看开源硬件盲盒里装啥", lv: 20 }
      ],
      [
        { user: "对焦满分", text: "蓝白机械平掌托底秒锁AF-C黄框！够专业", lv: 23 },
        { user: "小黄车秒杀", text: "金属倒角质感绝了，1号链接已冲！", lv: 15, combo: 8 },
        { user: "红钮诱惑", text: "快按顶上那颗发光红按钮试试！", lv: 19 }
      ],
      [
        { user: "弹幕护体", text: "卧槽弹簧金星直接窜起来撞防喷棉了哈哈", lv: 29, combo: 18 },
        { user: "芯片过载", text: "机器人LED眼睛瞬间缩成震惊大圆环！！", lv: 21 },
        { user: "物理引擎暴走", text: "RigidBody3D弹力系数设太高了吧666", lv: 26, combo: 12 }
      ],
      [
        { user: "弯弯笑眼", text: "切换成 ^_^ 弧线笑眼指弹幕太治愈了！", lv: 35, combo: 66 },
        { user: "榜一大哥", text: "穿云箭安排！给小机器人升级显卡！", lv: 40 },
        { user: "金星萌物", text: "桌上的发光小金星也在跟着弹跳好萌", lv: 18 }
      ]
    ],
    en: [
      [
        { user: "indie_dev", text: "GodoBot hosting tech unboxing?! instant sub", lv: 16 },
        { user: "shader_pro", text: "cobalt gear-head + glowing LED eyes look crisp", lv: 12 },
        { user: "box_hunter", text: "tap that silver mystery cube!!", lv: 20 }
      ],
      [
        { user: "af_c_lock", text: "mechanical white palm AF-C lock is genius", lv: 23 },
        { user: "cnc_finish", text: "anodized bevels + red button super sharp", lv: 15, combo: 8 },
        { user: "press_it", text: "PRESS THE RED BUTTON ON LIVE!", lv: 19 }
      ],
      [
        { user: "spring_pop", text: "GOLDEN STAR ROCKETED INTO THE BOOM MIC!!", lv: 29, combo: 18 },
        { user: "physics_bug", text: "who set bounce restitution to 9.0 lmao", lv: 26, combo: 12 },
        { user: "led_shock", text: "HIS LED EYES WENT FULL WIDE RINGS", lv: 21 }
      ],
      [
        { user: "happy_arcs", text: "THE ^_^ LED ARCS POINTING AT CHAT!!", lv: 35, combo: 66 },
        { user: "IronBro_01", text: "Golden Sky Arrows for GodoBot!!", lv: 40 },
        { user: "star_buddy", text: "wholesome open-source stream W", lv: 18 }
      ]
    ]
  },
  voxel_wuxia_sword_live: {
    commerceZh: "附魔青霜像素飞剑",
    commerceEn: "Enchanted Rune Sword",
    zh: [
      [
        { user: "方块蜀山弟子", text: "8x8体素仙侠御剑直播？！双厨狂喜！！", lv: 17 },
        { user: "像素考据党", text: "立体道冠外层皮肤配方块云海质感太正了", lv: 22 },
        { user: "早八御剑人", text: "三环方块航道又堵了，师兄走高空层啊", lv: 11 }
      ],
      [
        { user: "附魔铁匠", text: "16x16x1阶梯像素青霜剑自发光帅炸了！", lv: 20 },
        { user: "百公里两绿宝石", text: "比坐矿车快十倍，小黄车同款飞剑已拍", lv: 15, combo: 9 },
        { user: "空管预警", text: "小心右后方！有只像素丹顶鹤贴脸飞来了！", lv: 27 }
      ],
      [
        { user: "护体罡气", text: "卧槽体素仙鹤加塞抢镜！！剑身歪了12度！", lv: 31, combo: 24 },
        { user: "方块乱流", text: "像素眼睛瞬间瞪大，差点掉下云海哈哈", lv: 19 },
        { user: "修真行车记录", text: "全服都看到仙鹤别停青云师兄了", lv: 28 }
      ],
      [
        { user: "歪冠战神", text: "像素青玉道冠吹歪一格+死鱼眼(-_-)绝了", lv: 24, combo: 66 },
        { user: "青云掌门", text: "御剑飞行期间看弹幕扣五百宗门贡献！", lv: 40 },
        { user: "榜一剑仙", text: "刷艘璀璨星舰给师兄扶正道冠哈哈", lv: 35 }
      ]
    ],
    en: [
      [
        { user: "voxel_cultivator", text: "8x8x8 Voxel Wuxia sword stream goes CRAZY", lv: 17 },
        { user: "bsl_shader", text: "3D outer robe layer + cubic clouds = peak", lv: 22 },
        { user: "sky_commuter", text: "sword highway traffic at 8AM again lol", lv: 11 }
      ],
      [
        { user: "pixel_smith", text: "16x16x1 stepped cyan rune blade underfoot!!", lv: 20 },
        { user: "emerald_saver", text: "2 emeralds per 100km? instant buy", lv: 15, combo: 9 },
        { user: "radar_alert", text: "VOXEL SPIRIT CRANE INCOMING RIGHT SHOULDER!", lv: 27 }
      ],
      [
        { user: "wing_gust", text: "CUBIC WHITE CRANE PHOTOBOMBED THE SELFIE", lv: 31, combo: 24 },
        { user: "roll_12deg", text: "that turbulence camera roll had me sweating", lv: 19 },
        { user: "immortal_clip", text: "even his 8x8 pixel eyes went wide!!", lv: 28 }
      ],
      [
        { user: "crooked_crown", text: "THE TILTED PIXEL JADE CROWN + (-_-) FACE!!", lv: 24, combo: 66 },
        { user: "sect_master", text: "keep both square hands on the sword!!", lv: 40 },
        { user: "NovaPilot", text: "Starlight Cruiser for the voxel swordsman", lv: 35 }
      ]
    ]
  },
  roblox_obby_rage_pip: {
    commerceZh: "跑酷加速弹簧通行证",
    commerceEn: "Speed-Coil Gamepass",
    zh: [
      [
        { user: "跑酷见证人", text: "第99关零失误？右上角主播嘴角压不住了", lv: 16 },
        { user: "毒奶协会", text: "半场开香槟最为致命哈哈", lv: 11 },
        { user: "R6死忠粉", text: "猫耳耳机小窗同步率满分！", lv: 20 }
      ],
      [
        { user: "屏住呼吸", text: "最后一跳了！！千万别按早空格！", lv: 18 },
        { user: "细节放大镜", text: "主播脸都快贴进显示器蓝光里了", lv: 14 },
        { user: "终点旗招手", text: "稳住这把破世界纪录了！！", lv: 25 }
      ],
      [
        { user: "红砖杀手", text: "卧槽脚尖擦了0.1毫米红砖直接没了？！", lv: 32, combo: 28 },
        { user: "O_O表情包", text: "右上角小窗震惊圆圈眼截图了！！", lv: 21 },
        { user: "Oof经典咏流传", text: "差半步拿旗，血压直接拉满", lv: 27 }
      ],
      [
        { user: "喜提第一关", text: "双手刚性拍桌+瀑布宽条眼泪笑疯", lv: 29, combo: 99 },
        { user: "键盘侠心疼", text: "桌子：我承受了不该承受的痛", lv: 15 },
        { user: "pixel_kai", text: "99朵银河玫瑰安慰重开主播！", lv: 36 }
      ]
    ],
    en: [
      [
        { user: "obby_master", text: "Stage 99 zero-death flag planted!!", lv: 16 },
        { user: "jinx_squad", text: "never flex before the green pad lol", lv: 11 },
        { user: "r6_purist", text: "smug PiP facecam smirk is crazy", lv: 20 }
      ],
      [
        { user: "spacebar_pro", text: "ONE LAST JUMP HOLD YOUR BREATH", lv: 18 },
        { user: "sweat_drop", text: "bro leaning 2 inches from monitor", lv: 14 },
        { user: "wr_pace", text: "SO CLOSE TO THE FINISH FLAG!!", lv: 25 }
      ],
      [
        { user: "killbrick_rip", text: "HIS BLOCKY TOE GRAZED RED BRICK?!", lv: 32, combo: 28 },
        { user: "clip_that", text: "LOOK AT THE O_O FACECAM REACTION", lv: 21 },
        { user: "oof_moment", text: "generational choke right on live", lv: 27 }
      ],
      [
        { user: "stage1_club", text: "BACK TO STAGE 1 WATERFALL TEARS!!", lv: 29, combo: 99 },
        { user: "desk_check", text: "RIP desk after that double block slam", lv: 15 },
        { user: "pixel_kai", text: "99x Galaxy Rose for the rebuild", lv: 36 }
      ]
    ]
  },
  roblox_doors_irl_selfie: {
    qaZh: "壁灯闪了两下！快找木衣柜躲进去别看后面！",
    qaEn: "LIGHTS FLICKERED TWICE — HIDE IN THE CLOSET NOW!!",
    zh: [
      [
        { user: "酒店老房客", text: "050号铜牌门单排自拍？主播胆子真肥", lv: 14 },
        { user: "耳机音量警告", text: "这木地板脚步声听着心里发毛", lv: 9 },
        { user: "前排护体", text: "握紧手电筒注意听电流声！", lv: 19 }
      ],
      [
        { user: "满屏快躲", text: "灯闪了灯闪了！！别低头看弹幕快躲！", lv: 26 },
        { user: "衣柜指路党", text: "右手边就有百叶木柜快进去！！", lv: 17 },
        { user: "急死观众", text: "主播还在问为什么刷HIDE？？", lv: 22 }
      ],
      [
        { user: "左肩高能", text: "自拍屏幕里左肩膀后面亮起一对白眼！！", lv: 34 },
        { user: "瞳孔地震", text: "不用回头直接从前置镜头对视上了！", lv: 24 },
        { user: "吓飞手机", text: "18mm超广角自拍恐怖感直接翻倍", lv: 29 }
      ],
      [
        { user: "百叶窗视角", text: "躲进木柜只靠手机屏冷光照明绝了", lv: 25 },
        { user: "静音大军", text: "别刷大声特效礼物会把怪引过来哈哈", lv: 18 },
        { user: "kaya.studio", text: "瀑布泪贴图太真实了，徽章压惊", lv: 31 }
      ]
    ],
    en: [
      [
        { user: "doors_vet", text: "streaming Door 050 on selfie stick?!", lv: 14 },
        { user: "wood_creak", text: "dark hotel corridor looks so eerie", lv: 9 },
        { user: "stay_alert", text: "watch the brass sconces closely", lv: 19 }
      ],
      [
        { user: "spam_hide", text: "HIDE HIDE HIDE LIGHTS JUST FLASHED!!", lv: 26 },
        { user: "closet_now", text: "STOP READING CHAT GET IN WARDROBE", lv: 17 },
        { user: "mina.design", text: "something is coming down the hall!", lv: 22 }
      ],
      [
        { user: "behind_left", text: "GLOWING WHITE EYES OVER LEFT SHOULDER", lv: 34 },
        { user: "selfie_scare", text: "SPOTTED IT IN THE FRONT CAM PREVIEW!", lv: 24 },
        { user: "heart_rate", text: "O_O decal switch was instant", lv: 29 }
      ],
      [
        { user: "closet_gang", text: "peeking through wooden slats crying lol", lv: 25 },
        { user: "shhh_chat", text: "nobody breathe until red glow passes", lv: 18 },
        { user: "kaya.studio", text: "3 Badges for surviving Door 050!", lv: 31 }
      ]
    ]
  },
  roblox_pet_hatch_pk: {
    commerceZh: "神宠盲盒幸运孵化蛋",
    commerceEn: "Mythic Hatch Egg",
    zh: [
      [
        { user: "氪金观察员", text: "左屏金色VIP蛋 vs 右屏新手斑点蛋哈哈", lv: 16 },
        { user: "PK吃瓜群众", text: "开局血条78%比22%，新手拿头赢？", lv: 12, combo: 6 },
        { user: "黄皮信仰", text: "别小看经典Noob的玄学微笑！", lv: 23 }
      ],
      [
        { user: "同步敲蛋", text: "两边同时亮金裂纹了！！谁出金？？", lv: 19 },
        { user: "心跳开奖", text: "小黄车同款盲盒蛋先拍一单沾喜气", lv: 14 },
        { user: "欧气检定", text: "三二一开壳见真章！！", lv: 25, combo: 12 }
      ],
      [
        { user: "全服播报", text: "卧槽0.01%青金传说神龙给新手孵出来了？！", lv: 35, combo: 38 },
        { user: "PK条极限反杀", text: "左边开出灰石头当场石化哈哈哈哈", lv: 22 },
        { user: "微笑战神", text: "Noob爆出神龙连表情都不变一下太帅了", lv: 29, combo: 18 }
      ],
      [
        { user: "当场改名", text: "左屏90度刚体扑桌自闭 vs 右屏淡定喝可乐", lv: 31, combo: 88 },
        { user: "榜一大哥", text: "穿云箭全刷给右屏欧皇老铁！！", lv: 42 },
        { user: "节目效果拉满", text: "年度最具戏剧性连麦PK没有之一", lv: 26 }
      ]
    ],
    en: [
      [
        { user: "whale_watch", text: "Golden VIP Egg vs Starter Egg PK lol", lv: 16 },
        { user: "odds_maker", text: "78% PK lead already, poor Noob", lv: 12, combo: 6 },
        { user: "noob_believer", text: "never doubt the Default Smile aura", lv: 23 }
      ],
      [
        { user: "crack_hype", text: "BOTH EGGS GLOWING AT ONCE!!", lv: 19 },
        { user: "rng_gods", text: "please let the starter egg cook", lv: 14 },
        { user: "drumroll", text: "3... 2... 1... HATCH!!", lv: 25, combo: 12 }
      ],
      [
        { user: "server_alert", text: "0.01% MYTHIC NEON DRAGON ON STARTER EGG?!", lv: 35, combo: 38 },
        { user: "pebble_rip", text: "Y2K QUEEN GOT A GRAY ROCK LMAO", lv: 22 },
        { user: "pk_comeback", text: "PK BAR INSTANTLY FLIPPED TO 84%!!", lv: 29, combo: 18 }
      ],
      [
        { user: "bloxy_toast", text: "90° desk faceplant vs calm Bloxy Cola sip", lv: 31, combo: 88 },
        { user: "IronBro_01", text: "Golden Sky Arrows for ClassicNoob!!", lv: 42 },
        { user: "gg_ez", text: "default smile stays undefeated", lv: 26 }
      ]
    ]
  }
};

export function buildShotHudTimeline(shot = {}, shotIdx = 0, totalShots = 4, platformId = "douyin", episodeSlug = "") {
  const preset = resolvePlatformPreset(platformId);
  if (preset.id === "clean") {
    return { platform: "clean", enabled: false, events: [] };
  }

  const baseViewers = shot.baseViewers || 12400 + shotIdx * 6800;
  const peakMultiplier = shotIdx === totalShots - 1 ? 2.4 : shotIdx === totalShots - 2 ? 1.85 : 1.15;
  const viewerCount = Math.round(baseViewers * peakMultiplier);

  const pack = EPISODE_DANMAKU_PACKS[episodeSlug] || EPISODE_DANMAKU_PACKS.duolingo_owl_streak_cam;
  const cIdx = Math.min(3, shotIdx % 4);
  const commentsZh = shot.hudCommentsZh || pack.zh[cIdx];
  const commentsEn = shot.hudCommentsEn || pack.en[cIdx];

  const activePopup =
    shot.hudPopup ||
    (shotIdx === 0
      ? "join_toast"
      : shotIdx === 1
      ? preset.id === "instagram"
        ? "qa_pinned"
        : "commerce_card"
      : shotIdx === 2
      ? "gift_combo"
      : "gift_combo_peak");

  return {
    platform: preset.id,
    enabled: true,
    viewerCount,
    safeZone1080x1920: preset.safeZone1080x1920,
    activePopup,
    commentsZh,
    commentsEn,
    commerceItemZh: shot.commerceItemZh || pack.commerceZh || "1号福利链接",
    commerceItemEn: shot.commerceItemEn || pack.commerceEn || "Link #1 Deal",
    qaQuestionZh: shot.qaQuestionZh || pack.qaZh || "等等！刚才是真的自己在动吗？？",
    qaQuestionEn: shot.qaQuestionEn || pack.qaEn || "Wait did that actually move on live?!",
    giftZh: shot.hudGiftZh || preset.popups.defaultGiftZh,
    giftEn: shot.hudGiftEn || preset.popups.defaultGiftEn,
    pkScoreRatio: shot.pkScoreRatio ?? (shotIdx < 2 ? 0.52 : shotIdx === 2 ? 0.28 : 0.14),
    heartBurstIntensity: shotIdx >= 2 ? "high" : "normal"
  };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]).endsWith("hud_presets.mjs");
if (isMain) {
  const argPlatform = process.argv.includes("--platform")
    ? process.argv[process.argv.indexOf("--platform") + 1]
    : "all";
  const payload =
    argPlatform === "all"
      ? PLATFORM_HUD_PRESETS
      : resolvePlatformPreset(argPlatform);
  const outIdx = process.argv.indexOf("--out");
  const text = JSON.stringify(payload, null, 2) + "\n";
  if (outIdx !== -1 && process.argv[outIdx + 1]) {
    const abs = path.resolve(process.argv[outIdx + 1]);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, text, "utf8");
    console.log(`Wrote HUD preset spec to ${abs}`);
  } else {
    process.stdout.write(text);
  }
}
