/**
 * 3D автошколы на Three.js.
 *
 * Всё процедурное: ни одной внешней модели. buildCar() собирает седан из
 * профиля кузова, стёкол, колёс, тормозов, подвески, двигателя и коробки.
 * createHeroScene() ставит его на ночную трассу, createVehicleScene() —
 * на подиум с explode-анимацией и HTML-хотспотами.
 *
 * Оба рендера уважают prefers-reduced-motion, ограничивают DPR до 2 и
 * останавливаются, когда canvas вне вьюпорта или вкладка скрыта.
 */

import * as THREE from "three";
import { gsap } from "gsap";

const DPR = () => Math.min(window.devicePixelRatio || 1, 2);

const COLORS = {
  paint: 0xd9f99d,
  paintDark: 0x93b45a,
  dark: 0x14171a,
  glass: 0x0b1a1c,
  chrome: 0xc9d4c9,
  rubber: 0x0a0b0c,
  light: 0xfff6cf,
  red: 0xff4d5e,
  floor: 0x0b0d0f,
};

function makeMaterials() {
  return {
    paint: new THREE.MeshPhysicalMaterial({
      color: COLORS.paint,
      metalness: 0.5,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
    }),
    paintDark: new THREE.MeshStandardMaterial({
      color: COLORS.paintDark,
      metalness: 0.55,
      roughness: 0.42,
    }),
    dark: new THREE.MeshStandardMaterial({
      color: COLORS.dark,
      metalness: 0.55,
      roughness: 0.52,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: COLORS.glass,
      metalness: 0.35,
      roughness: 0.08,
      transparent: true,
      opacity: 0.82,
    }),
    chrome: new THREE.MeshStandardMaterial({
      color: COLORS.chrome,
      metalness: 0.92,
      roughness: 0.2,
    }),
    rubber: new THREE.MeshStandardMaterial({
      color: COLORS.rubber,
      roughness: 0.96,
      metalness: 0.02,
    }),
    light: new THREE.MeshStandardMaterial({
      color: COLORS.light,
      emissive: 0xffe9a8,
      emissiveIntensity: 3.2,
      toneMapped: false,
    }),
    red: new THREE.MeshStandardMaterial({
      color: COLORS.red,
      emissive: 0xff2a3d,
      emissiveIntensity: 2.4,
      toneMapped: false,
    }),
  };
}

function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cylinder(radius, height, material, segments = 20) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, segments),
    material
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeWheel(materials) {
  const group = new THREE.Group();

  const tyre = cylinder(0.35, 0.26, materials.rubber, 26);
  tyre.rotation.x = Math.PI / 2;
  group.add(tyre);

  const rim = cylinder(0.215, 0.265, materials.chrome, 22);
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  const hub = cylinder(0.055, 0.29, materials.dark, 12);
  hub.rotation.x = Math.PI / 2;
  group.add(hub);

  for (let i = 0; i < 5; i += 1) {
    for (const side of [-1, 1]) {
      const spoke = box(0.035, 0.31, 0.02, materials.dark);
      spoke.rotation.z = (i / 5) * Math.PI * 2;
      spoke.position.z = side * 0.135;
      group.add(spoke);
    }
  }

  return group;
}

function makeBrake(materials) {
  const group = new THREE.Group();
  const disc = cylinder(0.225, 0.032, materials.chrome, 24);
  disc.rotation.x = Math.PI / 2;
  group.add(disc);

  const caliper = box(0.06, 0.16, 0.11, materials.dark, 0, 0.12, 0.055);
  group.add(caliper);

  return group;
}

function makeSuspension(materials) {
  const group = new THREE.Group();

  const strut = cylinder(0.038, 0.52, materials.chrome, 12);
  strut.position.y = 0.24;
  group.add(strut);

  const spring = new THREE.Mesh(
    new THREE.TorusGeometry(0.085, 0.016, 6, 18),
    materials.paintDark
  );
  spring.rotation.x = Math.PI / 2;
  spring.position.y = 0.16;
  group.add(spring);

  const arm = box(0.07, 0.05, 0.46, materials.dark, 0, -0.16, 0.18);
  group.add(arm);

  return group;
}

/**
 * Седан: кузов-профиль, стёкла, 4 колеса, тормоза, подвеска, двигатель,
 * коробка и салон. Возвращает root и anchors для хотспотов.
 */
export function buildCar() {
  const materials = makeMaterials();
  const root = new THREE.Group();
  const explodable = [];
  const anchors = {};

  const body = new THREE.Group();
  root.add(body);

  const shape = new THREE.Shape();
  shape.moveTo(-2.15, 0.33);
  shape.lineTo(-2.15, 0.74);
  shape.lineTo(-1.98, 0.95);
  shape.lineTo(-1.16, 0.99);
  shape.lineTo(-0.55, 1.38);
  shape.lineTo(0.42, 1.4);
  shape.lineTo(1.03, 1.0);
  shape.lineTo(1.95, 0.93);
  shape.lineTo(2.14, 0.74);
  shape.lineTo(2.14, 0.33);
  shape.closePath();

  const bodyGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 1.62,
    bevelEnabled: true,
    bevelThickness: 0.055,
    bevelSize: 0.055,
    bevelSegments: 3,
    steps: 1,
  });
  bodyGeo.translate(0, 0, -0.81);

  const shell = new THREE.Mesh(bodyGeo, materials.paint);
  shell.castShadow = true;
  shell.receiveShadow = true;
  body.add(shell);

  body.add(box(4.16, 0.16, 1.66, materials.dark, 0, 0.3, 0));
  body.add(box(0.04, 0.16, 0.86, materials.dark, 2.14, 0.55, 0));
  body.add(box(0.05, 0.13, 0.34, materials.light, 2.145, 0.69, 0.53));
  body.add(box(0.05, 0.13, 0.34, materials.light, 2.145, 0.69, -0.53));
  body.add(box(0.05, 0.1, 0.42, materials.red, -2.16, 0.77, 0.51));
  body.add(box(0.05, 0.1, 0.42, materials.red, -2.16, 0.77, -0.51));

  for (const side of [-1, 1]) {
    const mirror = box(0.17, 0.075, 0.13, materials.dark, 0.72, 1.03, side * 0.98);
    body.add(mirror);
    body.add(box(0.09, 0.04, 0.12, materials.dark, 0.7, 1.0, side * 0.93));
  }

  /* --------------------------------------------------------------- cabin */
  const cabin = new THREE.Group();
  root.add(cabin);

  const windowShape = new THREE.Shape();
  windowShape.moveTo(-0.52, 1.02);
  windowShape.lineTo(0.3, 1.35);
  windowShape.lineTo(0.93, 1.02);
  windowShape.closePath();

  const windowGeo = new THREE.ExtrudeGeometry(windowShape, {
    depth: 0.02,
    bevelEnabled: false,
  });

  for (const side of [-1, 1]) {
    const windowMesh = new THREE.Mesh(windowGeo, materials.glass);
    windowMesh.position.z = side === 1 ? 0.868 : -0.888;
    windowMesh.castShadow = false;
    cabin.add(windowMesh);
  }

  const windshield = box(0.03, 0.66, 1.5, materials.glass, 0.73, 1.19, 0);
  windshield.rotation.z = 0.55;
  cabin.add(windshield);

  const rearGlass = box(0.03, 0.58, 1.46, materials.glass, -0.86, 1.18, 0);
  rearGlass.rotation.z = -0.55;
  cabin.add(rearGlass);

  cabin.add(box(0.26, 0.16, 1.42, materials.dark, 0.6, 0.99, 0));
  cabin.add(box(0.18, 0.34, 0.42, materials.dark, -0.12, 0.83, 0.38));
  cabin.add(box(0.18, 0.34, 0.42, materials.dark, -0.12, 0.83, -0.38));
  cabin.add(box(0.12, 0.46, 0.42, materials.dark, -0.27, 1.02, 0.38));
  cabin.add(box(0.12, 0.46, 0.42, materials.dark, -0.27, 1.02, -0.38));

  const steering = new THREE.Mesh(
    new THREE.TorusGeometry(0.13, 0.02, 8, 22),
    materials.dark
  );
  steering.position.set(0.52, 1.03, -0.34);
  steering.rotation.y = Math.PI / 2;
  steering.rotation.z = 0.2;
  cabin.add(steering);

  cabin.userData.base = cabin.position.clone();
  cabin.userData.explode = new THREE.Vector3(0, 1.92, 0);
  explodable.push(cabin);
  anchors.cabin = cabin;

  /* -------------------------------------------------------------- engine */
  const engine = new THREE.Group();
  engine.position.set(1.32, 0.62, 0);
  root.add(engine);

  engine.add(box(0.74, 0.46, 0.64, materials.dark));
  engine.add(box(0.68, 0.09, 0.56, materials.chrome, 0, 0.27, 0));
  engine.add(box(0.5, 0.05, 0.1, materials.paintDark, 0.02, 0.32, 0));

  for (let i = 0; i < 4; i += 1) {
    engine.add(
      box(0.06, 0.18, 0.07, materials.chrome, -0.26 + i * 0.17, 0.38, 0.2)
    );
  }

  const alternator = cylinder(0.075, 0.12, materials.chrome, 14);
  alternator.rotation.z = Math.PI / 2;
  alternator.position.set(0.38, 0.1, -0.2);
  engine.add(alternator);

  engine.add(box(0.12, 0.06, 0.12, materials.paintDark, 0.22, 0.33, -0.2));

  engine.userData.base = engine.position.clone();
  engine.userData.explode = new THREE.Vector3(0.85, 1.55, 0);
  explodable.push(engine);
  anchors.engine = engine;

  /* -------------------------------------------------------- transmission */
  const transmission = new THREE.Group();
  transmission.position.set(0.5, 0.4, 0);
  root.add(transmission);

  const gearbox = cylinder(0.2, 0.52, materials.chrome, 18);
  gearbox.rotation.z = Math.PI / 2;
  transmission.add(gearbox);

  const bell = cylinder(0.27, 0.1, materials.dark, 20);
  bell.rotation.z = Math.PI / 2;
  bell.position.x = 0.3;
  transmission.add(bell);

  const shaft = cylinder(0.05, 0.34, materials.chrome, 12);
  shaft.rotation.z = Math.PI / 2;
  shaft.position.x = -0.42;
  transmission.add(shaft);

  transmission.userData.base = transmission.position.clone();
  transmission.userData.explode = new THREE.Vector3(0, -1.15, 0.35);
  explodable.push(transmission);
  anchors.transmission = transmission;

  /* ------------------------------------------- колёса, тормоза, подвеска */
  const wheelPositions = [
    [1.38, 0.85],
    [1.38, -0.85],
    [-1.38, 0.85],
    [-1.38, -0.85],
  ];

  let frontRight = null;
  let frontLeftBrake = null;
  let rearLeftSuspension = null;

  for (const [x, z] of wheelPositions) {
    const wheel = makeWheel(materials);
    wheel.position.set(x, 0.35, z);
    root.add(wheel);
    wheel.userData.base = wheel.position.clone();
    wheel.userData.explode = new THREE.Vector3(0, 0.1, Math.sign(z) * 2.15);
    explodable.push(wheel);
    if (x > 0 && z < 0) frontRight = wheel;

    const brake = makeBrake(materials);
    brake.position.set(x, 0.35, z * 0.76);
    root.add(brake);
    brake.userData.base = brake.position.clone();
    brake.userData.explode = new THREE.Vector3(0, 0, Math.sign(z) * 1.35);
    explodable.push(brake);
    if (x > 0 && z > 0) frontLeftBrake = brake;

    const suspension = makeSuspension(materials);
    suspension.position.set(x, 0.46, z * 0.62);
    root.add(suspension);
    suspension.userData.base = suspension.position.clone();
    suspension.userData.explode = new THREE.Vector3(0, -0.85, Math.sign(z) * 0.85);
    explodable.push(suspension);
    if (x < 0 && z > 0) rearLeftSuspension = suspension;
  }

  anchors.wheels = frontRight;
  anchors.brakes = frontLeftBrake;
  anchors.suspension = rearLeftSuspension;

  root.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  return { root, explodable, anchors, materials };
}

function applyExplode(items, k) {
  for (const item of items) {
    item.position.copy(item.userData.base).addScaledVector(item.userData.explode, k);
  }
}

function makeRenderer(canvas, alpha) {
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(DPR());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return renderer;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ hero */

export function createHeroScene(canvas, options = {}) {
  const reduced = Boolean(options.reducedMotion);
  const renderer = makeRenderer(canvas, false);
  if (!renderer) return { ok: false };

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07080a);
  scene.fog = new THREE.FogExp2(0x07080a, 0.026);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120);
  const base = new THREE.Vector3(5.05, 2.35, 6.55);
  const target = new THREE.Vector3(0.1, 0.82, 0);
  camera.position.copy(base);
  camera.lookAt(target);

  const hemi = new THREE.HemisphereLight(0x9fc8ff, 0x0a0c0a, 0.5);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xfff1cf, 2.6);
  key.position.set(-7, 9, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 30;
  key.shadow.camera.left = -8;
  key.shadow.camera.right = 8;
  key.shadow.camera.top = 8;
  key.shadow.camera.bottom = -8;
  key.shadow.bias = -0.0012;
  key.shadow.camera.updateProjectionMatrix();
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xa8ff9a, 1.5);
  rim.position.set(5, 4, -7);
  scene.add(rim);

  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 17),
    new THREE.MeshStandardMaterial({ color: 0x0c0e11, roughness: 0.88, metalness: 0.08 })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.y = -0.02;
  road.receiveShadow = true;
  scene.add(road);

  const shoulderMat = new THREE.MeshStandardMaterial({
    color: 0x080a09,
    roughness: 0.95,
  });
  for (const side of [-1, 1]) {
    const shoulder = new THREE.Mesh(new THREE.PlaneGeometry(80, 12), shoulderMat);
    shoulder.rotation.x = -Math.PI / 2;
    shoulder.position.set(0, -0.03, side * 14.5);
    scene.add(shoulder);
  }

  const dashMat = new THREE.MeshBasicMaterial({ color: 0xb9b184 });
  const dashes = [];
  for (const z of [-3.1, 3.1]) {
    for (let x = -34; x <= 34; x += 5.4) {
      const dash = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.012, 0.1), dashMat);
      dash.position.set(x, 0.01, z);
      scene.add(dash);
      dashes.push(dash);
    }
  }

  const edgeMat = new THREE.MeshBasicMaterial({ color: 0x4f5a45 });
  for (const z of [-6.7, 6.7]) {
    for (let x = -34; x <= 34; x += 4) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.5), edgeMat);
      post.position.set(x, 0.02, z);
      scene.add(post);
    }
  }

  /* street lights */
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x23282a, metalness: 0.7, roughness: 0.5 });
  for (const x of [-15, 1, 16]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 6.4, 10), poleMat);
    pole.position.set(x, 3.2, -8.2);
    scene.add(pole);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.08), poleMat);
    arm.position.set(x + 0.7, 6.35, -8.2);
    scene.add(arm);
    const lamp = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.08, 0.24),
      new THREE.MeshBasicMaterial({ color: 0xffdfa3 })
    );
    lamp.position.set(x + 1.35, 6.3, -8.2);
    scene.add(lamp);
  }
  const lampA = new THREE.PointLight(0xffd39a, 26, 20, 2);
  lampA.position.set(2.35, 6.1, -8.2);
  scene.add(lampA);
  const lampB = new THREE.PointLight(0xffd39a, 18, 18, 2);
  lampB.position.set(-13.65, 6.1, -8.2);
  scene.add(lampB);

  /* stars */
  const starGeo = new THREE.BufferGeometry();
  const stars = new Float32Array(220 * 3);
  for (let i = 0; i < 220; i += 1) {
    stars[i * 3] = (Math.random() - 0.5) * 70;
    stars[i * 3 + 1] = 7 + Math.random() * 14;
    stars[i * 3 + 2] = -18 - Math.random() * 30;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(stars, 3));
  scene.add(
    new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0x9fb3a3, size: 0.07, sizeAttenuation: true })
    )
  );

  const car = buildCar();
  car.root.position.y = 0.02;
  car.root.rotation.y = -0.16;
  scene.add(car.root);

  for (const side of [-1, 1]) {
    const spot = new THREE.SpotLight(0xfff2c9, 45, 30, 0.44, 0.7, 1.6);
    spot.position.set(2.1, 0.72, side * 0.5);
    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(9, -0.4, side * 2.2);
    car.root.add(spotTarget);
    spot.target = spotTarget;
    car.root.add(spot);
  }

  const clock = new THREE.Clock();
  let visible = true;
  let running = !document.hidden;
  let pointerX = 0;
  let pointerY = 0;
  const parallax = { x: 0, y: 0 };

  function resize() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setPixelRatio(DPR());
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 720 ? 52 : 40;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    },
    { threshold: 0.02 }
  );
  io.observe(canvas);

  function onVisibility() {
    running = !document.hidden;
  }
  document.addEventListener("visibilitychange", onVisibility);

  function onPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    pointerY = (event.clientY - rect.top) / rect.height - 0.5;
  }
  window.addEventListener("pointermove", onPointer, { passive: true });

  function frame() {
    requestAnimationFrame(frame);
    if (!visible || !running) return;

    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    if (!reduced) {
      const speed = 9.5;
      for (const dash of dashes) {
        dash.position.x -= speed * dt;
        if (dash.position.x < -36) dash.position.x += 72;
      }
      car.root.traverse((node) => {
        if (node.userData && node.userData.base && node.userData.explode) {
          // колёса вращаются вокруг своей оси Z
          if (Math.abs(node.userData.explode.z) > 2) {
            node.rotation.z -= (speed * dt) / 0.35;
          }
        }
      });
      car.root.position.y = 0.02 + Math.sin(t * 2.1) * 0.008;
      lampA.intensity = 24 + Math.sin(t * 0.8) * 1.6;
    }

    parallax.x += (pointerX * 0.55 - parallax.x) * 0.04;
    parallax.y += (pointerY * 0.3 - parallax.y) * 0.04;
    camera.position.set(base.x + parallax.x, base.y - parallax.y, base.z);
    camera.lookAt(target);

    renderer.render(scene, camera);
  }

  if (!reduced) {
    gsap.fromTo(
      camera.position,
      { x: 8.6, y: 4.3, z: 10.4 },
      { x: base.x, y: base.y, z: base.z, duration: 1.9, ease: "power3.out" }
    );
    gsap.fromTo(
      car.root.rotation,
      { y: -1.1 },
      { y: -0.16, duration: 2.1, ease: "power3.out" }
    );
  }

  resize();
  frame();

  return {
    ok: true,
    dispose() {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      renderer.dispose();
    },
  };
}

/* --------------------------------------------------------------- vehicle */

export function createVehicleScene(canvas, options = {}) {
  const reduced = Boolean(options.reducedMotion);
  const renderer = makeRenderer(canvas, true);
  if (!renderer) {
    return {
      ok: false,
      setExploded() {},
      focus() {},
      setLabels() {},
      isExploded: () => false,
    };
  }

  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0b0d, 0.035);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
  camera.position.set(4.8, 3.15, 5.9);
  camera.lookAt(0, 0.85, 0);

  scene.add(new THREE.HemisphereLight(0xbfe0ff, 0x0b0d0a, 0.65));

  const key = new THREE.DirectionalLight(0xfff0cc, 2.4);
  key.position.set(-5, 8, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 26;
  key.shadow.camera.left = -7;
  key.shadow.camera.right = 7;
  key.shadow.camera.top = 7;
  key.shadow.camera.bottom = -7;
  key.shadow.camera.updateProjectionMatrix();
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xa8ff9a, 2);
  rim.position.set(4, 4, -6);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0x8fb6ff, 0.9);
  fill.position.set(6, 1, 4);
  scene.add(fill);

  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(7.4, 64),
    new THREE.MeshStandardMaterial({ color: 0x0a0c0a, roughness: 0.92, metalness: 0.1 })
  );
  disc.rotation.x = -Math.PI / 2;
  disc.receiveShadow = true;
  scene.add(disc);

  const grid = new THREE.GridHelper(15, 30, 0x3a4a2a, 0x1b2118);
  grid.position.y = 0.006;
  grid.material.transparent = true;
  grid.material.opacity = 0.55;
  scene.add(grid);

  const car = buildCar();
  car.root.rotation.y = -0.55;
  scene.add(car.root);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.44, 0.014, 8, 48),
    new THREE.MeshBasicMaterial({ color: COLORS.paint, toneMapped: false })
  );
  ring.visible = false;
  scene.add(ring);

  const markerHost = options.host;
  const markers = [];
  if (markerHost) {
    markerHost.innerHTML = "";
    Object.keys(car.anchors).forEach((id, index) => {
      const anchor = car.anchors[id];
      if (!anchor) return;
      const el = document.createElement("button");
      el.type = "button";
      el.className = "hotspot";
      el.dataset.part = id;
      el.innerHTML = `<span class="hotspot-num">${index + 1}</span><span class="hotspot-pulse"></span>`;
      markerHost.append(el);
      markers.push({ el, anchor });
    });

    markerHost.addEventListener("click", (event) => {
      const button = event.target.closest("[data-part]");
      if (button && options.onPartClick) options.onPartClick(button.dataset.part);
    });
  }

  let selected = null;
  let targetAnchor = null;
  const explodeState = { k: 0 };
  let exploded = false;
  const rotation = { yaw: -0.55, targetYaw: -0.55, pitch: 0, targetPitch: 0 };
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let idle = 0;
  let visible = true;

  function applyExplode() {
    applyExplodeTo(car.explodable, explodeState.k);
  }
  function applyExplodeTo(items, k) {
    for (const item of items) {
      item.position
        .copy(item.userData.base)
        .addScaledVector(item.userData.explode, k);
    }
  }

  function setExploded(next) {
    exploded = Boolean(next);
    if (reduced) {
      explodeState.k = exploded ? 1 : 0;
      applyExplode();
      return exploded;
    }
    gsap.to(explodeState, {
      k: exploded ? 1 : 0,
      duration: 1.15,
      ease: "power2.inOut",
      onUpdate: applyExplode,
    });
    return exploded;
  }

  function focus(id) {
    const anchor = car.anchors[id];
    if (!anchor) return;
    selected = id;
    targetAnchor = anchor;
    ring.visible = true;
  }

  function setLabels(labels = {}) {
    for (const { el, anchor } of markers) {
      const id = Object.keys(car.anchors).find((key) => car.anchors[key] === anchor);
      const label = labels[id] || id;
      el.setAttribute("aria-label", label);
      el.title = label;
    }
  }

  function resize() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setPixelRatio(DPR());
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 720 ? 46 : 34;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    },
    { threshold: 0.02 }
  );
  io.observe(canvas);

  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    idle = 0;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
    canvas.classList.add("is-dragging");
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    rotation.targetYaw += (event.clientX - lastX) * 0.008;
    rotation.targetPitch = Math.max(
      -0.14,
      Math.min(0.14, rotation.targetPitch + (event.clientY - lastY) * 0.002)
    );
    lastX = event.clientX;
    lastY = event.clientY;
  });

  function endDrag() {
    dragging = false;
    idle = 0;
    canvas.classList.remove("is-dragging");
  }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  const clock = new THREE.Clock();
  const world = new THREE.Vector3();

  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;

    const dt = Math.min(clock.getDelta(), 0.05);
    idle += dt;

    if (!dragging && idle > 2.6 && !reduced) rotation.targetYaw += dt * 0.12;

    rotation.yaw += (rotation.targetYaw - rotation.yaw) * 0.12;
    rotation.pitch += (rotation.targetPitch - rotation.pitch) * 0.12;
    car.root.rotation.y = rotation.yaw;
    car.root.rotation.x = rotation.pitch;

    scene.updateMatrixWorld(true);

    if (targetAnchor && ring.visible) {
      targetAnchor.getWorldPosition(world);
      ring.position.copy(world);
      ring.quaternion.copy(camera.quaternion);
      const pulse = reduced ? 1 : 1 + Math.sin(clock.elapsedTime * 3) * 0.06;
      ring.scale.setScalar(pulse);
    }

    if (markerHost) {
      const rect = canvas.getBoundingClientRect();
      for (const { el, anchor } of markers) {
        anchor.getWorldPosition(world);
        world.project(camera);
        const x = (world.x * 0.5 + 0.5) * rect.width;
        const y = (-world.y * 0.5 + 0.5) * rect.height;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        el.classList.toggle("is-off", world.z > 1);
        el.classList.toggle("is-active", el.dataset.part === selected);
      }
    }

    renderer.render(scene, camera);
  }

  if (!reduced) {
    gsap.fromTo(
      camera.position,
      { x: 6.4, y: 4.4, z: 7.6 },
      { x: 4.8, y: 3.15, z: 5.9, duration: 1.6, ease: "power3.out" }
    );
  }

  frame();

  return {
    ok: true,
    setExploded,
    focus,
    setLabels,
    isExploded: () => exploded,
    dispose() {
      ro.disconnect();
      io.disconnect();
      renderer.dispose();
    },
  };
}
