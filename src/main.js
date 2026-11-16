import {
  MANIFESTO_META,
  FOUNDATION,
  DIMENSIONS,
  HARDWARE_PARADIGMS,
  PROTOTYPES,
  SPECULATIONS,
  ETHICS_FINALE,
} from './data/noeticContent.js';
import { NoeticWebGPUEngine } from './engine/noeticWebGPUEngine.js';
import { NoeticAudioEngine } from './engine/noeticAudioEngine.js';

// Application Sensory State
const appState = {
  selectedDimIndex: 0,
  selectedProtoIndex: 0,
  temperature: 0.28,
  dissonance: 0.14,
  depth: 0.48,
  sovereignty: 0.62,
  overload: 0.24,
  lantern: 0.0,
  sovereignOverride: false,
  manualLanternPinned: false,
};

const audioEngine = new NoeticAudioEngine();
let gpuEngine = null;

function renderMonograph() {
  const root = document.getElementById('app-root');

  root.innerHTML = `
    <!-- HERO SECTION -->
    <section id="sec-hero" class="chapter-section hero-section" data-chapter="hero">
      <div class="hero-editorial">
        <span class="editorial-kicker">${MANIFESTO_META.indexCode}</span>
        <h1 class="hero-h1">
          <span class="hero-h1-zh lang-zh">${MANIFESTO_META.brandZh}</span>
          <span class="hero-h1-en lang-en">${MANIFESTO_META.brandEn}</span>
        </h1>
        <p class="hero-subline">
          <span class="lang-zh">${MANIFESTO_META.brandSubZh}</span>
          <span class="lang-en"> · ${MANIFESTO_META.brandSubEn}</span>
        </p>

        <div class="hero-prologue">
          <p class="prose-zh lang-zh">${MANIFESTO_META.prologueZh}</p>
          <p class="prose-en lang-en">${MANIFESTO_META.prologueEn}</p>
        </div>

        <div class="hero-actions">
          <a href="#sec-dimensions" class="action-primary" id="cta-enter-studio">
            <span class="lang-zh">进入四维智觉调制台</span>
            <span class="lang-en">Explore 4D Sensory Studio</span>
            <span aria-hidden="true">↓</span>
          </a>
          <button type="button" class="action-ghost" id="cta-awaken-acoustics">
            <span class="lang-zh">开启次声波神经谐振</span>
            <span class="lang-en">Awaken Harmonic Resonance</span>
          </button>
        </div>
      </div>

      <div class="hero-field-portal" id="hero-probe-portal" role="region" aria-label="Interactive Noetic Manifold Window">
        <div>
          <p class="portal-poetic-caption lang-zh">“${FOUNDATION.epigraphZh}”</p>
          <p class="portal-poetic-sub lang-en">“${FOUNDATION.epigraphEn}”</p>
        </div>
        <div class="portal-crosshair-note">
          <span>CURSOR PROBE · 触碰感知主权薄膜</span>
          <span id="hero-probe-status">READY · 场域静谧</span>
        </div>
      </div>
    </section>

    <!-- SECTION I: CORE DEFINITION & PHILOSOPHICAL FOUNDATION -->
    <section id="sec-foundation" class="chapter-section" data-chapter="foundation">
      <div class="section-index-row">
        <span class="section-numeral">CHAPTER ${FOUNDATION.sectionNum} · ONTOLOGY</span>
        <span class="section-numeral">PRE-LINGUISTIC SYNESTHESIA</span>
      </div>

      <div class="section-heading-group">
        <h2 class="chapter-title-zh lang-zh">${FOUNDATION.titleZh}</h2>
        <p class="chapter-title-en lang-en">${FOUNDATION.titleEn}</p>
      </div>

      <div class="bilingual-manifesto-columns">
        <div class="lang-zh">
          <span class="manifesto-col-label">${FOUNDATION.zhLabel}</span>
          <blockquote class="manifesto-quote-zh">${FOUNDATION.zhBody}</blockquote>
        </div>
        <div class="lang-en">
          <span class="manifesto-col-label">${FOUNDATION.enLabel}</span>
          <blockquote class="manifesto-quote-en">${FOUNDATION.enBody}</blockquote>
        </div>
      </div>

      <div class="comparison-ledger" role="table" aria-label="Sensory Paradigm Comparison">
        <div class="ledger-row ledger-head" role="row">
          <div role="columnheader">演化维度 / AXIS</div>
          <div role="columnheader">传统符号界面 / LEGACY INTERFACE</div>
          <div role="columnheader">智觉认知义体 / NOETIC PROSTHESIS</div>
        </div>
        ${FOUNDATION.comparisons
          .map(
            (row) => `
          <div class="ledger-row" role="row">
            <div class="ledger-axis" role="cell">
              <div class="lang-zh">${row.axisZh}</div>
              <div class="lang-en">${row.axisEn}</div>
            </div>
            <div class="ledger-legacy" role="cell">
              <div class="lang-zh">${row.legacyZh}</div>
              <div class="lang-en">${row.legacyEn}</div>
            </div>
            <div class="ledger-noetic" role="cell">
              <div class="lang-zh">${row.noeticZh}</div>
              <div class="lang-en">${row.noeticEn}</div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </section>

    <!-- SECTION II: THE FOUR-DIMENSIONAL ARCHITECTURE & LIVE WEBGPU STUDIO -->
    <section id="sec-dimensions" class="chapter-section" data-chapter="dimensions">
      <div class="section-index-row">
        <span class="section-numeral">CHAPTER II · SYNESTHETIC TENSOR FOLDING</span>
        <span class="section-numeral">INTERACTIVE WEBGPU / TSL MODULATOR</span>
      </div>

      <div class="section-heading-group">
        <h2 class="chapter-title-zh lang-zh">“智觉”的四维设计架构</h2>
        <p class="chapter-title-en lang-en">The Four-Dimensional Architecture</p>
      </div>

      <div class="studio-workspace">
        <!-- Left: Four Architectural Dimensions -->
        <div class="dimension-selector-list" id="dimension-list">
          ${DIMENSIONS.map(
            (dim, idx) => `
            <button
              type="button"
              id="dim-btn-${dim.id}"
              class="dim-item-btn ${idx === 0 ? 'is-selected' : ''}"
              data-dim-index="${idx}"
            >
              <div class="dim-header-line">
                <div class="dim-num-title">
                  <span class="dim-index">${dim.index}</span>
                  <div>
                    <div class="dim-name-zh lang-zh">${dim.titleZh}</div>
                    <div class="dim-name-en lang-en">${dim.titleEn}</div>
                  </div>
                </div>
                <span class="dim-modality-tag">
                  <span class="lang-zh">${dim.modalityZh}</span>
                  <span class="lang-en">${dim.modalityEn}</span>
                </span>
              </div>

              <div class="dim-detail-body">
                <p class="dim-mechanism lang-zh">${dim.mechanismZh}</p>
                <p class="dim-mechanism lang-en">${dim.mechanismEn}</p>
                <div class="dim-metaphor-box">
                  <div class="lang-zh">体验隐喻：${dim.metaphorZh}</div>
                  <div class="lang-en"><em>Metaphor:</em> ${dim.metaphorEn}</div>
                </div>
              </div>
            </button>
          `
          ).join('')}
        </div>

        <!-- Right: Live WebGPU Tactile Probe & 4D Sliders -->
        <div class="studio-control-console" aria-label="4D Sensory Field Controls">
          <div class="interactive-probe-frame" id="studio-probe-box">
            <div class="probe-top-meta">
              <span>LIVE TSL MANIFOLD PROBE</span>
              <span id="studio-recoil-badge">SOVEREIGNTY INTACT · 本我澄明</span>
            </div>
            <div class="probe-bottom-meta">
              <span>MOVE CURSOR TO PROJECT ASI INFERENCE</span>
              <span id="studio-active-dim-code">DIM 01</span>
            </div>
          </div>

          <div class="sliders-stack">
            <div class="slider-row">
              <div class="slider-label-line">
                <label for="slider-temperature" class="slider-title">
                  <span class="lang-zh">01 · 认知温度与张力</span>
                  <span class="lang-en">Cognitive Temperature</span>
                </label>
                <span class="slider-readout" id="val-temperature">0.28</span>
              </div>
              <input id="slider-temperature" class="noetic-range" type="range" min="0" max="1" step="0.01" value="0.28" />
              <div class="slider-poles">
                <span>清凉高置信 / Glacial Clarity</span>
                <span>深渊热张力 / Cliff Tension</span>
              </div>
            </div>

            <div class="slider-row">
              <div class="slider-label-line">
                <label for="slider-dissonance" class="slider-title">
                  <span class="lang-zh">02 · 逻辑和声与走音</span>
                  <span class="lang-en">Harmony ↔ Dissonance</span>
                </label>
                <span class="slider-readout" id="val-dissonance">0.14</span>
              </div>
              <input id="slider-dissonance" class="noetic-range" type="range" min="0" max="1" step="0.01" value="0.14" />
              <div class="slider-poles">
                <span>纯五度共鸣 / 3:2 Pure Chord</span>
                <span>微分音震颤 / Cognitive Detuning</span>
              </div>
            </div>

            <div class="slider-row">
              <div class="slider-label-line">
                <label for="slider-depth" class="slider-title">
                  <span class="lang-zh">03 · 概率景深视野</span>
                  <span class="lang-en">Probabilistic Depth</span>
                </label>
                <span class="slider-readout" id="val-depth">0.48</span>
              </div>
              <input id="slider-depth" class="noetic-range" type="range" min="0" max="1" step="0.01" value="0.48" />
              <div class="slider-poles">
                <span>当下锐焦 / Immediate Focus</span>
                <span>草蛇灰线 / Deep Causal Halo</span>
              </div>
            </div>

            <div class="slider-row">
              <div class="slider-label-line">
                <label for="slider-sovereignty" class="slider-title">
                  <span class="lang-zh">04 · 主权护盾刚度</span>
                  <span class="lang-en">Sovereignty Shield</span>
                </label>
                <span class="slider-readout" id="val-sovereignty">0.62</span>
              </div>
              <input id="slider-sovereignty" class="noetic-range" type="range" min="0" max="1" step="0.01" value="0.62" />
              <div class="slider-poles">
                <span>开放通透 / Permeable</span>
                <span>灼热心理回缩 / Tactile Recoil</span>
              </div>
            </div>
          </div>

          <div class="telemetry-spec-strip" id="dim-telemetry-strip">
            <span>TRANSDUCER CHANNEL</span>
            <strong id="spec-channel">${DIMENSIONS[0].telemetry.channel}</strong>
            <span>DYNAMIC RANGE</span>
            <strong id="spec-range">${DIMENSIONS[0].telemetry.range}</strong>
            <span>NEURAL LATENCY</span>
            <strong id="spec-latency">${DIMENSIONS[0].telemetry.latency}</strong>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION III: HARDWARE & BIDIRECTIONAL EMPATHIC CALIBRATION -->
    <section id="sec-hardware" class="chapter-section" data-chapter="hardware">
      <div class="section-index-row">
        <span class="section-numeral">CHAPTER ${HARDWARE_PARADIGMS.sectionNum} · EMBODIMENT</span>
        <span class="section-numeral">NON-INVASIVE PERIPHERAL COUPLING</span>
      </div>

      <div class="section-heading-group">
        <h2 class="chapter-title-zh lang-zh">${HARDWARE_PARADIGMS.titleZh}</h2>
        <p class="chapter-title-en lang-en">${HARDWARE_PARADIGMS.titleEn}</p>
      </div>

      <div class="paradigm-columns">
        ${HARDWARE_PARADIGMS.pillars
          .map(
            (p) => `
          <article class="paradigm-sheet">
            <div>
              <span class="paradigm-code">${p.code}</span>
              <h3 class="paradigm-h3-zh lang-zh">${p.titleZh}</h3>
              <p class="paradigm-h3-en lang-en">${p.titleEn}</p>
              <p class="prose-zh lang-zh" style="margin-bottom:0.85rem;">${p.bodyZh}</p>
              <p class="prose-en lang-en">${p.bodyEn}</p>
            </div>
            <ul class="spec-list">
              ${p.specs
                .map(
                  (s) => `
                <li>
                  <span class="spec-key">
                    <span class="lang-zh">${s.labelZh}</span>
                    <span class="lang-en">${s.labelEn}</span>
                  </span>
                  <span class="spec-val">${s.val}</span>
                </li>
              `
                )
                .join('')}
            </ul>
          </article>
        `
          )
          .join('')}
      </div>

      <!-- Interactive Closed-Loop Biometric Overload Simulator -->
      <div class="calibration-bench">
        <div>
          <span class="paradigm-code">LIVE HOMEOSTATIC GOVERNOR · 双向共情闭环实验</span>
          <h3 class="paradigm-h3-zh lang-zh">信息过载自动降维模拟器</h3>
          <p class="paradigm-h3-en lang-en">Biometric Cognitive Overload Auto-Attenuation</p>
          <p class="prose-zh lang-zh" style="margin-bottom:1.1rem;">
            拖动下方人类生理负荷滑块（皮电反应 GSR 与脑电 θ/γ 熵值）。当负荷超过临界点（65%）时，背景 WebGPU 粒子流与声学泛音将自动收敛降维，化繁为简，仅保留最核心的温柔指引。
          </p>
          <p class="prose-en lang-en" style="margin-bottom:1.1rem;">
            Scrub simulated human biometric load (GSR &amp; EEG stress). Beyond 65% load, watch the WebGPU spore field and upper acoustic harmonics automatically lower cognitive resolution into a single calm intuition stream.
          </p>

          <div class="slider-row">
            <div class="slider-label-line">
              <label for="slider-overload" class="slider-title">
                <span class="lang-zh">人类实时生理过载度 (GSR / EEG Load)</span>
                <span class="lang-en">Human Biometric Overload</span>
              </label>
              <span class="slider-readout" id="val-overload">24%</span>
            </div>
            <input id="slider-overload" class="noetic-range" type="range" min="0" max="1" step="0.01" value="0.24" />
            <div class="slider-poles">
              <span>心流从容 / Lucid Calm (0%)</span>
              <span>急性信息过载 / Cognitive Overload (100%)</span>
            </div>
          </div>
        </div>

        <div class="overload-status-readout">
          <div class="slider-label-line">
            <span class="spec-key">NOETIC RESOLUTION BANDWIDTH</span>
            <span class="slider-readout" id="val-resolution-bw">88% · FULL 4D TENSOR</span>
          </div>
          <div class="resolution-meter-bar">
            <div class="resolution-meter-fill" id="bar-resolution-bw"></div>
          </div>
          <p class="prose-zh lang-zh" id="overload-desc-zh" style="font-size:0.88rem; margin-top:0.75rem;">
            当前神经节律平稳：四维通感通道全分辨率开启，远期因果光晕清晰展开。
          </p>
          <p class="prose-en lang-en" id="overload-desc-en" style="font-size:0.96rem; margin-top:0.45rem;">
            Biometric rhythms steady: full 4D synesthetic resolution active across near and deep causal horizons.
          </p>
        </div>
      </div>
    </section>

    <!-- SECTION IV: TANGIBLE PROTOTYPES & PHILOSOPHICAL SPECULATIONS -->
    <section id="sec-prototypes" class="chapter-section" data-chapter="prototypes">
      <div class="section-index-row">
        <span class="section-numeral">CHAPTER IV · APPLIED HORIZONS &amp; DIALECTICS</span>
        <span class="section-numeral">SCENARIO PROTOTYPES &amp; FREE WILL</span>
      </div>

      <div class="section-heading-group">
        <h2 class="chapter-title-zh lang-zh">具象化穿戴原型与哲学科幻推演</h2>
        <p class="chapter-title-en lang-en">Wearable Scenario Prototypes &amp; Philosophical Speculations</p>
      </div>

      <!-- Three Wearable Scenario Tabs -->
      <div class="prototype-tabs" role="tablist" aria-label="Wearable Prototypes">
        ${PROTOTYPES.map(
          (proto, idx) => `
          <button
            type="button"
            role="tab"
            id="proto-tab-${proto.id}"
            aria-selected="${idx === 0 ? 'true' : 'false'}"
            class="proto-tab-btn ${idx === 0 ? 'is-active' : ''}"
            data-proto-index="${idx}"
          >
            <span class="proto-tab-code">${proto.code}</span>
            <span class="proto-tab-name lang-zh">${proto.titleZh}</span>
            <span class="proto-tab-name lang-en">${proto.titleEn}</span>
          </button>
        `
        ).join('')}
      </div>

      <div class="prototype-stage-sheet" id="prototype-stage-content"></div>

      <!-- Philosophical & Sci-Fi Dialectic Triptych -->
      <div class="section-heading-group" style="margin-top: 1rem;">
        <h3 class="chapter-title-zh lang-zh" style="font-size: clamp(1.45rem, 2.4vw, 2rem);">
          拥有“智觉”之后：自我意识、自由意志与人机伦理的演化
        </h3>
        <p class="chapter-title-en lang-en" style="font-size: clamp(1.15rem, 1.8vw, 1.55rem);">
          Post-Noetic Evolution: Selfhood, Free Will &amp; Human–ASI Ethics
        </p>
      </div>

      <div class="dialectic-list">
        ${SPECULATIONS.map(
          (sp, idx) => `
          <article class="dialectic-column">
            <span class="dialectic-code">${sp.num} · ${sp.code}</span>
            <h4 class="dialectic-title-zh lang-zh">${sp.titleZh}</h4>
            <p class="dialectic-title-en lang-en">${sp.titleEn}</p>
            <hr class="dialectic-divider" />
            <p class="prose-zh lang-zh" style="font-size:0.9rem;">${sp.questionZh}</p>
            <p class="prose-en lang-en" style="font-size:1.02rem;">${sp.questionEn}</p>
            <hr class="dialectic-divider" />
            <p class="prose-zh lang-zh" style="font-size:0.92rem; color:var(--ink-primary);">${sp.insightZh}</p>
            <p class="prose-en lang-en" style="font-size:1.04rem; color:var(--ink-primary);">${sp.insightEn}</p>
            ${
              idx === 1
                ? `
              <button type="button" id="btn-sovereign-override" class="ctrl-btn" style="margin-top:auto; justify-content:center;">
                <span>触发“主权豁免” · Engage Sovereign Override</span>
              </button>
            `
                : ''
            }
          </article>
        `
        ).join('')}
      </div>
    </section>

    <!-- SECTION V: THE ULTIMATE ETHIC — NEGATIVE SPACE & AWE -->
    <section id="sec-ethics" class="chapter-section finale-section" data-chapter="ethics">
      <div class="finale-lantern-frame">
        <span class="editorial-kicker" style="border-bottom:none; margin-bottom:1rem;">
          CHAPTER V · ${ETHICS_FINALE.titleZh} / ${ETHICS_FINALE.titleEn}
        </span>

        <blockquote class="finale-quote-zh lang-zh">
          “${ETHICS_FINALE.zhQuote}”
        </blockquote>

        <blockquote class="finale-quote-en lang-en">
          “${ETHICS_FINALE.enQuote}”
        </blockquote>

        <button type="button" id="btn-silent-lantern" class="silent-lantern-btn">
          点亮无言之灯 · ENTER SILENT LANTERN MODE
        </button>
      </div>
    </section>

    <footer class="colophon-footer">
      <span>智觉 · NOETIC SENSE — COGNITIVE PROSTHESIS MONOGRAPH</span>
      <span>RENDERED IN REAL TIME VIA THREE.JS WEBGPU &amp; TSL COMPUTE SHADERS</span>
    </footer>
  `;

  renderPrototypeDetail(0);
}

function renderPrototypeDetail(index) {
  const proto = PROTOTYPES[index];
  const container = document.getElementById('prototype-stage-content');
  if (!container || !proto) return;

  container.innerHTML = `
    <div>
      <span class="wearable-tag">
        <span class="lang-zh">穿戴形态：${proto.wearableZh}</span>
        <span class="lang-en"> · ${proto.wearableEn}</span>
      </span>
      <h3 class="paradigm-h3-zh lang-zh">${proto.titleZh}</h3>
      <p class="paradigm-h3-en lang-en">${proto.titleEn}</p>

      <p class="prose-zh lang-zh" style="margin-bottom:0.9rem;">${proto.contextZh}</p>
      <p class="prose-en lang-en" style="margin-bottom:1.25rem;">${proto.contextEn}</p>

      <div style="padding-top:1rem; border-top:1px solid var(--rule-hairline);">
        <p class="prose-zh lang-zh" style="color:var(--ink-primary); margin-bottom:0.65rem;">
          <strong>智觉体验流：</strong>${proto.experienceZh}
        </p>
        <p class="prose-en lang-en" style="color:var(--ink-primary);">
          <strong>Sensory Walkthrough:</strong> ${proto.experienceEn}
        </p>
      </div>
    </div>

    <div class="proto-metrics-col">
      ${proto.metrics
        .map(
          (m) => `
        <div class="metric-pair">
          <span class="metric-k">
            <span class="lang-zh">${m.kZh}</span>
            <span class="lang-en">${m.kEn}</span>
          </span>
          <span class="metric-v">${m.v}</span>
        </div>
      `
        )
        .join('')}
      <button type="button" class="action-ghost" id="btn-apply-proto-field" style="justify-content:center; width:100%;">
        <span class="lang-zh">注入该场景四维场参数</span>
        <span class="lang-en">Load Scenario Field Preset</span>
      </button>
    </div>
  `;

  const loadBtn = document.getElementById('btn-apply-proto-field');
  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      syncSensoryParameters(proto.shaderState);
    });
  }
}

function syncSensoryParameters(partial) {
  Object.assign(appState, partial);

  const sliderMap = [
    ['temperature', 'slider-temperature', 'val-temperature', (v) => v.toFixed(2)],
    ['dissonance', 'slider-dissonance', 'val-dissonance', (v) => v.toFixed(2)],
    ['depth', 'slider-depth', 'val-depth', (v) => v.toFixed(2)],
    ['sovereignty', 'slider-sovereignty', 'val-sovereignty', (v) => v.toFixed(2)],
    ['overload', 'slider-overload', 'val-overload', (v) => `${Math.round(v * 100)}%`],
  ];

  sliderMap.forEach(([key, inputId, labelId, fmt]) => {
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);
    if (input) input.value = String(appState[key]);
    if (label) label.textContent = fmt(appState[key]);
  });

  updateOverloadGovernorUI(appState.overload);
  updateHudNoeticStatus();

  if (gpuEngine) {
    gpuEngine.setState({
      temperature: appState.temperature,
      dissonance: appState.sovereignOverride ? 0.04 : appState.dissonance,
      depth: appState.depth,
      sovereignty: appState.sovereignty,
      overload: appState.overload,
      lantern: appState.lantern,
    });
  }

  audioEngine.applyState({
    temperature: appState.temperature,
    dissonance: appState.sovereignOverride ? 0.02 : appState.dissonance,
    depth: appState.depth,
    sovereignty: appState.sovereignty,
    overload: appState.overload,
    lantern: appState.lantern,
  });
}

function updateOverloadGovernorUI(overloadVal) {
  const bwLabel = document.getElementById('val-resolution-bw');
  const bwBar = document.getElementById('bar-resolution-bw');
  const descZh = document.getElementById('overload-desc-zh');
  const descEn = document.getElementById('overload-desc-en');

  const resolutionPct = Math.round(Math.max(14, (1 - Math.max(0, overloadVal - 0.25) * 1.05) * 100));
  if (bwBar) {
    bwBar.style.width = `${resolutionPct}%`;
    bwBar.style.backgroundColor =
      overloadVal > 0.65 ? 'var(--tone-lantern)' : 'var(--tone-celadon)';
  }

  if (overloadVal > 0.65) {
    if (bwLabel) bwLabel.textContent = `${resolutionPct}% · SINGLE-NUDGE ATTENUATION`;
    if (descZh) {
      descZh.textContent =
        '检测到皮电与脑电过载：双向共情校准已自动调低“认知分辨率”，滤除次要分支噪点，仅保留一束宁静的核心直觉指引。';
    }
    if (descEn) {
      descEn.textContent =
        'Cognitive overload detected: Noetic Sense has automatically lowered resolution, distilling oceans of data into one gentle directional nudge.';
    }
  } else {
    if (bwLabel) bwLabel.textContent = `${resolutionPct}% · FULL 4D TENSOR`;
    if (descZh) {
      descZh.textContent =
        '当前神经节律平稳：四维通感通道全分辨率开启，远期因果光晕清晰展开。';
    }
    if (descEn) {
      descEn.textContent =
        'Biometric rhythms steady: full 4D synesthetic resolution active across near and deep causal horizons.';
    }
  }
}

function updateHudNoeticStatus() {
  const hud = document.getElementById('hud-noetic-state');
  if (!hud) return;

  if (appState.lantern > 0.5) {
    hud.textContent = 'SILENT LANTERN · 留白掌灯';
  } else if (appState.sovereignOverride) {
    hud.textContent = 'SOVEREIGN OVERRIDE · 凡人逆流豁免';
  } else if (appState.overload > 0.65) {
    hud.textContent = 'EMPATHIC ATTENUATION · 过载自动降维';
  } else if (appState.temperature > 0.68) {
    hud.textContent = 'THERMAL CLIFF GRAVITY · 高熵张力预警';
  } else if (appState.dissonance > 0.6) {
    hud.textContent = 'MICROTONAL DISSONANCE · 认知盲区微颤';
  } else {
    hud.textContent = 'HARMONIC SYMBIOSIS · 弦音相合';
  }
}

function bindUIInteractions() {
  // 1. Language Mode Switcher (Bilingual / ZH / EN)
  const langBtns = document.querySelectorAll('[data-lang-mode]');
  langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-lang-mode');
      document.documentElement.setAttribute('data-lang-mode', mode);
      langBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
    });
  });

  // 2. Theme Toggle (Obsidian Dark <-> Xuan Paper Light)
  const themeBtn = document.getElementById('btn-theme-toggle');
  const themeLabel = document.getElementById('theme-btn-label');
  themeBtn.addEventListener('click', () => {
    const isCurrentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
    const nextTheme = isCurrentlyLight ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    themeLabel.textContent = nextTheme === 'light' ? '玄墨 · Obsidian' : '宣纸 · Paper';
    if (gpuEngine) {
      gpuEngine.setTheme(nextTheme === 'light');
    }
  });

  // 3. Neuro-Acoustic Audio Toggle
  const audioBtn = document.getElementById('btn-audio-toggle');
  const audioLabel = document.getElementById('audio-btn-label');
  const heroAudioCta = document.getElementById('cta-awaken-acoustics');

  const handleAudioToggle = async () => {
    const active = await audioEngine.toggle();
    audioBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
    audioLabel.textContent = active ? '神经谐振中 · Live' : '声学静音 · Muted';
  };

  audioBtn.addEventListener('click', handleAudioToggle);
  if (heroAudioCta) {
    heroAudioCta.addEventListener('click', async () => {
      if (!audioEngine.enabled) {
        await handleAudioToggle();
      } else {
        audioEngine.triggerBoundaryPulse(0.9);
      }
    });
  }

  // 4. Dimension Selector Buttons
  const dimBtns = document.querySelectorAll('.dim-item-btn');
  dimBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-dim-index'));
      appState.selectedDimIndex = idx;
      dimBtns.forEach((b) => b.classList.toggle('is-selected', b === btn));

      const dim = DIMENSIONS[idx];
      document.getElementById('studio-active-dim-code').textContent = `DIM ${dim.index}`;
      document.getElementById('spec-channel').textContent = dim.telemetry.channel;
      document.getElementById('spec-range').textContent = dim.telemetry.range;
      document.getElementById('spec-latency').textContent = dim.telemetry.latency;

      syncSensoryParameters({
        ...dim.preset,
        lantern: 0.0,
      });
    });
  });

  // 5. Continuous 4D + Overload Sliders
  const bindSlider = (id, key) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      appState.manualLanternPinned = false;
      syncSensoryParameters({ [key]: val, lantern: 0.0 });
    });
  };

  bindSlider('slider-temperature', 'temperature');
  bindSlider('slider-dissonance', 'dissonance');
  bindSlider('slider-depth', 'depth');
  bindSlider('slider-sovereignty', 'sovereignty');
  bindSlider('slider-overload', 'overload');

  // 6. Wearable Prototype Tabs
  const protoTabs = document.querySelectorAll('.proto-tab-btn');
  protoTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = Number(tab.getAttribute('data-proto-index'));
      appState.selectedProtoIndex = idx;
      protoTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      renderPrototypeDetail(idx);
      syncSensoryParameters({
        ...PROTOTYPES[idx].shaderState,
        lantern: 0.0,
      });
    });
  });

  // 7. Thesis II: Sovereign Override Button
  const overrideBtn = document.getElementById('btn-sovereign-override');
  if (overrideBtn) {
    overrideBtn.addEventListener('click', () => {
      appState.sovereignOverride = !appState.sovereignOverride;
      overrideBtn.setAttribute('aria-pressed', appState.sovereignOverride ? 'true' : 'false');
      overrideBtn.innerHTML = appState.sovereignOverride
        ? '<span>主权豁免已激活 · Dissonance Silenced for Chosen Path</span>'
        : '<span>触发“主权豁免” · Engage Sovereign Override</span>';
      syncSensoryParameters({});
      audioEngine.triggerBoundaryPulse(0.8);
    });
  }

  // 8. Finale: Silent Lantern Button
  const lanternBtn = document.getElementById('btn-silent-lantern');
  if (lanternBtn) {
    lanternBtn.addEventListener('click', () => {
      appState.manualLanternPinned = !appState.manualLanternPinned;
      const nextLantern = appState.manualLanternPinned ? 1.0 : 0.0;
      lanternBtn.classList.toggle('is-lit', appState.manualLanternPinned);
      lanternBtn.textContent = appState.manualLanternPinned
        ? '无言之灯已点亮 · SILENT LANTERN LIT'
        : '点亮无言之灯 · ENTER SILENT LANTERN MODE';
      syncSensoryParameters({ lantern: nextLantern });
    });
  }

  // 9. Scroll-Driven Chapter Choreography for WebGPU Framing
  const chapters = document.querySelectorAll('[data-chapter]');
  const navLinks = {
    foundation: document.getElementById('nav-link-foundation'),
    dimensions: document.getElementById('nav-link-dimensions'),
    hardware: document.getElementById('nav-link-hardware'),
    prototypes: document.getElementById('nav-link-prototypes'),
    ethics: document.getElementById('nav-link-ethics'),
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const name = entry.target.getAttribute('data-chapter');

        Object.entries(navLinks).forEach(([key, link]) => {
          if (link) link.classList.toggle('is-current', key === name);
        });

        if (!gpuEngine) return;

        if (name === 'hero') {
          gpuEngine.setState({
            groupOffsetX: 1.92,
            groupOffsetY: 0.04,
            cameraZ: 6.95,
            lantern: appState.manualLanternPinned ? 1.0 : 0.0,
          });
        } else if (name === 'foundation') {
          gpuEngine.setState({
            groupOffsetX: 0.0,
            groupOffsetY: 0.0,
            cameraZ: 6.8,
            lantern: appState.manualLanternPinned ? 1.0 : 0.0,
          });
        } else if (name === 'dimensions') {
          gpuEngine.setState({
            groupOffsetX: 1.35,
            groupOffsetY: 0.12,
            cameraZ: 5.85,
            lantern: appState.manualLanternPinned ? 1.0 : 0.0,
          });
        } else if (name === 'hardware') {
          gpuEngine.setState({
            groupOffsetX: -1.15,
            groupOffsetY: -0.05,
            cameraZ: 6.4,
            lantern: appState.manualLanternPinned ? 1.0 : 0.0,
          });
        } else if (name === 'prototypes') {
          gpuEngine.setState({
            groupOffsetX: 1.2,
            groupOffsetY: 0.0,
            cameraZ: 6.2,
            lantern: appState.manualLanternPinned ? 1.0 : 0.0,
          });
        } else if (name === 'ethics') {
          appState.lantern = 1.0;
          gpuEngine.setState({
            groupOffsetX: 0.0,
            groupOffsetY: 0.08,
            cameraZ: 5.6,
            lantern: 1.0,
          });
          updateHudNoeticStatus();
        }
      });
    },
    { threshold: 0.32 }
  );

  chapters.forEach((sec) => observer.observe(sec));
}

async function boot() {
  renderMonograph();
  bindUIInteractions();

  const canvas = document.getElementById('noetic-webgpu-canvas');
  const hudBackend = document.getElementById('hud-gpu-backend');
  const hudSpores = document.getElementById('hud-compute-stats');
  const heroProbeStatus = document.getElementById('hero-probe-status');
  const studioRecoilBadge = document.getElementById('studio-recoil-badge');

  let recoilTimer = null;

  gpuEngine = new NoeticWebGPUEngine(
    canvas,
    ({ backend, spores, fps }) => {
      if (hudBackend) hudBackend.textContent = backend;
      if (hudSpores) hudSpores.textContent = `${spores.toLocaleString()} TSL SPORES · ${fps} FPS`;
    },
    (sovereigntyStrength) => {
      audioEngine.triggerBoundaryPulse(sovereigntyStrength);
      if (heroProbeStatus) {
        heroProbeStatus.textContent = 'MEMBRANE RECOIL · 触觉边界回缩';
      }
      if (studioRecoilBadge) {
        studioRecoilBadge.textContent =
          sovereigntyStrength > 0.7
            ? 'THERMAL RECOIL SHIELD ACTIVE · 主权护盾回弹'
            : 'EMPATHIC RIPPLE · 共情涟漪';
      }
      clearTimeout(recoilTimer);
      recoilTimer = setTimeout(() => {
        if (heroProbeStatus) heroProbeStatus.textContent = 'READY · 场域静谧';
        if (studioRecoilBadge) studioRecoilBadge.textContent = 'SOVEREIGNTY INTACT · 本我澄明';
      }, 1100);
    }
  );

  try {
    await gpuEngine.init();
  } catch (err) {
    console.error('WebGPU initialization error:', err);
    if (hudBackend) hudBackend.textContent = 'FALLBACK SAFE MODE';
  }
}

boot();
