/**
 * live_hud_studio.js
 * Deterministic Multi-Platform Livestream Chrome, Popup Queue, PK Battle Bar,
 * and Bezier Heart Fountain State Machine (Douyin, Kuaishou, Instagram Live, X Live, TikTok Live).
 */

(function () {
  const PLATFORMS = {
    douyin: {
      name: "抖音直播间",
      accent: "#FE2C55",
      hostName: "阿泽 Live",
      hostSub: "本场点赞 18.6万",
      followText: "关注",
      showFollow: true,
      showTopGifters: true,
      showLivePill: false,
      storyRing: false,
      viewerText: "24.8K",
      subRankChips: ["🔥 人气榜 No.3", "小时榜", "🎁 福袋 01:28"],
      composerText: "说点什么…",
      chatRowMode: "bubble",
      badgeColor: "#3B82F6",
      badgePrefix: "钻粉 Lv.",
      joinSamples: [
        "✨ [钻粉 Lv.16] 星河舰长 来了",
        "✨ [守护] 芝士小猫 乘坐星光进场",
        "✨ [粉丝团] 夜猫子07 来了"
      ],
      giftMeta: { sender: "星河舰长", name: "璀璨星舰", icon: "🚀" },
      commerce: { badge: "讲解中", title: "1号链接 · 限量盲盒礼盒", price: "¥39.9", cta: "抢" },
      pkLeftColor: "linear-gradient(90deg, #ff1744, #fe2c55)",
      pkRightColor: "#25f4ee",
      heartColors: ["#FE2C55", "#FB7185", "#F43F5E", "#FDA4AF"],
      seedComments: [
        { user: "前排课代表", text: "前排打卡！这第一视角太稳了", lv: 14 },
        { user: "芝士小猫", text: "家人们注意看背景哈哈哈哈", lv: 9 },
        { user: "不吃香菜", text: "手掌托底对焦好真实！！", lv: 18 },
        { user: "切片组就位", text: "录屏了录屏了，名场面预定！", lv: 26 }
      ]
    },
    kuaishou: {
      name: "快手直播间",
      accent: "#FF5000",
      hostName: "老铁实测间",
      hostSub: "红心热力 9.8万",
      followText: "+ 关注",
      showFollow: true,
      showTopGifters: true,
      showLivePill: false,
      storyRing: false,
      viewerText: "3.2万老铁",
      subRankChips: ["🔥 红心热力榜", "🧧 快币红包 00:45"],
      composerText: "聊一聊…",
      chatRowMode: "bubble",
      badgeColor: "#F97316",
      badgePrefix: "铁粉 ",
      joinSamples: [
        "🔥 [铁粉] 榜一大哥 点亮了 ❤️",
        "🔥 [老铁] 东北小辣椒 点亮了 ❤️",
        "🔥 [守护] 可乐加冰 加入了直播间"
      ],
      giftMeta: { sender: "榜一大哥", name: "黄金穿云箭", icon: "🏹" },
      commerce: { badge: "小黄车秒杀", title: "源头直供 · 福利秒杀装", price: "¥19.9", cta: "去抢" },
      pkLeftColor: "linear-gradient(90deg, #ff5000, #fb923c)",
      pkRightColor: "#1890ff",
      heartColors: ["#FF5000", "#EF4444", "#FACC15", "#FB923C"],
      seedComments: [
        { user: "老铁666", text: "太实在了老铁，全屏扣666！", lv: 12, combo: 18 },
        { user: "北方汉子", text: "点亮了 ❤️❤️❤️", lv: 8 },
        { user: "测评达人", text: "小黄车1号链接还有库存吗？", lv: 15 },
        { user: "夜班保安", text: "哈哈哈哈这波绝对没剧本！", lv: 22, combo: 6 }
      ]
    },
    instagram: {
      name: "Instagram Live",
      accent: "#E1306C",
      hostName: "kaya.studio ⌄",
      hostSub: "Live Broadcast",
      followText: "",
      showFollow: false,
      showTopGifters: false,
      showLivePill: true,
      livePillBg: "linear-gradient(90deg, #E1306C, #FF0069)",
      storyRing: true,
      viewerText: "👁 14.2K",
      subRankChips: [],
      composerText: "Add a comment…",
      chatRowMode: "borderless-ig",
      badgeColor: "#E1306C",
      badgePrefix: "Badge ",
      joinSamples: [
        "👋 mina.design joined · Wave",
        "👋 pixel_kai joined · Wave",
        "👋 studio.sora joined · Wave"
      ],
      giftMeta: { sender: "mina.design", name: "Live Badges", icon: "💎" },
      commerce: { badge: "PINNED", title: "Studio Ring-Light Kit", price: "$29", cta: "View" },
      pkLeftColor: "linear-gradient(90deg, #E1306C, #FD1D1D)",
      pkRightColor: "#833AB4",
      heartColors: ["#E1306C", "#FD1D1D", "#C13584", "#FF6EA0"],
      seedComments: [
        { user: "📌 kaya.studio", text: "Welcome!! Drop your questions in the Q&A box below ✨", lv: 0 },
        { user: "lens_nerd", text: "that 18mm selfie angle feels 100% real", lv: 0 },
        { user: "momo_rblx", text: "WAIT LOOK BEHIND YOUR SHOULDER 👀", lv: 0 },
        { user: "vod_clipper", text: "no gibberish text at all, super clean!!", lv: 0 }
      ]
    },
    x: {
      name: "X / Periscope Live",
      accent: "#F91880",
      hostName: "@dev_mika",
      hostSub: "Broadcasting live",
      followText: "Follow",
      showFollow: true,
      showTopGifters: false,
      showLivePill: true,
      livePillBg: "#EF4444",
      storyRing: false,
      viewerText: "18.4K watching",
      subRankChips: ["📡 RAW CAMERA FEED · LOW LATENCY"],
      composerText: "Say something…",
      chatRowMode: "x-glass",
      badgeColor: "#35B1D1",
      badgePrefix: "",
      joinSamples: [
        "@alex_ai joined & reposted",
        "@periscope_vet tapped 12 hearts",
        "@shader_cat tuned in live"
      ],
      giftMeta: { sender: "@dev_pulse", name: "Super Heart Boost", icon: "⚡" },
      commerce: { badge: "FEATURED", title: "Open-Source Skill Repo", price: "MIT", cta: "Open" },
      pkLeftColor: "linear-gradient(90deg, #F91880, #EF4444)",
      pkRightColor: "#1D9BF0",
      // Exact 6 Periscope viewer-assigned colors
      heartColors: ["#fce473", "#f68b39", "#ed6c63", "#847bb9", "#97cd76", "#35b1d1"],
      seedComments: [
        { user: "@shader_cat", text: "2:00 AM desk stream vibes are immaculate", tint: "#fce473" },
        { user: "@frame_hunter", text: "wait are those ginger cat ears behind the chair?!", tint: "#35b1d1" },
        { user: "@zero_chill", text: "DO NOT LET THE CAT STEP ON ENTER 💀", tint: "#ed6c63" },
        { user: "@clip_archive", text: "instant classic broadcast moment", tint: "#97cd76" }
      ]
    },
    tiktok: {
      name: "TikTok Live",
      accent: "#FE2C55",
      hostName: "BloxyKai",
      hostSub: "Likes 42.1K",
      followText: "+ Follow",
      showFollow: true,
      showTopGifters: true,
      showLivePill: false,
      storyRing: false,
      viewerText: "19.6K",
      subRankChips: ["🏆 Weekly Rank #5", "🎁 Treasure 00:58"],
      composerText: "Add comment…",
      chatRowMode: "bubble",
      badgeColor: "#14B8A6",
      badgePrefix: "Gifter Lv.",
      joinSamples: [
        "🌟 [Gifter Lv.24] pixel_kai joined",
        "🌟 [Sub] obby_master joined",
        "🌟 [Top 1] neon_whale joined"
      ],
      giftMeta: { sender: "pixel_kai", name: "Galaxy Rose", icon: "🌹" },
      commerce: { badge: "PINNED", title: "Blocky Streamer Hoodie", price: "$24.00", cta: "Shop" },
      pkLeftColor: "linear-gradient(90deg, #FE2C55, #FF5E7E)",
      pkRightColor: "#25F4EE",
      heartColors: ["#FE2C55", "#25F4EE", "#FB7185", "#A855F7"],
      seedComments: [
        { user: "obby_master", text: "NO WAY ZERO DEATH STAGE 99?!", lv: 16 },
        { user: "chat_jinx", text: "watch the red killbrick right before flag 😭", lv: 9 },
        { user: "clip_that", text: "BRO HIS TOE BARELY CLIPPED IT LMAO", lv: 28 },
        { user: "stage1_club", text: "BACK TO STAGE 1 RIP KEYBOARD 💀💀", lv: 19 }
      ]
    }
  };

  const state = {
    platform: "douyin",
    giftComboCount: 1,
    joinCursor: 0,
    pkVisible: false,
    pkLeftRatio: 54,
    pipVisible: false,
    afVisible: false,
    safeZoneVisible: false,
    commerceVisible: false,
    qaVisible: false
  };

  const els = {
    stage: document.getElementById("phone-stage"),
    hudChrome: document.getElementById("hud-chrome"),
    topScrim: document.getElementById("top-scrim"),
    bottomScrim: document.getElementById("bottom-scrim"),
    hostAvatar: document.getElementById("host-avatar"),
    hostName: document.getElementById("host-name"),
    hostLikes: document.getElementById("host-likes"),
    followPill: document.getElementById("follow-pill"),
    liveStatusPill: document.getElementById("live-status-pill"),
    topGifters: document.getElementById("top-gifters"),
    viewerCountPill: document.getElementById("viewer-count-pill"),
    subrankRow: document.getElementById("subrank-row"),
    joinRibbon: document.getElementById("join-ribbon"),
    chatStack: document.getElementById("chat-feed-stack"),
    composerPlaceholder: document.getElementById("composer-placeholder"),
    giftSlots: document.getElementById("gift-slots"),
    commerceCard: document.getElementById("commerce-card"),
    commerceBadge: document.getElementById("commerce-badge"),
    commerceTitle: document.getElementById("commerce-title"),
    commercePrice: document.getElementById("commerce-price"),
    commerceCta: document.getElementById("commerce-cta"),
    igQaCard: document.getElementById("ig-qa-card"),
    heartsFountain: document.getElementById("hearts-fountain"),
    pkStage: document.getElementById("pk-stage"),
    pkBarFill: document.getElementById("pk-bar-fill"),
    pkBarTrack: document.getElementById("pk-bar-track"),
    pkScoreLeft: document.getElementById("pk-score-left"),
    pkScoreRight: document.getElementById("pk-score-right"),
    pipBox: document.getElementById("pip-box"),
    afBox: document.getElementById("af-box"),
    safeZoneGuides: document.getElementById("safe-zone-guides"),
    cleanPlateBg: document.getElementById("clean-plate-bg"),
    videoPlate: document.getElementById("custom-video-plate"),
    demoSilhouette: document.getElementById("demo-silhouette"),
    telemetry: document.getElementById("telemetry-box"),
    chatInput: document.getElementById("custom-chat-input")
  };

  function updateTelemetry() {
    els.telemetry.textContent = `platform=${state.platform} | pk=${state.pkVisible} (${state.pkLeftRatio}%) | pip=${state.pipVisible} | combo=x${state.giftComboCount} | commerce=${state.commerceVisible} | qa=${state.qaVisible}`;
  }

  function appendChatRow(item, cfg) {
    const row = document.createElement("div");
    row.className = "chat-row";
    if (cfg.chatRowMode === "borderless-ig") row.classList.add("borderless-ig");
    if (cfg.chatRowMode === "x-glass") {
      row.classList.add("x-glass");
      if (item.tint) row.style.borderLeftColor = item.tint;
    }

    if (item.lv && cfg.badgePrefix) {
      const badge = document.createElement("span");
      badge.className = "fan-badge";
      badge.style.background = cfg.badgeColor;
      badge.textContent = `${cfg.badgePrefix}${item.lv}`;
      row.appendChild(badge);
    }

    const userSpan = document.createElement("span");
    userSpan.className = "chat-user";
    if (item.tint) userSpan.style.color = item.tint;
    if (cfg.chatRowMode === "borderless-ig") userSpan.style.color = "#ffffff";
    userSpan.textContent = item.user;
    row.appendChild(userSpan);

    const textNode = document.createTextNode(item.text);
    row.appendChild(textNode);

    if (item.combo) {
      const combo = document.createElement("span");
      combo.className = "combo-pill";
      combo.textContent = `×${item.combo}`;
      row.appendChild(combo);
    }

    els.chatStack.appendChild(row);
    while (els.chatStack.children.length > 5) {
      els.chatStack.removeChild(els.chatStack.firstChild);
    }
  }

  function setPlatform(platformId) {
    state.platform = platformId;
    els.stage.dataset.platform = platformId;

    document.querySelectorAll("[data-set-platform]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.setPlatform === platformId);
    });

    if (platformId === "clean") {
      els.hudChrome.classList.add("clean-hidden");
      els.topScrim.style.display = "none";
      els.bottomScrim.style.display = "none";
      els.giftSlots.innerHTML = "";
      els.commerceCard.classList.remove("visible");
      els.igQaCard.classList.remove("visible");
      updateTelemetry();
      return;
    }

    els.hudChrome.classList.remove("clean-hidden");
    els.topScrim.style.display = "block";
    els.bottomScrim.style.display = "block";

    const cfg = PLATFORMS[platformId] || PLATFORMS.douyin;
    document.documentElement.style.setProperty("--accent", cfg.accent);

    els.hostAvatar.textContent = cfg.hostName.replace(/^@/, "").slice(0, 1).toUpperCase();
    els.hostAvatar.classList.toggle("story-ring", Boolean(cfg.storyRing));
    els.hostName.textContent = cfg.hostName;
    els.hostLikes.textContent = cfg.hostSub;
    els.followPill.textContent = cfg.followText;
    els.followPill.style.display = cfg.showFollow ? "inline-block" : "none";

    els.liveStatusPill.style.display = cfg.showLivePill ? "inline-block" : "none";
    if (cfg.livePillBg) els.liveStatusPill.style.background = cfg.livePillBg;
    els.topGifters.style.display = cfg.showTopGifters ? "flex" : "none";
    els.viewerCountPill.textContent = cfg.viewerText;
    els.composerPlaceholder.textContent = cfg.composerText;

    els.subrankRow.innerHTML = "";
    cfg.subRankChips.forEach((txt) => {
      const chip = document.createElement("span");
      chip.className = "subrank-chip";
      chip.textContent = txt;
      els.subrankRow.appendChild(chip);
    });

    els.joinRibbon.textContent = cfg.joinSamples[0];
    els.commerceBadge.textContent = cfg.commerce.badge;
    els.commerceTitle.textContent = cfg.commerce.title;
    els.commercePrice.textContent = cfg.commerce.price;
    els.commerceCta.textContent = cfg.commerce.cta;

    els.pkBarFill.style.background = cfg.pkLeftColor;
    els.pkBarTrack.style.background = cfg.pkRightColor;

    els.chatStack.innerHTML = "";
    cfg.seedComments.forEach((c) => appendChatRow(c, cfg));
    updateTelemetry();
  }

  function triggerJoinBanner() {
    if (state.platform === "clean") return;
    const cfg = PLATFORMS[state.platform] || PLATFORMS.douyin;
    state.joinCursor = (state.joinCursor + 1) % cfg.joinSamples.length;
    els.joinRibbon.style.animation = "none";
    void els.joinRibbon.offsetWidth;
    els.joinRibbon.textContent = cfg.joinSamples[state.joinCursor];
    els.joinRibbon.style.animation = "slideGiftIn 0.24s ease";
    updateTelemetry();
  }

  function triggerGiftCombo() {
    if (state.platform === "clean") return;
    const cfg = PLATFORMS[state.platform] || PLATFORMS.douyin;
    let banner = els.giftSlots.querySelector(".gift-banner");
    if (!banner) {
      state.giftComboCount = 1;
      banner = document.createElement("div");
      banner.className = "gift-banner";
      banner.innerHTML = `
        <div class="gift-avatar">${cfg.giftMeta.icon}</div>
        <div class="gift-copy">
          <div class="gift-sender">${cfg.giftMeta.sender}</div>
          <div class="gift-title">送出 ${cfg.giftMeta.name}</div>
        </div>
        <div class="gift-combo-num">×1</div>
      `;
      els.giftSlots.appendChild(banner);
    } else {
      state.giftComboCount += state.giftComboCount < 10 ? 5 : 22;
      const numEl = banner.querySelector(".gift-combo-num");
      numEl.textContent = `×${state.giftComboCount}`;
      numEl.classList.add("pop");
      setTimeout(() => numEl.classList.remove("pop"), 150);
    }
    spawnHeartBurst(6);
    updateTelemetry();
  }

  function spawnHeartBurst(count = 8) {
    if (state.platform === "clean") return;
    const cfg = PLATFORMS[state.platform] || PLATFORMS.douyin;
    const flows = ["flowOne", "flowTwo", "flowThree"];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const h = document.createElement("div");
        h.className = "floating-heart";
        h.textContent = "❤";
        const color = cfg.heartColors[i % cfg.heartColors.length];
        const flow = flows[i % flows.length];
        const dur = (1.25 + (i % 4) * 0.14).toFixed(2);
        h.style.color = color;
        h.style.left = `${18 + (i % 3) * 14}px`;
        h.style.fontSize = `${20 + (i % 4) * 5}px`;
        h.style.animation = `${flow} ${dur}s linear forwards`;
        els.heartsFountain.appendChild(h);
        setTimeout(() => h.remove(), Number(dur) * 1000 + 80);
      }, i * 75);
    }
  }

  // Bind buttons
  document.querySelectorAll("[data-set-platform]").forEach((btn) => {
    btn.addEventListener("click", () => setPlatform(btn.dataset.setPlatform));
  });

  document.getElementById("btn-join").addEventListener("click", triggerJoinBanner);
  document.getElementById("btn-gift").addEventListener("click", triggerGiftCombo);
  document.getElementById("btn-hearts").addEventListener("click", () => spawnHeartBurst(10));

  document.getElementById("btn-commerce").addEventListener("click", () => {
    state.commerceVisible = !state.commerceVisible;
    els.commerceCard.classList.toggle("visible", state.commerceVisible);
    updateTelemetry();
  });

  document.getElementById("btn-qa").addEventListener("click", () => {
    state.qaVisible = !state.qaVisible;
    els.igQaCard.classList.toggle("visible", state.qaVisible);
    updateTelemetry();
  });

  document.getElementById("btn-pk").addEventListener("click", () => {
    state.pkVisible = !state.pkVisible;
    els.pkStage.classList.toggle("visible", state.pkVisible);
    document.documentElement.style.setProperty("--chat-max-height", state.pkVisible ? "152px" : "196px");
    updateTelemetry();
  });

  document.getElementById("btn-pk-flip").addEventListener("click", () => {
    if (!state.pkVisible) {
      state.pkVisible = true;
      els.pkStage.classList.add("visible");
    }
    state.pkLeftRatio = state.pkLeftRatio > 50 ? 16 : 84;
    els.pkBarFill.style.width = `${state.pkLeftRatio}%`;
    els.pkScoreLeft.textContent = state.pkLeftRatio > 50 ? "128,900" : "19,400";
    els.pkScoreRight.textContent = state.pkLeftRatio > 50 ? "24,100" : "142,800";
    spawnHeartBurst(8);
    updateTelemetry();
  });

  document.getElementById("btn-pip").addEventListener("click", () => {
    state.pipVisible = !state.pipVisible;
    els.pipBox.classList.toggle("visible", state.pipVisible);
    updateTelemetry();
  });

  document.getElementById("btn-af").addEventListener("click", () => {
    state.afVisible = !state.afVisible;
    els.afBox.classList.toggle("visible", state.afVisible);
    updateTelemetry();
  });

  document.getElementById("btn-safezone").addEventListener("click", () => {
    state.safeZoneVisible = !state.safeZoneVisible;
    els.safeZoneGuides.classList.toggle("visible", state.safeZoneVisible);
    updateTelemetry();
  });

  document.getElementById("btn-send-chat").addEventListener("click", () => {
    const val = (els.chatInput.value || "").trim();
    if (!val || state.platform === "clean") return;
    const cfg = PLATFORMS[state.platform] || PLATFORMS.douyin;
    appendChatRow({ user: state.platform === "x" ? "@you_live" : "直播间观众", text: val, lv: 20, tint: "#35b1d1" }, cfg);
    els.chatInput.value = "";
    spawnHeartBurst(3);
  });

  document.getElementById("video-file-input").addEventListener("change", (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    els.videoPlate.src = URL.createObjectURL(file);
    els.videoPlate.style.display = "block";
    els.videoPlate.play();
    els.demoSilhouette.style.display = "none";
  });

  document.getElementById("btn-bg-normal").addEventListener("click", () => {
    els.cleanPlateBg.className = "clean-plate-bg";
  });
  document.getElementById("btn-bg-green").addEventListener("click", () => {
    els.cleanPlateBg.className = "clean-plate-bg chroma-green";
    els.demoSilhouette.style.display = "none";
  });
  document.getElementById("btn-bg-checker").addEventListener("click", () => {
    els.cleanPlateBg.className = "clean-plate-bg chroma-checker";
  });

  // Initialize default Douyin state + initial heart burst
  setPlatform("douyin");
  spawnHeartBurst(5);
})();
