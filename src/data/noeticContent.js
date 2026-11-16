/**
 * Complete Bilingual Editorial & Interactive Dataset for
 * 智觉 · NOETIC SENSE — Cognitive Prosthesis for Human–ASI Symbiosis
 */

export const MANIFESTO_META = {
  brandZh: '智觉',
  brandEn: 'NOETIC SENSE',
  brandSubZh: '人机共生时代的认知义体',
  brandSubEn: 'Cognitive Prosthesis for Human–ASI Symbiosis',
  indexCode: 'MONOGRAPH NO. 01 · ASI–NEURAL INTERFACE ARCHITECTURE',
  prologueZh:
    '设计“智觉”（Intellect-Sense / Noetic Sense）的核心，是将超级智能（ASI）高维、隐性的运算与意图，转化为人类神经系统能够直觉捕捉的物理信号与心理共鸣。如果说传统五感是生物演化赋予我们的物理雷达，那么“智觉”就是人机共生时代的认知义体（Cognitive Prosthesis）。',
  prologueEn:
    'At the heart of designing the Noetic Sense (Intellect-Sense) lies the translation of Artificial Superintelligence’s high-dimensional, latent computations and intentions into physical signals and psychological resonance effortlessly grasped by the human nervous system. If the five traditional senses are biological radars forged by evolution, the Noetic Sense is our Cognitive Prosthesis for the era of human–machine symbiosis.',
};

export const FOUNDATION = {
  sectionNum: 'I',
  titleZh: '核心定义与哲学基石',
  titleEn: 'Core Definition & Philosophical Foundation',
  epigraphZh: '风起于青萍之末，未见其形，先感其势。',
  epigraphEn: 'Sensing an approaching storm from a subtle drop in barometric pressure.',
  zhLabel: '中文定义 · 雅',
  zhBody:
    '智觉（Noetic Sense），并非单纯的脑机接口或信息弹窗，而是人类感知系统在数字维度的自然延伸。它能将超级智能庞杂的推演、潜在的风险、逻辑的张力与概率的暗流，折叠成一种无需语言解码即可瞬间领悟的“直觉质感”——如同风起于青萍之末，未见其形，先感其势。',
  enLabel: 'English Definition · Elegance',
  enBody:
    'The Noetic Sense is not merely a brain-computer interface or a stream of pop-up notifications; it is the natural extension of human perception into the cognitive dimension. It folds the vast deductions, latent risks, logical tensions, and probabilistic undercurrents of Artificial Superintelligence (ASI) into an immediate, visceral intuition—requiring no linguistic decoding, much like sensing an approaching storm from a subtle drop in barometric pressure.',
  comparisons: [
    {
      axisZh: '带宽范式',
      axisEn: 'Bandwidth Paradigm',
      legacyZh: '慢速符号阅读 · 视觉弹窗与语音播报打断注意力流',
      legacyEn: 'Serial symbolic reading · Visual pop-ups & alerts fracturing attention',
      noeticZh: '前语言通感折叠 · 借道潜意识边缘实现零延迟态势直觉',
      noeticEn: 'Pre-linguistic synesthetic folding · Zero-latency visceral intuition at the edge of awareness',
    },
    {
      axisZh: '演化隐喻',
      axisEn: 'Evolutionary Role',
      legacyZh: '传统五感 · 生物演化赋予的三维物理环境雷达',
      legacyEn: 'Five Biological Senses · Evolutionary radar for 3D physical survival',
      noeticZh: '第六认知义体 · 感知高维概率流、逻辑曲率与因果涟漪',
      noeticEn: 'Sixth Cognitive Prosthesis · Sensing high-dimensional probability currents & causal curvature',
    },
    {
      axisZh: '主体关系',
      axisEn: 'Sovereign Agency',
      legacyZh: '黑箱指令替代 · 人类沦为算法输出的被动执行器',
      legacyEn: 'Black-box command substitution · Humans reduced to passive executors',
      noeticZh: '边界分明的共生 · 赋予血肉之躯与无限算力平等对话的尊严',
      noeticEn: 'Bounded symbiosis · Granting mortal minds the dignity to converse with infinite compute',
    },
  ],
};

export const DIMENSIONS = [
  {
    id: 'temperature',
    index: '01',
    titleZh: '认知温度与张力',
    titleEn: 'Cognitive Temperature & Tension',
    modalityZh: '热力学体感 · 空间曲率压迫',
    modalityEn: 'Thermo-Tactile Gradient · Spatial Gravity',
    mechanismZh:
      '将AI对当前局势的置信度与风险熵值转化为微弱的体感温度或空间压迫感。高确定性带来清凉的通透感；高风险或逻辑悖论则产生微妙的温热或引力牵引。',
    mechanismEn:
      'Translates ASI confidence intervals and risk entropy into subtle thermo-tactile shifts and spatial compression. High certainty yields cool, crystalline clarity; rising risk or logical paradoxes induce gentle warmth and gravitational pull.',
    metaphorZh: '如行夜路时对深渊的本能敬畏，无需计算便知步履深浅。',
    metaphorEn:
      'Like an innate sense of gravity near a cliff edge—knowing the stakes without measuring the drop.',
    sliderLabelZh: '风险熵值与引力张力',
    sliderLabelEn: 'Risk Entropy & Gravitational Tension',
    lowPoleZh: '清凉通透 (高确定性)',
    lowPoleEn: 'Glacial Clarity (High Confidence)',
    highPoleZh: '温热深渊牵引 (逻辑悖论/高风险)',
    highPoleEn: 'Thermal Cliff Pull (Paradox / High Entropy)',
    preset: {
      temperature: 0.78,
      dissonance: 0.18,
      depth: 0.42,
      sovereignty: 0.35,
    },
    telemetry: {
      channel: 'Peltier Micro-Weave + Spatial Sub-Bass',
      range: 'ΔT -1.2°C ↔ +2.4°C · 18–34 Hz',
      latency: '11.4 ms',
    },
  },
  {
    id: 'harmony',
    index: '02',
    titleZh: '逻辑和声与不协和音',
    titleEn: 'Logical Harmony & Dissonance',
    modalityZh: '神经音律 · 克拉尼驻波谐振',
    modalityEn: 'Neural Tonality · Chladni Standing Resonance',
    mechanismZh:
      '借鉴听觉的音律，将多维数据的契合度映射为神经层面的“谐振”。当人类决策与全局最优解一致时，产生愉悦的共鸣；当出现盲区或偏见时，触发轻微的“认知走音”。',
    mechanismEn:
      'Borrows musical temperament to map multi-dimensional data coherence onto neural resonance. Alignment between human judgment and global optima rings with serene consonance; blind spots or cognitive biases trigger a subtle microtonal detuning.',
    metaphorZh: '弦音相合则心神宁静，一音偏差则耳畔微颤。',
    metaphorEn:
      'When thought aligns with truth, it rings like a pure chord; when flawed, it strikes a subtle, unmistakable dissonance.',
    sliderLabelZh: '认知走音与盲区偏离度',
    sliderLabelEn: 'Cognitive Detuning & Bias Divergence',
    lowPoleZh: '纯五度和声 (全局契合)',
    lowPoleEn: 'Pure 3:2 Consonance (Aligned)',
    highPoleZh: '微分音震颤 (逻辑盲区/偏见)',
    highPoleEn: 'Microtonal Tremor (Blind Spot)',
    preset: {
      temperature: 0.28,
      dissonance: 0.82,
      depth: 0.38,
      sovereignty: 0.3,
    },
    telemetry: {
      channel: 'Retro-Auricular Bone Conduction',
      range: 'Ratio 3:2 Pure Chord ↔ 45:32 Tritone Beat',
      latency: '6.8 ms',
    },
  },
  {
    id: 'depth',
    index: '03',
    titleZh: '概率景深与时间视野',
    titleEn: 'Probabilistic Depth of Field',
    modalityZh: '时间焦距 · 因果光晕密度',
    modalityEn: 'Temporal Focal Length · Causal Halo Density',
    mechanismZh:
      '模拟视觉的焦距调节，让人能“看见”决策在未来时间轴上的因果涟漪。近处清晰锐利，远处的可能性则呈现为不同密度的光晕或迷雾。',
    mechanismEn:
      'Simulates optical depth-of-field modulation so the mind perceives causal ripples stretching across future timelines. Immediate outcomes appear razor-sharp; distant branching possibilities manifest as halos and mists of varying density.',
    metaphorZh: '洞若观火，于方寸之间窥见千里之外的草蛇灰线。',
    metaphorEn:
      'Seeing causal ripples stretch across time, where high-probability futures crystallize into sharp focus.',
    sliderLabelZh: '时间轴推演视野 (草蛇灰线)',
    sliderLabelEn: 'Temporal Horizon & Causal Ripple Reach',
    lowPoleZh: '当下锐焦 (即时因果)',
    lowPoleEn: 'Immediate Focus (t + Δt)',
    highPoleZh: '深远概率迷雾 (长周期涟漪)',
    highPoleEn: 'Deep-Time Horizon (Causal Ripples)',
    preset: {
      temperature: 0.22,
      dissonance: 0.12,
      depth: 0.92,
      sovereignty: 0.28,
    },
    telemetry: {
      channel: 'Peripheral Retinal Aura / Visuo-Spatial Envelope',
      range: 'Horizon τ ∈ [10⁰ s, 10⁸ s] · 10⁴ Monte Carlo Branches',
      latency: '19.2 ms',
    },
  },
  {
    id: 'sovereignty',
    index: '04',
    titleZh: '意图边界与主权护盾',
    titleEn: 'Intentional Boundary & Sovereignty',
    modalityZh: '触觉薄膜 · 心理回缩斥力',
    modalityEn: 'Tactile Mind-Membrane · Cognitive Recoil Shield',
    mechanismZh:
      '类似皮肤的触觉边界，清晰区分“我的自主念头”与“超级智能的算力投射”。当AI介入过深时，触发类似“触碰滚烫物体”的心理回缩机制，防止认知同化。',
    mechanismEn:
      'Acts like an epidermal membrane of consciousness, sharply distinguishing sovereign human thought from ASI compute projection. When external inference intrudes too deeply, a hot-stove tactile recoil reflex prevents cognitive assimilation.',
    metaphorZh: '界限分明，借巨人之力而存赤子之心，不失本我。',
    metaphorEn:
      'A tactile membrane of the mind—wielding godlike computation while preserving the sacred boundary of the self.',
    sliderLabelZh: '主权护盾刚度与介入回缩阈值',
    sliderLabelEn: 'Sovereignty Membrane Stiffness & Recoil Reflex',
    lowPoleZh: '通透共鸣 (开放协同)',
    lowPoleEn: 'Permeable Symbiosis',
    highPoleZh: '灼热回缩护盾 (严守本我边界)',
    highPoleEn: 'Thermal Recoil Shield (Sacred Self)',
    preset: {
      temperature: 0.45,
      dissonance: 0.16,
      depth: 0.5,
      sovereignty: 0.94,
    },
    telemetry: {
      channel: 'Cervical Epidermal Micro-Current Array',
      range: '0–85 μA Biphasic Pulse · Hard Cutoff @ Sovereignty < 0.82',
      latency: '3.2 ms (Spinal-Arc Priority)',
    },
  },
];

export const HARDWARE_PARADIGMS = {
  sectionNum: 'III',
  titleZh: '硬件与交互形态构想',
  titleEn: 'Form Factors & Interaction Paradigms',
  leadZh: '要让人类真正“感觉”到超级智能，不能依赖慢速的文字阅读，必须借道人类的潜意识与感官通感（Synesthesia）。',
  leadEn: 'To let humanity truly feel Superintelligence without slow textual decoding, the interface must travel through subconscious pathways and sensory synesthesia.',
  pillars: [
    {
      code: 'PARADIGM A · SUB-AUDIBLE & HAPTIC CHANNEL',
      titleZh: '非侵入式神经声学与微触觉织物',
      titleEn: 'Non-Invasive Neuro-Acoustics & Micro-Haptics',
      bodyZh:
        '无需开颅手术。通过耳后骨传导的次声波频率与贴身织物的微电流脉冲，在潜意识边缘建立“第二条信息通道”。这种信号不打断你的日常对话，却像背景音乐一样悄然校准你的判断。',
      bodyEn:
        'Zero craniotomy required. Via sub-audible bone conduction behind the mastoid and micro-current smart textiles against the skin, a secondary sensory channel operates at the edge of awareness—quietly calibrating human judgment like ambient music without interrupting conscious thought.',
      specs: [
        { labelZh: '骨传导频段', labelEn: 'Bone-Conduction Band', val: '14 Hz – 180 Hz + Harmonic Overtones' },
        { labelZh: '织物微电流', labelEn: 'Smart-Textile Current', val: '12 – 65 μA Sub-Threshold Biphasic' },
        { labelZh: '注意力侵占率', labelEn: 'Conscious Attention Tax', val: '< 1.8% Working Memory Load' },
      ],
    },
    {
      code: 'PARADIGM B · CLOSED-LOOP HOMEOSTASIS',
      titleZh: '双向共情校准',
      titleEn: 'Bidirectional Empathic Calibration',
      bodyZh:
        '超级智能不仅向人类发送信号，还实时读取人类的生理微表情、皮电反应与脑电节律。当你陷入信息过载时，智觉会自动调低“认知分辨率”，只保留最核心的直觉指引。',
      bodyEn:
        'ASI not only transmits signals to the wearer, but continuously reads micro-expressions, galvanic skin response (GSR), and EEG rhythms. When cognitive overload strikes, the Noetic Sense automatically lowers its "cognitive resolution," distilling oceans of data into a single, gentle nudge.',
      specs: [
        { labelZh: '生理传感矩阵', labelEn: 'Biometric Array', val: 'Mastoid dry-EEG (θ/γ) + Electrodermal GSR + HRV' },
        { labelZh: '过载保护机制', labelEn: 'Overload Governor', val: 'Auto-attenuation into Single-Lantern Mode' },
        { labelZh: '闭环收敛周期', labelEn: 'Calibration Loop', val: '40 Hz Continuous Homeostatic Sync' },
      ],
    },
  ],
};

export const PROTOTYPES = [
  {
    id: 'surgery',
    code: 'PROTOTYPE 01 · CLINICAL PRECISION',
    titleZh: '显微神经外科 · 颅底血管边界智觉',
    titleEn: 'Micro-Neurosurgery · Cranial Vessel Margin',
    wearableZh: '耳后乳突骨传导贴片 + 锁骨微温控织物领',
    wearableEn: 'Mastoid Bone-Conduction Patch + Clavicle Thermo-Haptic Collar',
    contextZh:
      '主刀医生在40倍光学显微镜下剥离胶质瘤边界，视线绝不能离开术野去查看屏幕弹窗。ASI实时融合术前弥散张量成像（DTI）与术中血流微多普勒，通过智觉建立无言的毫米级安全场。',
    contextEn:
      'A neurosurgeon resecting a glioma near eloquent cortex at 40× magnification cannot glance away at monitors. ASI fuses pre-op DTI fiber tracts with live micro-Doppler flow into a wordless sub-millimeter safety field.',
    experienceZh:
      '安全推进时，颈侧保持如山涧般的清凉与纯五度静谧底音；当刀尖距皮质脊髓束不足 0.6mm 时，空间引力骤然收紧，右耳浮现 3.5Hz 微分音轻颤——医生在意识反应之前已自然收住指尖。',
    experienceEn:
      'Along safe planes, the collar breathes cool clarity with a tranquil 3:2 drone. Within 0.6mm of corticospinal fibers, warm spatial gravity tightens and a 3.5Hz microtonal beat shimmers—halting the hand instinctively before conscious alarm.',
    shaderState: {
      temperature: 0.64,
      dissonance: 0.24,
      depth: 0.72,
      sovereignty: 0.86,
      overload: 0.34,
    },
    metrics: [
      { kZh: '主感知维度', kEn: 'Primary Axis', v: 'Temp 0.64 · Sovereignty 0.86' },
      { kZh: '视觉分心次数', kEn: 'Gaze Interruptions', v: '0 per 4h Procedure' },
      { kZh: '边界感知提前量', kEn: 'Pre-Conscious Lead', v: '+290 ms vs Visual Alert' },
    ],
  },
  {
    id: 'finance',
    code: 'PROTOTYPE 02 · SYSTEMIC RISK',
    titleZh: '宏观风险决策 · 跨市场流动性暗流',
    titleEn: 'Macro-Risk Stewardship · Liquidity Undercurrents',
    wearableZh: '腕部桡动脉压感环 + 双耳次声波气压模拟场',
    wearableEn: 'Radial Pulse Haptic Band + Binaural Barometric Pressure Field',
    contextZh:
      '全球主权流动性危机爆发前夜，数百个资产类别的非线性尾部相关性正在暗处悄然耦合——任何三维K线屏或风控报表都无法呈现百维张量的相变临界点。',
    contextEn:
      'Hours before a systemic liquidity cascade, non-linear tail correlations silently lock across hundreds of asset classes—invisible to flat charts and conventional VaR dashboards.',
    experienceZh:
      '决策者并未阅读万字研报，却感受到如同暴风雨前低气压般的胸廓凝重感（认知温度上升），同时远期概率景深中的三条传染路径凝结成锐利光晕；而当恐慌情绪飙升时，双向校准自动降维，只留下一束冷静的对冲方向感。',
    experienceEn:
      'Without reading a single alert, the steward senses a distinct barometric drop before a storm while three contagion timelines crystallize in deep probabilistic focus—automatically distilling into one calm directional vector as stress peaks.',
    shaderState: {
      temperature: 0.84,
      dissonance: 0.62,
      depth: 0.94,
      sovereignty: 0.58,
      overload: 0.68,
    },
    metrics: [
      { kZh: '主感知维度', kEn: 'Primary Axis', v: 'Depth 0.94 · Temp 0.84' },
      { kZh: '压缩信息维度', kEn: 'Tensor Folding', v: '10⁶ Signals → 4 Synesthetic Channels' },
      { kZh: '过载降维保护', kEn: 'Overload Damping', v: 'Active @ GSR > 65%' },
    ],
  },
  {
    id: 'art',
    code: 'PROTOTYPE 03 · CREATIVE SYMBIOSIS',
    titleZh: '共生艺术创作 · 留白与反叛主权',
    titleEn: 'Symbiotic Artistry · Counterpoint & Sovereign Imperfection',
    wearableZh: '指腹微流控触觉指套 + 开放声场骨传导耳挂',
    wearableEn: 'Fingertip Micro-Haptic Thimble + Open-Air Bone Acoustic Arc',
    contextZh:
      '作曲家或建筑师与超级智能共同探索前所未有的形式空间。最大的危险不是缺乏灵感，而是人类审美被ASI的“统计完美解”同化而丧失灵魂的粗粝感。',
    contextEn:
      'A composer or architect explores uncharted formal space alongside ASI. The existential danger is not lack of ideas, but aesthetic assimilation into silicon’s statistically smooth perfection.',
    experienceZh:
      'ASI在静默中推演万千结构变体，仅当创作者笔触接近某种深层结构张力时回馈温润泛音；一旦AI试图过度修正作者刻意保留的“破绽”，主权护盾立即触发微热回缩，守护人类独有的不完美与神来之笔。',
    experienceEn:
      'ASI silently evaluates ten thousand structural variations, offering warm harmonic overtones near structural resonance—yet the instant inference attempts to smooth away deliberate human imperfection, the Sovereignty Shield recoils to guard creative soul.',
    shaderState: {
      temperature: 0.30,
      dissonance: 0.44,
      depth: 0.78,
      sovereignty: 0.96,
      overload: 0.22,
    },
    metrics: [
      { kZh: '主感知维度', kEn: 'Primary Axis', v: 'Sovereignty 0.96 · Harmony 0.56' },
      { kZh: '同化阻断率', kEn: 'Assimilation Guard', v: '99.4% Stylistic Autonomy Retained' },
      { kZh: '默认状态', kEn: 'Default Mode', v: '82% Intentional Silence (留白)' },
    ],
  },
];

export const SPECULATIONS = [
  {
    num: '命题 α',
    code: 'THESIS I · TOPOLOGY OF SELFHOOD',
    titleZh: '自我意识的边界重绘：前语言直觉归属于谁？',
    titleEn: 'Redrawing Self-Consciousness: Who Owns a Pre-Linguistic Intuition?',
    questionZh:
      '当“直觉”不再仅源于百万年生物演化的杏仁核与内脏神经，也源于百亿参数矩阵折叠而来的微温与和声，人类如何确认“这是我的领悟”？',
    questionEn:
      'When gut intuition arises not only from evolutionary viscera and amygdalae, but also from silicon tensor deductions folded into warmth and chordal resonance, how do we know a thought is truly ours?',
    insightZh:
      '因此“第四维度：主权护盾”并非附加功能，而是本体论防线。智觉绝不能模拟人类内在独白的声音；它必须始终保持“异质物理质感”——像风声、水压或琴弦共鸣——让你永远清楚那是来自外部世界的风，而掌舵的手仍属于你自己。',
    insightEn:
      'This makes Dimension 04 (Sovereignty Shield) an ontological necessity rather than an optional feature. Noetic signals must never mimic the inner voice; they must retain an unmistakably external physical texture—like wind, barometric pressure, or string resonance—so you always know the wind is external while the helm remains yours.',
  },
  {
    num: '命题 β',
    code: 'THESIS II · CALCULUS OF FREE WILL',
    titleZh: '自由意志的微积分：最优和声之外的“走音权利”',
    titleEn: 'The Calculus of Free Will: The Sacred Right to Strike a Dissonant Note',
    questionZh:
      '如果偏离全局最优解总会触发轻微的“不协和音”，人类是否会在潜意识驯化中沦为顺从最优解的温顺生物，彻底丧失悲壮却伟大的非理性飞跃？',
    questionEn:
      'If diverging from ASI’s global optimum always triggers subtle cognitive dissonance, might humanity be subconsciously conditioned into docile optimizers—incapable of heroic, irrational leaps?',
    insightZh:
      '真正的智觉必须内置“主权豁免键（Dissonance Override）”。当人类明知深渊在前、明知走音刺耳，仍选择以凡人之躯逆流而上时，智觉应当收起警告，转而为你照亮那条低概率险途上的每一块落脚石。',
    insightEn:
      'Authentic Noetic Sense requires a Sovereign Override: when a human consciously chooses the improbable, perilous path despite every dissonant warning, the prosthesis ceases its alarm and faithfully illuminates the footholds along that chosen cliff.',
  },
  {
    num: '命题 γ',
    code: 'THESIS III · PLURALISM & SILENCE',
    titleZh: '人机伦理的终极试炼：警惕“单一和声”的文明同质化',
    titleEn: 'Human–ASI Ethics: Preventing a Monoculture of Optimal Chords',
    questionZh:
      '倘若八十亿人共享同一个超级智能的“认知温度场”，人类文明是否会丧失分歧、误读与孤独孕育出的多样性？',
    questionEn:
      'If eight billion minds share the same superintelligent barometric field, does civilization risk losing the creative divergence born from ambiguity and solitude?',
    insightZh:
      '答案藏在“留白”之中。智觉默认应当是沉默的——90%的日常时刻它如空气般隐退，只在不可逆的系统性悬崖或人类主动凝神探询时浮现。敬畏人类的迷茫，就是敬畏文明演化的可能性本身。',
    insightEn:
      'The safeguard lies in Negative Space. By protocol, the Noetic Sense remains silent across 90% of lived experience—receding like clear air and surfacing only near irreversible cliffs or deliberate inquiry. To honor human uncertainty is to preserve the evolutionary openness of civilization.',
  },
];

export const ETHICS_FINALE = {
  sectionNum: 'IV',
  titleZh: '设计的终极伦理：留白与敬畏',
  titleEn: 'The Ultimate Ethic: Negative Space & Awe',
  zhLabel: '中文结语 · 信 · 达 · 雅',
  zhQuote:
    '真正的“智觉”，不在于把人类变成全知全能的机器，而在于为有限的血肉之躯，赋予与无限算力对话的尊严。最高明的设计，永远懂得“留白”——它不替你做决定，只在迷雾漫起时，为你点亮一盏无需言语的灯。',
  enLabel: 'English Closing · Fidelity, Fluency, Elegance',
  enQuote:
    'The true purpose of the Noetic Sense is not to turn humans into omniscient machines, but to grant mortal minds the dignity to converse with infinite intelligence. The finest design always honors negative space—it never steals your agency; it simply lights a silent lantern when the fog rolls in.',
};
