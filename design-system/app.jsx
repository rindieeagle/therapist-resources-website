/* global React, ReactDOM, MagneticButton, TweaksPanel, useTweaks, TweakSection, TweakSlider, TweakToggle, TweakRadio */
const { useState } = React;

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "radius": 50,
  "strength": 0.2,
  "parallax": 0.3,
  "stiffness": 400,
  "damping": 20,
  "showField": false,
  "showVector": false,
  "variant": "primary",
  "label": "Book a session"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(DEFAULTS);
  const [clicks, setClicks] = useState(0);

  const spring = {
    type: "spring",
    stiffness: tweaks.stiffness,
    damping: tweaks.damping,
    mass: 0.6,
  };

  return (
    <div className="page">
      {/* Eyebrow + title */}
      <header className="hero">
        <span className="tr-eyebrow">Component · Motion</span>
        <h1 className="tr-h1 title">
          Magnetic <span className="tr-grad-text">Button</span>
        </h1>
        <p className="tr-lead lede">
          A primary CTA that subtly attracts toward the cursor inside a 50&nbsp;px radius.
          Inside the button, the label drifts the opposite way for a parallax effect.
          Press to scale&nbsp;0.95. Snappy spring · stiffness {tweaks.stiffness} · damping {tweaks.damping}.
        </p>
      </header>

      {/* Stage */}
      <section className="stage">
        <div className="stage-grid">
          <div className="stage-cell" data-cell="primary">
            <span className="cell-eyebrow">Primary</span>
            <MagneticButton
              radius={tweaks.radius}
              strength={tweaks.strength}
              parallax={tweaks.parallax}
              spring={spring}
              variant="primary"
              showField={tweaks.showField}
              showVector={tweaks.showVector}
              onClick={() => setClicks((c) => c + 1)}
            >
              {tweaks.label}
            </MagneticButton>
          </div>

          <div className="stage-cell" data-cell="ghost">
            <span className="cell-eyebrow">Ghost</span>
            <MagneticButton
              radius={tweaks.radius}
              strength={tweaks.strength}
              parallax={tweaks.parallax}
              spring={spring}
              variant="ghost"
              showField={tweaks.showField}
              showVector={tweaks.showVector}
            >
              Learn more
            </MagneticButton>
          </div>

          <div className="stage-cell" data-cell="violet">
            <span className="cell-eyebrow">Enroll</span>
            <MagneticButton
              radius={tweaks.radius}
              strength={tweaks.strength}
              parallax={tweaks.parallax}
              spring={spring}
              variant="violet"
              showField={tweaks.showField}
              showVector={tweaks.showVector}
            >
              Enroll · $129
            </MagneticButton>
          </div>
        </div>

        <div className="stage-meta">
          <div className="meta-row">
            <span className="meta-key">radius</span><span className="meta-val">{tweaks.radius}px from edge</span>
          </div>
          <div className="meta-row">
            <span className="meta-key">pull</span><span className="meta-val">{Math.round(tweaks.strength * 100)}% of cursor offset</span>
          </div>
          <div className="meta-row">
            <span className="meta-key">parallax</span><span className="meta-val">−{Math.round(tweaks.parallax * 100)}% on label</span>
          </div>
          <div className="meta-row">
            <span className="meta-key">press</span><span className="meta-val">scale 0.95</span>
          </div>
          <div className="meta-row">
            <span className="meta-key">clicks</span><span className="meta-val">{clicks}</span>
          </div>
        </div>
      </section>

      {/* Spec */}
      <section className="spec">
        <h2 className="tr-h3 spec-title">Behavior spec</h2>
        <ol className="spec-list">
          <li>
            <span className="spec-num">01</span>
            <div>
              <strong>Magnetic field.</strong> When the pointer crosses within <code>radius</code> of any
              edge of the button, the button translates toward the pointer by{" "}
              <code>strength × cursorOffset</code>. Falloff is linear from 1 at the button edge to 0 at the radius edge.
            </div>
          </li>
          <li>
            <span className="spec-num">02</span>
            <div>
              <strong>Parallax label.</strong> The inner <code>span</code> translates by{" "}
              <code>-parallax × buttonOffset</code>, so it lags and counter-drifts against the chassis.
            </div>
          </li>
          <li>
            <span className="spec-num">03</span>
            <div>
              <strong>Active state.</strong> <code>whileTap={"{ scale: 0.95 }"}</code> shrinks the button on press.
            </div>
          </li>
          <li>
            <span className="spec-num">04</span>
            <div>
              <strong>Snappy spring.</strong> All motion uses{" "}
              <code>{`{ type: "spring", stiffness: ${tweaks.stiffness}, damping: ${tweaks.damping} }`}</code>.
            </div>
          </li>
        </ol>
      </section>

      <footer className="foot">
        <span className="tr-caption">Therapist Resources · motion library</span>
        <span className="tr-caption">Hover within the dashed ring to see the pull · toggle <em>Field</em> in Tweaks</span>
      </footer>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Magnetic field">
          <TweakSlider
            label="Radius (px from edge)"
            min={0} max={200} step={1}
            value={tweaks.radius}
            onChange={(v) => setTweak("radius", v)}
          />
          <TweakSlider
            label="Pull strength"
            min={0} max={1} step={0.01}
            value={tweaks.strength}
            onChange={(v) => setTweak("strength", v)}
          />
          <TweakSlider
            label="Label parallax"
            min={0} max={1} step={0.01}
            value={tweaks.parallax}
            onChange={(v) => setTweak("parallax", v)}
          />
        </TweakSection>

        <TweakSection title="Spring">
          <TweakSlider
            label="Stiffness"
            min={50} max={1000} step={10}
            value={tweaks.stiffness}
            onChange={(v) => setTweak("stiffness", v)}
          />
          <TweakSlider
            label="Damping"
            min={1} max={60} step={1}
            value={tweaks.damping}
            onChange={(v) => setTweak("damping", v)}
          />
        </TweakSection>

        <TweakSection title="Debug">
          <TweakToggle
            label="Show magnetic field"
            value={tweaks.showField}
            onChange={(v) => setTweak("showField", v)}
          />
          <TweakToggle
            label="Show offset dot"
            value={tweaks.showVector}
            onChange={(v) => setTweak("showVector", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
