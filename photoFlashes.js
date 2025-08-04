const photoFlashes = (p) => {
  let flashes = [];
  let containerW = 0, containerH = 0, boxSize = 0;
  let slideW = 0, slideH = 0;

  // Helper to update the photo container and slide sizes
  function updateBoxSize() {
    const container = document.querySelector('.ali-photo-container');
    const slide = document.querySelector('.ali-photo-slide');
    if (container) {
      const rect = container.getBoundingClientRect();
      containerW = rect.width;
      containerH = rect.height;
      boxSize = containerW; // Since container is square
    } else {
      containerW = p.width;
      containerH = p.height;
      boxSize = Math.min(containerW, containerH);
    }
    if (slide) {
      slideW = slide.offsetWidth;
      slideH = slide.offsetHeight;
    } else {
      slideW = p.width;
      slideH = p.height;
    }
  }

  // Return slide size (with fallback)
  function getSlideSize() {
    const slide = document.querySelector('.ali-photo-slide');
    if (slide) {
      return [slide.offsetWidth, slide.offsetHeight];
    }
    return [window.innerWidth, window.innerHeight];
  }

  p.setup = function() {
    updateBoxSize();
    let [w, h] = getSlideSize();
    let c = p.createCanvas(w, h);
    c.parent('photo-flash-bg');
    p.noStroke();
  };

  p.windowResized = function() {
    updateBoxSize();
    let [w, h] = getSlideSize();
    p.resizeCanvas(w, h);
    updateBoxSize();
  };

  function spawnFlash() {
    // Three colors: pure red, green, blue
    const colors = [
      [0, 255, 0],   // Green
      [255, 0, 0],   // Red
      [0, 0, 255],   // Blue
    ];
    const color = colors[Math.floor(p.random(3))];

    // Random place over the photo container (centered in slide)
    const slide = document.querySelector('.ali-photo-slide');
    const container = document.querySelector('.ali-photo-container');
    let x, y;

    if (container && slide) {
      const containerRect = container.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();
      // Compute position relative to canvas
      x = containerRect.left - slideRect.left + p.random(-boxSize * 0.08, boxSize * 0.08);
      y = containerRect.top - slideRect.top + p.random(-boxSize * 0.08, boxSize * 0.08);
    } else {
      // fallback: center
      x = p.width/2 - boxSize/2;
      y = p.height/2 - boxSize/2;
    }

    flashes.push({
      x, y,
      color,
      alpha: 0,
      state: 'fadein',
      t: 0,
      life: Math.floor(p.random(12, 21)), // stays visible for 12-20 frames
    });
  }

  p.draw = function() {
    // Keep canvas in sync if container size changes (e.g. orientation change, slide resize)
    let [w, h] = getSlideSize();
    if (p.width !== w || p.height !== h) {
      p.resizeCanvas(w, h);
      updateBoxSize();
    }

    p.clear();

    // Sometimes flash a new square!
    if (p.frameCount % 2 === 0 && p.random() < 0.24) {
      spawnFlash();
    }

    for (let f of flashes) {
      // Animate alpha: fade in for 6 frames, stay, fade out
      if (f.state === 'fadein') {
        f.alpha += 36;
        if (f.alpha >= 220) {
          f.alpha = 220;
          f.state = 'hold';
          f.t = 0;
        }
      } else if (f.state === 'hold') {
        f.t++;
        if (f.t > f.life) f.state = 'fadeout';
      } else if (f.state === 'fadeout') {
        f.alpha -= 48;
      }
      // Draw square, with same size as photo (boxSize)
      p.fill(f.color[0], f.color[1], f.color[2], p.constrain(f.alpha, 0, 220));
      p.rect(f.x, f.y, boxSize, boxSize, 22); // 22 radius for round corners
    }

    // Remove fully faded
    flashes = flashes.filter(f => f.alpha > 0);
  };
};

new p5(photoFlashes);
