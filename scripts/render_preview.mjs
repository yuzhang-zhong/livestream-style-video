#!/usr/bin/env node
/**
 * render_preview.mjs (v2.0 HD Stylized & Open-Source Character Edition)
 * Zero-npm-dependency 3D SDF Livestream Scene + Multi-Platform Chrome/HUD Video Engine.
 *
 * Character Families (Zero Uncanny Mannequins):
 * 1. Duolingo-Inspired Geometric Mascot & Cast:
 *    - LingoOwl (#58CC02 feather-green owl, #89E219 scalloped belly, twin-pill eyes, bold brow bars)
 *    - Lila (Flat-3D geometric cast with berry-violet bob bangs, half-lidded/wide pill eyes, striped knitwear)
 * 2. Open-Source Mascot IPs:
 *    - Linux Tux Penguin (obsidian body, white belly, golden bill, studio RGB headphones)
 *    - CC0 Rust Ferris the Crab (#F74C00 scalloped shell, stalk-eyes, articulated pincer claws)
 *    - MIT Godot-Inspired Gear-Bot (#478CBF chamfered head, 3 top gear cogs, glowing LED eyes & mouth-bar)
 * 3. Crisp 8x8x8 Nearest-Neighbor Voxel Sandbox:
 *    - Voxel Wuxia Swordsman (integer 8x8 pixel face, +0.5px 3D outer robe/crown, 16x16x1 stepped rune blade)
 * 4. High-Detail Canonical Roblox R6 + Sculpted UGC:
 *    - 2x2x1 torso, flush 1x2x1 fingerless block limbs, 1:1 smooth barrel head, 3D bangs/pigtails/caps/Speed Coil
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { execFileSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { TEMPLATES, compileStoryboard } from "./shot_compiler.mjs";
import { buildShotHudTimeline, resolvePlatformPreset } from "./hud_presets.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const mix = (a, b, t) => a + (b - a) * t;
const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

const v3 = (x = 0, y = 0, z = 0) => ({ x, y, z });
const add3 = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
const sub3 = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const mul3 = (a, s) => ({ x: a.x * s, y: a.y * s, z: a.z * s });
const dot3 = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const len3 = (a) => Math.hypot(a.x, a.y, a.z);
const norm3 = (a) => {
  const l = len3(a) || 1;
  return { x: a.x / l, y: a.y / l, z: a.z / l };
};
const cross3 = (a, b) => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x
});

function rotY(p, ang) {
  const c = Math.cos(ang), s = Math.sin(ang);
  return { x: c * p.x + s * p.z, y: p.y, z: -s * p.x + c * p.z };
}
function rotX(p, ang) {
  const c = Math.cos(ang), s = Math.sin(ang);
  return { x: p.x, y: c * p.y - s * p.z, z: s * p.y + c * p.z };
}
function rotZ(p, ang) {
  const c = Math.cos(ang), s = Math.sin(ang);
  return { x: c * p.x - s * p.y, y: s * p.x + c * p.y, z: p.z };
}

function sdBox(p, b) {
  const qx = Math.abs(p.x) - b.x;
  const qy = Math.abs(p.y) - b.y;
  const qz = Math.abs(p.z) - b.z;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0);
}

function sdRoundBox(p, b, r) {
  const qx = Math.abs(p.x) - b.x + r;
  const qy = Math.abs(p.y) - b.y + r;
  const qz = Math.abs(p.z) - b.z + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r;
}

function sdRoundedCylinder(p, ra, rb, h) {
  const dx = Math.hypot(p.x, p.z) - ra + rb;
  const dy = Math.abs(p.y) - h + rb;
  return Math.min(Math.max(dx, dy), 0) + Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) - rb;
}

function sdSphere(p, r) {
  return len3(p) - r;
}

function sdEllipsoid(p, r) {
  const k0 = Math.hypot(p.x / r.x, p.y / r.y, p.z / r.z);
  if (k0 < 1e-6) return -Math.min(r.x, r.y, r.z);
  const k1 = Math.hypot(p.x / (r.x * r.x), p.y / (r.y * r.y), p.z / (r.z * r.z));
  return (k0 * (k0 - 1.0)) / k1;
}

function sdCapsule(p, a, b, r) {
  const pa = sub3(p, a), ba = sub3(b, a);
  const h = clamp(dot3(pa, ba) / (dot3(ba, ba) || 1e-6), 0, 1);
  return len3(sub3(pa, mul3(ba, h))) - r;
}

function sdTaperedCapsule(p, a, b, ra, rb) {
  const pa = sub3(p, a), ba = sub3(b, a);
  const h = clamp(dot3(pa, ba) / (dot3(ba, ba) || 1e-6), 0, 1);
  return len3(sub3(pa, mul3(ba, h))) - mix(ra, rb, h);
}

function smin(a, b, k = 0.06) {
  const h = Math.max(k - Math.abs(a - b), 0.0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

class SceneHit {
  constructor() {
    this.d = 1e9;
    this.color = [128, 128, 128];
    this.roughness = 0.35;
    this.id = 0;
  }
  add(d, color, roughness = 0.35, id = 1) {
    if (d < this.d) {
      this.d = d;
      this.color = color;
      this.roughness = roughness;
      this.id = id;
    }
    return this;
  }
  merge(other) {
    if (other && other.d < this.d) {
      this.d = other.d;
      this.color = other.color;
      this.roughness = other.roughness;
      this.id = other.id;
    }
    return this;
  }
}

// ---------- PNG Encoder (Zero Dependencies) ----------
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

export function encodePNG(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * stride, stride).copy(raw, rowStart + 1);
  }
  const idat = zlib.deflateSync(raw, { level: 6 });
  return Buffer.concat([signature, pngChunk("IHDR", ihdr), pngChunk("IDAT", idat), pngChunk("IEND", Buffer.alloc(0))]);
}

// ---------- 1. Roblox High-Resolution 2D Face Decal ----------
function evalRobloxFaceDecal(u, v, expression = "smile", pupilShiftX = 0) {
  if (Math.abs(u) > 0.46 || Math.abs(v) > 0.46) return null;
  const ink = [15, 23, 42];
  const white = [255, 255, 255];
  const tear = [88, 206, 255];
  const signX = u < 0 ? -1 : 1;
  const ex = Math.abs(u) - 0.135;
  const ey = v - 0.075;

  // Comic cyan waterfall tear strips (under eyes, unobstructed)
  if (expression === "tears" && Math.abs(ex) < 0.044 && v < 0.03 && v > -0.37) {
    return Math.abs(ex) < 0.024 ? [186, 238, 255] : tear;
  }

  // Expressive eyebrows
  const browY =
    expression === "shocked"
      ? 0.205
      : expression === "smirk"
      ? (u < 0 ? 0.185 : 0.162 - Math.abs(ex) * 0.18)
      : expression === "tears"
      ? 0.172 + ex * 0.28
      : 0.175 - ex * 0.08;
  if (Math.abs(ex) < 0.068 && Math.abs(v - browY) < 0.017 && expression !== "dizzy") {
    return ink;
  }

  // Eyes
  if (expression === "dizzy") {
    if (Math.abs(ex) < 0.062 && Math.abs(ey) < 0.062 && (Math.abs(ex - ey) < 0.019 || Math.abs(ex + ey) < 0.019)) {
      return ink;
    }
  } else if (expression === "deadpan") {
    if (Math.abs(ex) < 0.068 && Math.abs(ey) < 0.017) return ink;
  } else if (expression === "shocked") {
    const r = Math.hypot(ex, ey);
    if (r < 0.074 && r > 0.048) return ink;
    if (r <= 0.048 && r > 0.019) return white;
    if (r <= 0.019) return ink;
  } else {
    const px = u - signX * 0.135 - pupilShiftX * 0.03;
    const r = Math.hypot(px, ey * 0.84);
    if (r < 0.056) {
      if (Math.hypot(px + 0.018, ey - 0.022) < 0.019) return white;
      return ink;
    }
  }

  // Mouth
  const my = v + 0.125;
  if (expression === "shocked" || expression === "tears") {
    if (Math.abs(u) < 0.082 && Math.abs(my) < 0.054) {
      if (my > 0.032) return white; // upper teeth bar
      return my < -0.016 ? [244, 114, 182] : [68, 16, 28];
    }
  } else if (expression === "deadpan" || expression === "dizzy") {
    if (Math.abs(u) < 0.082 && Math.abs(my) < 0.016) return ink;
  } else if (expression === "smirk") {
    const curve = (u - 0.02) * 0.30 + u * u * 0.8;
    if (Math.abs(u) < 0.098 && Math.abs(my - curve) < 0.019) return ink;
  } else if (expression === "grin") {
    if (Math.abs(u) < 0.105 && my < 0.026 && my > -0.055 + u * u * 3.2) {
      if (my > 0.004) return white;
      return my < -0.028 ? [244, 114, 182] : [30, 41, 59];
    }
  } else {
    const arc = u * u * 2.1 - 0.024;
    if (Math.abs(u) < 0.105 && Math.abs(my - arc) < 0.019) return ink;
  }
  return null;
}

// ---------- 2. Duolingo-Inspired Geometric Mascot Owl (LingoOwl) ----------
function evalDuolingoOwlSDF(p, cfg = {}) {
  const hit = new SceneHit();
  const pos = cfg.pos || v3(0, 0, 0);
  let q = sub3(p, pos);
  if (len3(q) - 1.45 > hit.d) return hit;

  if (cfg.yaw) q = rotY(q, cfg.yaw);
  if (cfg.roll) q = rotZ(q, cfg.roll);

  const featherGreen = [88, 204, 2];   // #58CC02
  const limeBelly = [137, 226, 25];    // #89E219
  const darkScallop = [62, 160, 4];    // #3EA004
  const beakGold = [255, 200, 0];      // #FFC800
  const beakOrange = [255, 150, 0];    // #FF9600
  const expr = cfg.expression || "cheerful";

  // Plump rounded owl body (smooth union of plump chest + head crown)
  let pb = sub3(q, v3(0, 0.12, 0));
  if (cfg.headYaw) {
    const tBlend = smoothstep(-0.08, 0.26, pb.y);
    pb = rotY(pb, cfg.headYaw * tBlend);
  }
  const dLower = sdRoundBox(sub3(pb, v3(0, -0.14, 0)), v3(0.35, 0.30, 0.27), 0.22);
  const dUpper = sdRoundBox(sub3(pb, v3(0, 0.18, 0)), v3(0.33, 0.26, 0.25), 0.20);
  const dBody = smin(dLower, dUpper, 0.12);

  if (dBody < hit.d) {
    let col = featherGreen;
    // Lime-green rounded belly patch with 3 scalloped feather ticks
    if (pb.z > 0.14 && pb.y < 0.02 && pb.y > -0.36 && Math.hypot(pb.x / 0.24, (pb.y + 0.18) / 0.21) < 1.0) {
      col = limeBelly;
      for (const sx of [-0.09, 0.0, 0.09]) {
        const sy = sx === 0 ? -0.19 : -0.13;
        const rSc = Math.hypot(pb.x - sx, pb.y - sy);
        if (rSc < 0.042 && rSc > 0.022 && pb.y < sy) col = darkScallop;
      }
    }
    // Subtle lighter-green facial mask ring around twin eyes
    if (pb.z > 0.16 && pb.y > 0.03 && pb.y < 0.34 && (Math.hypot(pb.x + 0.11, pb.y - 0.18) < 0.155 || Math.hypot(pb.x - 0.11, pb.y - 0.18) < 0.155)) {
      col = [114, 218, 22];
    }
    hit.add(dBody, col, 0.32, 20);
  }

  // Sculpted top feather ear-tufts
  hit.add(sdTaperedCapsule(pb, v3(-0.18, 0.36, 0.02), v3(-0.30, 0.49, 0.02), 0.075, 0.028), featherGreen, 0.32, 20);
  hit.add(sdTaperedCapsule(pb, v3(0.18, 0.36, 0.02), v3(0.30, 0.49, 0.02), 0.075, 0.028), featherGreen, 0.32, 20);

  // Iconic Twin-Pill Oversized White Eye Masks + Glossy Pupils
  const eyeShiftX = expr === "suspicious" ? 0.025 : 0.0;
  for (const side of [-1, 1]) {
    const pe = sub3(pb, v3(side * 0.112, 0.185, 0.235));
    const dWhite = sdRoundBox(pe, v3(0.098, 0.118, 0.032), 0.078);
    if (dWhite < hit.d) {
      let eCol = [255, 255, 255];
      if (pe.z > 0.01) {
        if (expr === "happy_arcs") {
          // Joyful ^_^ curved crescent eye arcs
          const arcY = -0.01 + (pe.x * pe.x) * -4.2;
          if (Math.abs(pe.x) < 0.062 && Math.abs(pe.y - arcY) < 0.020) eCol = [24, 34, 38];
        } else {
          const px = pe.x - eyeShiftX;
          const py = pe.y + (expr === "intense" ? 0.008 : 0);
          const pr = expr === "intense" ? 0.050 : 0.058;
          const rPupil = Math.hypot(px, py * 0.88);
          if (rPupil < pr) {
            if (Math.hypot(px + 0.018, py - 0.022) < 0.020) eCol = [255, 255, 255];
            else if (Math.hypot(px - 0.018, py + 0.020) < 0.009) eCol = [255, 255, 255];
            else eCol = [24, 34, 38];
          }
        }
      }
      hit.add(dWhite, eCol, 0.16, 21);
    }

    // Thick Expressive Floating Green Brow Bars
    const browTilt = expr === "intense" ? -side * 0.38 : expr === "suspicious" ? -side * 0.06 : side * 0.14;
    const browY = expr === "intense" ? 0.285 : expr === "suspicious" ? 0.275 : 0.325;
    const pBrow = rotZ(sub3(pb, v3(side * 0.118, browY, 0.268)), browTilt);
    hit.add(sdRoundBox(pBrow, v3(0.105, 0.032, 0.028), 0.022), darkScallop, 0.28, 22);
  }

  // Sculpted 2-Part Amber-Gold Beak
  const pBeakU = rotX(sub3(pb, v3(0, 0.065, 0.275)), 0.12);
  hit.add(sdRoundBox(pBeakU, v3(0.068, 0.042, 0.065), 0.034), beakGold, 0.20, 23);
  const openJaw = expr === "cheerful" || expr === "happy_arcs" ? 0.028 : 0.008;
  hit.add(sdRoundBox(sub3(pb, v3(0, 0.028 - openJaw, 0.258)), v3(0.048, 0.028, 0.048), 0.022), beakOrange, 0.24, 23);

  // Articulated Plump Green Wings
  const wingLAng = cfg.wingLAng ?? 0.25;
  const wingRAng = cfg.wingRAng ?? -0.25;
  const pwL = rotZ(rotX(sub3(q, v3(-0.33, 0.14, 0.02)), cfg.wingLPitch ?? -0.2), wingLAng);
  hit.add(sdRoundBox(sub3(pwL, v3(-0.06, -0.16, 0)), v3(0.068, 0.20, 0.12), 0.058), featherGreen, 0.32, 24);

  const pwR = rotZ(rotX(sub3(q, v3(0.33, 0.14, 0.02)), cfg.wingRPitch ?? -0.2), wingRAng);
  hit.add(sdRoundBox(sub3(pwR, v3(0.06, -0.16, 0)), v3(0.068, 0.20, 0.12), 0.058), featherGreen, 0.32, 24);

  // Optional Glowing 365 Flame Streak Trophy held in right wing
  if (cfg.streakFlame) {
    const pf = sub3(pwR, v3(0.06, -0.32, 0.18));
    const dOuterFlame = smin(
      sdSphere(pf, 0.115),
      sdTaperedCapsule(pf, v3(0, 0.02, 0), v3(0, 0.20, 0), 0.095, 0.018),
      0.05
    );
    hit.add(dOuterFlame, [255, 150, 0], 0.04, 25);
    hit.add(sdSphere(sub3(pf, v3(0, -0.02, 0.05)), 0.065), [255, 228, 72], 0.03, 25);
  }

  // Stubby Amber Feet
  hit.add(sdRoundBox(sub3(q, v3(-0.14, -0.34, 0.08)), v3(0.075, 0.036, 0.095), 0.028), beakOrange, 0.28, 26);
  hit.add(sdRoundBox(sub3(q, v3(0.14, -0.34, 0.08)), v3(0.075, 0.036, 0.095), 0.028), beakOrange, 0.28, 26);
  return hit;
}

// ---------- 3. Duolingo-Inspired Geometric Cast Girl (Lila — Zero Uncanny Flesh!) ----------
function evalDuolingoCastSDF(p, cfg = {}) {
  const hit = new SceneHit();
  const pos = cfg.pos || v3(0, 0, 0);
  let q = sub3(p, pos);
  if (len3(q) - 1.55 > hit.d) return hit;

  if (cfg.yaw) q = rotY(q, cfg.yaw);
  const expr = cfg.expression || "cool"; // "cool" | "shocked" | "grumpy"
  const skin = cfg.flushed ? [255, 126, 136] : [255, 218, 194];
  const bobViolet = [124, 58, 237];     // #7C3AED
  const darkViolet = [91, 33, 182];     // #5B21B6
  const stripeLilac = [221, 214, 254];  // #DDD6FE

  // Chunky Cozy Striped Geometric Sweater Torso
  const pt = sub3(q, v3(0, -0.14, 0));
  const dTorso = sdRoundBox(pt, v3(0.28, 0.34, 0.17), 0.12);
  if (dTorso < hit.d) {
    const stripe = Math.floor((pt.y + 0.5) * 9.5) % 2 === 0;
    hit.add(dTorso, stripe ? darkViolet : stripeLilac, 0.38, 30);
  }
  // Collar rib
  hit.add(sdRoundedCylinder(sub3(q, v3(0, 0.20, 0)), 0.13, 0.02, 0.035), darkViolet, 0.38, 30);

  // Rounded-Square Flat-3D Cartoon Head
  let ph = sub3(q, v3(0, 0.50, 0));
  if (cfg.headYaw) ph = rotY(ph, cfg.headYaw);
  const dHead = sdRoundBox(ph, v3(0.225, 0.215, 0.185), 0.125);
  if (dHead < hit.d) {
    let hCol = skin;
    if (ph.z > 0.13) {
      // Rosy circular cheek dots
      if (Math.hypot(Math.abs(ph.x) - 0.135, ph.y + 0.045) < 0.042) {
        hCol = [255, 132, 158];
      }
      // Mouth (cool flat line, wide shocked oval, or grumpy pout)
      const my = ph.y + 0.095;
      if (expr === "shocked") {
        if (Math.hypot(ph.x / 0.055, my / 0.048) < 1.0) {
          hCol = my < -0.012 ? [244, 114, 182] : [58, 16, 42];
        }
      } else if (expr === "grumpy") {
        const frown = -ph.x * ph.x * 2.5;
        if (Math.abs(ph.x) < 0.055 && Math.abs(my - frown) < 0.014) hCol = [58, 16, 42];
      } else {
        const smirk = ph.x * 0.12;
        if (Math.abs(ph.x) < 0.052 && Math.abs(my - smirk) < 0.013) hCol = [58, 16, 42];
      }
    }
    hit.add(dHead, hCol, 0.34, 31);
  }

  // Cute Rounded Geometric Button Nose
  hit.add(sdSphere(sub3(ph, v3(0, -0.01, 0.195)), 0.028), cfg.flushed ? [244, 63, 94] : [248, 165, 138], 0.34, 31);

  // Oversized Pill White Eyes + Signature Violet Half-Lids!
  for (const side of [-1, 1]) {
    const pe = sub3(ph, v3(side * 0.088, 0.032, 0.178));
    const dEye = sdRoundBox(pe, v3(0.054, 0.064, 0.024), 0.044);
    if (dEye < hit.d) {
      let eCol = [255, 255, 255];
      if (pe.z > 0.005) {
        if (expr !== "shocked" && pe.y > (expr === "grumpy" ? 0.004 : 0.010)) {
          // Signature cool deadpan heavy purple upper eyelid!
          eCol = bobViolet;
        } else {
          const pr = expr === "shocked" ? 0.024 : 0.032;
          const rP = Math.hypot(pe.x, (pe.y + 0.008) * 0.9);
          if (rP < pr) {
            eCol = Math.hypot(pe.x + 0.010, pe.y - 0.004) < 0.010 ? [255, 255, 255] : [24, 20, 42];
          }
        }
      }
      hit.add(dEye, eCol, 0.18, 32);
    }
  }

  // Chunky Berry-Violet Straight-Cut Bob Hair + Horizontal Bangs + Gold Hair Clip
  // Back & top bob helmet
  const pBack = sub3(ph, v3(0, 0.03, -0.03));
  if (ph.z < 0.08 || ph.y > 0.11) {
    hit.add(sdRoundBox(pBack, v3(0.265, 0.245, 0.215), 0.12), bobViolet, 0.36, 33);
  }
  // Left & Right chunky bob side-locks framing jaw
  hit.add(sdRoundBox(sub3(ph, v3(-0.225, -0.04, 0.03)), v3(0.062, 0.22, 0.155), 0.052), bobViolet, 0.36, 33);
  hit.add(sdRoundBox(sub3(ph, v3(0.225, -0.04, 0.03)), v3(0.062, 0.22, 0.155), 0.052), bobViolet, 0.36, 33);
  // Crisp straight horizontal fringe bangs across forehead
  hit.add(sdRoundBox(sub3(ph, v3(0, 0.165, 0.145)), v3(0.22, 0.068, 0.068), 0.036), bobViolet, 0.36, 33);
  // Amber hairpin bar on left temple
  hit.add(sdRoundBox(rotZ(sub3(ph, v3(-0.165, 0.12, 0.195)), 0.18), v3(0.038, 0.014, 0.015), 0.006), [255, 200, 0], 0.18, 33);

  // Cartoon Sweater Arms + Smooth Mitten Hands
  const paL = rotX(sub3(q, v3(-0.34, 0.14, 0)), cfg.armLPitch ?? -0.35);
  hit.add(sdCapsule(paL, v3(0, 0, 0), v3(0, -0.38, 0), 0.082), darkViolet, 0.38, 34);
  hit.add(sdSphere(sub3(paL, v3(0, -0.42, 0)), 0.072), skin, 0.34, 34);

  const paR = rotX(sub3(q, v3(0.34, 0.14, 0)), cfg.armRPitch ?? -1.22);
  hit.add(sdCapsule(paR, v3(0, 0, 0), v3(0, -0.38, 0), 0.082), darkViolet, 0.38, 34);
  hit.add(sdSphere(sub3(paR, v3(0, -0.42, 0)), 0.072), skin, 0.34, 34);
  return hit;
}

// ---------- 4. Open-Source Mascot IPs: Linux Tux Penguin & CC0 Rust Ferris Crab ----------
function evalTuxPenguinSDF(p, cfg = {}) {
  const hit = new SceneHit();
  const pos = cfg.pos || v3(0, 0, 0);
  let q = sub3(p, pos);
  if (len3(q) - 1.45 > hit.d) return hit;
  if (cfg.yaw) q = rotY(q, cfg.yaw);

  const obsidian = [22, 27, 38];
  const snowWhite = [248, 250, 252];
  const billGold = [251, 176, 24];
  const billDeep = [234, 128, 16];
  const expr = cfg.expression || "smile";

  // Plump Pear-Shaped Tux Body + Head
  let pb = sub3(q, v3(0, 0.08, 0));
  if (cfg.headYaw) {
    const tb = smoothstep(0.02, 0.30, pb.y);
    pb = rotY(pb, cfg.headYaw * tb);
  }
  const dBelly = sdEllipsoid(sub3(pb, v3(0, -0.14, 0)), v3(0.34, 0.34, 0.28));
  const dHead = sdEllipsoid(sub3(pb, v3(0, 0.24, 0)), v3(0.25, 0.24, 0.23));
  const dBody = smin(dBelly, dHead, 0.10);

  if (dBody < hit.d) {
    let col = obsidian;
    // Crisp Snow-White Belly Oval
    if (pb.z > 0.11 && Math.hypot(pb.x / 0.24, (pb.y + 0.14) / 0.27) < 1.0) {
      col = snowWhite;
    }
    hit.add(dBody, col, col === snowWhite ? 0.28 : 0.22, 40);
  }

  // Cute Top Head Tuft
  hit.add(sdTaperedCapsule(pb, v3(0, 0.44, 0), v3(0.03, 0.53, -0.02), 0.038, 0.014), obsidian, 0.24, 40);

  // Oversized Expressive White Oval Eyes Sitting Above Bill
  for (const side of [-1, 1]) {
    const pe = sub3(pb, v3(side * 0.072, 0.275, 0.198));
    const eyeScaleY = expr === "shocked" ? 0.078 : 0.064;
    const dE = sdEllipsoid(pe, v3(0.056, eyeScaleY, 0.028));
    if (dE < hit.d) {
      let eCol = snowWhite;
      if (pe.z > 0.006) {
        const px = pe.x + side * 0.012;
        const py = pe.y + (expr === "typing" ? -0.014 : 0);
        const pr = expr === "shocked" ? 0.020 : 0.030;
        if (Math.hypot(px, py) < pr) {
          eCol = Math.hypot(px + 0.008, py - 0.008) < 0.009 ? snowWhite : [12, 16, 24];
        }
      }
      hit.add(dE, eCol, 0.14, 41);
    }
  }

  // Contoured Smiling Golden-Orange Penguin Bill
  hit.add(sdRoundBox(sub3(pb, v3(0, 0.185, 0.235)), v3(0.115, 0.036, 0.075), 0.032), billGold, 0.20, 42);
  const jawDrop = expr === "shocked" ? 0.032 : 0.008;
  hit.add(sdRoundBox(sub3(pb, v3(0, 0.152 - jawDrop, 0.215)), v3(0.088, 0.026, 0.062), 0.022), billDeep, 0.24, 42);

  // Studio Cyan-Lit RGB Over-Ear Headphones
  const pArch = rotX(sub3(pb, v3(0, 0.28, 0)), Math.PI / 2);
  if (pb.y > 0.24) {
    const dBand = Math.max(sdRoundedCylinder(pArch, 0.275, 0.014, 0.032), -sdRoundedCylinder(pArch, 0.242, 0.01, 0.06));
    hit.add(dBand, [51, 65, 85], 0.22, 43);
  }
  for (const side of [-1, 1]) {
    hit.add(sdRoundBox(sub3(pb, v3(side * 0.258, 0.26, 0)), v3(0.038, 0.078, 0.068), 0.022), [30, 41, 59], 0.22, 43);
    hit.add(sdRoundBox(sub3(pb, v3(side * 0.282, 0.26, 0)), v3(0.016, 0.056, 0.048), 0.014), [37, 244, 238], 0.04, 43);
  }

  // Articulated Flippers (typing forward or raised on head in comic shock!)
  const flLPitch = cfg.flipperLPitch ?? -0.85;
  const flRPitch = cfg.flipperRPitch ?? -0.85;
  const flL = rotZ(rotX(sub3(q, v3(-0.30, 0.10, 0.04)), flLPitch), cfg.flipperLRoll ?? 0.22);
  hit.add(sdRoundBox(sub3(flL, v3(0, -0.18, 0)), v3(0.052, 0.19, 0.095), 0.044), obsidian, 0.24, 44);

  const flR = rotZ(rotX(sub3(q, v3(0.30, 0.10, 0.04)), flRPitch), cfg.flipperRRoll ?? -0.22);
  hit.add(sdRoundBox(sub3(flR, v3(0, -0.18, 0)), v3(0.052, 0.19, 0.095), 0.044), obsidian, 0.24, 44);

  // Webbed Golden Feet
  hit.add(sdRoundBox(sub3(q, v3(-0.15, -0.36, 0.12)), v3(0.09, 0.032, 0.11), 0.024), billGold, 0.24, 45);
  hit.add(sdRoundBox(sub3(q, v3(0.15, -0.36, 0.12)), v3(0.09, 0.032, 0.11), 0.024), billGold, 0.24, 45);
  return hit;
}

function evalFerrisCrabSDF(p, cfg = {}) {
  const hit = new SceneHit();
  const pos = cfg.pos || v3(0, 0, 0);
  const scale = cfg.scale || 1.0;
  let q = mul3(sub3(p, pos), 1.0 / scale);
  if (len3(q) - 0.85 > hit.d / scale) return hit;
  if (cfg.yaw) q = rotY(q, cfg.yaw);

  const ferrisOrange = [247, 76, 0];   // #F74C00 CC0 Ferris Tangerine
  const brightShell = [255, 108, 36];

  // Domed Crab Carapace + 5 Scalloped Shell Crown Bumps
  let dShell = sdEllipsoid(q, v3(0.24, 0.165, 0.19));
  for (let i = -2; i <= 2; i++) {
    const ang = i * 0.48;
    const bx = Math.sin(ang) * 0.21;
    const by = Math.cos(ang) * 0.06 + 0.06;
    dShell = smin(dShell, sdSphere(sub3(q, v3(bx, by, -0.02)), 0.068), 0.045);
  }
  if (dShell * scale < hit.d) {
    let cCol = q.y > 0.03 ? brightShell : ferrisOrange;
    // Cute rosy cheeks & happy smile
    if (q.z > 0.13) {
      if (Math.hypot(Math.abs(q.x) - 0.105, q.y + 0.015) < 0.030) cCol = [255, 164, 148];
      const arc = q.x * q.x * 3.5 - 0.035;
      if (Math.abs(q.x) < 0.048 && Math.abs(q.y - arc) < 0.011) cCol = [24, 16, 16];
    }
    hit.add(dShell * scale, cCol, 0.26, 46);
  }

  // Optional Tiny White Ramen Chef Headband
  if (cfg.chefBand) {
    const dBand = Math.max(
      sdRoundedCylinder(sub3(q, v3(0, 0.095, 0)), 0.225, 0.01, 0.024),
      -sdRoundedCylinder(sub3(q, v3(0, 0.095, 0)), 0.195, 0.008, 0.04)
    );
    hit.add(dBand * scale, [248, 250, 252], 0.28, 46);
  }

  // Glossy Black Stalk-Eyes with White Catchlights
  for (const side of [-1, 1]) {
    const pe = sub3(q, v3(side * 0.072, 0.065, 0.175));
    const dEye = sdSphere(pe, 0.038);
    if (dEye * scale < hit.d) {
      const isCatch = Math.hypot(pe.x + 0.012, pe.y - 0.012) < 0.012 && pe.z > 0.015;
      hit.add(dEye * scale, isCatch ? [255, 255, 255] : [15, 23, 42], 0.10, 47);
    }
  }

  // Articulated Chubby V-Notched Pincer Claws
  const clawL = rotZ(rotX(sub3(q, v3(-0.22, 0.02, 0.10)), cfg.clawLPitch ?? -0.5), cfg.clawLRoll ?? 0.45);
  const dPincerL = Math.max(sdEllipsoid(sub3(clawL, v3(-0.08, 0.06, 0.04)), v3(0.075, 0.058, 0.052)), -sdBox(rotZ(sub3(clawL, v3(-0.13, 0.09, 0.04)), 0.4), v3(0.045, 0.016, 0.06)));
  hit.add(dPincerL * scale, brightShell, 0.24, 48);

  const clawR = rotZ(rotX(sub3(q, v3(0.22, 0.02, 0.10)), cfg.clawRPitch ?? -0.5), cfg.clawRRoll ?? -0.45);
  const dPincerR = Math.max(sdEllipsoid(sub3(clawR, v3(0.08, 0.06, 0.04)), v3(0.075, 0.058, 0.052)), -sdBox(rotZ(sub3(clawR, v3(0.13, 0.09, 0.04)), -0.4), v3(0.045, 0.016, 0.06)));
  hit.add(dPincerR * scale, brightShell, 0.24, 48);

  // Stubby Side Crab Legs
  for (const side of [-1, 1]) {
    for (const lz of [-0.06, 0.02, 0.09]) {
      hit.add(sdCapsule(q, v3(side * 0.18, -0.08, lz), v3(side * 0.27, -0.17, lz), 0.024) * scale, ferrisOrange, 0.28, 48);
    }
  }
  return hit;
}

// ---------- 5. Open-Source Mascot IP: Godot-Inspired Cobalt Gear-Bot (GodoBot) ----------
function evalGodotBotSDF(p, cfg = {}) {
  const hit = new SceneHit();
  const pos = cfg.pos || v3(0, 0, 0);
  let q = sub3(p, pos);
  if (len3(q) - 1.55 > hit.d) return hit;
  if (cfg.yaw) q = rotY(q, cfg.yaw);

  const cobalt = [71, 140, 191];       // #478CBF Open-Source Game-Engine Cobalt
  const navyVisor = [26, 44, 68];
  const mechaWhite = [241, 245, 249];
  const expr = cfg.expression || "normal"; // "normal" | "wide_rings" | "happy_arcs"

  // Compact White-and-Cobalt Mecha Torso + Glowing Cyan Core
  const pt = sub3(q, v3(0, -0.14, 0));
  hit.add(sdRoundBox(pt, v3(0.27, 0.28, 0.16), 0.065), mechaWhite, 0.26, 50);
  hit.add(sdRoundBox(sub3(pt, v3(0, 0.03, 0.145)), v3(0.16, 0.12, 0.03), 0.03), cobalt, 0.24, 50);
  hit.add(sdSphere(sub3(pt, v3(0, 0.03, 0.17)), 0.046), [56, 189, 248], 0.04, 50);

  // Chamfered Cobalt Gear-Head + 3 Sculpted Top Gear Cogs + Side Bolts
  let ph = sub3(q, v3(0, 0.44, 0));
  if (cfg.headYaw) ph = rotY(ph, cfg.headYaw);

  let dHead = sdRoundBox(ph, v3(0.28, 0.22, 0.20), 0.075);
  // 3 Top Gear Teeth (Center + Left Angled + Right Angled)
  dHead = Math.min(dHead, sdRoundBox(sub3(ph, v3(0, 0.255, 0)), v3(0.062, 0.058, 0.085), 0.018));
  dHead = Math.min(dHead, sdRoundBox(rotZ(sub3(ph, v3(-0.175, 0.225, 0)), 0.46), v3(0.058, 0.055, 0.085), 0.018));
  dHead = Math.min(dHead, sdRoundBox(rotZ(sub3(ph, v3(0.175, 0.225, 0)), -0.46), v3(0.058, 0.055, 0.085), 0.018));

  if (dHead < hit.d) {
    let hCol = cobalt;
    let rough = 0.24;
    if (ph.z > 0.165) {
      // Dark navy face visor panel
      if (Math.abs(ph.x) < 0.215 && ph.y > -0.13 && ph.y < 0.13) {
        hCol = navyVisor;
        rough = 0.18;
      }
      // Glowing White LED Eyes
      const ex = Math.abs(ph.x) - 0.108;
      const ey = ph.y - 0.025;
      if (expr === "happy_arcs") {
        const arc = -0.015 - ex * ex * 5.2;
        if (Math.abs(ex) < 0.058 && Math.abs(ey - arc) < 0.018) {
          hCol = [255, 255, 255];
          rough = 0.03;
        }
      } else if (expr === "wide_rings") {
        const r = Math.hypot(ex, ey);
        if (r < 0.064 && r > 0.036) {
          hCol = [255, 255, 255];
          rough = 0.03;
        }
      } else {
        const r = Math.hypot(ex, ey);
        if (r < 0.054) {
          hCol = r < 0.022 ? cobalt : [255, 255, 255];
          rough = r < 0.022 ? 0.20 : 0.03;
        }
      }
      // Segmented White Robot Mouth-Bar
      if (Math.abs(ph.x) < 0.125 && Math.abs(ph.y + 0.082) < 0.022) {
        const notch = Math.abs(Math.abs(ph.x) - 0.045) < 0.009;
        if (!notch) {
          hCol = [255, 255, 255];
          rough = 0.05;
        }
      }
    }
    hit.add(dHead, hCol, rough, 51);
  }

  // White Side Ear-Bolts
  hit.add(sdRoundedCylinder(rotZ(sub3(ph, v3(-0.305, 0.0, 0)), Math.PI / 2), 0.055, 0.012, 0.032), mechaWhite, 0.22, 52);
  hit.add(sdRoundedCylinder(rotZ(sub3(ph, v3(0.305, 0.0, 0)), Math.PI / 2), 0.055, 0.012, 0.032), mechaWhite, 0.22, 52);

  // Articulated Cobalt Arms + White Mechanical Hands
  const paL = rotX(sub3(q, v3(-0.35, 0.08, 0)), cfg.armLPitch ?? -0.55);
  hit.add(sdCapsule(paL, v3(0, 0, 0), v3(0, -0.34, 0), 0.068), cobalt, 0.26, 53);
  hit.add(sdRoundBox(sub3(paL, v3(0, -0.38, 0)), v3(0.065, 0.065, 0.052), 0.024), mechaWhite, 0.22, 53);

  const paR = rotX(sub3(q, v3(0.35, 0.08, 0)), cfg.armRPitch ?? -0.55);
  hit.add(sdCapsule(paR, v3(0, 0, 0), v3(0, -0.34, 0), 0.068), cobalt, 0.26, 53);
  hit.add(sdRoundBox(sub3(paR, v3(0, -0.38, 0)), v3(0.065, 0.065, 0.052), 0.024), mechaWhite, 0.22, 53);
  return hit;
}

// ---------- 6. Crisp 8x8x8 Nearest-Neighbor Voxel Wuxia Swordsman & Voxel Crane ----------
const VOXEL_FACES = {
  grin: [
    "HHHHHHHH",
    "HSSSSSSH",
    "BBBBBBBB",
    "SWBSSBWS",
    "SSSSSSSS",
    "SSMMMMSS",
    "SSMWWMSS",
    "SSSSSSSS"
  ],
  shocked: [
    "HHHHHHHH",
    "BSSSSSSB",
    "SWWSSWWS",
    "SWBSSWBS",
    "SSSSSSSS",
    "SSSMMSSS",
    "SSSMMSSS",
    "SSSSSSSS"
  ],
  deadpan: [
    "HHHHHHHH",
    "HSSSSSSH",
    "SSSSSSSS",
    "SBBSSBBS",
    "SSSSSSSS",
    "SSBBBBSS",
    "SSSSSSSS",
    "SSSSSSSS"
  ]
};

function evalVoxelWuxiaSDF(p, cfg = {}) {
  const hit = new SceneHit();
  const pos = cfg.pos || v3(0, 0, 0);
  let q = sub3(p, pos);
  if (len3(q) - 1.65 > hit.d) return hit;
  if (cfg.yaw) q = rotY(q, cfg.yaw);

  const skin = [245, 204, 168];
  const hairDark = [24, 30, 44];
  const robeAzure = [56, 189, 248];
  const robeWhite = [241, 245, 249];
  const jadeGold = [45, 212, 191];
  const expr = cfg.expression || "grin";

  // 8x12x4 Voxel Sect Robe Torso (sharp 0.008 bevel)
  const pt = sub3(q, v3(0, -0.02, 0));
  const dTorso = sdRoundBox(pt, v3(0.24, 0.34, 0.13), 0.008);
  if (dTorso < hit.d) {
    // Integer nearest-neighbor robe pixel pattern (diagonal white lapel + cyan sash)
    const tx = clamp(Math.floor(((pt.x + 0.24) / 0.48) * 8), 0, 7);
    const ty = clamp(Math.floor(((0.34 - pt.y) / 0.68) * 12), 0, 11);
    let tCol = robeWhite;
    if (ty === 7 || ty === 8) tCol = jadeGold; // Jade waist belt
    else if (tx === 0 || tx === 7 || ty > 8) tCol = robeAzure;
    else if (pt.z > 0.11 && Math.abs(tx - 3.5) < 1.2 && ty < 6) tCol = robeAzure;
    hit.add(dTorso, tCol, 0.30, 60);
  }

  // 8x8x8 Sharp Cubic Head + Integer 8x8 Nearest-Neighbor Pixel Face + Raised 3D Hair Shell
  let ph = sub3(q, v3(0, 0.54, 0));
  if (cfg.headYaw) ph = rotY(ph, cfg.headYaw);
  const dHead = sdRoundBox(ph, v3(0.22, 0.22, 0.22), 0.008);
  if (dHead < hit.d) {
    let hCol = hairDark;
    if (ph.z > 0.205) {
      const gx = clamp(Math.floor(((ph.x + 0.22) / 0.44) * 8), 0, 7);
      const gy = clamp(Math.floor(((0.22 - ph.y) / 0.44) * 8), 0, 7);
      const grid = VOXEL_FACES[expr] || VOXEL_FACES.grin;
      const ch = grid[gy][gx];
      if (ch === "S") hCol = skin;
      else if (ch === "W") hCol = [255, 255, 255];
      else if (ch === "B") hCol = [15, 23, 42];
      else if (ch === "M") hCol = [190, 68, 78];
      else hCol = hairDark;
    } else if (ph.y < -0.18) {
      hCol = skin;
    }
    hit.add(dHead, hCol, 0.28, 61);
  }
  // Raised +0.5px 3D Outer Hair Cap & Azure Headband Ribbon
  if (ph.y > 0.11 || ph.z < -0.16 || Math.abs(ph.x) > 0.19) {
    const isBand = Math.abs(ph.y - 0.145) < 0.032;
    hit.add(sdRoundBox(sub3(ph, v3(0, 0.04, -0.01)), v3(0.236, 0.19, 0.236), 0.008), isBand ? jadeGold : hairDark, 0.26, 62);
  }

  // Voxel Azure-Jade Hair Crown (Crooked in Shot 4!)
  const pCrown = rotZ(sub3(ph, v3(cfg.crookedCrown ? 0.055 : 0, 0.29, 0)), cfg.crookedCrown ? 0.34 : 0);
  hit.add(sdRoundBox(pCrown, v3(0.085, 0.075, 0.085), 0.006), hairDark, 0.28, 62);
  hit.add(sdRoundBox(sub3(pCrown, v3(0, -0.02, 0)), v3(0.105, 0.028, 0.105), 0.005), [250, 204, 21], 0.16, 62);

  // 4x12x4 Square-End Voxel Arms + Glowing Jade-Slip Selfie Cam in Right Hand
  const paL = rotX(sub3(q, v3(-0.36, 0.24, 0)), cfg.armLPitch ?? -0.35);
  const dArmL = sdRoundBox(sub3(paL, v3(0, -0.24, 0)), v3(0.115, 0.32, 0.115), 0.008);
  hit.add(dArmL, paL.y < -0.44 ? skin : robeAzure, 0.30, 63);

  const paR = rotX(sub3(q, v3(0.36, 0.24, 0)), cfg.armRPitch ?? -1.25);
  const dArmR = sdRoundBox(sub3(paR, v3(0, -0.24, 0)), v3(0.115, 0.32, 0.115), 0.008);
  hit.add(dArmR, paR.y < -0.44 ? skin : robeAzure, 0.30, 63);

  if (cfg.jadeSelfie) {
    hit.add(sdRoundBox(sub3(paR, v3(-0.08, -0.58, 0.14)), v3(0.082, 0.135, 0.022), 0.005), [45, 212, 191], 0.04, 64);
  }

  // 4x12x4 Square-End Voxel Legs
  hit.add(sdRoundBox(sub3(q, v3(-0.12, -0.66, 0)), v3(0.115, 0.32, 0.118), 0.008), robeWhite, 0.32, 65);
  hit.add(sdRoundBox(sub3(q, v3(0.12, -0.66, 0)), v3(0.115, 0.32, 0.118), 0.008), robeWhite, 0.32, 65);
  return hit;
}

function evalVoxelCraneSDF(p, cfg = {}) {
  const hit = new SceneHit();
  const cp = rotY(sub3(p, cfg.pos || v3(0, 0, 0)), cfg.yaw || 0.32);
  if (len3(cp) - 0.85 > hit.d) return hit;

  // Sharp cubic white body + S-stepped voxel neck + crimson red voxel crown + gold pixel beak
  hit.add(sdRoundBox(cp, v3(0.14, 0.10, 0.20), 0.006), [255, 255, 255], 0.26, 66);
  hit.add(sdRoundBox(sub3(cp, v3(0, 0.14, 0.16)), v3(0.042, 0.12, 0.042), 0.005), [255, 255, 255], 0.26, 66);
  hit.add(sdRoundBox(sub3(cp, v3(0, 0.27, 0.20)), v3(0.058, 0.055, 0.062), 0.005), [255, 255, 255], 0.26, 66);
  hit.add(sdRoundBox(sub3(cp, v3(0, 0.335, 0.20)), v3(0.038, 0.022, 0.038), 0.004), [239, 68, 68], 0.18, 66);
  hit.add(sdRoundBox(sub3(cp, v3(0, 0.26, 0.31)), v3(0.022, 0.020, 0.065), 0.004), [250, 204, 21], 0.20, 66);

  // Flapping stepped voxel wings with black pixel wingtips
  const wingAng = cfg.wingAng ?? 0.28;
  for (const side of [-1, 1]) {
    const pw = rotZ(sub3(cp, v3(side * 0.12, 0.04, 0)), side * wingAng);
    const tipBlack = Math.abs(pw.x) > 0.26;
    hit.add(sdRoundBox(sub3(pw, v3(side * 0.18, 0, 0)), v3(0.18, 0.024, 0.13), 0.005), tipBlack ? [24, 30, 44] : [248, 250, 252], 0.28, 66);
  }
  return hit;
}

// ---------- 7. Upgraded Canonical Roblox R6 + Sculpted 3D UGC Accessories ----------
function evalRobloxAvatarSDF(p, cfg = {}) {
  const hit = new SceneHit();
  const pos = cfg.pos || v3(0, 0, 0);
  let q = sub3(p, pos);
  if (len3(q) - 1.72 > hit.d) return hit;

  if (cfg.yaw) q = rotY(q, cfg.yaw);
  if (cfg.roll) q = rotZ(q, cfg.roll);
  if (cfg.waistPitch) {
    const wPivot = v3(0, -0.18, 0);
    q = add3(rotX(sub3(q, wPivot), cfg.waistPitch), wPivot);
  }

  const theme = cfg.theme || "obby";
  const palettes = {
    noob: { head: [245, 205, 48], torso: [13, 105, 172], arms: [245, 205, 48], legs: [164, 189, 71], headset: false, hair: "none" },
    obby: { head: [253, 230, 138], torso: [14, 165, 233], arms: [14, 165, 233], hands: [253, 230, 138], legs: [30, 41, 59], headset: true, hair: "messy_cyan", speedCoil: true },
    y2k: { head: [252, 222, 132], torso: [236, 72, 153], arms: [30, 27, 46], hands: [252, 222, 132], legs: [147, 197, 253], headset: true, hair: "pigtails" },
    commuter: { head: [253, 230, 138], torso: [37, 99, 235], arms: [241, 245, 249], hands: [253, 230, 138], legs: [51, 65, 85], headset: false, hair: "backwards_cap" },
    shadow: { head: [15, 23, 42], torso: [15, 23, 42], arms: [15, 23, 42], legs: [15, 23, 42], headset: false, hair: "none" }
  };
  const pal = palettes[theme] || palettes.obby;

  // Canonical 2x2x1 Torso + 3D Hoodie Pocket / Varsity Trim
  const pt = sub3(q, v3(0, 0.0, 0));
  const dTorso = sdRoundBox(pt, v3(0.34, 0.34, 0.17), 0.026);
  if (dTorso < hit.d) {
    let tCol = pal.torso;
    if (theme === "obby" && pt.z > 0.145) {
      if (pt.y > -0.08 && pt.y < 0.15 && Math.abs(pt.x) < (0.15 - pt.y) * 0.52) tCol = [56, 189, 248];
      if (pt.y < -0.14 && Math.abs(pt.x) < 0.22) tCol = [2, 132, 199]; // Kangaroo pocket
    } else if (theme === "y2k" && pt.z > 0.145) {
      if (Math.hypot(pt.x, pt.y - 0.04) < 0.11) tCol = [253, 224, 71]; // Y2K star badge
    } else if (theme === "commuter" && pt.z > 0.145) {
      if (Math.abs(pt.x) < 0.035) tCol = [248, 250, 252]; // Varsity zip stripe
    }
    hit.add(dTorso, tCol, 0.22, 10);
  }
  if (theme === "obby" || theme === "commuter") {
    // Sculpted 3D Hoodie Collar Ring
    hit.add(sdRoundedCylinder(sub3(q, v3(0, 0.34, -0.01)), 0.19, 0.025, 0.032), theme === "obby" ? [2, 132, 199] : [225, 29, 72], 0.26, 10);
  }

  // Canonical 1:1 Smooth Barrel-Beveled Cylindrical Head + High-Res Decal
  let ph = sub3(q, v3(0, 0.56, 0));
  if (cfg.headYaw) ph = rotY(ph, cfg.headYaw);
  const dHead = sdRoundedCylinder(ph, 0.215, 0.055, 0.215);
  if (dHead < hit.d) {
    let hCol = pal.head;
    if (theme === "shadow") {
      const isEye = ph.z > 0.14 && Math.hypot(Math.abs(ph.x) - 0.072, ph.y - 0.03) < 0.034;
      hit.add(dHead, isEye ? [255, 255, 255] : hCol, isEye ? 0.02 : 0.45, 11);
    } else {
      if (ph.z > 0.14) {
        const dec = evalRobloxFaceDecal(ph.x / 0.42, ph.y / 0.42, cfg.expression || "smile", cfg.pupilShiftX || 0);
        if (dec) hCol = dec;
      }
      hit.add(dHead, hCol, 0.20, 11);
    }
  }

  // Sculpted 3D UGC Hair & Caps (Cleanly Above Eyebrows!)
  if (pal.hair === "messy_cyan") {
    const darkHair = [20, 28, 46];
    if (ph.y > 0.12 || ph.z < -0.04) {
      hit.add(sdSphere(sub3(ph, v3(0, 0.06, -0.02)), 0.235), darkHair, 0.32, 12);
    }
    for (const [lx, ly, lz, tx, ty, tz, cyan] of [
      [-0.12, 0.22, 0.16, -0.17, 0.13, 0.22, false],
      [-0.02, 0.23, 0.18, 0.03, 0.13, 0.23, true],
      [0.10, 0.22, 0.16, 0.16, 0.14, 0.21, false]
    ]) {
      hit.add(sdTaperedCapsule(ph, v3(lx, ly, lz), v3(tx, ty, tz), 0.046, 0.020), cyan ? [37, 244, 238] : darkHair, 0.28, 12);
    }
  } else if (pal.hair === "pigtails") {
    const hairP = [38, 24, 54];
    if (ph.y > 0.12 || ph.z < -0.03) {
      hit.add(sdSphere(sub3(ph, v3(0, 0.06, -0.02)), 0.235), hairP, 0.30, 12);
    }
    hit.add(sdRoundBox(sub3(ph, v3(0, 0.165, 0.175)), v3(0.17, 0.045, 0.055), 0.028), hairP, 0.30, 12);
    for (const side of [-1, 1]) {
      hit.add(sdSphere(sub3(ph, v3(side * 0.235, 0.14, -0.02)), 0.045), [244, 114, 182], 0.16, 12);
      hit.add(sdTaperedCapsule(ph, v3(side * 0.26, 0.13, -0.02), v3(side * 0.35, -0.14, 0.02), 0.072, 0.038), hairP, 0.30, 12);
    }
  } else if (pal.hair === "backwards_cap") {
    if (ph.y > 0.10) {
      hit.add(sdRoundedCylinder(sub3(ph, v3(0, 0.13, 0)), 0.232, 0.05, 0.10), [225, 29, 72], 0.28, 12);
    }
    // Backwards visor brim + dark side burns
    hit.add(sdRoundBox(sub3(ph, v3(0, 0.11, -0.24)), v3(0.14, 0.022, 0.11), 0.014), [30, 41, 59], 0.28, 12);
    hit.add(sdTaperedCapsule(ph, v3(-0.19, 0.10, 0.08), v3(-0.20, 0.01, 0.11), 0.035, 0.018), [30, 24, 22], 0.34, 12);
    hit.add(sdTaperedCapsule(ph, v3(0.19, 0.10, 0.08), v3(0.20, 0.01, 0.11), 0.035, 0.018), [30, 24, 22], 0.34, 12);
  }

  // Optional Cat-Ear RGB Headset
  if (pal.headset || cfg.headset) {
    const pArch = rotX(sub3(ph, v3(0, 0.05, 0)), Math.PI / 2);
    if (ph.y > 0.0) {
      const dBand = Math.max(sdRoundedCylinder(pArch, 0.265, 0.015, 0.035), -sdRoundedCylinder(pArch, 0.228, 0.01, 0.06));
      hit.add(dBand, [168, 85, 247], 0.18, 12);
    }
    for (const side of [-1, 1]) {
      hit.add(sdRoundBox(sub3(ph, v3(side * 0.145, 0.285, 0)), v3(0.042, 0.046, 0.026), 0.009), [244, 114, 182], 0.08, 12);
      hit.add(sdRoundBox(sub3(ph, v3(side * 0.245, 0.02, 0)), v3(0.036, 0.078, 0.068), 0.016), [56, 189, 248], 0.08, 12);
    }
  }

  // Flush 1x2x1 Solid Block Arms (Fingerless/Clawless + Sleeve Cuffs + Optional Speed Coil)
  const armLPitch = cfg.armLPitch ?? 0.0;
  const armRPitch = cfg.armRPitch ?? 0.0;

  const paL = rotX(sub3(q, v3(-0.51, 0.24, 0)), armLPitch);
  const dArmL = sdRoundBox(sub3(paL, v3(0, -0.24, 0)), v3(0.165, 0.34, 0.165), 0.022);
  hit.add(dArmL, pal.hands && paL.y < -0.42 ? pal.hands : pal.arms, 0.22, 13);

  const paR = rotX(sub3(q, v3(0.51, 0.24, 0)), armRPitch);
  const dArmR = sdRoundBox(sub3(paR, v3(0, -0.24, 0)), v3(0.165, 0.34, 0.165), 0.022);
  hit.add(dArmR, pal.hands && paR.y < -0.42 ? pal.hands : pal.arms, 0.22, 13);

  if (pal.speedCoil) {
    // Iconic Glowing Red Roblox Speed Coil around right forearm
    for (const cy of [-0.14, -0.25, -0.36]) {
      const dRing = Math.max(
        sdRoundedCylinder(sub3(paR, v3(0, cy, 0)), 0.205, 0.014, 0.022),
        -sdRoundedCylinder(sub3(paR, v3(0, cy, 0)), 0.168, 0.01, 0.04)
      );
      hit.add(dRing, [255, 44, 68], 0.05, 14);
    }
  }

  if (cfg.selfieStick) {
    hit.add(sdCapsule(paR, v3(0, -0.54, 0.05), v3(-0.18, -0.35, 0.72), 0.022), [148, 163, 184], 0.20, 14);
    hit.add(sdRoundBox(sub3(paR, v3(-0.18, -0.32, 0.76)), v3(0.088, 0.148, 0.018), 0.012), [56, 189, 248], 0.05, 14);
  }
  if (cfg.colaCan) {
    const pc = sub3(paR, v3(0, -0.56, 0.14));
    hit.add(sdRoundedCylinder(pc, 0.076, 0.012, 0.115), [225, 29, 72], 0.16, 14);
    hit.add(sdRoundedCylinder(sub3(pc, v3(0, 0.112, 0)), 0.068, 0.006, 0.012), [226, 232, 240], 0.14, 14);
  }

  // Flush 1x2x1 Solid Block Legs + Clean Sneaker Soles
  const plL = rotX(sub3(q, v3(-0.17, -0.34, 0)), cfg.legLPitch ?? 0.0);
  hit.add(sdRoundBox(sub3(plL, v3(0, -0.34, 0)), v3(0.166, 0.34, 0.168), 0.02), plL.y < -0.60 && theme !== "noob" ? [241, 245, 249] : pal.legs, 0.26, 15);
  const plR = rotX(sub3(q, v3(0.17, -0.34, 0)), cfg.legRPitch ?? 0.0);
  hit.add(sdRoundBox(sub3(plR, v3(0, -0.34, 0)), v3(0.166, 0.34, 0.168), 0.02), plR.y < -0.60 && theme !== "noob" ? [241, 245, 249] : pal.legs, 0.26, 15);

  return hit;
}

// ---------- Procedural Floor Materials ----------
function evalProceduralFloor(fp, mode, col1, col2) {
  if (mode === "hotel_carpet") {
    const medallion = Math.sin(fp.x * 7.5) * Math.sin(fp.z * 7.5);
    const border = Math.abs(fp.x) > 0.72;
    if (border) return [72, 42, 26];
    return medallion > 0.25 ? [136, 28, 42] : [92, 20, 32];
  }
  if (mode === "night_pavers") {
    const gx = Math.abs(((fp.x + 10) * 2.4) % 1 - 0.5);
    const gz = Math.abs(((fp.z + 10) * 2.4) % 1 - 0.5);
    if (gx > 0.45 || gz > 0.45) return [22, 26, 38];
    const sheen = Math.sin(fp.x * 3.1 + fp.z * 2.7) * 0.5 + 0.5;
    return [mix(34, 58, sheen), mix(36, 44, sheen), mix(54, 78, sheen)];
  }
  if (mode === "wood_planks") {
    const plank = Math.floor((fp.x + 10) * 3.2);
    const seam = Math.abs(((fp.x + 10) * 3.2) % 1 - 0.5) > 0.46;
    if (seam) return [54, 34, 22];
    const grain = (plank % 2) * 12;
    return [112 + grain, 74 + grain, 48 + grain];
  }
  const checker = (Math.floor(fp.x * 2.2) + Math.floor(fp.z * 2.2)) & 1;
  return checker ? col1 : col2;
}

// ---------- Core HD Raymarcher (Soft Shadows + Ambient Occlusion + 3-Point Rim Lighting) ----------
export function render3DViewport(width, height, sceneFn, camCfg = {}) {
  const buf = new Uint8Array(width * height * 4);
  const ro = camCfg.ro || v3(0, 0.35, 2.55);
  const ta = camCfg.ta || v3(0, 0.15, 0);
  const fov = camCfg.fov || 1.85;
  const bgTop = camCfg.bgTop || [15, 23, 42];
  const bgBot = camCfg.bgBot || [30, 41, 59];
  const floorY = camCfg.floorY !== undefined ? camCfg.floorY : -0.95;
  const floorCol1 = camCfg.floorCol1 || [30, 41, 59];
  const floorCol2 = camCfg.floorCol2 || [51, 65, 85];
  const floorMode = camCfg.floorMode || "checker";

  const fw = norm3(sub3(ta, ro));
  let rt = norm3(cross3(fw, v3(0, 1, 0)));
  let up = cross3(rt, fw);
  if (camCfg.roll) {
    const cr = Math.cos(camCfg.roll), sr = Math.sin(camCfg.roll);
    const nrt = add3(mul3(rt, cr), mul3(up, sr));
    const nup = sub3(mul3(up, cr), mul3(rt, sr));
    rt = nrt;
    up = nup;
  }

  const keyLight = norm3(camCfg.keyDir || v3(0.42, 0.76, 0.74));
  const fillLight = norm3(v3(-0.55, 0.35, 0.55));
  const rimLight = norm3(v3(-0.62, 0.48, -0.62));
  const rimTint = camCfg.rimTint || [56, 189, 248];

  const calcNormal = (p, d0) => {
    const e = 0.0024;
    return norm3(
      v3(
        sceneFn(v3(p.x + e, p.y, p.z)).d - d0,
        sceneFn(v3(p.x, p.y + e, p.z)).d - d0,
        sceneFn(v3(p.x, p.y, p.z + e)).d - d0
      )
    );
  };

  const calcAO = (p, n) => {
    const d1 = sceneFn(add3(p, mul3(n, 0.045))).d;
    const d2 = sceneFn(add3(p, mul3(n, 0.11))).d;
    const occ = Math.max(0, 0.045 - d1) * 4.5 + Math.max(0, 0.11 - d2) * 2.2;
    return clamp(1.0 - occ, 0.48, 1.0);
  };

  const calcSoftShadow = (p, lDir) => {
    let res = 1.0;
    let t = 0.04;
    for (let i = 0; i < 6; i++) {
      const h = sceneFn(add3(p, mul3(lDir, t))).d;
      if (h < 0.003) return 0.52;
      res = Math.min(res, 0.52 + 0.48 * clamp((6.0 * h) / t, 0, 1));
      t += clamp(h, 0.04, 0.22);
      if (t > 1.35) break;
    }
    return res;
  };

  for (let py = 0; py < height; py++) {
    const ny = 1 - (2 * (py + 0.5)) / height;
    const vg = py / height;
    for (let px = 0; px < width; px++) {
      const nx = ((2 * (px + 0.5)) / width - 1) * (width / height);
      const rd = norm3(add3(add3(mul3(rt, nx), mul3(up, ny)), mul3(fw, fov)));

      let r = mix(bgTop[0], bgBot[0], vg);
      let g = mix(bgTop[1], bgBot[1], vg);
      let b = mix(bgTop[2], bgBot[2], vg);

      if (camCfg.splitScreenTint) {
        if (px < width / 2) {
          r = mix(r, 108, 0.36);
          g = mix(g, 28, 0.36);
          b = mix(b, 78, 0.36);
        } else {
          r = mix(r, 20, 0.32);
          g = mix(g, 68, 0.32);
          b = mix(b, 108, 0.32);
        }
      }

      let t = 0.16;
      let tMax = 7.5;
      let tf = -1;
      if (floorY !== null && rd.y < -0.002) {
        tf = (floorY - ro.y) / rd.y;
        if (tf > 0 && tf < tMax) tMax = tf + 0.01;
      }

      let hit = null;
      const maxSteps = camCfg.maxSteps || 36;
      for (let step = 0; step < maxSteps; step++) {
        if (t > tMax) break;
        const pos = add3(ro, mul3(rd, t));
        const res = sceneFn(pos);
        if (res.d < 0.0038) {
          hit = { pos, res, t };
          break;
        }
        t += res.d;
      }

      if (hit && (tf <= 0 || hit.t <= tf)) {
        const rough = hit.res.roughness ?? 0.30;
        if (rough <= 0.07) {
          r = clamp(hit.res.color[0] * 1.10 + 18, 0, 255);
          g = clamp(hit.res.color[1] * 1.10 + 18, 0, 255);
          b = clamp(hit.res.color[2] * 1.10 + 18, 0, 255);
        } else {
          const N = calcNormal(hit.pos, hit.res.d);
          const V = mul3(rd, -1);
          const ao = camCfg.fastShade ? 0.92 : calcAO(hit.pos, N);
          const sh = camCfg.fastShade ? 1.0 : calcSoftShadow(add3(hit.pos, mul3(N, 0.012)), keyLight);
          const diff = Math.max(0, dot3(N, keyLight)) * sh;
          const fill = Math.max(0, dot3(N, fillLight)) * 0.20;
          const amb = (0.40 + 0.16 * (0.5 + 0.5 * N.y)) * ao;
          const H = norm3(add3(keyLight, V));
          const specPow = rough < 0.24 ? 38 : 16;
          const spec = Math.pow(Math.max(0, dot3(N, H)), specPow) * (rough < 0.24 ? 0.36 : 0.14) * sh;
          const rim = Math.pow(1 - Math.max(0, dot3(N, V)), 2.6) * (0.35 + 0.65 * Math.max(0, dot3(N, rimLight))) * 0.42;
          const base = hit.res.color;
          const lit = amb + diff * 0.64 + fill;
          r = clamp(base[0] * lit + 255 * spec + rimTint[0] * rim, 0, 255);
          g = clamp(base[1] * lit + 253 * spec + rimTint[1] * rim, 0, 255);
          b = clamp(base[2] * lit + 248 * spec + rimTint[2] * rim, 0, 255);
        }
      } else if (tf > 0 && tf < 10.0 && floorY !== null) {
        const fp = add3(ro, mul3(rd, tf));
        const fc = evalProceduralFloor(fp, floorMode, floorCol1, floorCol2);
        const fShadow = camCfg.fastShade ? 0.88 : calcSoftShadow(v3(fp.x, floorY + 0.015, fp.z), keyLight);
        const fade = Math.exp(-0.065 * tf * tf);
        r = mix(r, fc[0] * fShadow, fade);
        g = mix(g, fc[1] * fShadow, fade);
        b = mix(b, fc[2] * fShadow, fade);
      }

      const idx = (py * width + px) * 4;
      buf[idx] = r;
      buf[idx + 1] = g;
      buf[idx + 2] = b;
      buf[idx + 3] = 255;
    }
  }
  return buf;
}

// ---------- Episode Specific 3D Scene Builders (Zero Uncanny Mannequins!) ----------
function buildEpisodeScene(slug, shotIdx, phase = 0.5) {
  const s = clamp(shotIdx, 0, 3);

  // 1. Duolingo-Inspired Green Owl 11:58 PM Streak Check-In Webcam
  if (slug === "duolingo_owl_streak_cam") {
    const bounce = Math.sin(phase * Math.PI * 2) * 0.025;
    const flap = s === 3 ? Math.sin(phase * Math.PI * 6) * 0.55 : 0;
    const isAlert = s === 2;
    return {
      cam: {
        ro: v3(0, 0.44, isAlert ? 1.98 : 2.32),
        ta: v3(0, 0.16, 0.05),
        fov: 1.82,
        bgTop: isAlert ? [68, 14, 28] : [20, 28, 52],
        bgBot: isAlert ? [36, 12, 24] : [34, 48, 82],
        rimTint: isAlert ? [255, 72, 72] : [88, 204, 2],
        floorY: null
      },
      sceneFn: (p) => {
        const hit = new SceneHit();
        // Sleek creator desk + Left studio condenser boom mic + Glowing wall accent bar
        hit.add(sdRoundBox(sub3(p, v3(0, -0.38, 0.42)), v3(1.28, 0.048, 0.50), 0.02), [226, 232, 240], 0.28, 70);
        hit.add(sdCapsule(p, v3(-0.84, -0.26, 0.62), v3(-0.42, 0.14, 0.48), 0.024), [30, 41, 59], 0.34, 71);
        hit.add(sdRoundedCylinder(sub3(p, v3(-0.40, 0.18, 0.48)), 0.052, 0.018, 0.075), [15, 23, 42], 0.42, 71);
        hit.add(
          sdRoundBox(sub3(p, v3(0.58, 0.84, -0.92)), v3(0.36, 0.032, 0.05), 0.015),
          isAlert ? [255, 68, 68] : [88, 204, 2],
          0.04,
          72
        );

        hit.merge(
          evalDuolingoOwlSDF(p, {
            pos: v3(0, bounce, isAlert ? 0.12 : 0),
            headYaw: s === 1 ? 0.26 : 0,
            expression: s === 1 ? "suspicious" : s === 2 ? "intense" : s === 3 ? "happy_arcs" : "cheerful",
            wingLAng: s === 0 ? 0.85 : s === 3 ? 0.95 + flap : 0.25,
            wingRAng: s === 2 ? -0.75 : s === 3 ? -0.95 - flap : -0.25,
            wingRPitch: s === 2 ? -0.95 : -0.2,
            streakFlame: s === 2
          })
        );
        return hit;
      }
    };
  }

  // 2. Duolingo-Style Flat-3D Cool Girl Night-Market Spicy Skewer Selfie
  if (slug === "duolingo_chill_night_market") {
    const bob = Math.sin(phase * Math.PI * 4) * 0.028;
    const shake = s === 2 ? Math.sin(phase * Math.PI * 10) * 0.036 : 0;
    return {
      cam: {
        ro: v3(shake, 0.38 + bob, s === 1 ? 1.88 : 2.18),
        ta: v3(0, 0.24, 0),
        fov: 1.54,
        bgTop: [32, 18, 64],
        bgBot: [78, 26, 72],
        rimTint: [254, 44, 85],
        floorY: -0.92,
        floorMode: "night_pavers"
      },
      sceneFn: (p) => {
        const hit = new SceneHit();
        if (p.z < -0.55) {
          hit.add(sdRoundBox(sub3(p, v3(-0.74, 0.66, -1.08)), v3(0.28, 0.13, 0.04), 0.02), [254, 44, 85], 0.04, 30);
          hit.add(sdRoundBox(sub3(p, v3(0.76, 0.58, -1.16)), v3(0.30, 0.12, 0.04), 0.02), [37, 244, 238], 0.04, 30);
          hit.add(sdSphere(sub3(p, v3(-0.36, 0.92, -0.92)), 0.125), [255, 200, 0], 0.05, 30);
          hit.add(sdSphere(sub3(p, v3(0.38, 0.92, -0.92)), 0.125), [255, 115, 24], 0.05, 30);
        }
        hit.merge(
          evalDuolingoCastSDF(p, {
            pos: v3(0.04, 0, 0),
            yaw: -0.10,
            armRPitch: -1.24,
            armLPitch: s === 1 ? -1.12 : s === 3 ? -1.32 : -0.45,
            expression: s === 2 ? "shocked" : s === 3 ? "grumpy" : "cool",
            flushed: s >= 2
          })
        );
        // Glossy Sizzling 10x Chili Skewer + Flat Cartoon Palm Lock in Shot 1
        if (s === 1 || s === 2) {
          const skPos = s === 1 ? v3(-0.04, 0.22, 1.04) : v3(-0.18, 0.16, 0.56);
          const qk = sub3(p, skPos);
          hit.add(sdCapsule(qk, v3(0, -0.22, 0), v3(0, 0.18, 0), 0.013), [224, 182, 122], 0.36, 35);
          for (let k = -1; k <= 1; k++) {
            hit.add(sdSphere(sub3(qk, v3(0, k * 0.088, 0)), 0.052), [239, 36, 68], 0.16, 35);
          }
          if (s === 1) {
            const pPalm = rotZ(sub3(p, v3(-0.15, 0.24, 0.88)), 0.16);
            hit.add(sdRoundBox(pPalm, v3(0.085, 0.115, 0.028), 0.032), [255, 218, 194], 0.32, 35);
          }
        }
        // Giant Iced Lemon Tea Boba Cup in Shot 3
        if (s === 3) {
          const cupP = sub3(p, v3(-0.08, 0.24, 0.58));
          hit.add(sdRoundedCylinder(cupP, 0.105, 0.018, 0.155), [255, 204, 21], 0.14, 36);
          hit.add(sdRoundedCylinder(sub3(cupP, v3(0, 0.155, 0)), 0.112, 0.012, 0.018), [248, 250, 252], 0.18, 36);
          hit.add(sdCapsule(cupP, v3(0, 0.12, 0), v3(0.03, 0.28, 0.04), 0.014), [88, 204, 2], 0.18, 36);
        }
        return hit;
      }
    };
  }

  // 3. Open-Source Mascot Duo: Linux Tux + CC0 Rust Ferris 2AM Code Stream
  if (slug === "tux_ferris_code_webcam") {
    const shake = s === 2 ? Math.sin(phase * Math.PI * 8) * 0.03 * (1 - phase) : 0;
    const typeTap = s === 0 ? Math.sin(phase * Math.PI * 8) * 0.14 : 0;
    return {
      cam: {
        ro: v3(0, 0.54 + shake, 2.34),
        ta: v3(0, 0.10, 0.14),
        fov: 1.78,
        bgTop: [14, 22, 42],
        bgBot: [28, 32, 56],
        rimTint: [37, 244, 238],
        floorY: null
      },
      sceneFn: (p) => {
        const hit = new SceneHit();
        // Warm Walnut Desk + RGB Mechanical Keyboard
        hit.add(sdRoundBox(sub3(p, v3(0, -0.38, 0.46)), v3(1.32, 0.05, 0.54), 0.02), [132, 88, 56], 0.36, 49);
        const pk = sub3(p, v3(-0.04, -0.31, 0.54));
        const dKb = sdRoundBox(pk, v3(0.32, 0.025, 0.13), 0.01);
        if (dKb < hit.d) {
          let kCol = [30, 41, 59];
          if (pk.y < -0.008) kCol = [37, 244, 238];
          else if (pk.y > 0.012 && Math.abs(pk.x) < 0.28 && Math.abs(pk.z) < 0.095) {
            const gx = Math.abs(((pk.x + 1) * 18) % 1 - 0.5);
            const gz = Math.abs(((pk.z + 1) * 18) % 1 - 0.5);
            const isEnter = pk.x > 0.18 && Math.abs(pk.z) < 0.04;
            kCol = gx < 0.36 && gz < 0.36 ? (isEnter ? [247, 76, 0] : [51, 65, 85]) : [56, 189, 248];
          }
          hit.add(dKb, kCol, kCol[0] === 37 || kCol[0] === 56 ? 0.04 : 0.26, 49);
        }
        // Warm Desk Lamp + Cyan Terminal Wall Strip
        hit.add(sdCapsule(p, v3(-0.80, -0.34, 0.32), v3(-0.66, 0.26, 0.32), 0.022), [71, 85, 105], 0.30, 49);
        hit.add(sdSphere(sub3(p, v3(-0.61, 0.24, 0.34)), 0.058), [254, 243, 199], 0.04, 49);
        hit.add(sdRoundBox(sub3(p, v3(0.58, 0.82, -0.90)), v3(0.38, 0.032, 0.06), 0.014), s >= 2 ? [255, 88, 68] : [37, 244, 238], 0.04, 49);

        hit.merge(
          evalTuxPenguinSDF(p, {
            pos: v3(-0.10, 0, 0),
            headYaw: s === 0 && phase < 0.45 ? 0.22 : 0,
            expression: s >= 2 ? "shocked" : s === 0 ? "typing" : "smile",
            flipperLPitch: s === 3 ? -2.35 : -0.88 + typeTap,
            flipperRPitch: s === 1 ? -1.15 : s === 3 ? -2.35 : -0.88 - typeTap,
            flipperLRoll: s === 3 ? -0.35 : 0.22,
            flipperRRoll: s === 3 ? 0.35 : -0.22
          })
        );

        // Coffee Mug on Right Side of Desk
        if (s <= 1) {
          hit.add(sdRoundedCylinder(sub3(p, v3(0.34, -0.22, 0.44)), 0.072, 0.012, 0.088), [248, 250, 252], 0.20, 49);
        }

        // CC0 Rust Ferris the Crab (peeks behind mug in Shot 1, leaps onto Enter in Shot 2, waves proudly in Shot 3!)
        if (s >= 1) {
          const ferrisPos =
            s === 1
              ? v3(0.52, -0.20, 0.32)
              : s === 2
              ? v3(mix(0.48, 0.16, smoothstep(0, 0.65, phase)), -0.18 + Math.sin(phase * Math.PI) * 0.26, mix(0.34, 0.54, phase))
              : v3(0.18, -0.17, 0.54);
          hit.merge(
            evalFerrisCrabSDF(p, {
              pos: ferrisPos,
              scale: 0.78,
              yaw: s === 1 ? -0.25 : 0.0,
              clawLPitch: s >= 2 ? -1.15 : -0.45,
              clawRPitch: s === 3 ? -1.45 - Math.sin(phase * Math.PI * 4) * 0.25 : -0.65
            })
          );
        }
        return hit;
      }
    };
  }

  // 4. Godot-Inspired Cobalt Gear-Bot Tech Unboxing + [AF-C] Palm Focus Lock
  if (slug === "godot_bot_unboxing_af") {
    const shake = s === 2 ? Math.sin(phase * Math.PI * 8) * 0.03 * (1 - phase) : 0;
    const popH = s === 2 ? smoothstep(0.08, 0.58, phase) * 0.48 : 0;
    return {
      cam: {
        ro: v3(0, 0.45 + shake, 2.28),
        ta: v3(0, 0.14, 0.16),
        fov: 1.90,
        bgTop: [22, 34, 56],
        bgBot: [38, 56, 86],
        rimTint: [56, 189, 248],
        floorY: null
      },
      sceneFn: (p) => {
        const hit = new SceneHit();
        hit.add(sdRoundBox(sub3(p, v3(0, -0.36, 0.45)), v3(1.3, 0.05, 0.55), 0.02), [226, 232, 240], 0.28, 54);
        // Screen-Left Locked Studio Condenser Boom Mic
        hit.add(sdCapsule(p, v3(-0.85, -0.25, 0.65), v3(-0.38, 0.16, 0.52), 0.024), [30, 41, 59], 0.34, 55);
        hit.add(sdRoundedCylinder(sub3(p, v3(-0.36, 0.20, 0.52)), 0.054, 0.02, 0.08), [15, 23, 42], 0.42, 55);

        hit.merge(
          evalGodotBotSDF(p, {
            pos: v3(0, 0, s === 2 ? -0.16 * smoothstep(0.1, 0.5, phase) : 0),
            headYaw: s === 3 ? 0.22 : 0,
            armLPitch: s === 1 ? -1.16 : -0.62,
            armRPitch: s === 1 ? -1.20 : s === 3 ? -0.98 : -0.68,
            expression: s === 2 ? "wide_rings" : s === 3 ? "happy_arcs" : "normal"
          })
        );

        // Anodized Silver Mystery Hardware Cube + Glowing Red Button
        const cubePos = s === 1 ? v3(0.02, -0.02, 1.24) : v3(0.02, -0.19, 0.55);
        const qc = sub3(p, cubePos);
        hit.add(sdRoundBox(qc, v3(0.125, 0.125, 0.125), 0.022), [148, 163, 184], 0.16, 56);
        hit.add(sdRoundedCylinder(sub3(qc, v3(0, 0.13, 0)), 0.045, 0.008, 0.018), [239, 68, 68], 0.06, 56);
        if (s === 1) {
          // Clean White Mechanical Flat Palm behind the cube to trigger [AF-C] focus lock!
          const pPalm = rotZ(sub3(p, v3(-0.12, 0.08, 1.05)), 0.16);
          hit.add(sdRoundBox(pPalm, v3(0.092, 0.122, 0.026), 0.022), [241, 245, 249], 0.20, 56);
          hit.add(sdRoundBox(sub3(pPalm, v3(0, 0, 0.02)), v3(0.052, 0.068, 0.01), 0.01), [71, 140, 191], 0.22, 56);
        }

        // Bouncy Golden Star Mascot on Spring (Shots 2 & 3)
        if (s >= 2) {
          const starPos = s === 2 ? v3(0.02, -0.04 + popH, 0.55) : v3(0.26, -0.22 + Math.abs(Math.sin(phase * Math.PI * 2)) * 0.06, 0.56);
          const pm = sub3(p, starPos);
          let dStar = sdSphere(pm, 0.095);
          for (let a = 0; a < 5; a++) {
            const ang = (a / 5) * Math.PI * 2 - Math.PI / 2;
            dStar = smin(dStar, sdSphere(sub3(pm, v3(Math.cos(ang) * 0.085, Math.sin(ang) * 0.085, 0)), 0.042), 0.035);
          }
          if (dStar < hit.d) {
            const isEye = pm.z > 0.065 && Math.abs(Math.abs(pm.x) - 0.032) < 0.013 && Math.abs(pm.y - 0.012) < 0.016;
            hit.add(dStar, isEye ? [15, 23, 42] : [253, 214, 36], isEye ? 0.2 : 0.08, 57);
          }
          if (s === 2) {
            hit.add(sdRoundedCylinder(sub3(p, v3(0.02, -0.05 + popH * 0.45, 0.55)), 0.032, 0.006, popH * 0.45 + 0.02), [226, 232, 240], 0.18, 57);
          }
        }
        return hit;
      }
    };
  }

  // 5. Crisp 8x8x8 Voxel Wuxia Sword-Flight Selfie Live
  if (slug === "voxel_wuxia_sword_live") {
    const roll = s === 2 ? Math.sin(phase * Math.PI * 4) * 0.18 : 0;
    return {
      cam: {
        ro: v3(0.08, s === 1 ? 0.54 : 0.48, s === 1 ? 2.88 : 2.38),
        ta: v3(0, s === 1 ? -0.28 : 0.18, 0),
        roll,
        fov: 1.56,
        bgTop: [38, 166, 242],
        bgBot: [254, 240, 188],
        rimTint: [253, 224, 71],
        floorY: null
      },
      sceneFn: (p) => {
        const hit = new SceneHit();
        // Stepped 16x16x1 Voxel Flying Rune Sword Underfoot
        const ps = sub3(p, v3(0, -1.00, 0));
        hit.add(sdRoundBox(ps, v3(0.18, 0.032, 0.94), 0.005), [45, 212, 191], 0.05, 67);
        hit.add(sdRoundBox(sub3(ps, v3(0, 0.016, -0.68)), v3(0.32, 0.038, 0.072), 0.005), [250, 204, 21], 0.16, 67);

        // Sharp Cubic Voxel Cloud Sea Below
        if (p.y < -0.72) {
          hit.add(sdRoundBox(sub3(p, v3(-0.78, -1.28, -0.62)), v3(0.58, 0.13, 0.38), 0.008), [255, 255, 255], 0.36, 68);
          hit.add(sdRoundBox(sub3(p, v3(-0.56, -1.14, -0.58)), v3(0.34, 0.10, 0.26), 0.008), [255, 255, 255], 0.36, 68);
          hit.add(sdRoundBox(sub3(p, v3(0.74, -1.20, -0.82)), v3(0.64, 0.14, 0.40), 0.008), [254, 249, 212], 0.36, 68);
        }

        hit.merge(
          evalVoxelWuxiaSDF(p, {
            pos: v3(0, 0, 0),
            crookedCrown: s === 3,
            armRPitch: -1.26,
            armLPitch: s === 3 ? -1.80 : -0.38,
            jadeSelfie: true,
            expression: s === 2 ? "shocked" : s === 3 ? "deadpan" : "grin"
          })
        );

        // Cubic White Voxel Spirit Crane Photobombing Right Shoulder in Shot 2
        if (s === 2) {
          hit.merge(
            evalVoxelCraneSDF(p, {
              pos: v3(mix(0.84, 0.45, phase), 0.50, -0.28),
              yaw: 0.32,
              wingAng: Math.sin(phase * Math.PI * 6) * 0.35 + 0.20
            })
          );
        }
        return hit;
      }
    };
  }

  // 6. Roblox Sky-Obby + Track-B PiP Facecam
  if (slug === "roblox_obby_rage_pip") {
    const jumpArc = s === 1 ? Math.sin(phase * Math.PI) * 0.42 : 0;
    const swing = s === 1 ? Math.sin(phase * Math.PI * 2) * 0.65 : 0;
    const fallRoll = s === 2 ? smoothstep(0.15, 0.85, phase) * 1.15 : 0;
    return {
      cam: {
        ro: v3(s === 1 ? 0.95 : -0.45, 0.52, 2.95),
        ta: v3(0, -0.05, 0),
        fov: 1.88,
        bgTop: [14, 116, 144],
        bgBot: [186, 230, 253],
        floorY: null
      },
      sceneFn: (p) => {
        const hit = new SceneHit();
        hit.add(sdRoundBox(sub3(p, v3(-0.55, -1.08, 0)), v3(0.48, 0.075, 0.48), 0.02), [244, 114, 182], 0.20, 80);
        hit.add(sdRoundBox(sub3(p, v3(0.55, -0.96, 0)), v3(0.48, 0.075, 0.48), 0.02), [52, 211, 153], 0.20, 80);
        // Checkered finish flag pole on green pad
        hit.add(sdCapsule(p, v3(0.86, -0.88, -0.24), v3(0.86, -0.18, -0.24), 0.018), [248, 250, 252], 0.24, 80);
        hit.add(sdRoundBox(sub3(p, v3(0.98, -0.28, -0.24)), v3(0.12, 0.08, 0.012), 0.006), [250, 204, 21], 0.08, 80);
        if (s === 2) {
          hit.add(sdRoundBox(sub3(p, v3(0.12, -0.88, 0)), v3(0.085, 0.048, 0.46), 0.012), [255, 36, 56], 0.03, 81);
        }
        const avX = s === 0 ? -0.48 : s === 1 ? mix(-0.42, 0.22, phase) : s === 2 ? 0.14 : -0.48;
        hit.merge(
          evalRobloxAvatarSDF(p, {
            pos: v3(avX, jumpArc - (s === 2 ? phase * 0.25 : 0), 0),
            yaw: s === 0 || s === 3 ? 0.15 : 0.48,
            roll: -fallRoll,
            armLPitch: s === 0 ? -0.9 : swing,
            armRPitch: -swing,
            legLPitch: -swing,
            legRPitch: swing,
            expression: s === 2 ? "shocked" : s === 3 ? "tears" : "grin",
            theme: "obby"
          })
        );
        return hit;
      },
      pipScene: {
        cam: {
          ro: v3(s >= 2 ? Math.sin(phase * Math.PI * 8) * 0.04 : 0, 0.42, 1.92),
          ta: v3(0, 0.34, 0),
          fov: 1.85,
          bgTop: [49, 46, 129],
          bgBot: [15, 23, 42],
          rimTint: [244, 63, 94],
          floorY: null
        },
        sceneFn: (p) => {
          const hit = new SceneHit();
          hit.add(sdRoundBox(sub3(p, v3(0, -0.22, 0.35)), v3(0.8, 0.04, 0.35), 0.015), [51, 65, 85], 0.3, 82);
          const slamArm = s === 3 ? mix(-1.9, -0.85, smoothstep(0.1, 0.65, phase)) : -0.4;
          hit.merge(
            evalRobloxAvatarSDF(p, {
              pos: v3(0, 0, 0),
              waistPitch: s === 1 ? 0.16 : 0,
              armLPitch: s === 3 ? slamArm : -0.35,
              armRPitch: s === 0 ? -1.4 : s === 3 ? slamArm : -0.35,
              expression: s === 0 ? "smirk" : s === 1 ? "grin" : s === 2 ? "shocked" : "tears",
              theme: "obby",
              headset: true
            })
          );
          return hit;
        }
      }
    };
  }

  // 7. Roblox DOORS Corridor Selfie-Stick Live
  if (slug === "roblox_doors_irl_selfie") {
    const flickerRed = s === 1 && Math.floor(phase * 6) % 2 === 1;
    const shake = s === 2 ? Math.sin(phase * Math.PI * 10) * 0.04 : 0;
    return {
      cam: {
        ro: v3(shake, 0.38, s === 3 ? 1.58 : 2.18),
        ta: v3(0, 0.30, 0),
        fov: 1.55,
        bgTop: flickerRed ? [96, 18, 28] : [26, 18, 30],
        bgBot: [48, 28, 34],
        rimTint: [250, 204, 21],
        floorY: -1.02,
        floorMode: "hotel_carpet"
      },
      sceneFn: (p) => {
        const hit = new SceneHit();
        if (s === 3) {
          hit.add(sdRoundBox(sub3(p, v3(-0.44, 0.25, 0.68)), v3(0.18, 0.95, 0.032), 0.01), [92, 58, 36], 0.38, 85);
          hit.add(sdRoundBox(sub3(p, v3(0.44, 0.25, 0.68)), v3(0.18, 0.95, 0.032), 0.01), [92, 58, 36], 0.38, 85);
        } else if (p.z < -0.55) {
          hit.add(sdRoundBox(sub3(p, v3(0, 0.1, -1.25)), v3(0.44, 0.86, 0.05), 0.015), [116, 70, 42], 0.36, 85);
          hit.add(sdRoundBox(sub3(p, v3(0, 0.48, -1.19)), v3(0.15, 0.065, 0.016), 0.008), [250, 204, 21], 0.10, 85);
          // Warm brass wall sconces
          if (!flickerRed) {
            hit.add(sdSphere(sub3(p, v3(-0.68, 0.62, -1.15)), 0.052), [254, 240, 138], 0.04, 85);
            hit.add(sdSphere(sub3(p, v3(0.68, 0.62, -1.15)), 0.052), [254, 240, 138], 0.04, 85);
          }
        }
        if (s === 2) {
          hit.merge(
            evalRobloxAvatarSDF(p, {
              pos: v3(-0.38, 0.08, -0.52),
              yaw: 0.15,
              theme: "shadow"
            })
          );
        }
        hit.merge(
          evalRobloxAvatarSDF(p, {
            pos: v3(0.06, 0, 0.12),
            yaw: -0.14,
            armRPitch: -1.22,
            armLPitch: s === 0 ? -0.95 : -0.25,
            selfieStick: s < 3,
            expression: s === 1 ? "deadpan" : s === 2 ? "shocked" : s === 3 ? "tears" : "smirk",
            theme: "commuter"
          })
        );
        return hit;
      }
    };
  }

  // 8. Roblox Pet Hatch 50/50 Co-Host PK Split-Screen
  const tapArm = s === 1 ? mix(-1.4, -0.75, smoothstep(0.1, 0.7, phase)) : -0.35;
  return {
    cam: {
      ro: v3(0, 0.34, 3.35),
      ta: v3(0, 0.08, 0),
      fov: 1.92,
      bgTop: [30, 27, 58],
      bgBot: [15, 23, 42],
      splitScreenTint: true,
      floorY: null
    },
    sceneFn: (p) => {
      const hit = new SceneHit();
      hit.add(sdRoundBox(sub3(p, v3(-0.62, -0.36, 0.42)), v3(0.52, 0.045, 0.36), 0.015), [244, 114, 182], 0.26, 90);
      hit.add(sdRoundBox(sub3(p, v3(0.62, -0.36, 0.42)), v3(0.52, 0.045, 0.36), 0.015), [148, 163, 184], 0.32, 90);

      hit.merge(
        evalRobloxAvatarSDF(p, {
          pos: v3(-0.62, 0, 0),
          yaw: s === 2 ? 0.48 : 0.15,
          waistPitch: s === 3 ? 1.15 : 0,
          armRPitch: s === 0 ? -1.1 : tapArm,
          expression: s === 2 ? "shocked" : s === 3 ? "dizzy" : "smirk",
          theme: "y2k"
        })
      );
      hit.merge(
        evalRobloxAvatarSDF(p, {
          pos: v3(0.62, 0, 0),
          yaw: -0.15,
          armRPitch: s === 3 ? -1.05 : tapArm,
          colaCan: s === 3,
          expression: "smile",
          theme: "noob"
        })
      );

      if (s <= 1) {
        const glow = s === 1 ? 0.04 : 0.20;
        hit.add(sdRoundBox(sub3(p, v3(-0.56, -0.18, 0.52)), v3(0.11, 0.14, 0.11), 0.06), [250, 204, 21], glow, 91);
        hit.add(sdRoundBox(sub3(p, v3(0.56, -0.18, 0.52)), v3(0.11, 0.14, 0.11), 0.06), [226, 232, 240], glow, 91);
      } else {
        hit.add(sdRoundBox(sub3(p, v3(-0.56, -0.26, 0.52)), v3(0.06, 0.045, 0.06), 0.02), [100, 116, 139], 0.48, 92);
        const dy = 0.72 + Math.sin(phase * Math.PI * 2) * 0.05;
        const qd = rotY(sub3(p, v3(0.32, dy, 0.38)), -0.38);
        hit.add(sdRoundBox(qd, v3(0.11, 0.09, 0.14), 0.022), [37, 244, 238], 0.06, 93);
        const dh = sub3(qd, v3(0, 0.08, 0.15));
        const dDrgHead = sdRoundBox(dh, v3(0.085, 0.075, 0.09), 0.018);
        if (dDrgHead < hit.d) {
          let drgCol = [56, 189, 248];
          if (dh.z > 0.07 && Math.abs(Math.abs(dh.x) - 0.038) < 0.016 && Math.abs(dh.y - 0.015) < 0.018) drgCol = [15, 23, 42];
          hit.add(dDrgHead, drgCol, 0.08, 93);
        }
        hit.add(sdRoundBox(sub3(dh, v3(-0.05, 0.095, -0.02)), v3(0.018, 0.042, 0.018), 0.005), [250, 204, 21], 0.05, 93);
        hit.add(sdRoundBox(sub3(dh, v3(0.05, 0.095, -0.02)), v3(0.018, 0.042, 0.018), 0.005), [250, 204, 21], 0.05, 93);
        const flap = Math.sin(phase * Math.PI * 4) * 0.28 + 0.22;
        hit.add(sdRoundBox(sub3(rotZ(sub3(qd, v3(-0.10, 0.04, 0)), -flap), v3(-0.13, 0, 0)), v3(0.13, 0.020, 0.09), 0.008), [250, 204, 21], 0.05, 93);
        hit.add(sdRoundBox(sub3(rotZ(sub3(qd, v3(0.10, 0.04, 0)), flap), v3(0.13, 0, 0)), v3(0.13, 0.020, 0.09), 0.008), [250, 204, 21], 0.05, 93);
      }
      return hit;
    }
  };
}

// ---------- Style-Routed Character Helper for Custom Specs & Setup Sheets ----------
function evalCharacterByStyle(p, style = "duolingo-mascot", cfg = {}) {
  if (style === "roblox-blocky") {
    return evalRobloxAvatarSDF(p, { headYaw: cfg.headYaw || 0, expression: cfg.expression || "smile", headset: true, theme: "obby" });
  }
  if (style === "voxel-sandbox") {
    return evalVoxelWuxiaSDF(p, { headYaw: cfg.headYaw || 0, expression: cfg.expression === "shocked" ? "shocked" : "grin", jadeSelfie: true });
  }
  if (style === "opensource-mascot") {
    const subj = String(cfg.subjectHint || "").toLowerCase();
    if (subj.includes("ferris") || subj.includes("crab") || subj.includes("螃蟹")) {
      return evalFerrisCrabSDF(p, { pos: v3(0, 0.14, 0.18), scale: 1.35, chefBand: true, clawLPitch: -0.95, clawRPitch: -1.15 });
    }
    if (subj.includes("godot") || subj.includes("bot") || subj.includes("机器人")) {
      return evalGodotBotSDF(p, { headYaw: cfg.headYaw || 0, expression: cfg.expression === "shocked" ? "wide_rings" : "normal" });
    }
    return evalTuxPenguinSDF(p, { headYaw: cfg.headYaw || 0, expression: cfg.expression === "shocked" ? "shocked" : "smile" });
  }
  if (style === "duolingo-mascot") {
    const subj = String(cfg.subjectHint || "").toLowerCase();
    if (subj.includes("lila") || subj.includes("girl") || subj.includes("紫发")) {
      return evalDuolingoCastSDF(p, { headYaw: cfg.headYaw || 0, expression: cfg.expression === "shocked" ? "shocked" : "cool" });
    }
    return evalDuolingoOwlSDF(p, { headYaw: cfg.headYaw || 0, expression: cfg.expression === "shocked" ? "intense" : "cheerful" });
  }
  // All other styles route to charismatic stylized flat-3D cast or mascot (never uncanny mannequin!)
  return evalDuolingoCastSDF(p, { headYaw: cfg.headYaw || 0, expression: cfg.expression === "shocked" ? "shocked" : "cool" });
}

function buildCustomSpecScene(specData, shotIdx, phase = 0.5) {
  const slug = specData.slug || "";
  if (
    [
      "duolingo_owl_streak_cam",
      "duolingo_chill_night_market",
      "tux_ferris_code_webcam",
      "godot_bot_unboxing_af",
      "voxel_wuxia_sword_live",
      "roblox_obby_rage_pip",
      "roblox_doors_irl_selfie",
      "roblox_pet_hatch_pk"
    ].includes(slug)
  ) {
    return buildEpisodeScene(slug, shotIdx, phase);
  }

  const rig = specData.rig || "desktop-webcam";
  const style = specData.style || "duolingo-mascot";
  const shake = shotIdx === 2 ? Math.sin(phase * Math.PI * 8) * 0.03 : 0;
  const expr = shotIdx === 2 ? "shocked" : "smile";
  const subjectHint = `${specData.subjectEn || ""} ${specData.subjectZh || ""} ${specData.host || ""}`;

  const baseScene = {
    cam: {
      ro: v3(shake, 0.42, rig === "handheld-selfie-irl" ? 2.08 : 2.38),
      ta: v3(0, 0.18, 0.08),
      fov: rig === "handheld-selfie-irl" ? 1.56 : 1.84,
      bgTop: [18, 26, 48],
      bgBot: [36, 48, 78],
      rimTint: [56, 189, 248],
      splitScreenTint: rig === "pk-cohost-split",
      floorY: -0.95,
      floorMode: "night_pavers"
    },
    sceneFn: (p) => {
      const hit = new SceneHit();
      hit.add(sdRoundBox(sub3(p, v3(0, -0.38, 0.45)), v3(1.25, 0.048, 0.50), 0.02), [71, 85, 105], 0.30, 95);
      hit.merge(evalCharacterByStyle(p, style, { headYaw: shotIdx === 1 ? 0.24 : 0, expression: expr, subjectHint }));
      return hit;
    }
  };

  if (rig === "pip-facecam-rig") {
    baseScene.pipScene = {
      cam: { ro: v3(0, 0.42, 1.95), ta: v3(0, 0.34, 0), fov: 1.85, bgTop: [49, 46, 129], bgBot: [15, 23, 42], floorY: null },
      sceneFn: baseScene.sceneFn
    };
  }
  return baseScene;
}

// ---------- Timing & Synthesized Live WAV Audio ----------
export function computeEpisodeTimingPlan(specData = {}) {
  const shots = Array.isArray(specData.shots) && specData.shots.length > 0 ? specData.shots : [{}];
  const sumShotSec = shots.reduce((acc, s) => acc + (Number(s.durationSec) || 0), 0);
  const targetTotalSec = Number(specData.durationSeconds) || (sumShotSec > 0 ? sumShotSec : shots.length * 3.75);
  const fallbackSec = targetTotalSec / shots.length;
  const rawDurations = shots.map((s) => Number(s.durationSec) || fallbackSec);
  const scaleSec = targetTotalSec / (rawDurations.reduce((a, b) => a + b, 0) || targetTotalSec);
  const shotDurations = rawDurations.map((d) => Number((d * scaleSec).toFixed(3)));
  const totalDurationSec = Number(shotDurations.reduce((a, b) => a + b, 0).toFixed(3));

  const sampleFps = clamp(Number(specData.sampleFps) || 2.4, 1.6, 8);
  const shotFrameCounts = shotDurations.map((d) => Math.max(4, Math.round(d * sampleFps)));
  const totalFrames = shotFrameCounts.reduce((a, b) => a + b, 0);
  const inFps = Number((totalFrames / totalDurationSec).toFixed(4));
  return { shotDurations, totalDurationSec, shotFrameCounts, totalFrames, inFps };
}

export function buildEpisodeWavBuffer(shots = [], shotDurationsOrScalar = 3.75) {
  const sampleRate = 22050;
  const durations = Array.isArray(shotDurationsOrScalar)
    ? shotDurationsOrScalar
    : shots.map(() => Number(shotDurationsOrScalar) || 3.75);
  const totalSec = Math.max(2, durations.reduce((a, b) => a + b, 0));
  const numSamples = Math.floor(sampleRate * totalSec);
  const pcm = new Int16Array(numSamples);

  let cursorSec = 0;
  for (let s = 0; s < shots.length; s++) {
    const durSec = durations[s] || 3.75;
    const cue = (shots[s].sfxCue || (s === shots.length - 1 ? "win" : s === 0 ? "chime" : "boing")).toLowerCase();
    const startSample = Math.floor(cursorSec * sampleRate);
    const shotSamples = Math.floor(durSec * sampleRate);
    cursorSec += durSec;

    for (let i = 0; i < shotSamples && startSample + i < numSamples; i++) {
      const t = i / sampleRate;
      // Subtle live room chat-tick & synth bed
      const chatTick = (t % 0.42) < 0.03 ? Math.sin(2 * Math.PI * 1320 * t) * 0.10 : 0;
      let val = chatTick + Math.sin(2 * Math.PI * 174 * t) * Math.exp(-(t % 0.5) * 8) * 0.10;

      if (cue === "chime" && t < 0.48) {
        const f = t < 0.15 ? 659.25 : 987.77;
        val += Math.sin(2 * Math.PI * f * t) * Math.exp(-((t % 0.15) * 8)) * 0.40;
      } else if (cue === "boing" && t < 0.45) {
        const f = 280 + 440 * (t / 0.45);
        val += Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 6) * 0.42;
      } else if (cue === "clack" && t < 0.18) {
        val += (Math.sin(2 * Math.PI * 880 * t) + Math.sin(2 * Math.PI * 390 * t)) * Math.exp(-t * 24) * 0.44;
      } else if (cue === "buzz" && t < 0.55) {
        val += (Math.sin(2 * Math.PI * 145 * t) > 0 ? 0.34 : -0.34) * Math.exp(-t * 4);
      } else if (cue === "siren" && t < 1.1) {
        const f = Math.floor(t * 5) % 2 === 0 ? 720 : 540;
        val += Math.sin(2 * Math.PI * f * t) * 0.28;
      } else if (cue === "drop" && t < 0.7) {
        const f = Math.max(110, 660 - 540 * (t / 0.7));
        val += Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 3.5) * 0.42;
      } else if (cue === "win" && t < 0.85) {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        const nIdx = Math.min(3, Math.floor(t / 0.16));
        val += Math.sin(2 * Math.PI * notes[nIdx] * t) * Math.exp(-((t % 0.16) * 5)) * 0.44;
      }
      pcm[startSample + i] = clamp(Math.round(val * 28000), -32767, 32767);
    }
  }

  const header = Buffer.alloc(44);
  const byteLen = pcm.length * 2;
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + byteLen, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(byteLen, 40);
  return Buffer.concat([header, Buffer.from(pcm.buffer)]);
}

function runHudComposerOrFallback(manifestPath, customFallbackOut = null) {
  const pyScript = path.join(ROOT, "scripts", "compose_hud.py");
  try {
    execFileSync("python3", [pyScript, manifestPath], { stdio: "inherit" });
    return true;
  } catch (err) {
    // Pure-Node fallback: copy raw keyframes so environments without python3/Pillow never fail
    if (customFallbackOut) {
      for (const [src, dst] of customFallbackOut) {
        if (fs.existsSync(src)) {
          fs.mkdirSync(path.dirname(dst), { recursive: true });
          fs.copyFileSync(src, dst);
        }
      }
    }
    return false;
  }
}

// ---------- Mode A: Custom Spec Shard Renderer (HD Native Resolutions) ----------
function renderCustomSpecShard(specPath, rawDir, force, shardIdx, shardCount) {
  const specData = JSON.parse(fs.readFileSync(specPath, "utf8").replace(/^\uFEFF/, ""));
  const { shotFrameCounts } = computeEpisodeTimingPlan(specData);
  const prefix = (specData.slug || path.basename(specPath, path.extname(specPath)) || "episode").replace(/[^a-z0-9_-]/gi, "_");
  const subjectHint = `${specData.subjectEn || ""} ${specData.subjectZh || ""} ${specData.host || ""}`;

  fs.mkdirSync(rawDir, { recursive: true });
  let taskId = 0;
  const writePng = (fname, w, h, fn) => {
    if (taskId++ % shardCount !== shardIdx) return;
    const outP = path.join(rawDir, fname);
    if (!force && fs.existsSync(outP) && fs.statSync(outP).size > 800) return;
    fs.writeFileSync(outP, encodePNG(w, h, fn()));
  };

  // 3-State Setup Anchor Views (360x460 HD)
  for (const [fname, headYaw, camRo] of [
    ["setup_0deg.png", 0.0, v3(0, 0.42, 2.22)],
    ["setup_15deg.png", 0.28, v3(0, 0.42, 2.22)],
    ["setup_side.png", 0.0, v3(1.62, 0.45, 1.62)]
  ]) {
    writePng(fname, 360, 460, () => {
      const sc = buildCustomSpecScene(specData, 0, 0.5);
      return render3DViewport(
        360,
        460,
        (p) => {
          const hit = new SceneHit();
          hit.add(sdRoundBox(sub3(p, v3(0, -0.38, 0.42)), v3(1.1, 0.045, 0.45), 0.02), [226, 232, 240], 0.28, 95);
          hit.add(sdCapsule(p, v3(-0.80, -0.26, 0.60), v3(-0.40, 0.14, 0.46), 0.022), [30, 41, 59], 0.34, 96);
          hit.add(sdRoundedCylinder(sub3(p, v3(-0.38, 0.18, 0.46)), 0.05, 0.018, 0.072), [15, 23, 42], 0.42, 96);
          hit.merge(evalCharacterByStyle(p, specData.style || "duolingo-mascot", { headYaw, subjectHint }));
          return hit;
        },
        { ...sc.cam, ro: camRo, ta: v3(0, 0.20, 0.08), floorY: null }
      );
    });
  }

  // Keyframes (360x640 HD)
  for (let s = 0; s < specData.shots.length; s++) {
    writePng(`${prefix}_shot_${s}.png`, 360, 640, () => {
      const sc = buildCustomSpecScene(specData, s, 0.58);
      return render3DViewport(360, 640, sc.sceneFn, sc.cam);
    });
    const probe = buildCustomSpecScene(specData, s, 0.58);
    if (probe.pipScene) {
      writePng(`${prefix}_pip_shot_${s}.png`, 162, 216, () =>
        render3DViewport(162, 216, probe.pipScene.sceneFn, probe.pipScene.cam)
      );
    }
  }

  // Animation Frames (270x480 clean plates -> composited at 540x960 & upscaled to 720p MP4)
  let frameIdx = 0;
  for (let s = 0; s < specData.shots.length; s++) {
    const count = shotFrameCounts[s];
    for (let f = 0; f < count; f++) {
      const phase = (f + 0.5) / count;
      const cur = frameIdx++;
      writePng(`${prefix}_anim_${String(cur).padStart(4, "0")}.png`, 270, 480, () => {
        const sc = buildCustomSpecScene(specData, s, phase);
        return render3DViewport(270, 480, sc.sceneFn, sc.cam);
      });
      const probe = buildCustomSpecScene(specData, s, phase);
      if (probe.pipScene) {
        writePng(`${prefix}_pip_anim_${String(cur).padStart(4, "0")}.png`, 135, 180, () =>
          render3DViewport(135, 180, probe.pipScene.sceneFn, probe.pipScene.cam)
        );
      }
    }
  }
}

// ---------- Mode B: Full Repository Showcase & 8 Flagship Examples Shard Renderer ----------
function renderShowcaseShard(rawDir, force, shardIdx, shardCount) {
  fs.mkdirSync(rawDir, { recursive: true });
  let taskId = 0;
  const writePng = (fname, w, h, fn) => {
    if (taskId++ % shardCount !== shardIdx) return;
    const outP = path.join(rawDir, fname);
    if (!force && fs.existsSync(outP) && fs.statSync(outP).size > 800) return;
    fs.writeFileSync(outP, encodePNG(w, h, fn()));
  };

  // 1. Setup 3-state sheet panels featuring charismatic LingoOwl + Left Condenser Boom Mic (360x460 HD)
  for (const [fname, headYaw, expr, ro] of [
    ["setup_0deg.png", 0.0, "cheerful", v3(0, 0.44, 2.22)],
    ["setup_15deg.png", 0.28, "suspicious", v3(0, 0.44, 2.22)],
    ["setup_side.png", 0.0, "cheerful", v3(1.62, 0.48, 1.58)]
  ]) {
    writePng(fname, 360, 460, () =>
      render3DViewport(
        360,
        460,
        (p) => {
          const hit = new SceneHit();
          hit.add(sdRoundBox(sub3(p, v3(0, -0.38, 0.42)), v3(1.15, 0.048, 0.46), 0.02), [226, 232, 240], 0.28, 70);
          hit.add(sdCapsule(p, v3(-0.82, -0.26, 0.60), v3(-0.40, 0.14, 0.48), 0.024), [30, 41, 59], 0.34, 71);
          hit.add(sdRoundedCylinder(sub3(p, v3(-0.38, 0.18, 0.48)), 0.052, 0.018, 0.075), [15, 23, 42], 0.42, 71);
          hit.merge(evalDuolingoOwlSDF(p, { headYaw, expression: expr, wingLAng: headYaw === 0 ? 0.65 : 0.25 }));
          return hit;
        },
        { ro, ta: v3(0, 0.18, 0.08), fov: 1.86, bgTop: [20, 28, 52], bgBot: [34, 48, 82], rimTint: [88, 204, 2], floorY: null }
      )
    );
  }

  // 2. Clean 360x640 HD base frame for 6-Panel (3x2) Platform HUD Atlas & 4-Way Drift Comparison
  writePng("atlas_clean_base.png", 360, 640, () => {
    const sc = buildEpisodeScene("duolingo_owl_streak_cam", 0, 0.55);
    return render3DViewport(360, 640, sc.sceneFn, sc.cam);
  });

  // Drift Bad 1: Detached far-away third-person cinema wide shot with letterbox bars
  writePng("drift_bad_cinema.png", 360, 640, () => {
    const sc = buildEpisodeScene("duolingo_owl_streak_cam", 0, 0.5);
    const rgba = render3DViewport(360, 640, sc.sceneFn, {
      ...sc.cam,
      ro: v3(2.85, 1.45, 4.25),
      ta: v3(0, 0.0, 0),
      fov: 2.2
    });
    for (let y = 0; y < 640; y++) {
      if (y < 122 || y > 518) {
        for (let x = 0; x < 360; x++) {
          const i = (y * 360 + x) * 4;
          rgba[i] = 6; rgba[i + 1] = 8; rgba[i + 2] = 12;
        }
      }
    }
    return rgba;
  });

  // Drift Bad 2: Melted / garbled burned-in AI diffusion UI artifacts
  writePng("drift_bad_gibberish.png", 360, 640, () => {
    const sc = buildEpisodeScene("duolingo_owl_streak_cam", 2, 0.5);
    const rgba = render3DViewport(360, 640, sc.sceneFn, sc.cam);
    for (let y = 420; y < 590; y++) {
      for (let x = 22; x < 292; x++) {
        const wave = Math.sin(x * 0.21 + y * 0.17) * Math.cos(y * 0.34);
        if (wave > 0.36 && ((y - 420) % 36 < 22)) {
          const i = (y * 360 + x) * 4;
          rgba[i] = 252; rgba[i + 1] = 82 + ((x * 7) % 120); rgba[i + 2] = 158;
        }
      }
    }
    return rgba;
  });

  // 3. All 8 Built-in Examples (360x640 HD Keyframes + 270x480 HD Animation Plates)
  for (const tplKey of Object.keys(TEMPLATES)) {
    const plan = compileStoryboard({ template: tplKey, engine: "local3d", sampleFps: 2.0 });
    const slug = plan.slug;
    const { shotFrameCounts } = computeEpisodeTimingPlan({ ...plan, sampleFps: 2.0 });

    for (let s = 0; s < plan.shots.length; s++) {
      writePng(`${slug}_shot_${s}.png`, 360, 640, () => {
        const sc = buildEpisodeScene(slug, s, 0.58);
        return render3DViewport(360, 640, sc.sceneFn, sc.cam);
      });
      const probe = buildEpisodeScene(slug, s, 0.58);
      if (probe.pipScene) {
        writePng(`${slug}_pip_shot_${s}.png`, 162, 216, () =>
          render3DViewport(162, 216, probe.pipScene.sceneFn, probe.pipScene.cam)
        );
      }
    }

    let fCursor = 0;
    for (let s = 0; s < plan.shots.length; s++) {
      const fCount = shotFrameCounts[s];
      for (let f = 0; f < fCount; f++) {
        const phase = (f + 0.5) / fCount;
        const idx = fCursor++;
        writePng(`${slug}_anim_${String(idx).padStart(4, "0")}.png`, 270, 480, () => {
          const sc = buildEpisodeScene(slug, s, phase);
          return render3DViewport(270, 480, sc.sceneFn, { ...sc.cam, fastShade: true, maxSteps: 28 });
        });
        const probe = buildEpisodeScene(slug, s, phase);
        if (probe.pipScene) {
          writePng(`${slug}_pip_anim_${String(idx).padStart(4, "0")}.png`, 135, 180, () =>
            render3DViewport(135, 180, probe.pipScene.sceneFn, { ...probe.pipScene.cam, fastShade: true, maxSteps: 22 })
          );
        }
      }
    }
  }
}

function buildShowcaseManifest(rawDir) {
  const showcaseDir = path.join(ROOT, "assets", "showcase");
  fs.mkdirSync(showcaseDir, { recursive: true });

  const heroLabelBySlug = {
    duolingo_owl_streak_cam: "Duolingo Owl · DOUYIN",
    tux_ferris_code_webcam: "Tux + Ferris · X LIVE",
    voxel_wuxia_sword_live: "8x8 Voxel · DOUYIN",
    roblox_pet_hatch_pk: "Roblox PK · KUAISHOU"
  };

  const cases = Object.keys(TEMPLATES).map((tplKey) => {
    const plan = compileStoryboard({ template: tplKey, engine: "local3d" });
    const slug = plan.slug;
    const exDir = path.join(ROOT, "examples", tplKey, "assets");
    fs.mkdirSync(exDir, { recursive: true });

    const { shotDurations, shotFrameCounts, inFps } = computeEpisodeTimingPlan({ ...plan, sampleFps: 2.0 });
    const wavPath = path.join(rawDir, `${slug}_audio.wav`);
    fs.writeFileSync(wavPath, buildEpisodeWavBuffer(plan.shots, shotDurations));

    return {
      prefix: slug,
      titleZh: plan.titleZh,
      titleEn: plan.titleEn,
      platform: plan.platform,
      rig: plan.rig,
      style: plan.style,
      host: plan.host,
      cohost: plan.cohost || "ClassicNoob",
      hudLang: plan.platform === "instagram" || plan.platform === "x" || plan.platform === "tiktok" ? "en" : "zh",
      inFps,
      wavPath,
      includeInHeroReel: Boolean(heroLabelBySlug[slug]),
      reelLabel: heroLabelBySlug[slug] || `${plan.style} · ${plan.platform.toUpperCase()}`,
      sheetZh: path.join(exDir, "storyboard_sheet.zh.png"),
      sheetEn: path.join(exDir, "storyboard_sheet.en.png"),
      sheetDefault: path.join(exDir, "storyboard_sheet.png"),
      gifPath: path.join(exDir, `${slug}.gif`),
      mp4Path: path.join(exDir, `${slug}.mp4`),
      shots: plan.shots.map((sh, idx) => {
        const num = String(idx + 1).padStart(2, "0");
        return {
          frameCount: shotFrameCounts[idx],
          labelZh: `${num} · ${sh.role}`,
          labelEn: `${num} · ${sh.role.split("/")[0].trim()}`,
          chatEn: sh.chatEn || "",
          hudMeta: sh.hudOverlay,
          savePath: path.join(exDir, `shot_${num}.png`)
        };
      })
    };
  });

  return {
    rawDir,
    turnaround: {
      titleZh: "直播间跨镜头三态一致性参考卡 (Duolingo 萌系绿鸟 · 0°主镜对视 · 15°读弹幕 · 侧视悬臂麦锚定)",
      titleEn: "3-State Livestream Consistency Sheet (LingoOwl · 0° Lens · 15° Chat Glance · Side Mic Lock)",
      outZh: path.join(showcaseDir, "rig_setup_sheet.zh.png"),
      outEn: path.join(showcaseDir, "rig_setup_sheet.en.png"),
      outDefault: [path.join(showcaseDir, "rig_setup_sheet.png")],
      views: [
        { file: "setup_0deg.png", labelZh: "01 · 0° 主镜头眼神对视", labelEn: "01 · 0° Direct Lens Address" },
        { file: "setup_15deg.png", labelZh: "02 · 15° 偏轴扫视副屏弹幕", labelEn: "02 · 15° Off-Axis Chat Read" },
        { file: "setup_side.png", labelZh: "03 · 机位距离与左置悬臂麦锚定", labelEn: "03 · Optical Distance & Left Mic" }
      ]
    },
    platformAtlas: {
      baseFile: "atlas_clean_base.png",
      cols: 3,
      cardW: 360,
      cardH: 640,
      outZh: path.join(showcaseDir, "platform_hud_atlas.zh.png"),
      outEn: path.join(showcaseDir, "platform_hud_atlas.en.png"),
      outDefault: path.join(showcaseDir, "platform_hud_atlas.png"),
      items: [
        {
          platform: "douyin",
          host: "LingoOwl",
          labelZh: "01 · 抖音直播间 · 小黄车讲解卡",
          labelEn: "01 · Douyin · Live Shopping Card",
          borderColor: [254, 44, 85],
          hudMeta: buildShotHudTimeline({ hudPopup: "commerce_card", baseViewers: 28500 }, 1, 4, "douyin", "duolingo_owl_streak_cam")
        },
        {
          platform: "kuaishou",
          host: "GodoBot",
          labelZh: "02 · 快手直播间 · 穿云箭连击 x28",
          labelEn: "02 · Kuaishou · SkyArrow Combo x28",
          borderColor: [255, 80, 0],
          hudMeta: buildShotHudTimeline(
            {
              hudPopup: "gift_combo",
              hudGiftZh: { sender: "榜一大哥", gift: "黄金穿云箭", combo: 28 },
              hudGiftEn: { sender: "IronBro_01", gift: "Sky Arrow", combo: 28 },
              baseViewers: 19400
            },
            2,
            4,
            "kuaishou",
            "godot_bot_unboxing_af"
          )
        },
        {
          platform: "instagram",
          host: "lingo.owl",
          labelZh: "03 · Ins Live · 无框弹幕与提问卡",
          labelEn: "03 · Instagram Live · Q&A Card",
          borderColor: [225, 48, 108],
          hudMeta: buildShotHudTimeline({ hudPopup: "qa_pinned", baseViewers: 14200 }, 1, 4, "instagram", "duolingo_owl_streak_cam")
        },
        {
          platform: "x",
          host: "@tux_kernel",
          labelZh: "04 · X Live · 暗夜毛玻璃与六色飘心",
          labelEn: "04 · X / Periscope · 6-Color Hearts",
          borderColor: [53, 177, 209],
          hudMeta: {
            ...buildShotHudTimeline({ hudPopup: "join_toast", baseViewers: 16800 }, 0, 4, "x", "tux_ferris_code_webcam"),
            heartBurstIntensity: "high"
          }
        },
        {
          platform: "tiktok",
          host: "BloxyKai",
          labelZh: "05 · TikTok Live · 银河玫瑰 x99",
          labelEn: "05 · TikTok Live · Galaxy Rose x99",
          borderColor: [37, 244, 238],
          hudMeta: buildShotHudTimeline(
            {
              hudPopup: "gift_combo_peak",
              hudGiftZh: { sender: "pixel_kai", gift: "Galaxy Rose", combo: 99 },
              hudGiftEn: { sender: "pixel_kai", gift: "Galaxy Rose", combo: 99 },
              baseViewers: 22600
            },
            3,
            4,
            "tiktok",
            "roblox_obby_rage_pip"
          )
        },
        {
          platform: "clean",
          host: "LingoOwl",
          labelZh: "06 · Clean Raw Plate · 纯净生视频底片",
          labelEn: "06 · Clean Raw Plate · Zero-HUD I2V/T2V",
          borderColor: [88, 204, 2],
          hudMeta: {}
        }
      ]
    },
    rigAtlas: {
      cols: 3,
      cardW: 360,
      cardH: 640,
      outZh: path.join(showcaseDir, "camera_rigs_atlas.zh.png"),
      outEn: path.join(showcaseDir, "camera_rigs_atlas.en.png"),
      outDefault: path.join(showcaseDir, "camera_rigs_atlas.png"),
      items: [
        {
          file: "duolingo_owl_streak_cam_shot_2.png",
          rig: "desktop-webcam",
          platform: "douyin",
          host: "LingoOwl",
          shotIdx: 2,
          labelZh: "01 · Duolingo 绿鸟 · 24mm 桌面查岗",
          labelEn: "01 · Duolingo Owl · 24mm Webcam",
          hudMeta: buildShotHudTimeline({ hudPopup: "gift_combo" }, 2, 4, "douyin", "duolingo_owl_streak_cam")
        },
        {
          file: "duolingo_chill_night_market_shot_2.png",
          rig: "handheld-selfie-irl",
          platform: "douyin",
          host: "Lila",
          shotIdx: 2,
          labelZh: "02 · 扁平3D酷妹 · 18mm 夜市自拍",
          labelEn: "02 · Flat-3D Cast · 18mm IRL Selfie",
          hudMeta: buildShotHudTimeline({ hudPopup: "gift_combo" }, 2, 4, "douyin", "duolingo_chill_night_market")
        },
        {
          file: "tux_ferris_code_webcam_shot_3.png",
          rig: "desktop-webcam",
          platform: "x",
          host: "@tux_kernel",
          shotIdx: 3,
          labelZh: "03 · Linux Tux + Ferris · 开源吉祥物",
          labelEn: "03 · Tux & CC0 Ferris · Dev Cam",
          hudMeta: buildShotHudTimeline({}, 3, 4, "x", "tux_ferris_code_webcam")
        },
        {
          file: "godot_bot_unboxing_af_shot_1.png",
          rig: "overhead-showcase-rig",
          platform: "kuaishou",
          host: "GodoBot",
          shotIdx: 1,
          labelZh: "04 · Godot 齿轮机器人 · [AF-C] 托底对焦",
          labelEn: "04 · Godot Gear-Bot · [AF-C] Lock",
          hudMeta: buildShotHudTimeline({ hudPopup: "commerce_card" }, 1, 4, "kuaishou", "godot_bot_unboxing_af")
        },
        {
          file: "voxel_wuxia_sword_live_shot_2.png",
          rig: "handheld-selfie-irl",
          platform: "douyin",
          host: "青云剑修",
          shotIdx: 2,
          labelZh: "05 · 8x8 体素仙侠 · 御剑自拍转译",
          labelEn: "05 · 8x8 Voxel Wuxia · Sword Selfie",
          hudMeta: buildShotHudTimeline({ hudPopup: "gift_combo" }, 2, 4, "douyin", "voxel_wuxia_sword_live")
        },
        {
          file: "roblox_obby_rage_pip_shot_2.png",
          pipFile: "roblox_obby_rage_pip_pip_shot_2.png",
          rig: "pip-facecam-rig",
          platform: "tiktok",
          host: "BloxyKai",
          shotIdx: 2,
          labelZh: "06 · Roblox R6 + B轨反应小窗",
          labelEn: "06 · Roblox R6 + PiP Facecam",
          hudMeta: {
            ...buildShotHudTimeline({}, 2, 4, "tiktok", "roblox_obby_rage_pip"),
            style: "roblox-blocky",
            chatEn: "NOOOO!!"
          }
        }
      ]
    },
    drift: {
      outZh: path.join(showcaseDir, "clean_vs_hud_drift_comparison.zh.png"),
      outEn: path.join(showcaseDir, "clean_vs_hud_drift_comparison.en.png"),
      outDefault: path.join(showcaseDir, "clean_vs_hud_drift_comparison.png"),
      panels: [
        { file: "drift_bad_cinema.png", labelZh: "[X] 第三人称电影摇臂跑偏", labelEn: "[X] 3rd-Person Cinema Drift", color: [225, 29, 72] },
        { file: "drift_bad_gibberish.png", labelZh: "[X] AI直出乱码弹幕融化", labelEn: "[X] Burned-In Gibberish UI", color: [234, 88, 12] },
        { file: "atlas_clean_base.png", labelZh: "[OK] 纯净无字直播镜头底片", labelEn: "[OK] Clean Raw Camera Plate", color: [2, 132, 199] },
        { file: "atlas_clean_base.png", postHudPlatform: "douyin", labelZh: "[OK] 纯净底片 + 后置高清HUD", labelEn: "[OK] Clean Plate + Post-HUD", color: [22, 163, 74] }
      ]
    },
    heroReel: {
      gifPath: path.join(showcaseDir, "livestream_pov_reel.gif"),
      mp4Path: path.join(showcaseDir, "livestream_pov_reel.mp4")
    },
    cases
  };
}

// ---------- CLI Entry ----------
const isMain = process.argv[1] && path.resolve(process.argv[1]).endsWith("render_preview.mjs");
if (isMain) {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(`Usage:
  node scripts/render_preview.mjs --spec <episode.json> --out-dir <dir> [--platform <id>] [--workers <n>] [--force]
  node scripts/render_preview.mjs [--workers <n>] [--force]

Render 9:16 Livestream POV 3D preview videos (.mp4 + .gif), bilingual contact sheets,
3-state rig setup sheets, and multi-platform HUD overlays (douyin, kuaishou, instagram, x, tiktok, clean).`);
    process.exit(0);
  }

  const getArg = (flag) => {
    const idx = process.argv.indexOf(flag);
    return idx !== -1 && process.argv[idx + 1] ? process.argv[idx + 1] : null;
  };

  const specArg = getArg("--spec");
  const outDirArg = getArg("--out-dir");
  const platformOverride = getArg("--platform");
  const shardArg = getArg("--shard");
  const force = process.argv.includes("--force");

  if (specArg) {
    const absSpec = path.resolve(specArg);
    const specData = JSON.parse(fs.readFileSync(absSpec, "utf8").replace(/^\uFEFF/, ""));
    const outDir = outDirArg ? path.resolve(outDirArg) : path.join(path.dirname(absSpec), "assets");
    const tmpDir = getArg("--raw-dir") ? path.resolve(getArg("--raw-dir")) : path.join(outDir, ".render_tmp");

    if (shardArg) {
      const [sIdx, sTotal] = shardArg.split("/").map(Number);
      renderCustomSpecShard(absSpec, tmpDir, force, sIdx, sTotal);
      process.exit(0);
    }

    fs.mkdirSync(outDir, { recursive: true });
    fs.mkdirSync(tmpDir, { recursive: true });
    const workers = clamp(Number(getArg("--workers")) || 2, 1, 6);
    await Promise.all(
      Array.from({ length: workers }, (_, i) =>
        new Promise((resolve, reject) => {
          const args = [process.argv[1], "--spec", absSpec, "--out-dir", outDir, "--raw-dir", tmpDir, "--shard", `${i}/${workers}`];
          if (force) args.push("--force");
          const child = spawn(process.execPath, args, { stdio: "inherit" });
          child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`Shard ${i} exited ${code}`))));
        })
      )
    );

    const slug = (specData.slug || path.basename(absSpec, path.extname(absSpec))).replace(/[^a-z0-9_-]/gi, "_");
    const platformId = resolvePlatformPreset(platformOverride || specData.platform || "douyin").id;
    const { shotDurations, shotFrameCounts, inFps } = computeEpisodeTimingPlan(specData);
    const wavPath = path.join(tmpDir, `${slug}_audio.wav`);
    fs.writeFileSync(wavPath, buildEpisodeWavBuffer(specData.shots, shotDurations));

    const customManifest = {
      rawDir: tmpDir,
      turnaround: {
        titleZh: "直播间三态一致性参考卡",
        titleEn: "3-State Livestream Setup Sheet",
        outZh: path.join(outDir, "rig_setup_sheet.zh.png"),
        outEn: path.join(outDir, "rig_setup_sheet.en.png"),
        outDefault: [path.join(outDir, "rig_setup_sheet.png")],
        views: [
          { file: "setup_0deg.png", labelZh: "0° 主镜对视", labelEn: "0° Lens Address" },
          { file: "setup_15deg.png", labelZh: "15° 读弹幕", labelEn: "15° Chat Read" },
          { file: "setup_side.png", labelZh: "侧视机位锚点", labelEn: "Side Rig Lock" }
        ]
      },
      cases: [
        {
          prefix: slug,
          titleZh: specData.titleZh || slug,
          titleEn: specData.titleEn || slug,
          platform: platformId,
          rig: specData.rig || "desktop-webcam",
          style: specData.style || "realistic-irl",
          host: specData.host || "Alex",
          cohost: specData.cohost || "Momo",
          hudLang: ["instagram", "x", "tiktok"].includes(platformId) ? "en" : "zh",
          inFps,
          wavPath,
          sheetZh: path.join(outDir, "storyboard_sheet.zh.png"),
          sheetEn: path.join(outDir, "storyboard_sheet.en.png"),
          sheetDefault: path.join(outDir, "storyboard_sheet.png"),
          gifPath: path.join(outDir, `${slug}.gif`),
          mp4Path: path.join(outDir, `${slug}.mp4`),
          shots: specData.shots.map((sh, idx) => {
            const num = String(idx + 1).padStart(2, "0");
            return {
              frameCount: shotFrameCounts[idx],
              labelZh: `${num} · ${sh.role || `镜头 ${num}`}`,
              labelEn: `${num} · ${(sh.role || `Shot ${num}`).split("/")[0].trim()}`,
              chatEn: sh.chatEn || "",
              hudMeta: sh.hudOverlay || buildShotHudTimeline(sh, idx, specData.shots.length, platformId),
              savePath: path.join(outDir, `shot_${num}.png`)
            };
          })
        }
      ]
    };

    const mPath = path.join(tmpDir, "hud_manifest.json");
    fs.writeFileSync(mPath, JSON.stringify(customManifest, null, 2), "utf8");
    const fallbackCopies = specData.shots.map((_, i) => [
      path.join(tmpDir, `${slug}_shot_${i}.png`),
      path.join(outDir, `shot_${String(i + 1).padStart(2, "0")}.png`)
    ]);
    runHudComposerOrFallback(mPath, fallbackCopies);

    if (!process.argv.includes("--keep-tmp")) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    console.log(`Rendered custom livestream POV video (${platformId} HUD): ${path.join(outDir, `${slug}.mp4`)}`);
    process.exit(0);
  }

  // Full Showcase + 8 Flagship Examples Render
  const rawDir = getArg("--raw-dir") ? path.resolve(getArg("--raw-dir")) : path.join("/tmp", "livestream_pov_raw3d");
  if (shardArg) {
    const [sIdx, sTotal] = shardArg.split("/").map(Number);
    renderShowcaseShard(rawDir, force, sIdx, sTotal);
    process.exit(0);
  }

  fs.mkdirSync(rawDir, { recursive: true });
  const workers = clamp(Number(getArg("--workers")) || Math.min(8, os.cpus().length), 1, 12);
  await Promise.all(
    Array.from({ length: workers }, (_, i) =>
      new Promise((resolve, reject) => {
        const args = [process.argv[1], "--raw-dir", rawDir, "--shard", `${i}/${workers}`];
        if (force) args.push("--force");
        const child = spawn(process.execPath, args, { stdio: "inherit" });
        child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`Shard ${i} exited ${code}`))));
      })
    )
  );

  const manifest = buildShowcaseManifest(rawDir);
  const mPath = path.join(rawDir, "showcase_hud_manifest.json");
  fs.writeFileSync(mPath, JSON.stringify(manifest, null, 2), "utf8");
  runHudComposerOrFallback(mPath);
  if (!process.argv.includes("--keep-tmp")) {
    fs.rmSync(rawDir, { recursive: true, force: true });
  }
  console.log("Rendered all 8 Livestream POV example packages, 5-platform HUD atlas, and 4-up hero reel.");
}
