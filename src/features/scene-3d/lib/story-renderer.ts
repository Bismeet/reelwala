import * as T from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createStoryModel, type StoryScene } from "./story-models";
import { visualScrollEvent } from "@/lib/visual-scroll";
import { advancePointerSpring } from "@/lib/pointer-spring";

export function mountStoryScene(host: HTMLElement, kind: StoryScene) {
  const renderer = new T.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(
    Math.min(
      devicePixelRatio,
      kind === "hero"
        ? matchMedia("(pointer:coarse)").matches
          ? 1.5
          : 2
        : 1.25,
    ),
  );
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = kind === "hero" ? 1 : 1.1;
  if (kind === "hero") {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFShadowMap;
    renderer.shadowMap.autoUpdate = false;
  }
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.append(canvas);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(32, 1, 0.1, 100);
  const makeEnvironment = () => {
    const pmrem = new T.PMREMGenerator(renderer),
      room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);
    room.dispose();
    pmrem.dispose();
    return target;
  };
  let environment = makeEnvironment();
  scene.environment = environment.texture;
  if (kind === "hero") scene.environmentIntensity = 0.3;
  scene.add(
    new T.HemisphereLight(
      kind === "hero" ? "#acc7f4" : "#fff5dd",
      "#365a4e",
      kind === "hero" ? 0.35 : 1.3,
    ),
  );
  const key = new T.DirectionalLight(
    kind === "hero" ? "#ffe1ae" : "#fff0df",
    kind === "hero" ? 1.8 : 4,
  );
  key.position.set(-4, 7, 5);
  scene.add(key);
  if (kind === "hero") {
    key.castShadow = true;
    const shadowSize = matchMedia("(pointer:coarse)").matches ? 1024 : 2048;
    key.shadow.mapSize.set(shadowSize, shadowSize);
    key.shadow.radius = 2;
    key.shadow.camera.left = -8;
    key.shadow.camera.right = 8;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -6;
    key.shadow.normalBias = 0.025;
  }
  const fill = new T.DirectionalLight(
    kind === "hero" ? "#d8e2df" : "#9ffff0",
    kind === "hero" ? 0.35 : 2,
  );
  fill.position.set(5, 1, 3);
  scene.add(fill);
  if (kind === "hero") {
    const rim = new T.DirectionalLight("#adc9ff", 1.6);
    rim.position.set(3, 4, -3);
    scene.add(rim);
  }
  const model = createStoryModel(kind);
  scene.add(model.group);
  // A soft, procedural shadow anchors the sculptural object without a shadow-map pass.
  const shadow = new T.Mesh(
    new T.PlaneGeometry(6, 2),
    new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { opacity: { value: 0.15 } },
      vertexShader:
        "varying vec2 uvPos;void main(){uvPos=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader:
        "varying vec2 uvPos;uniform float opacity;void main(){float d=length((uvPos-.5)*vec2(2.,2.));gl_FragColor=vec4(.025,.09,.07,exp(-d*d*8.)*opacity);}",
    }),
  );
  shadow.position.set(0, -2.55, -1);
  scene.add(shadow);
  let active = false,
    disposed = false,
    contextLost = false,
    raf = 0,
    idleTimer = 0,
    previous = 0,
    elapsed = 0,
    progress = 0,
    targetProgress = 0,
    replayUntil = 0,
    distance = 12;
  let assetsReady = !model.ready;
  model.ready
    ?.then(() => {
      if (disposed) return;
      const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      model.group.traverse((object) => {
        if (!(object instanceof T.Mesh)) return;
        for (const material of Array.isArray(object.material)
          ? object.material
          : [object.material]) {
          for (const value of Object.values(material)) {
            if (value instanceof T.Texture && !value.isRenderTargetTexture)
              value.anisotropy = anisotropy;
          }
        }
      });
      assetsReady = true;
      request();
    })
    .catch(() => {
      if (!disposed) host.dataset.sceneReady = "fallback";
    });
  const pointer = new T.Vector2(),
    targetPointer = new T.Vector2();
  const springX = { position: 0, velocity: 0 };
  const springY = { position: 0, velocity: 0 };
  const cameraOffset = new T.Vector3();
  const resetPointer = () => {
    pointer.set(0, 0);
    targetPointer.set(0, 0);
    springX.position = springX.velocity = 0;
    springY.position = springY.velocity = 0;
  };
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const stage =
    host.closest<HTMLElement>("[data-hero-stage], [data-edit-stage]") ?? host;
  const resize = () => {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    const width =
      kind === "hero" ? (w < 651 ? 7.5 : 10.6) : kind === "edit" ? 9.6 : 6.9;
    distance =
      Math.max(
        kind === "hero" ? 6.3 : kind === "edit" ? 6.3 : 6.7,
        width / camera.aspect,
      ) /
      (2 * Math.tan(T.MathUtils.degToRad(16)));
    camera.position.set(0, 0.45, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    request();
  };
  const readProgress = () => {
    if (
      (kind === "hero" || kind === "edit") &&
      stage.dataset.sceneProgress !== undefined
    )
      targetProgress = Number(stage.dataset.sceneProgress);
    else {
      const rect = host.getBoundingClientRect();
      targetProgress = T.MathUtils.clamp(
        (innerHeight * 0.85 - rect.top) /
          (innerHeight * 0.85 + rect.height * 0.6),
        0,
        1,
      );
    }
    request();
  };
  function draw(now: number) {
    raf = 0;
    if (disposed || contextLost || !active || document.hidden || !assetsReady)
      return;
    const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0.016;
    previous = now;
    elapsed += delta;
    if (motion.matches) {
      progress = kind === "hero" ? 1 : kind === "edit" ? 0.05 : 0.45;
      resetPointer();
    } else {
      // GSAP already eases the story timeline; follow its rendered position.
      progress =
        stage.dataset.sceneProgress !== undefined
          ? targetProgress
          : T.MathUtils.damp(
              progress,
              targetProgress,
              kind === "hero" ? 12 : 7,
              delta,
            );
      if (kind === "hero") {
        advancePointerSpring(springX, targetPointer.x, delta);
        advancePointerSpring(springY, targetPointer.y, delta);
        pointer.set(springX.position, springY.position);
      } else pointer.lerp(targetPointer, 1 - Math.exp(-5 * delta));
    }
    model.update(progress, elapsed);
    if (kind === "hero")
      host.dataset.recordingProgress = Number(
        model.group.userData.recordingProgress,
      ).toFixed(3);
    model.group.rotation.y = kind === "hero" ? 0 : pointer.x * 0.14;
    model.group.rotation.x = kind === "hero" ? 0 : pointer.y * 0.08;
    camera.position.set(
      pointer.x * 0.3,
      0.45 + pointer.y * 0.15,
      distance * (1 - progress * (kind === "hero" ? 0.11 : 0.035)),
    );
    camera.lookAt(0, 0, 0);
    model.updateCamera?.(camera, distance, camera.aspect, progress);
    if (kind === "hero") {
      // Layer a gentle viewing-camera shift over the grounded asset responses.
      // Settle back to the authored composition before the phone/title reveal.
      const strength = 1 - T.MathUtils.smoothstep(progress, 0.5, 0.82);
      model.updatePointer?.(pointer.x, pointer.y, strength);
      cameraOffset
        .set(pointer.x * 0.28, -pointer.y * 0.14, 0)
        .multiplyScalar(strength)
        .applyQuaternion(camera.quaternion);
      camera.position.add(cameraOffset);
      camera.rotateZ(-pointer.x * 0.0025 * strength);
      host.dataset.pointerOffset = `${(pointer.x * strength).toFixed(4)},${(pointer.y * strength).toFixed(4)}`;
      host.dataset.reactiveElements = String(
        model.group.userData.reactiveElements ?? 0,
      );
      host.dataset.elementMotion = Number(
        model.group.userData.elementMotion ?? 0,
      ).toFixed(5);
      host.dataset.liveGestureTime = Number(
        model.group.userData.liveGestureTime ?? 0,
      ).toFixed(3);
    }
    model.beforeRender?.(renderer, scene, now);
    if (kind === "hero")
      host.dataset.recordingRenders = String(
        model.group.userData.recordingRenders ?? 0,
      );
    renderer.render(scene, camera);
    host.dataset.sceneReady = "true";
    host.dataset.renderProgress = progress.toFixed(3);
    const responding =
      Math.abs(progress - targetProgress) > 0.001 ||
      pointer.distanceTo(targetPointer) > 0.001 ||
      Math.abs(springX.velocity) > 0.005 ||
      Math.abs(springY.velocity) > 0.005;
    if (!motion.matches && model.isAnimating?.() && !responding) {
      // Limit ambient work; mouse/scroll input cancels this wait immediately.
      idleTimer = window.setTimeout(
        request,
        Math.max(0, 1000 / 30 - (performance.now() - now) - 8),
      );
    } else if (
      !motion.matches &&
      ((kind !== "hero" && elapsed < 2.2) ||
        elapsed < replayUntil ||
        model.needsRender?.() ||
        Math.abs(progress - targetProgress) > 0.001 ||
        pointer.distanceTo(targetPointer) > 0.001 ||
        (kind === "hero" &&
          (Math.abs(springX.velocity) > 0.005 ||
            Math.abs(springY.velocity) > 0.005)))
    )
      request();
  }
  function request() {
    clearTimeout(idleTimer);
    idleTimer = 0;
    if (!raf && active && !contextLost && !disposed && !document.hidden)
      raf = requestAnimationFrame(draw);
  }
  const move = (event: PointerEvent) => {
    if (
      event.pointerType !== "mouse" ||
      motion.matches ||
      (kind === "hero" && progress >= 0.82)
    )
      return;
    const r = host.getBoundingClientRect();
    targetPointer.set(
      T.MathUtils.clamp(((event.clientX - r.left) / r.width - 0.5) * 2, -1, 1),
      T.MathUtils.clamp(((event.clientY - r.top) / r.height - 0.5) * 2, -1, 1),
    );
    if (!raf) previous = performance.now();
    request();
  };
  const leave = () => {
    targetPointer.set(0, 0);
    request();
  };
  const replay = () => {
    if (kind !== "hero" || motion.matches || progress < 0.9) return;
    model.replay?.(elapsed);
    replayUntil = elapsed + 1.8;
    request();
  };
  const lost = (event: Event) => {
    event.preventDefault();
    host.dataset.sceneReady = "fallback";
    contextLost = true;
    resetPointer();
    cancelAnimationFrame(raf);
    clearTimeout(idleTimer);
    raf = 0;
    active = false;
  };
  const restored = () => {
    contextLost = false;
    environment.dispose();
    environment = makeEnvironment();
    scene.environment = environment.texture;
    model.invalidate?.();
    renderer.shadowMap.needsUpdate = true;
    active = true;
    resize();
    readProgress();
  };
  const visibility = () => {
    previous = 0;
    if (document.hidden) {
      resetPointer();
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      raf = 0;
    } else request();
  };
  const observer = new IntersectionObserver(
    ([entry]) => {
      active = entry.isIntersecting;
      previous = 0;
      if (active) readProgress();
      else {
        resetPointer();
        cancelAnimationFrame(raf);
        clearTimeout(idleTimer);
        raf = 0;
      }
    },
    { rootMargin: "100px" },
  );
  observer.observe(host);
  const sizes = new ResizeObserver(resize);
  sizes.observe(host);
  const pointerSurface = kind === "hero" ? stage : host;
  pointerSurface.addEventListener("pointermove", move);
  pointerSurface.addEventListener("pointerleave", leave);
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", restored);
  window.addEventListener("scroll", readProgress, { passive: true });
  window.addEventListener(visualScrollEvent, readProgress);
  window.addEventListener("reelwala:scene-progress", readProgress);
  window.addEventListener("reelwala:replay", replay);
  document.addEventListener("visibilitychange", visibility);
  motion.addEventListener("change", readProgress);
  resize();
  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    clearTimeout(idleTimer);
    observer.disconnect();
    sizes.disconnect();
    pointerSurface.removeEventListener("pointermove", move);
    pointerSurface.removeEventListener("pointerleave", leave);
    canvas.removeEventListener("webglcontextlost", lost);
    canvas.removeEventListener("webglcontextrestored", restored);
    window.removeEventListener("scroll", readProgress);
    window.removeEventListener(visualScrollEvent, readProgress);
    window.removeEventListener("reelwala:scene-progress", readProgress);
    window.removeEventListener("reelwala:replay", replay);
    document.removeEventListener("visibilitychange", visibility);
    motion.removeEventListener("change", readProgress);
    const materials = new Set<T.Material>();
    scene.traverse((object) => {
      if (object instanceof T.Mesh) {
        object.geometry.dispose();
        (Array.isArray(object.material)
          ? object.material
          : [object.material]
        ).forEach((m) => materials.add(m));
      }
    });
    (model.group.userData.materials as T.Material[]).forEach((m) =>
      materials.add(m),
    );
    materials.forEach((m) => m.dispose());
    model.dispose?.();
    environment.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
