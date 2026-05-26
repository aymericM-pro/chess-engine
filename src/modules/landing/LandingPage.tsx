import { Button } from "@/shared/components/Button";

const pieces: Record<string, string> = {
  "00": "♜", "01": "♞", "02": "♝", "03": "♛", "04": "♚", "05": "♝", "06": "♞", "07": "♜",
  "10": "♟", "11": "♟", "12": "♟", "13": "♟", "14": "♟", "15": "♟", "16": "♟", "17": "♟",
  "60": "♙", "61": "♙", "62": "♙", "63": "♙", "64": "♙", "65": "♙", "66": "♙", "67": "♙",
  "70": "♖", "71": "♘", "72": "♗", "73": "♕", "74": "♔", "75": "♗", "76": "♘", "77": "♖",
};

function MiniBoard() {
  const squares = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isLight = (r + c) % 2 === 0;
      squares.push(
        <div
          key={`${r}${c}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            background: isLight ? "#d4a96a22" : "#1c1c22",
          }}
        >
          {pieces[`${r}${c}`] ?? ""}
        </div>
      );
    }
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        width: 200,
        height: 200,
        borderRadius: 8,
        overflow: "hidden",
        border: "2px solid #2e2e38",
        margin: "40px auto 0",
        opacity: 0.6,
      }}
    >
      {squares}
    </div>
  );
}

const css = `
  .lp-nav-link { font-size:15px; color:#fff; text-decoration:none; transition:color 0.2s; position:relative; padding-bottom:2px; }
  .lp-nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:var(--color-gold); transition:width 0.25s ease; }
  .lp-nav-link:hover { color:var(--color-gold); }
  .lp-nav-link:hover::after { width:100%; }
  .lp-feature-card { background:var(--color-bg-2); padding:36px 32px; transition:background 0.2s; display:flex; flex-direction:column; align-items:center; text-align:center; }
  .lp-feature-card:hover { background:var(--color-bg-3); }
  .lp-mode-card { background:var(--color-bg-2); border:1px solid var(--color-border); border-radius:12px; padding:36px 32px; transition:border-color 0.2s; display:flex; flex-direction:column; align-items:center; text-align:center; }
  .lp-mode-card:hover { border-color:var(--color-faint); }
  .lp-mode-card-featured { border-color:var(--color-accent-dk); background:rgba(201,169,110,0.04); }
`;

export function LandingPage() {
  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh" }}>

        {/* HERO */}
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 40px", maxWidth: 800, margin: "0 auto", boxSizing: "border-box" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.3)", borderRadius: 100, padding: "5px 14px", fontSize: 12, color: "var(--color-gold)", marginBottom: 32 }}>
            ★ 7 jours gratuits · Aucune carte requise
          </div>
          <h1 style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.12, marginBottom: 20, letterSpacing: "-0.025em" }}>
            Vos parties d&apos;échecs passent en <span style={{ color: "var(--color-gold)" }}>pilote automatique</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--color-text-muted)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.75 }}>
            Jouez en ligne, analysez avec Stockfish, progressez avec des leçons adaptées à votre niveau. Première partie en 48&nbsp;secondes.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 16 }}>
            <Button variant="landing-primary" label="Commencer à jouer" />
            <Button variant="landing-outline" label="Voir une démo" />
          </div>
          <p style={{ fontSize: 12, color: "var(--color-faint)" }}>7 jours gratuits · Annulation en 1 clic</p>
          <MiniBoard />
        </section>

        {/* STATS */}
        <div style={{ borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex" }}>
            {[
              { value: "2.4M+", label: "Parties jouées" },
              { value: "180k", label: "Joueurs actifs" },
              { value: "99.9%", label: "Disponibilité" },
              { value: "< 50ms", label: "Latence moyenne" },
            ].map((s, i, arr) => (
              <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "36px 24px", borderRight: i < arr.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: "var(--color-gold)", marginBottom: 6, letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "var(--color-text-muted)", letterSpacing: "0.02em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 52 }}>
            <div style={{ fontSize: 12, color: "var(--color-gold)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>Fonctionnalités</div>
            <h2 style={{ fontSize: 38, fontWeight: 700, marginBottom: 14, letterSpacing: "-0.02em", lineHeight: 1.15 }}>Tout ce dont vous avez besoin</h2>
            <p style={{ fontSize: 16, color: "var(--color-text-muted)", maxWidth: 500, lineHeight: 1.7 }}>De la partie rapide à l&apos;analyse approfondie, ChessMaster couvre chaque aspect de votre progression.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--color-border)", border: "1px solid var(--color-border)", borderRadius: 12, overflow: "hidden" }}>
            {[
              { icon: "♟", title: "Parties en ligne", desc: "Affrontez des joueurs du monde entier en temps réel. Matchmaking par ELO pour des parties équilibrées." },
              { icon: "⚙", title: "Analyse Stockfish", desc: "Analysez chaque coup avec le moteur n°1 mondial. Identifiez vos erreurs et comprenez les meilleures variantes." },
              { icon: "📈", title: "Suivi ELO", desc: "Votre progression en temps réel. Graphiques détaillés, historique complet et statistiques par ouverture." },
              { icon: "🎓", title: "Leçons adaptatives", desc: "Un curriculum personnalisé selon votre niveau. Ouvertures, tactiques, fins de partie — progressez méthodiquement." },
              { icon: "🏆", title: "Tournois", desc: "Participez à des tournois quotidiens, hebdomadaires et des championnats ouverts à tous les niveaux." },
              { icon: "📄", title: "Export PGN & PDF", desc: "Exportez vos parties en PGN ou générez un rapport PDF complet avec le replay et l'analyse intégrée." },
            ].map((f) => (
              <div key={f.title} className="lp-feature-card">
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "var(--color-gold)", marginBottom: 20 }}>{f.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{f.title}</div>
                <div style={{ fontSize: 15, color: "var(--color-text-muted)", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* MODES */}
        <section style={{ padding: "0 40px 80px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 12, color: "var(--color-gold)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>Cadences de jeu</div>
            <h2 style={{ fontSize: 38, fontWeight: 700, marginBottom: 14, letterSpacing: "-0.02em", lineHeight: 1.15 }}>Votre rythme, vos règles</h2>
            <p style={{ fontSize: 16, color: "var(--color-text-muted)", maxWidth: 460, lineHeight: 1.7 }}>Du bullet en 1 minute à la correspondance sur plusieurs jours.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {[
              { title: "Blitz", time: "3 + 2 · 5 + 0 minutes", desc: "La cadence parfaite — assez rapide pour l'adrénaline, assez lente pour réfléchir. Le format préféré des joueurs de club.", featured: true },
              { title: "Bullet", time: "1 + 0 · 2 + 1 minutes", desc: "Réflexes et intuition. Chaque seconde compte, chaque coup doit être instinctif. Pas pour les cardiaques.", featured: false },
              { title: "Rapide", time: "10 + 0 · 15 + 10 minutes", desc: "Prenez le temps de calculer. Le format idéal pour appliquer vos ouvertures et progresser techniquement.", featured: false },
              { title: "Correspondance", time: "1 à 7 jours par coup", desc: "Jouez à votre rythme. Analysez profondément, consultez des livres, prenez les meilleures décisions.", featured: false },
            ].map((m) => (
              <div key={m.title} className={`lp-mode-card${m.featured ? " lp-mode-card-featured" : ""}`}>
                {m.featured && <div style={{ display: "inline-block", background: "rgba(201,169,110,0.15)", color: "var(--color-gold)", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, marginBottom: 16, letterSpacing: "0.06em" }}>Le plus joué</div>}
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{m.title}</div>
                <div style={{ fontSize: 14, color: "var(--color-gold)", marginBottom: 16 }}>{m.time}</div>
                <div style={{ fontSize: 15, color: "var(--color-text-muted)", lineHeight: 1.6 }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 40px" }}>
          <div style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 16, padding: "72px 48px", textAlign: "center" }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 14, letterSpacing: "-0.02em" }}>Prêt à passer au niveau supérieur ?</h2>
            <p style={{ fontSize: 16, color: "var(--color-text-muted)", marginBottom: 36, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>
              Rejoignez 180&nbsp;000 joueurs qui progressent chaque jour sur ChessMaster.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <Button variant="landing-primary" label="Créer un compte gratuit" />
              <Button variant="landing-outline" label="Calculer ma progression" />
            </div>
            <p style={{ marginTop: 20, fontSize: 12, color: "var(--color-faint)" }}>7 jours gratuits · Annulation en 1 clic pendant l&apos;essai</p>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop: "1px solid var(--color-border)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, letterSpacing: "0.04em" }}>ChessMaster</div>
              <p style={{ fontSize: 12, color: "var(--color-faint)" }}>© 2026 ChessMaster. Tous droits réservés.</p>
            </div>
            <ul style={{ display: "flex", gap: 24, listStyle: "none", margin: 0, padding: 0 }}>
              {["Confidentialité", "CGU", "Contact", "API"].map((l) => (
                <li key={l}><a href="#" className="lp-nav-link" style={{ fontSize: 13 }}>{l}</a></li>
              ))}
            </ul>
          </div>
        </footer>

        {/* Lien vers l'app */}
        <div style={{ position: "fixed", bottom: 24, right: 24 }}>
          <Button to="/replay" variant="landing-floating" label="Ouvrir l'app →" />
        </div>

      </div>
    </>
  );
}
