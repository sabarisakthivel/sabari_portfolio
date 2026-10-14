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

      // ---------- falling pose: back-first, limbs pushed up by the air ----------
      const pose = (t: number) => {
        rest.forEach((q, b) => b.quaternion.copy(q));
        spin.position.set(0, 0, 0);
        spin.rotation.set(0, 0, 0);
        outer.rotation.set(0, 0, 0);
        pivot.quaternion.identity();
        scene.updateMatrixWorld(true);

        const w = (k: number) => Math.sin(t * k);
        const j = (k: number) => 0.07 * Math.sin(t * k); // fast wind flutter
        aim("spine2", "neck", dir(0, 1, 0.3 + j(7)));
        aim("head", "headtopend", dir(0, 0.8, 0.6 + j(9)));
        aim("leftarm", "leftforearm", dir(0.6 + 0.15 * w(5.3), 0.45 + 0.25 * w(4.1) + j(13), 0.65));
        aim("leftforearm", "lefthand", dir(0.3, 0.7 + 0.2 * w(6.2), 0.65 + j(15)));
        aim("rightarm", "rightforearm", dir(-0.6 - 0.15 * w(4.7), 0.4 + 0.25 * w(5.6) + j(12), 0.65));
        aim("rightforearm", "righthand", dir(-0.3, 0.7 + 0.2 * w(5.9), 0.65 + j(14)));
        aim("leftupleg", "leftleg", dir(0.22, -0.5 + 0.18 * w(3.3), 0.85 + j(11)));
        aim("leftleg", "leftfoot", dir(0.12, -0.95, 0.3 + 0.25 * w(4.6) + j(10)));
        aim("rightupleg", "rightleg", dir(-0.22, -0.75 + 0.18 * w(2.9), 0.6 + j(12)));
        aim("rightleg", "rightfoot", dir(-0.1, -0.75, -0.3 + 0.25 * w(4.1) + j(9)));

        // head-down diagonal, chest facing the sky, swaying
        euler.set(-1.15 + 0.12 * Math.sin(t * 0.9), 1 + 0.2 * Math.sin(t * 0.6), 0);
        qD.setFromEuler(euler);
        pivot.quaternion.copy(qD).multiply(qBodyInv);
        outer.rotation.z = 1 + 0.15 * Math.sin(t * 0.7);
        spin.rotation.y = t * 0.4; // continuous slow spin
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
