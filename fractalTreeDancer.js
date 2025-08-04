const fractalTreeDancer = (p) => {
  let mic, fft;
  let lineColor;

  p.setup = function() {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent('fractal-tree-dancer');
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT(0.9, 128);
    fft.setInput(mic);
    p.angleMode(p.DEGREES);
    lineColor = p.color(255);
  };

  p.draw = function() {
    let vol = mic.getLevel();
    let baseBranchLen = p.map(vol, 0, 1, 20, 200) * 5;
    let spectrum = fft.analyze();
    let centroid = fft.getCentroid();

    // Always use dark background (matches quote screen)
    p.background(0);

    // Line color logic
    if (centroid > 3000) {
      lineColor = p.color(255, 0, 0); // Solid red
    } else {
      lineColor = p.color(255); // White
    }

    p.stroke(lineColor);
    p.strokeWeight(2);

    let angle = p.map(centroid, 0, p.width / 2, 0, 90);

    p.translate(p.width / 2, p.height / 2);

    for (let i = 0; i < 7; i++) {
      p.push();
      p.rotate(i * 360 / 7);
      branch(baseBranchLen, angle, p);
      p.pop();
    }

    for (let i = 0; i < 7; i++) {
      p.push();
      p.rotate(i * 360 / 7);
      branch(baseBranchLen * 0.25, angle, p);
      p.pop();
    }
  };

  function branch(len, angle, p) {
    p.line(0, 0, 0, -len);
    if (len < 2) {
      return;
    } else {
      p.push();
      p.translate(0, -len);
      p.rotate(angle);
      branch(len * 0.67, angle, p);
      p.pop();

      p.push();
      p.translate(0, -len);
      p.rotate(-angle);
      branch(len * 0.67, angle, p);
      p.pop();
    }
  }

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(fractalTreeDancer);
