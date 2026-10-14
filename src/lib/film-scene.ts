// Original Three.js composition. Runtime is imported only for visible, motion-enabled desktop galleries.
import * as THREE from "three";
export function mountFilmScene(host: HTMLElement, onReady: () => void) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 5.3);
  const group = new THREE.Group();
  scene.add(group);
  const textures: THREE.Texture[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  let closed = false;
  let raf = 0;
  let active = true;
  let targetX = 0;
  let targetY = 0;
  const draw = () => {
    if (!closed && active) renderer.render(scene, camera);
  };
  const resize = () => {
    const width = host.clientWidth,
      height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = Math.max(
      5.3,
      9.15 /
        (2 *
          Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
          camera.aspect),
    );
    camera.updateProjectionMatrix();
    draw();
  };
  const resizer = new ResizeObserver(resize);
  resizer.observe(host);
  resize();
  const animate = () => {
    raf = 0;
    if (closed || !active) return;
    group.rotation.y += (targetX - group.rotation.y) * 0.12;
    group.rotation.x += (targetY - group.rotation.x) * 0.12;
    draw();
    if (
      Math.abs(targetX - group.rotation.y) +
        Math.abs(targetY - group.rotation.x) >
      0.0005
    )
      raf = requestAnimationFrame(animate);
  };
  const requestDraw = () => {
    if (!raf && !closed && active) raf = requestAnimationFrame(animate);
  };
  const pointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const rect = host.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.1;
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.04;
    requestDraw();
  };
  const leave = () => {
    targetX = 0;
    targetY = 0;
    requestDraw();
  };
  const parent = host.parentElement!;
  parent.addEventListener("pointermove", pointer);
  parent.addEventListener("pointerleave", leave);
  const observer = new IntersectionObserver((entries) => {
    active = entries.some((e) => e.isIntersecting) && !document.hidden;
    if (active) requestDraw();
    else {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  observer.observe(host);
  const visibility = () => {
    active =
      !document.hidden &&
      host.getBoundingClientRect().bottom > 0 &&
      host.getBoundingClientRect().top < innerHeight;
    if (active) requestDraw();
  };
  document.addEventListener("visibilitychange", visibility);
  function dispose() {
    if (closed) return;
    closed = true;
    cancelAnimationFrame(raf);
    resizer.disconnect();
    observer.disconnect();
    document.removeEventListener("visibilitychange", visibility);
    parent.removeEventListener("pointermove", pointer);
    parent.removeEventListener("pointerleave", leave);
    textures.forEach((t) => t.dispose());
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  }
  const loss = (event: Event) => {
    event.preventDefault();
    parent.dataset.ready = "false";
    dispose();
  };
  renderer.domElement.addEventListener("webglcontextlost", loss, {
    once: true,
  });
  async function load() {
    const loader = new THREE.TextureLoader();
    const photos = await Promise.all(
      ["celebration", "corporate", "festival"].map(async (name) => {
        const texture = await loader.loadAsync(`/media/${name}.webp`);
        if (closed) {
          texture.dispose();
          return texture;
        }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.repeat.set(0.66, 1);
        texture.offset.set(0.17, 0);
        textures.push(texture);
        return texture;
      }),
    );
    if (closed) return;
    photos.forEach((texture, index) => {
      const frame = new THREE.Group();
      const back = new THREE.PlaneGeometry(2.7, 2.85);
      const backMaterial = new THREE.MeshBasicMaterial({
        color: index === 1 ? "#d5bb85" : "#af8c51",
        side: THREE.DoubleSide,
      });
      geometries.push(back);
      materials.push(backMaterial);
      frame.add(new THREE.Mesh(back, backMaterial));
      const image = new THREE.PlaneGeometry(2.52, 2.58);
      const imageMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      geometries.push(image);
      materials.push(imageMaterial);
      const mesh = new THREE.Mesh(image, imageMaterial);
      mesh.position.set(0, 0.06, 0.015);
      frame.add(mesh);
      frame.position.set(
        (index - 1) * 3,
        index === 1 ? 0.1 : -0.03,
        index === 1 ? 0.25 : -0.1,
      );
      frame.rotation.y = (index - 1) * -0.15;
      frame.rotation.z = (index - 1) * -0.055;
      group.add(frame);
    });
    resize();
    draw();
    onReady();
  }
  void load().catch(() => {
    parent.dataset.ready = "false";
    dispose();
  });
  return dispose;
}
