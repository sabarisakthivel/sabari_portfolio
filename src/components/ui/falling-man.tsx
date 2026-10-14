"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Mixamo "Remy", converted and compressed from assets-src/Remy.fbx (~630 KB). */
const MODEL_URL = "/models/remy.glb";

/** On-screen height of the figure in world units. */
const HEIGHT = 3.2;

/** How far he drops, as a share of the visible height, by the time he is covered. */
const DROP = 0.9;

/** Frame time the pose freezes at under reduced motion — a balanced silhouette. */
const STILL_T = 0;

type Three = typeof import("three");
type Vec3 = InstanceType<Three["Vector3"]>;

/**
 * Laptop centre relative to his hips, in body axes (x = his left, y = toward
 * head, z = his front) and world units at HEIGHT 3.2: just above the thighs.
 */
const LAPTOP_AT = { x: 0, y: 0.14, z: 0.46 };

/** Base footprint and thickness; the lid shares the footprint. */
const LAPTOP_W = 0.78;
const LAPTOP_D = 0.52;
const LAPTOP_T = 0.035;

/**
 * Yaw that looks over his shoulder onto the screen, and how far he sways
 * either side of it. A full spin hid the screen half the time.
 */
const VIEW_YAW = Math.PI;
const SWAY = 0.5;

/** How far past upright the lid leans away from him, in radians. */
const LID_LEAN = 0.32;

/**
 * Editor-style screen: a dark ground with indented lines of syntax-coloured
 * bars. Drawn once to a canvas, so it costs one small texture.
 */
function drawScreen(css: CSSStyleDeclaration): HTMLCanvasElement {
  const read = (name: string) => css.getPropertyValue(name).trim();
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = read("--fg");
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const palette = [
    read("--accent"),
    read("--syntax-str"),
    read("--syntax-num"),
    read("--fg-faint"),
  ];
  // indent, then segment widths per line — a shape, not real code
  const lines: [number, number[]][] = [
    [0, [90, 140]], [1, [60, 110, 70]], [2, [150, 50]], [2, [80, 120]],
    [1, [40]], [1, [110, 90, 40]], [2, [70, 160]], [3, [120]], [2, [60, 60]],
    [1, [40]], [0, [30]], [0, [100, 80]],
  ];
  let y = 26;
  lines.forEach(([indent, segments], row) => {
    let x = 26 + indent * 28;
    segments.forEach((width, index) => {
      ctx.fillStyle = palette[(row + index) % palette.length];
      ctx.fillRect(x, y, width, 10);
      x += width + 12;
    });
    y += 24;
  });
  return canvas;
}

/**
 * The laptop, in its own body-axis frame: base centred on the origin, lid
 * hinged on the far edge and opened back toward him, screen facing him.
 * `grip(side, out)` writes the world position of the base's left (-1) or
 * right (+1) edge — where each hand takes hold.
 */
function buildLaptop(
  THREE: Three,
  token: (name: string) => InstanceType<Three["Color"]>,
  css: CSSStyleDeclaration,
) {
  const group = new THREE.Group();
  // brushed aluminium
  const shell = new THREE.MeshStandardMaterial({
    color: token("--bg-elev-2"),
    roughness: 0.35,
    metalness: 0.55,
  });

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(LAPTOP_W, LAPTOP_T, LAPTOP_D),
    shell,
  );
  group.add(base);

  // hinge on the far edge; the lid stands up from it and leans away a little
  const hinge = new THREE.Group();
  hinge.position.set(0, LAPTOP_T / 2, LAPTOP_D / 2);
  hinge.rotation.x = LID_LEAN;
  group.add(hinge);

  const lid = new THREE.Mesh(
    new THREE.BoxGeometry(LAPTOP_W, LAPTOP_D, LAPTOP_T * 0.7),
    shell,
  );
  lid.position.set(0, LAPTOP_D / 2, 0);
  hinge.add(lid);

  // Unlit, so it reads as a glowing panel whatever the scene lighting does.
  const screenTexture = new THREE.CanvasTexture(drawScreen(css));
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(LAPTOP_W * 0.92, LAPTOP_D * 0.88),
    new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }),
  );
  screen.rotation.y = Math.PI; // face back toward him
  screen.position.set(0, LAPTOP_D / 2, -(LAPTOP_T * 0.35 + 0.002));
  hinge.add(screen);

  // the screen's glow on his face and hands
  const glow = new THREE.PointLight(token("--accent"), 2.5, 2.2, 2);
  glow.position.set(0, LAPTOP_D * 0.5, -0.25);
  hinge.add(glow);

  const local = new THREE.Vector3();
  const grip = (side: -1 | 1, out: Vec3) => {
    // his left is +x in body axes; grab just behind the middle of each side
    local.set(-side * (LAPTOP_W / 2), 0, -LAPTOP_D * 0.1);
    group.updateMatrixWorld(true);
    return out.copy(group.localToWorld(local));
  };

  return { group, grip };
}

/**
 * The falling figure behind the first screen, ported from Motion.html.
 *
 * The canvas is fixed to the viewport. `scrollTarget` is the spacer it belongs
 * to: as that spacer scrolls away he drops and spins faster, while the opaque
 * page layer slides up over him. Once the spacer is gone the loop stops and the
 * canvas is hidden, so WebGL only costs anything on the first screen.
 *
 * three.js and the model load in a dynamic import on mount — during the deploy
 * intro — so neither touches the initial bundle. No animation clip: every
 * frame aims each limb by hand, which works on any Mixamo skeleton.
 */
export function FallingMan({
  scrollTargetId,
  className,
}: {
  scrollTargetId: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const target = document.getElementById(scrollTargetId);
    if (!canvas || !target) return;

    let disposed = false;
    const cleanups: (() => void)[] = [];

    void (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import(
        "three/examples/jsm/loaders/GLTFLoader.js"
      );
      const { MeshoptDecoder } = await import(
        "three/examples/jsm/libs/meshopt_decoder.module.js"
      );
      if (disposed) return;

      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const css = getComputedStyle(document.documentElement);
      const token = (name: string) =>
        new THREE.Color(css.getPropertyValue(name).trim());

      // ---------- renderer, camera, lights ----------
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
      renderer.setClearColor(0x000000, 0);
      // Phones have dense screens and weak GPUs; 1.5x is indistinguishable here.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

      // Intensities are Motion.html's ×π: three dropped legacy light units.
      scene.add(
        new THREE.HemisphereLight(token("--bg-elev"), token("--bg-elev-2"), 3.5),
      );
      const key = new THREE.DirectionalLight(token("--bg-elev"), 6.9);
      key.position.set(3, 5, 6);
      const fill = new THREE.DirectionalLight(token("--bg-elev"), 1.9);
      fill.position.set(-5, 0, 4);
      const rim = new THREE.DirectionalLight(token("--accent"), 7.9);
      rim.position.set(-4, 2, -5);
      scene.add(key, fill, rim);

      // drop (scroll offset) > spin (vertical-axis tumble) > outer (diagonal
      // tilt) > pivot (body orientation) > model
      const drop = new THREE.Group();
      const spin = new THREE.Group();
      const outer = new THREE.Group();
      const pivot = new THREE.Group();
      drop.add(spin);
      spin.add(outer);
      outer.add(pivot);
      scene.add(drop);

      // ---------- helpers ----------
      type Bone = InstanceType<typeof THREE.Bone>;
      const bones: Record<string, Bone> = {};
      const rest = new Map<Bone, InstanceType<typeof THREE.Quaternion>>();
      const qBody = new THREE.Quaternion();
      const qBodyInv = new THREE.Quaternion();
      const vA = new THREE.Vector3();
      const vB = new THREE.Vector3();
      const qq = new THREE.Quaternion();
      const wq = new THREE.Quaternion();
      const pq = new THREE.Quaternion();
      const euler = new THREE.Euler(0, 0, 0, "YXZ");
      const qD = new THREE.Quaternion();

      const wp = (k: string) => bones[k].getWorldPosition(new THREE.Vector3());
      // direction in body space (x = his left, y = toward head, z = his front) → world
      const dir = (x: number, y: number, z: number) =>
        new THREE.Vector3(x, y, z).normalize().applyQuaternion(qBody);

      // rotate a bone so it points from itself toward its child along `d`
      const aim = (bk: string, ck: string, d: InstanceType<typeof THREE.Vector3>) => {
        const b = bones[bk];
        const c = bones[ck];
        if (!b || !c || !b.parent) return;
        b.getWorldPosition(vA);
        c.getWorldPosition(vB);
        vB.sub(vA);
        if (vB.lengthSq() < 1e-10) return;
        vB.normalize();
        qq.setFromUnitVectors(vB, d);
        b.getWorldQuaternion(wq);
        wq.premultiply(qq);
        b.parent.getWorldQuaternion(pq);
        b.quaternion.copy(pq.invert().multiply(wq));
        b.updateMatrixWorld(true);
      };

      // ---------- load the character ----------
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      let gltf: Awaited<ReturnType<typeof loader.loadAsync>>;
      try {
        gltf = await loader.loadAsync(MODEL_URL);
      } catch {
        renderer.dispose();
        return; // purely decorative — an empty first screen is the fallback
      }
      if (disposed) {
        renderer.dispose();
        return;
      }

      const model = gltf.scene;
      pivot.add(model);
      model.traverse((o) => {
        if ((o as InstanceType<typeof THREE.Mesh>).isMesh) {
          o.frustumCulled = false;
          // The converter drops the lash opacity map; opaque lashes read as smudges.
          if (/eyelash/i.test(o.name)) o.visible = false;
        }
        if ((o as Bone).isBone) {
          const k = o.name
            .replace(/[^a-z0-9]/gi, "")
            .toLowerCase()
            .replace(/^mixamorig\d*/, "");
          if (!bones[k]) bones[k] = o as Bone;
          rest.set(o as Bone, o.quaternion.clone());
        }
      });
      if (!bones.hips || !bones.head || !bones.leftarm || !bones.rightarm) {
        renderer.dispose();
        return;
      }

      // scale to HEIGHT from the skeleton itself (reliable for any rig)
      scene.updateMatrixWorld(true);
      const top = bones.headtopend ? wp("headtopend") : wp("head");
      const foot = bones.lefttoebase
        ? wp("lefttoebase")
        : bones.leftfoot
          ? wp("leftfoot")
          : wp("hips");
      model.scale.multiplyScalar(HEIGHT / Math.max(top.distanceTo(foot), 1e-6));
      scene.updateMatrixWorld(true);
      model.position.sub(wp("hips")); // rotate around his hips
      scene.updateMatrixWorld(true);

      // which way his body faces in the rest pose
      const up = wp("head").sub(wp("hips")).normalize();
      let left = wp("leftarm").sub(wp("rightarm")).normalize();
      const front = new THREE.Vector3().crossVectors(left, up).normalize();
      left = new THREE.Vector3().crossVectors(up, front).normalize();
      qBody.setFromRotationMatrix(new THREE.Matrix4().makeBasis(left, up, front));
      qBodyInv.copy(qBody).invert();

      // ---------- laptop on his lap ----------
      // Built from boxes rather than shipped as a model. It hangs off `pivot`,
      // whose origin is his hips, so it tumbles with him; its axes are his body
      // axes (x = his left, y = toward head, z = his front).
      const laptop = buildLaptop(THREE, token, css);
      laptop.group.quaternion.copy(qBody);
      laptop.group.position
        .set(LAPTOP_AT.x, LAPTOP_AT.y, LAPTOP_AT.z)
        .applyQuaternion(qBody);
      pivot.add(laptop.group);

      const gripL = new THREE.Vector3();
      const gripR = new THREE.Vector3();
      const towards = (from: string, to: InstanceType<typeof THREE.Vector3>) =>
        to.clone().sub(wp(from)).normalize();

      // ---------- falling pose: sitting into the fall, working on the laptop ----------
      const pose = (t: number) => {
        rest.forEach((q, b) => b.quaternion.copy(q));
        spin.position.set(0, 0, 0);
        spin.rotation.set(0, 0, 0);
        outer.rotation.set(0, 0, 0);
        pivot.quaternion.identity();
        scene.updateMatrixWorld(true);

        const w = (k: number) => Math.sin(t * k);
        const j = (k: number) => 0.05 * Math.sin(t * k); // fast wind flutter
        // hunched over the screen, head tipped down to read it
        aim("spine2", "neck", dir(0, 1, 0.18 + j(7)));
        aim("head", "headtopend", dir(0, 0.7, 0.75 + j(9)));
        // elbows out and down, then each forearm reaches for a side of the base
        laptop.grip(-1, gripL);
        laptop.grip(1, gripR);
        aim("leftarm", "leftforearm", dir(0.45, -0.7 + j(13), 0.35));
        aim("leftforearm", "lefthand", towards("leftforearm", gripL));
        aim("rightarm", "rightforearm", dir(-0.45, -0.7 + j(12), 0.35));
        aim("rightforearm", "righthand", towards("rightforearm", gripR));
        // seated: thighs forward to make a lap, shins hanging; the right leg
        // kicks loose in the wind
        aim("leftupleg", "leftleg", dir(0.16, -0.12 + j(11), 1));
        aim("leftleg", "leftfoot", dir(0.06, -1, 0.18 + 0.12 * w(3.6)));
        aim("rightupleg", "rightleg", dir(-0.18, -0.2 + 0.1 * w(2.9), 0.95));
        aim("rightleg", "rightfoot", dir(-0.08, -0.7, 0.55 + 0.25 * w(4.1) + j(9)));

        // head-down diagonal, chest facing the sky, swaying
        euler.set(-1.15 + 0.12 * Math.sin(t * 0.9), 1 + 0.2 * Math.sin(t * 0.6), 0);
        qD.setFromEuler(euler);
        pivot.quaternion.copy(qD).multiply(qBodyInv);
        outer.rotation.z = 1 + 0.15 * Math.sin(t * 0.7);
        // sway around the over-the-shoulder view rather than spinning, so the
        // screen stays readable
        spin.rotation.y = VIEW_YAW + SWAY * Math.sin(t * 0.35);
        spin.position.set(
          // air buffeting
          0.04 * Math.sin(t * 17) + 0.03 * Math.sin(t * 23),
          0.05 * Math.sin(t * 19) + 0.03 * Math.sin(t * 29),
          0,
        );
      };

      // ---------- layout ----------
      let viewHeight = 1; // visible world height at the figure's depth
      const size = () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // Portrait phones need the camera further back to fit his full span.
        const z = camera.aspect < 0.8 ? 14.5 : 10;
        camera.position.set(0, 0, z);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        viewHeight = 2 * z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      };
      const resizeObserver = new ResizeObserver(size);
      resizeObserver.observe(canvas);
      size();

      // ---------- scroll ----------
      // 0 while the first screen is fully shown, 1 once it has scrolled away.
      const progress = () => {
        const rect = target.getBoundingClientRect();
        return Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
      };

      // ---------- loop ----------
      let t = reduce ? STILL_T : 0;
      let last = performance.now();
      let raf = 0;
      let running = false;

      const render = () => {
        const p = progress();
        // ease-in: he hangs for a beat, then gravity takes him
        drop.position.y = reduce ? 0 : -p * p * viewHeight * DROP;
        pose(t);
        renderer.render(scene, camera);
        return p;
      };

      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const p = progress();
        // the spin quickens as he falls
        t += dt * (1 + p * 1.5);
        render();
        raf = requestAnimationFrame(frame);
      };

      const start = () => {
        if (running || reduce) return;
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(raf);
      };

      // Only animate while the first screen is on screen and the tab is visible.
      const sync = () => {
        const visible = progress() < 1 && document.visibilityState === "visible";
        canvas.style.visibility = progress() < 1 ? "visible" : "hidden";
        if (reduce) {
          if (visible) render();
          return;
        }
        if (visible) start();
        else stop();
      };

      window.addEventListener("scroll", sync, { passive: true });
      document.addEventListener("visibilitychange", sync);
      const onResize = () => {
        size();
        if (reduce) render();
      };
      window.addEventListener("resize", onResize);

      render();
      sync();
      setReady(true);

      cleanups.push(() => {
        stop();
        resizeObserver.disconnect();
        window.removeEventListener("scroll", sync);
        document.removeEventListener("visibilitychange", sync);
        window.removeEventListener("resize", onResize);
        scene.traverse((o) => {
          const mesh = o as InstanceType<typeof THREE.Mesh>;
          if (!mesh.isMesh) return;
          mesh.geometry.dispose();
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          materials.forEach((mat) => {
            Object.values(mat).forEach((value) => {
              if (value instanceof THREE.Texture) value.dispose();
            });
            mat.dispose();
          });
        });
        renderer.dispose();
      });
    })();

    return () => {
      disposed = true;
      cleanups.forEach((fn) => fn());
    };
  }, [scrollTargetId]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "transition-opacity duration-700 ease-out",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}
