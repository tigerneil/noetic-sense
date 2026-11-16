/**
 * 智觉 · NOETIC SENSE — Three.js WebGPU + TSL Sensory Field Engine
 * Uses THREE.WebGPURenderer, TSL NodeMaterials, and GPU Compute Shaders (4,096 spores)
 * with automatic WebGL2 Transform-Feedback fallback.
 */

import * as THREE from 'three/webgpu';
import {
  Fn,
  uniform,
  instancedArray,
  instanceIndex,
  hash,
  sin,
  cos,
  mix,
  smoothstep,
  length,
  normalize,
  dot,
  cross,
  abs,
  pow,
  exp,
  clamp,
  positionLocal,
  normalLocal,
  normalWorld,
  positionWorld,
  cameraPosition,
  uv,
  time,
  vec2,
  vec3,
  vec4,
  float,
  mx_noise_float,
  mx_noise_vec3,
} from 'three/tsl';

const SPORE_COUNT = 4096;

export class NoeticWebGPUEngine {
  constructor(canvas, onTelemetry, onBoundaryRecoil) {
    this.canvas = canvas;
    this.onTelemetry = onTelemetry;
    this.onBoundaryRecoil = onBoundaryRecoil;

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.rootGroup = null;
    this.membraneMesh = null;
    this.sporeMesh = null;
    this.horizonRings = [];

    this.computeInit = null;
    this.computeUpdate = null;
    this.computeReady = false;
    this.disposed = false;

    // Target vs Smoothed Sensory State
    this.target = {
      temperature: 0.28,
      dissonance: 0.14,
      depth: 0.48,
      sovereignty: 0.62,
      overload: 0.24,
      lantern: 0.0,
      lightMode: 0.0,
      groupOffsetX: 1.92,
      groupOffsetY: 0.04,
      cameraZ: 6.95,
    };

    this.current = { ...this.target };

    // Pointer / Raycasting state for Sovereignty Membrane tactile interaction
    this.pointerNDC = new THREE.Vector2(99, 99);
    this.pointerActive = 0;
    this.pointerTargetStrength = 0;
    this.raycaster = new THREE.Raycaster();
    this.probeSphere = new THREE.Sphere(new THREE.Vector3(), 1.72);
    this.localProbeVec = new THREE.Vector3(0, 0, 3.0);

    // TSL Uniforms
    this.uTemperature = uniform(0.28);
    this.uDissonance = uniform(0.14);
    this.uDepth = uniform(0.48);
    this.uSovereignty = uniform(0.62);
    this.uOverload = uniform(0.24);
    this.uLantern = uniform(0.0);
    this.uLightMode = uniform(0.0);
    this.uPointerLocal = uniform(new THREE.Vector3(0, 0, 4));
    this.uPointerStrength = uniform(0.0);
    this.uDelta = uniform(0.016);

    // FPS tracking
    this.frameCount = 0;
    this.lastFpsStamp = performance.now();
    this.lastFrameTime = performance.now();
    this.backendLabel = 'INITIALIZING...';
  }

  async init() {
    this.scene = new THREE.Scene();

    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 60);
    this.camera.position.set(0, 0.1, 6.4);

    this.renderer = new THREE.WebGPURenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    await this.renderer.init();

    const isNativeWebGPU = Boolean(this.renderer.backend?.isWebGPUBackend);
    this.backendLabel = isNativeWebGPU
      ? 'WEBGPU · WGSL COMPUTE'
      : 'WEBGPU → WEBGL2 COMPUTE';

    this.setupLighting();
    this.rootGroup = new THREE.Group();
    this.rootGroup.position.set(this.current.groupOffsetX, 0.05, 0);
    this.scene.add(this.rootGroup);

    this.buildSovereigntyMembrane();
    this.buildHorizonRings();
    await this.buildComputeSpores();

    this.updateClearColor();

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', this.handlePointerLeave, { passive: true });

    if (this.onTelemetry) {
      this.onTelemetry({
        backend: this.backendLabel,
        spores: SPORE_COUNT,
        fps: 60,
      });
    }

    this.renderer.setAnimationLoop(this.animate);
  }

  setupLighting() {
    const ambient = new THREE.AmbientLight(0xdce6eb, 0.55);
    this.scene.add(ambient);

    this.keyLight = new THREE.DirectionalLight(0xf6e6cb, 2.1);
    this.keyLight.position.set(4.5, 5.0, 5.5);
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.DirectionalLight(0x7ac5cf, 1.45);
    this.rimLight.position.set(-5.5, -2.5, 2.5);
    this.scene.add(this.rimLight);

    this.coreLanternLight = new THREE.PointLight(0xf5c879, 1.4, 12, 1.6);
    this.coreLanternLight.position.set(0, 0, 0);
    this.scene.add(this.coreLanternLight);
  }

  buildSovereigntyMembrane() {
    const geo = new THREE.IcosahedronGeometry(1.58, 40);
    const mat = new THREE.MeshPhysicalNodeMaterial({
      roughness: 0.26,
      metalness: 0.08,
      transparent: true,
      opacity: 0.94,
    });

    // Shared TSL deformation logic for the Noetic Mind-Membrane
    const displacedPos = Fn(() => {
      const p = positionLocal.toVar();
      const n = normalLocal;
      const t = time.mul(0.55);

      // Overload damping & Silent Lantern calm down high-frequency complexity
      const calmGovernor = clamp(
        float(1.0)
          .sub(smoothstep(float(0.58), float(0.95), this.uOverload).mul(0.72))
          .mul(float(1.0).sub(this.uLantern.mul(0.82))),
        0.08,
        1.0
      );

      // 1. Barometric slow organic flow ("风起于青萍之末")
      const baseFlow = mx_noise_float(
        p.mul(float(1.15).add(this.uTemperature.mul(0.65))).add(vec3(t.mul(0.45), t.mul(0.32), t.mul(-0.28)))
      );

      // 2. Chladni Harmonic Standing Waves vs Microtonal Dissonance
      const pureChord = sin(p.x.mul(3.0).add(t))
        .mul(cos(p.y.mul(3.0).sub(t.mul(0.7))))
        .add(sin(p.y.mul(3.0)).mul(cos(p.z.mul(3.0).add(t.mul(0.8)))));

      const dissonantTremor = sin(p.x.mul(13.5).add(time.mul(8.5)))
        .mul(cos(p.y.mul(11.3).sub(time.mul(7.2))))
        .mul(this.uDissonance);

      const harmonicDisp = pureChord
        .mul(0.085)
        .add(dissonantTremor.mul(0.075))
        .mul(calmGovernor);

      // 3. Cliff-Edge Gravitational Tension (equatorial pinch + thermal swell)
      const gravityPinch = p.y.mul(p.y).sub(0.35).mul(this.uTemperature).mul(0.14).mul(calmGovernor);

      // 4. Dimension 04: Tactile Sovereignty Recoil Reflex when probed
      const distToProbe = length(p.sub(this.uPointerLocal));
      const recoilWave = sin(distToProbe.mul(14.0).sub(time.mul(10.5)))
        .mul(exp(distToProbe.negate().mul(1.85)))
        .mul(this.uPointerStrength)
        .mul(float(0.06).add(this.uSovereignty.mul(0.16)));

      const indent = exp(distToProbe.negate().mul(2.4))
        .negate()
        .mul(this.uPointerStrength)
        .mul(float(0.18).sub(this.uSovereignty.mul(0.09)));

      // Silent Lantern slight contraction into serene pearl-lantern
      const lanternScale = float(1.0).sub(this.uLantern.mul(0.22));

      const totalOffset = baseFlow
        .mul(float(0.12).add(this.uTemperature.mul(0.11)))
        .mul(calmGovernor)
        .add(harmonicDisp)
        .add(gravityPinch)
        .add(recoilWave)
        .add(indent);

      return p.mul(lanternScale).add(n.mul(totalOffset));
    })();

    mat.positionNode = displacedPos;

    // Curated Mineral Surface Color & Emissive Iridescence (Zero Purple!)
    const celadon = vec3(0.36, 0.72, 0.77); // Cool clarity
    const thermalAmber = vec3(0.90, 0.35, 0.18); // High risk / cliff-edge warmth
    const harmonicGold = vec3(0.89, 0.75, 0.49); // Pure consonance
    const sovereignJade = vec3(0.34, 0.71, 0.56); // Sacred boundary
    const lanternIvory = vec3(0.98, 0.84, 0.56); // Silent lantern

    const darkBase = vec3(0.06, 0.09, 0.12);
    const paperBase = vec3(0.84, 0.81, 0.75);

    mat.colorNode = Fn(() => {
      const baseSurface = mix(darkBase, paperBase, this.uLightMode);
      const tempTint = mix(celadon, thermalAmber, this.uTemperature);
      const chordTint = mix(harmonicGold, thermalAmber, this.uDissonance.mul(0.65));
      const blendedAccent = mix(tempTint, chordTint, float(0.42));
      const withSovereignty = mix(blendedAccent, sovereignJade, this.uSovereignty.mul(0.28));
      const finalTint = mix(withSovereignty, lanternIvory, this.uLantern.mul(0.85));
      return mix(baseSurface, finalTint, float(0.46).add(this.uLightMode.mul(0.16)));
    })();

    mat.emissiveNode = Fn(() => {
      const viewDir = normalize(cameraPosition.sub(positionWorld));
      const fresnel = pow(clamp(float(1.0).sub(abs(dot(normalWorld, viewDir))), 0.0, 1.0), float(2.4));

      // Delicate barometric isobar & Chladni standing-wave contour filaments
      const p = positionLocal;
      const contourWave = sin(p.x.mul(3.2).add(time.mul(0.35)))
        .mul(cos(p.y.mul(3.2).sub(time.mul(0.28))))
        .add(sin(p.z.mul(3.2).add(time.mul(0.22))));
      const contourLine = smoothstep(float(0.92), float(0.995), abs(sin(contourWave.mul(9.5))))
        .mul(float(1.0).sub(this.uLantern.mul(0.75)))
        .mul(float(0.24).sub(this.uLightMode.mul(0.12)));

      const distToProbe = length(p.sub(this.uPointerLocal));
      const probeRing = exp(abs(distToProbe.sub(0.55)).negate().mul(6.5))
        .mul(this.uPointerStrength)
        .mul(float(0.5).add(this.uSovereignty));

      const rimHue = mix(celadon, thermalAmber, this.uTemperature);
      const sovereignGlow = mix(rimHue, sovereignJade, this.uSovereignty.mul(0.45));
      const recoilHue = mix(harmonicGold, thermalAmber, this.uSovereignty);

      const lanternCoreGlow = lanternIvory.mul(this.uLantern).mul(float(0.65).add(fresnel.mul(0.6)));

      const baseEmissive = sovereignGlow
        .mul(fresnel.mul(float(0.62).sub(this.uLightMode.mul(0.32))))
        .add(harmonicGold.mul(contourLine))
        .add(recoilHue.mul(probeRing.mul(1.15)))
        .add(lanternCoreGlow);

      return baseEmissive;
    })();

    mat.roughnessNode = mix(float(0.18), float(0.46), this.uDissonance.mul(0.6).add(this.uLightMode.mul(0.25)));

    this.membraneMesh = new THREE.Mesh(geo, mat);
    this.rootGroup.add(this.membraneMesh);
  }

  buildHorizonRings() {
    // Three Concentric Temporal Horizon Filaments (Probabilistic Depth of Field)
    const configs = [
      { radius: 2.18, tiltX: 1.12, tiltY: 0.22, speed: 0.18 },
      { radius: 2.86, tiltX: 1.28, tiltY: -0.34, speed: -0.12 },
      { radius: 3.68, tiltX: 1.02, tiltY: 0.48, speed: 0.08 },
    ];

    configs.forEach((cfg, idx) => {
      const ringGeo = new THREE.TorusGeometry(cfg.radius, 0.0065, 12, 180);
      const ringMat = new THREE.MeshBasicNodeMaterial({
        transparent: true,
        depthWrite: false,
      });

      const ringIndexFactor = float((idx + 1) / configs.length);

      ringMat.colorNode = mix(
        mix(vec3(0.45, 0.77, 0.80), vec3(0.90, 0.76, 0.52), ringIndexFactor),
        vec3(0.22, 0.34, 0.38),
        this.uLightMode
      );

      ringMat.opacityNode = Fn(() => {
        const angleWave = sin(uv().x.mul(37.699).add(time.mul(cfg.speed * 6.0))).mul(0.5).add(0.5);
        const depthVisibility = smoothstep(ringIndexFactor.mul(0.22), float(1.0), this.uDepth.add(0.22));
        const lanternFade = float(1.0).sub(this.uLantern.mul(0.85));
        const overloadFade = float(1.0).sub(smoothstep(float(0.65), float(0.95), this.uOverload).mul(0.7));
        return float(0.08)
          .add(angleWave.mul(0.26))
          .mul(depthVisibility)
          .mul(lanternFade)
          .mul(overloadFade);
      })();

      const mesh = new THREE.Mesh(ringGeo, ringMat);
      mesh.rotation.set(cfg.tiltX, cfg.tiltY, 0);
      mesh.userData = cfg;
      this.rootGroup.add(mesh);
      this.horizonRings.push(mesh);
    });
  }

  async buildComputeSpores() {
    // Storage buffers updated on GPU via WebGPU Compute Shader (or WebGL2 Transform Feedback)
    const posStorage = instancedArray(SPORE_COUNT, 'vec4'); // xyz = position, w = normalized radial band
    const metaStorage = instancedArray(SPORE_COUNT, 'vec4'); // x = phase, y = speed, z = baseRadius, w = seed

    this.computeInit = Fn(() => {
      const idx = instanceIndex;
      const h1 = hash(idx);
      const h2 = hash(idx.add(10007));
      const h3 = hash(idx.add(20011));
      const h4 = hash(idx.add(30013));

      const theta = h1.mul(6.2831853);
      const cosPhi = h2.mul(2.0).sub(1.0);
      const sinPhi = pow(clamp(float(1.0).sub(cosPhi.mul(cosPhi)), 0.0001, 1.0), 0.5);

      const baseR = float(1.95).add(pow(h3, 1.4).mul(3.4));
      const px = sinPhi.mul(cos(theta)).mul(baseR);
      const py = cosPhi.mul(baseR).mul(0.62);
      const pz = sinPhi.mul(sin(theta)).mul(baseR);

      posStorage.element(idx).assign(vec4(px, py, pz, h3));
      metaStorage.element(idx).assign(vec4(theta, float(0.25).add(h4.mul(0.75)), baseR, h4));
    })().compute(SPORE_COUNT);

    this.computeUpdate = Fn(() => {
      const idx = instanceIndex;
      const pEntry = posStorage.element(idx);
      const mEntry = metaStorage.element(idx);

      const pos = pEntry.xyz.toVar();
      const band = pEntry.w;
      const speed = mEntry.y;
      const baseR = mEntry.z;
      const seed = mEntry.w;

      // Probabilistic Depth of Field expands outer causal horizon shells
      const targetRadius = baseR.mul(float(0.78).add(this.uDepth.mul(0.68))).mul(float(1.0).sub(this.uLantern.mul(0.28)));

      // Overload damping calms chaotic flow into serene laminar stream
      const calm = clamp(
        float(1.0).sub(smoothstep(float(0.62), float(0.96), this.uOverload).mul(0.75)),
        0.18,
        1.0
      );

      // Tangential orbital velocity around gently tilted axis
      const upAxis = normalize(vec3(sin(seed.mul(3.1)).mul(0.22), float(1.0), cos(seed.mul(2.7)).mul(0.18)));
      const radialDir = normalize(pos.add(vec3(0.0001, 0.0001, 0.0001)));
      const tangent = normalize(cross(upAxis, radialDir));

      // 3D Barometric curl-like noise drift
      const noiseField = mx_noise_vec3(pos.mul(0.45).add(vec3(time.mul(0.16), time.mul(-0.12), seed.mul(4.0))));

      // Dissonance adds high-frequency shimmer; Temperature accelerates convective drift
      const driftSpeed = speed
        .mul(float(0.32).add(this.uTemperature.mul(0.55)))
        .mul(calm);

      const radialSpring = radialDir.mul(targetRadius.sub(length(pos)).mul(1.35));

      // Sovereignty boundary repulsion from pointer probe
      const toSpore = pos.sub(this.uPointerLocal);
      const probeDist = length(toSpore).add(0.05);
      const probeRepel = normalize(toSpore)
        .mul(exp(probeDist.negate().mul(1.7)))
        .mul(this.uPointerStrength)
        .mul(float(1.4).add(this.uSovereignty.mul(2.6)));

      const vel = tangent
        .mul(driftSpeed)
        .add(noiseField.mul(float(0.28).add(this.uDissonance.mul(0.45))).mul(calm))
        .add(radialSpring)
        .add(probeRepel);

      const nextPos = pos.add(vel.mul(this.uDelta));
      pEntry.assign(vec4(nextPos, band));
    })().compute(SPORE_COUNT);

    try {
      await this.renderer.computeAsync(this.computeInit);
      this.computeReady = true;
    } catch (err) {
      console.warn('Compute fallback warning:', err);
      this.computeReady = false;
    }

    // Billboarded Instanced Spores using SpriteNodeMaterial
    const spriteMat = new THREE.SpriteNodeMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const sporeAttr = posStorage.toAttribute();
    spriteMat.positionNode = sporeAttr.xyz;

    // Probabilistic Depth of Field modulates spore size & focus sharpness
    spriteMat.scaleNode = Fn(() => {
      const band = sporeAttr.w;
      const nearSharp = float(0.022);
      const farHalo = float(0.016).add(band.mul(this.uDepth).mul(0.038));
      const pulse = sin(time.mul(2.2).add(band.mul(18.0))).mul(0.15).add(0.85);
      return mix(nearSharp, farHalo, band).mul(pulse);
    })();

    spriteMat.colorNode = Fn(() => {
      const band = sporeAttr.w;
      const coolSpore = vec3(0.48, 0.82, 0.86);
      const warmSpore = vec3(0.95, 0.56, 0.34);
      const goldSpore = vec3(0.94, 0.82, 0.58);
      const inkSpore = vec3(0.14, 0.22, 0.26);

      const tempMix = mix(coolSpore, warmSpore, this.uTemperature.mul(float(1.0).sub(band.mul(0.35))));
      const lanternMix = mix(tempMix, goldSpore, this.uLantern.mul(0.8).add(float(0.2)));
      return mix(lanternMix, inkSpore, this.uLightMode.mul(0.78));
    })();

    spriteMat.opacityNode = Fn(() => {
      const centered = uv().sub(vec2(0.5, 0.5));
      const r2 = dot(centered, centered);
      const softDisc = exp(r2.negate().mul(14.0))
        .mul(smoothstep(float(0.25), float(0.02), r2));

      const band = sporeAttr.w;
      // Overload auto-governor dims outer noisy spores so only core intuition remains
      const overloadMask = float(1.0).sub(
        smoothstep(float(0.55), float(0.92), this.uOverload).mul(band).mul(0.82)
      );
      const lanternMask = float(1.0).sub(this.uLantern.mul(band).mul(0.75));
      const depthAlpha = mix(float(0.82), float(0.34).add(this.uDepth.mul(0.42)), band);

      return softDisc.mul(depthAlpha).mul(overloadMask).mul(lanternMask);
    })();

    const quadGeo = new THREE.PlaneGeometry(1, 1);
    this.sporeMesh = new THREE.InstancedMesh(quadGeo, spriteMat, SPORE_COUNT);
    this.sporeMesh.frustumCulled = false;
    this.rootGroup.add(this.sporeMesh);
  }

  updateClearColor() {
    if (!this.renderer) return;
    // Smooth blend between Obsidian Void (#0a0d10) and Archival Xuan Paper (#f3eee5)
    const darkCol = new THREE.Color(0x0a0d10);
    const lightCol = new THREE.Color(0xf3eee5);
    const mixed = darkCol.lerp(lightCol, this.current.lightMode);
    this.renderer.setClearColor(mixed, 1);
  }

  setState(partial) {
    Object.assign(this.target, partial);
  }

  setTheme(isLight) {
    this.target.lightMode = isLight ? 1.0 : 0.0;
  }

  handlePointerMove = (e) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.pointerNDC.x = (e.clientX / w) * 2 - 1;
    this.pointerNDC.y = -(e.clientY / h) * 2 + 1;
    this.pointerActive = 1;
  };

  handlePointerLeave = () => {
    this.pointerActive = 0;
  };

  handleResize = () => {
    if (!this.renderer || !this.camera) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  };

  updatePointerProbe() {
    if (!this.camera || !this.rootGroup) return;

    if (this.pointerActive) {
      this.raycaster.setFromCamera(this.pointerNDC, this.camera);
      this.probeSphere.center.copy(this.rootGroup.position);
      this.probeSphere.radius = 1.72;

      const hit = new THREE.Vector3();
      const didHit = this.raycaster.ray.intersectSphere(this.probeSphere, hit);
      if (didHit) {
        this.localProbeVec.copy(hit).sub(this.rootGroup.position);
        this.membraneMesh.worldToLocal(hit);
        this.uPointerLocal.value.lerp(hit, 0.25);

        const prevStrength = this.pointerTargetStrength;
        this.pointerTargetStrength = 1.0;
        if (prevStrength < 0.4 && this.onBoundaryRecoil) {
          this.onBoundaryRecoil(this.current.sovereignty);
        }
      } else {
        // Closest point on ray near membrane for gentle ambient field bending
        this.raycaster.ray.closestPointToPoint(this.rootGroup.position, hit);
        const dist = hit.distanceTo(this.rootGroup.position);
        const proximity = Math.max(0, 1 - (dist - 1.72) / 1.9);
        this.membraneMesh.worldToLocal(hit);
        this.uPointerLocal.value.lerp(hit, 0.16);
        this.pointerTargetStrength = proximity * 0.55;
      }
    } else {
      this.pointerTargetStrength = 0;
    }

    this.uPointerStrength.value += (this.pointerTargetStrength - this.uPointerStrength.value) * 0.12;
  }

  animate = () => {
    if (this.disposed) return;

    const now = performance.now();
    const dt = Math.min(0.04, Math.max(0.001, (now - this.lastFrameTime) / 1000));
    this.lastFrameTime = now;
    this.uDelta.value = dt;

    // Smooth exponential damping for all uniforms & camera choreography
    const damp = 1 - Math.exp(-dt * 4.5);
    for (const k of Object.keys(this.target)) {
      this.current[k] += (this.target[k] - this.current[k]) * damp;
    }

    this.uTemperature.value = this.current.temperature;
    this.uDissonance.value = this.current.dissonance;
    this.uDepth.value = this.current.depth;
    this.uSovereignty.value = this.current.sovereignty;
    this.uOverload.value = this.current.overload;
    this.uLantern.value = this.current.lantern;

    if (Math.abs(this.uLightMode.value - this.current.lightMode) > 0.001) {
      this.uLightMode.value = this.current.lightMode;
      this.updateClearColor();
    }

    // Mobile responsive centering
    const isCompactViewport = window.innerWidth < 1060;
    const effectiveOffsetX = isCompactViewport ? 0 : this.current.groupOffsetX;

    this.rootGroup.position.x = effectiveOffsetX;
    this.rootGroup.position.y = this.current.groupOffsetY;
    this.camera.position.z = this.current.cameraZ;

    // Gentle rotational poise
    if (this.membraneMesh) {
      this.membraneMesh.rotation.y += dt * (0.11 + this.current.temperature * 0.08) * (1 - this.current.lantern * 0.6);
      this.membraneMesh.rotation.x = Math.sin(now * 0.00035) * 0.12;
    }

    this.horizonRings.forEach((ring, i) => {
      ring.rotation.z += dt * ring.userData.speed;
      const scale = 0.88 + this.current.depth * (0.18 + i * 0.08);
      ring.scale.setScalar(scale);
    });

    this.updatePointerProbe();

    // Execute GPU Compute Shader step
    if (this.computeReady && this.computeUpdate) {
      this.renderer.compute(this.computeUpdate);
    }

    this.renderer.render(this.scene, this.camera);

    // Update FPS telemetry every ~800ms
    this.frameCount++;
    if (now - this.lastFpsStamp >= 800) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsStamp));
      this.frameCount = 0;
      this.lastFpsStamp = now;
      if (this.onTelemetry) {
        this.onTelemetry({
          backend: this.backendLabel,
          spores: SPORE_COUNT,
          fps,
        });
      }
    }
  };

  dispose() {
    this.disposed = true;
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerleave', this.handlePointerLeave);
    if (this.renderer) {
      this.renderer.setAnimationLoop(null);
      this.renderer.dispose();
    }
  }
}
