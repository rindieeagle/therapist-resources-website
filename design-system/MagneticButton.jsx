/* global React, Motion */
const { useRef, useState, useCallback, useEffect } = React;
const { motion, useMotionValue, useSpring, useTransform } = window.Motion;

/**
 * MagneticButton
 * - When the cursor enters within `radius` px of the button's edge,
 *   the button translates toward the cursor by `strength` (0..1).
 * - The inner label translates in the OPPOSITE direction at
 *   `parallax` of the button's offset (parallax / counter-drift).
 * - Press: scales to 0.95.
 * - Spring: stiffness 400, damping 20 (snappy).
 */
function MagneticButton({
  children = "Book a session",
  radius = 50,
  strength = 0.35,
  parallax = 0.5,
  spring = { stiffness: 400, damping: 20, mass: 0.6 },
  variant = "primary", // "primary" | "ghost" | "violet"
  onClick,
  showField = false,    // debug: render the magnetic field
  showVector = false,   // debug: render the offset vector
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  // Inner label drifts the opposite way at `parallax` strength.
  const tx = useTransform(sx, (v) => -v * parallax);
  const ty = useTransform(sy, (v) => -v * parallax);
  // Debug vector: counter-translate to stay anchored to the cursor.
  const vxNeg = useTransform(sx, (v) => -v);
  const vyNeg = useTransform(sy, (v) => -v);

  const [active, setActive] = useState(false);

  // Touch policy: on coarse pointers, magnetism is disabled (clean & predictable).
  const isCoarsePointer = typeof window !== "undefined"
    && window.matchMedia
    && window.matchMedia("(pointer: coarse)").matches;

  const handleMove = useCallback(
    (e) => {
      if (isCoarsePointer) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // Distance from cursor to nearest edge of the button.
      const halfW = rect.width / 2;
      const halfH = rect.height / 2;
      const edgeDx = Math.max(0, Math.abs(dx) - halfW);
      const edgeDy = Math.max(0, Math.abs(dy) - halfH);
      const edgeDist = Math.hypot(edgeDx, edgeDy);

      if (edgeDist <= radius) {
        // Falloff: full pull when inside the button, easing out to 0 at the radius edge.
        const falloff = 1 - edgeDist / radius;
        x.set(dx * strength * falloff);
        y.set(dy * strength * falloff);
        setActive(true);
      } else {
        x.set(0);
        y.set(0);
        setActive(false);
      }
    },
    [radius, strength, x, y, isCoarsePointer]
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setActive(false);
  }, [x, y]);

  useEffect(() => {
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
    };
  }, [handleMove, handleLeave]);

  const variantClass =
    variant === "ghost"
      ? "mb mb--ghost"
      : variant === "violet"
      ? "mb mb--violet"
      : "mb mb--primary";

  return (
    <div className="mb-wrap" style={{ position: "relative", display: "inline-block" }}>
      {showField && (
        <div
          className="mb-field"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: `-${radius}px`,
            borderRadius: 9999,
            border: "1px dashed rgba(6,182,212,0.45)",
            background:
              "radial-gradient(closest-side, rgba(6,182,212,0.08), rgba(6,182,212,0.0) 70%)",
            pointerEvents: "none",
            opacity: active ? 1 : 0.55,
            transition: "opacity 200ms cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      )}

      <motion.button
        ref={ref}
        type="button"
        className={variantClass}
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        transition={spring}
        style={{ x: sx, y: sy }}
        data-active={active ? "true" : "false"}
      >
        <motion.span className="mb-label" style={{ x: tx, y: ty }}>
          {children}
        </motion.span>

        {showVector && (
          <motion.span
            aria-hidden="true"
            className="mb-vector"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 6,
              height: 6,
              borderRadius: 9999,
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 0 0 2px rgba(6,182,212,0.6)",
              x: vxNeg,
              y: vyNeg,
              translateX: "-50%",
              translateY: "-50%",
            }}
          />
        )}
      </motion.button>
    </div>
  );
}

window.MagneticButton = MagneticButton;
