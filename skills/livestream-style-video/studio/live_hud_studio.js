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
    scene: "duolingo-owl",
    chromaMode: "none",
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
    plateCanvas: document.getElementById("live-plate-canvas"),
    pipCanvas: document.getElementById("pip-canvas"),
    videoPlate: document.getElementById("custom-video-plate"),
    telemetry: document.getElementById("telemetry-box"),
    chatInput: document.getElementById("custom-chat-input")
  };

  function updateTelemetry() {
    els.telemetry.textContent = `platform=${state.platform} | scene=${state.scene} | pk=${state.pkVisible} (${state.pkLeftRatio}%) | pip=${state.pipVisible} | combo=x${state.giftComboCount} | commerce=${state.commerceVisible}`;
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
    state.chromaMode = "video";
    els.cleanPlateBg.className = "clean-plate-bg";
    els.plateCanvas.style.display = "none";
    els.videoPlate.src = URL.createObjectURL(file);
    els.videoPlate.style.display = "block";
    els.videoPlate.play();
    updateTelemetry();
  });

  function setScene(sceneId) {
    state.scene = sceneId;
    state.chromaMode = "none";
    els.cleanPlateBg.className = "clean-plate-bg";
    els.videoPlate.style.display = "none";
    els.plateCanvas.style.display = "block";
    document.querySelectorAll("[data-set-scene]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.setScene === sceneId);
    });
    if (sceneId === "roblox-obby" && !state.pipVisible) {
      state.pipVisible = true;
      els.pipBox.classList.add("visible");
    }
    updateTelemetry();
  }

  document.querySelectorAll("[data-set-scene]").forEach((btn) => {
    btn.addEventListener("click", () => setScene(btn.dataset.setScene));
  });

  document.getElementById("btn-bg-green").addEventListener("click", () => {
    state.chromaMode = "green";
    els.cleanPlateBg.className = "clean-plate-bg chroma-green";
    els.plateCanvas.style.display = "none";
    els.videoPlate.style.display = "none";
    document.querySelectorAll("[data-set-scene]").forEach((b) => b.classList.remove("active"));
    updateTelemetry();
  });

  document.getElementById("btn-bg-checker").addEventListener("click", () => {
    state.chromaMode = "checker";
    els.cleanPlateBg.className = "clean-plate-bg chroma-checker";
    els.plateCanvas.style.display = "none";
    els.videoPlate.style.display = "none";
    document.querySelectorAll("[data-set-scene]").forEach((b) => b.classList.remove("active"));
    updateTelemetry();
  });

  // Procedural Clean-Plate Live Camera Viewport Renderer (Studio IRL / Wuxia Sword / Roblox Obby + Synced PiP)
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.closePath();
  }

  function renderLivePlates(ts) {
    const t = (ts || 0) * 0.001;
    if (state.chromaMode === "none" && els.plateCanvas) {
      const ctx = els.plateCanvas.getContext("2d");
      const W = 390, H = 844;
      ctx.clearRect(0, 0, W, H);

      if (state.scene === "voxel-wuxia") {
        const gSky = ctx.createLinearGradient(0, 0, 0, H);
        gSky.addColorStop(0, "#0284c7");
        gSky.addColorStop(0.58, "#7dd3fc");
        gSky.addColorStop(1, "#fef3c7");
        ctx.fillStyle = gSky;
        ctx.fillRect(0, 0, W, H);

        // Cubic Voxel Clouds
        for (let i = 0; i < 4; i++) {
          const cx = ((i * 130 + t * (28 + i * 9)) % (W + 180)) - 90;
          const cy = 510 + i * 48;
          ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.92)" : "rgba(254,243,199,0.88)";
          ctx.fillRect(cx, cy, 140, 32);
          ctx.fillRect(cx + 24, cy - 16, 84, 18);
        }

        // Stepped 16x16x1 Voxel Rune Sword Underfoot
        const bob = Math.sin(t * 2.6) * 6;
        ctx.save();
        ctx.translate(W / 2, 548 + bob);
        ctx.fillStyle = "#2dd4bf";
        ctx.shadowColor = "#2dd4bf";
        ctx.shadowBlur = 16;
        ctx.fillRect(-26, -8, 52, 136);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#facc15";
        ctx.fillRect(-48, -14, 96, 18);
        ctx.restore();

        // Cubic Voxel Spirit Crane
        const craneX = W + 60 - ((t * 55) % (W + 140));
        const craneY = 235 + Math.sin(t * 5) * 8;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(craneX - 24, craneY - 10, 48, 22);
        ctx.fillRect(craneX - 30, craneY - 26, 18, 18);
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(craneX - 28, craneY - 32, 14, 6);

        // 8x8x8 Voxel Wuxia Swordsman
        const sy = 336 + bob;
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(W / 2 - 54, sy + 44, 108, 136);
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(W / 2 - 54, sy + 116, 108, 20);
        ctx.fillRect(W / 2 + 54, sy + 36, 44, 92);
        ctx.fillRect(W / 2 - 98, sy + 44, 44, 92);
        // Sharp 8x8 Cubic Head + Jade Crown
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(W / 2 - 48, sy - 54, 96, 98);
        ctx.fillRect(W / 2 - 20, sy - 78, 40, 24);
        ctx.fillStyle = "#2dd4bf";
        ctx.fillRect(W / 2 - 48, sy - 38, 96, 12);
        ctx.fillStyle = "#f5cba7";
        ctx.fillRect(W / 2 - 40, sy - 22, 80, 62);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(W / 2 - 30, sy - 8, 20, 14);
        ctx.fillRect(W / 2 + 10, sy - 8, 20, 14);
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(W / 2 - 20, sy - 8, 10, 14);
        ctx.fillRect(W / 2 + 10, sy - 8, 10, 14);
        ctx.fillStyle = "#be123c";
        ctx.fillRect(W / 2 - 14, sy + 18, 28, 10);
      } else if (state.scene === "tux-ferris") {
        const gRoom = ctx.createLinearGradient(0, 0, 0, H);
        gRoom.addColorStop(0, "#0f172a");
        gRoom.addColorStop(0.65, "#1e293b");
        gRoom.addColorStop(1, "#090d16");
        ctx.fillStyle = gRoom;
        ctx.fillRect(0, 0, W, H);

        // Walnut Desk + RGB Mechanical Keyboard
        ctx.fillStyle = "#7c4d2b";
        roundRect(ctx, 18, 505, W - 36, 125, 14);
        ctx.fill();
        ctx.fillStyle = "#1e293b";
        roundRect(ctx, 68, 518, 210, 34, 8);
        ctx.fill();
        ctx.strokeStyle = "#25f4ee";
        ctx.lineWidth = 3;
        roundRect(ctx, 68, 518, 210, 34, 8);
        ctx.stroke();

        // Linux Tux Penguin in Cyan RGB Studio Headphones
        const bob = Math.sin(t * 2.5) * 3.5;
        const tx = 165, ty = 378 + bob;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(tx, ty - 48, 66, Math.PI, 0);
        ctx.stroke();
        ctx.fillStyle = "#25f4ee";
        roundRect(ctx, tx - 76, ty - 56, 18, 42, 8);
        ctx.fill();
        roundRect(ctx, tx + 58, ty - 56, 18, 42, 8);
        ctx.fill();

        ctx.fillStyle = "#161b26";
        ctx.beginPath();
        ctx.ellipse(tx, ty + 18, 78, 108, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.ellipse(tx, ty + 38, 54, 74, 0, 0, Math.PI * 2);
        ctx.fill();
        // Eyes + Golden Bill
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(tx - 18, ty - 42, 15, 19, 0, 0, Math.PI * 2);
        ctx.ellipse(tx + 18, ty - 42, 15, 19, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(tx - 14, ty - 40, 7.5, 0, Math.PI * 2);
        ctx.arc(tx + 14, ty - 40, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fbb018";
        roundRect(ctx, tx - 30, ty - 22, 60, 22, 11);
        ctx.fill();

        // CC0 Rust Ferris the Crab (#F74C00) Scuttling Beside Keyboard!
        const fx = 302 + Math.sin(t * 3.2) * 8;
        const fy = 486 - Math.abs(Math.sin(t * 4.5)) * 12;
        ctx.fillStyle = "#f74c00";
        ctx.beginPath();
        ctx.ellipse(fx, fy, 42, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        // Cute Pincers + Stalk Eyes
        roundRect(ctx, fx - 54, fy - 24, 20, 18, 8);
        ctx.fill();
        roundRect(ctx, fx + 34, fy - 28, 20, 18, 8);
        ctx.fill();
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(fx - 13, fy - 12, 5.5, 0, Math.PI * 2);
        ctx.arc(fx + 13, fy - 12, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(fx - 15, fy - 14, 2, 0, Math.PI * 2);
        ctx.arc(fx + 11, fy - 14, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (state.scene === "roblox-obby") {
        const gSky = ctx.createLinearGradient(0, 0, 0, H);
        gSky.addColorStop(0, "#0e7490");
        gSky.addColorStop(1, "#bae6fd");
        ctx.fillStyle = gSky;
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = "#f472b6";
        roundRect(ctx, 34, 540, 142, 26, 7);
        ctx.fill();
        ctx.fillStyle = "#34d399";
        roundRect(ctx, 214, 512, 146, 26, 7);
        ctx.fill();
        ctx.fillStyle = "#ff2438";
        ctx.shadowColor = "#ff2438";
        ctx.shadowBlur = 14;
        roundRect(ctx, 182, 520, 26, 18, 5);
        ctx.fill();
        ctx.shadowBlur = 0;

        const jumpPhase = (t * 0.75) % 1;
        const rx = 95 + Math.sin(jumpPhase * Math.PI) * 115;
        const ry = 372 - Math.sin(jumpPhase * Math.PI) * 78;
        ctx.save();
        ctx.translate(rx, ry);
        ctx.fillStyle = "#1e293b";
        roundRect(ctx, -38, 66, 37, 68, 5);
        ctx.fill();
        roundRect(ctx, 1, 66, 37, 68, 5);
        ctx.fill();
        ctx.fillStyle = "#0ea5e9";
        roundRect(ctx, -74, -4, 34, 52, 6);
        ctx.fill();
        roundRect(ctx, 40, -16, 34, 52, 6);
        ctx.fill();
        ctx.fillStyle = "#fde68a";
        roundRect(ctx, -74, 42, 34, 24, 5);
        ctx.fill();
        roundRect(ctx, 40, 30, 34, 24, 5);
        ctx.fill();
        ctx.fillStyle = "#0ea5e9";
        roundRect(ctx, -38, -6, 76, 72, 7);
        ctx.fill();
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(16, 40);
        ctx.lineTo(-16, 40);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#fde68a";
        roundRect(ctx, -26, -58, 52, 50, 15);
        ctx.fill();
        // Sculpted dark bangs + RGB Cat-Ear Headset
        ctx.fillStyle = "#1e293b";
        roundRect(ctx, -27, -62, 54, 18, 8);
        ctx.fill();
        ctx.fillStyle = "#f472b6";
        roundRect(ctx, -22, -74, 12, 12, 3);
        ctx.fill();
        roundRect(ctx, 10, -74, 12, 12, 3);
        ctx.fill();
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(-9, -33, 3.8, 0, Math.PI * 2);
        ctx.arc(9, -33, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, -22, 8, 0.15, Math.PI - 0.15);
        ctx.stroke();
        ctx.restore();
      } else {
        // Default: Duolingo-Inspired Feather-Green Owl Mascot (LingoOwl) 24mm Studio Stream!
        const gRoom = ctx.createLinearGradient(0, 0, 0, H);
        gRoom.addColorStop(0, "#141c34");
        gRoom.addColorStop(0.6, "#223052");
        gRoom.addColorStop(1, "#090d16");
        ctx.fillStyle = gRoom;
        ctx.fillRect(0, 0, W, H);

        // Feather-Green & Gold Studio Neon Accents
        ctx.strokeStyle = "#58cc02";
        ctx.lineWidth = 6;
        ctx.shadowColor = "#58cc02";
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.moveTo(48, 168);
        ctx.lineTo(48, 365);
        ctx.stroke();
        ctx.strokeStyle = "#ffc800";
        ctx.shadowColor = "#ffc800";
        ctx.beginPath();
        ctx.moveTo(342, 178);
        ctx.lineTo(342, 372);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Sleek Studio Desk
        ctx.fillStyle = "#e2e8f0";
        roundRect(ctx, 20, 508, W - 40, 118, 14);
        ctx.fill();

        const bounce = Math.sin(t * 2.6) * 4.5;
        const ox = W / 2, oy = 382 + bounce;

        // Plump Feather-Green Owl Body (#58CC02) + Ear Tufts
        ctx.fillStyle = "#58cc02";
        roundRect(ctx, ox - 88, oy - 96, 176, 206, 76);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(ox - 58, oy - 86);
        ctx.lineTo(ox - 92, oy - 122);
        ctx.lineTo(ox - 24, oy - 94);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(ox + 58, oy - 86);
        ctx.lineTo(ox + 92, oy - 122);
        ctx.lineTo(ox + 24, oy - 94);
        ctx.fill();

        // Waving Left Wing + Right Wing Holding 365 Streak Flame
        const wave = Math.sin(t * 4.2) * 10;
        roundRect(ctx, ox - 118, oy - 24 + wave, 38, 88, 19);
        ctx.fill();
        roundRect(ctx, ox + 80, oy - 24 - wave, 38, 88, 19);
        ctx.fill();

        // Lime-Chartreuse Scalloped Belly (#89E219)
        ctx.fillStyle = "#89e219";
        ctx.beginPath();
        ctx.ellipse(ox, oy + 48, 58, 52, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#3ea004";
        ctx.lineWidth = 4;
        for (const sx of [-24, 0, 24]) {
          ctx.beginPath();
          ctx.arc(ox + sx, oy + (sx === 0 ? 52 : 36), 10, 0.15, Math.PI - 0.15);
          ctx.stroke();
        }

        // Giant Twin-Pill White Eye Masks + Glossy Tracking Pupils
        const glanceChat = (t % 5.0) > 3.5;
        const shiftX = glanceChat ? 6 : 0;
        ctx.fillStyle = "#ffffff";
        roundRect(ctx, ox - 64, oy - 68, 58, 68, 28);
        ctx.fill();
        roundRect(ctx, ox + 6, oy - 68, 58, 68, 28);
        ctx.fill();

        for (const ex of [ox - 35, ox + 35]) {
          ctx.fillStyle = "#182226";
          ctx.beginPath();
          ctx.arc(ex + shiftX, oy - 34, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(ex + shiftX - 5, oy - 40, 5.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bold Expressive Green Brow Bars
        ctx.fillStyle = "#3ea004";
        roundRect(ctx, ox - 66, oy - 82, 58, 14, 7);
        ctx.fill();
        roundRect(ctx, ox + 8, oy - 82, 58, 14, 7);
        ctx.fill();

        // 2-Part Amber-Gold Beak (#FFC800 + #FF9600)
        ctx.fillStyle = "#ffc800";
        roundRect(ctx, ox - 20, oy - 12, 40, 22, 11);
        ctx.fill();
        ctx.fillStyle = "#ff9600";
        roundRect(ctx, ox - 13, oy + 6, 26, 14, 7);
        ctx.fill();

        // Stubby Amber Feet
        roundRect(ctx, ox - 52, oy + 102, 36, 16, 8);
        ctx.fill();
        roundRect(ctx, ox + 16, oy + 102, 36, 16, 8);
        ctx.fill();

        // Locked Screen-Left Condenser Boom Mic
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(14, 520);
        ctx.lineTo(106, 434);
        ctx.stroke();
        ctx.fillStyle = "#0f172a";
        roundRect(ctx, 96, 404, 32, 48, 15);
        ctx.fill();
      }
    }

    // Render synced Corner PiP Streamer Reaction Canvas when visible
    if (state.pipVisible && els.pipCanvas) {
      const pctx = els.pipCanvas.getContext("2d");
      pctx.fillStyle = "#1e1b4b";
      pctx.fillRect(0, 0, 104, 138);
      const bob = Math.sin(t * 4) * 2;
      pctx.fillStyle = "#0ea5e9";
      roundRect(pctx, 20, 76 + bob, 64, 48, 8);
      pctx.fill();
      pctx.fillStyle = "#a855f7";
      roundRect(pctx, 24, 24 + bob, 56, 12, 6);
      pctx.fill();
      pctx.fillStyle = "#facc15";
      roundRect(pctx, 28, 30 + bob, 48, 44, 13);
      pctx.fill();
      pctx.fillStyle = "#0f172a";
      pctx.beginPath();
      pctx.arc(44, 50 + bob, 3.5, 0, Math.PI * 2);
      pctx.arc(60, 50 + bob, 3.5, 0, Math.PI * 2);
      pctx.fill();
      pctx.fillStyle = "rgba(2,6,23,0.82)";
      roundRect(pctx, 8, 116, 88, 16, 6);
      pctx.fill();
      pctx.fillStyle = "#7dd3fc";
      pctx.font = "bold 9px monospace";
      pctx.fillText("PiP · R6 CAM", 18, 127);
    }

    requestAnimationFrame(renderLivePlates);
  }

  // Initialize default Douyin state + live canvas + initial heart burst
  setPlatform("douyin");
  spawnHeartBurst(5);
  requestAnimationFrame(renderLivePlates);
})();
