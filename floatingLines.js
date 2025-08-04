const introParticles = (p) => {
  const MAX_LINES = 35;
  const LIFESPAN = 110; // total frames
  let lines = [];

  p.setup = function() {
    let c = p.createCanvas(p.windowWidth, p.windowHeight);
    c.parent('floating-lines');
    p.noFill();
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  function spawnLine() {
    const len = p.random(15, 40);
    const angle = p.random(p.TWO_PI);
    const x = p.random(len/2, p.width - len/2);
    const y = p.random(len/2, p.height - len/2);
    lines.push({
      x, y, len, angle,
      life: 0,
      total: LIFESPAN,
    });
  }

  p.draw = function() {
    p.clear();

    // Fade-in/out and draw lines
    for (let l of lines) {
      let fade = 1.0;
      if (l.life < 14) fade = p.map(l.life, 0, 14, 0, 1);
      else if (l.life > l.total - 16) fade = p.map(l.life, l.total - 16, l.total, 1, 0);

      p.stroke(255, 180 * fade);
      p.strokeWeight(2);

      const x0 = l.x - Math.cos(l.angle) * l.len / 2;
      const y0 = l.y - Math.sin(l.angle) * l.len / 2;
      const x1 = l.x + Math.cos(l.angle) * l.len / 2;
      const y1 = l.y + Math.sin(l.angle) * l.len / 2;
      p.line(x0, y0, x1, y1);

      l.life++;
    }

    // Remove expired
    lines = lines.filter(l => l.life < l.total);

    // Randomly spawn new lines (keep population up)
    if (lines.length < MAX_LINES && p.random() < 0.33) {
      spawnLine();
    }
  };
};

new p5(introParticles);
