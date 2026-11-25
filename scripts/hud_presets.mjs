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
      defaultGiftZh: { sender: "kaya.studio", gift: "发送了徽章打赏", combo: 3 },
      defaultGiftEn: { sender: "kaya.studio", gift: "bought 3 Badges", combo: 3 },
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
export function buildShotHudTimeline(shot = {}, shotIdx = 0, totalShots = 4, platformId = "douyin") {
  const preset = resolvePlatformPreset(platformId);
  if (preset.id === "clean") {
    return { platform: "clean", enabled: false, events: [] };
  }

  const baseViewers = shot.baseViewers || 12400 + shotIdx * 6800;
  const peakMultiplier = shotIdx === totalShots - 1 ? 2.4 : shotIdx === totalShots - 2 ? 1.85 : 1.15;
  const viewerCount = Math.round(baseViewers * peakMultiplier);

  const defaultCommentsZh = [
    [
      { user: "阿泽冲冲冲", text: "前排打卡！真敢播啊？？", lv: 14 },
      { user: "芝士小猫", text: "镜头离这么近太真实了", lv: 8 },
      { user: "夜猫子07", text: "家人们别眨眼看后面！", lv: 21 }
    ],
    [
      { user: "测评老司机", text: "这微距对焦绝了，看清细节了", lv: 18 },
      { user: "泡泡糖", text: "等等……声音是不是不对劲", lv: 9 },
      { user: "不吃香菜", text: "哈哈哈哈弹幕全在预警", lv: 12, combo: 6 }
    ],
    [
      { user: "全场课代表", text: "卧槽！！直播事故名场面！！", lv: 26, combo: 23 },
      { user: "可乐加冰", text: "？？？？刚刚发生了什么", lv: 15 },
      { user: "切片组就位", text: "录屏了录屏了，神回预定！", lv: 30 }
    ],
    [
      { user: "满屏问号", text: "主播表情彻底凝固哈哈哈哈", lv: 19, combo: 66 },
      { user: "早八特种兵", text: "刚进来就看到大型破防现场", lv: 11 },
      { user: "榜一随缘", text: "礼物走一波安慰一下主播！", lv: 36 }
    ]
  ];

  const defaultCommentsEn = [
    [
      { user: "kai_streams", text: "YO chat we are actually live!!", lv: 14 },
      { user: "momo_irl", text: "wait look right behind you...", lv: 8 },
      { user: "nightowl99", text: "no way they do this on stream", lv: 21 }
    ],
    [
      { user: "lens_nerd", text: "that autofocus pull is clean 👀", lv: 18 },
      { user: "pixel_tea", text: "hold up did something just move?!", lv: 9 },
      { user: "chat_clipper", text: "W STREAM LMAO", lv: 12, combo: 6 }
    ],
    [
      { user: "clip_that_now", text: "BRO WHAT JUST HAPPENED?!?!", lv: 26, combo: 23 },
      { user: "iced_latte", text: "CHAT IS GOING CRAZY RN 😭😭", lv: 15 },
      { user: "vod_hunter", text: "INSTANT HALL OF FAME FAIL", lv: 30 }
    ],
    [
      { user: "zero_chill", text: "LOOK AT THEIR FACE LMAO 💀", lv: 19, combo: 66 },
      { user: "cozy_byte", text: "joined at the exact peak moment", lv: 11 },
      { user: "top_gifter", text: "clip it!! 100k views incoming", lv: 36 }
    ]
  ];

  const cIdx = Math.min(3, shotIdx % 4);
  const commentsZh = shot.hudCommentsZh || defaultCommentsZh[cIdx];
  const commentsEn = shot.hudCommentsEn || defaultCommentsEn[cIdx];

  // Pick context-appropriate active popup per shot so frames are never overcrowded
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
