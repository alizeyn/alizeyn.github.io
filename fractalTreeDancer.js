const fractalTreeDancer = (p) => {
  let mic;
  let fft;
  let bgColor;
  let lineColor;

  let isMobile = window.innerWidth < 600;
  let branchCount = isMobile ? 5 : 7; // fewer branches on mobile
  let depthLimit = isMobile ? 5 : 8;  // shallower depth on mobile

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT(0.9, 128);
    fft.setInput(mic);
    p.angleMode(p.DEGREES);
    bgColor = p.color(64, 224, 208);
    lineColor = p.color(255);
  };

  p.draw = function () {
    let vol = mic.getLevel();
    let baseBranchLen = p.map(vol, 0, 1, 20, 200) * 5;
    let centroid = fft.getCentroid();

    // Color logic
    bgColor = p.color(0, 0, 0); // always black now
    lineColor = centroid > 3000 ? p.color(255, 0, 0) : p.color(255);

    p.background(bgColor);
    p.stroke(lineColor);
    p.strokeWeight(2);

    let angle = p.map(centroid, 0, p.width / 2, 0, 90);

    p.translate(p.width / 2, p.height / 2);

    // Main branches
    for (let i = 0; i < branchCount; i++) {
      p.push();
      p.rotate(i * 360 / branchCount);
      branch(baseBranchLen, angle, 0);
      p.pop();
    }
  };

  // Recursive branch function, with depth tracking for mobile perf
  function branch(len, angle, depth) {
    p.line(0, 0, 0, -len);
    if (len < 2 || depth > depthLimit) return;
    p.push();
    p.translate(0, -len);
    p.rotate(angle);
    branch(len * 0.67, angle, depth + 1);
    p.pop();
    p.push();
    p.translate(0, -len);
    p.rotate(-angle);
    branch(len * 0.67, angle, depth + 1);
    p.pop();
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    // recalculate for new screen size
    isMobile = window.innerWidth < 600;
    branchCount = isMobile ? 5 : 7;
    depthLimit = isMobile ? 5 : 8;
  };
};

new p5(fractalTreeDancer, 'fractal-tree-dancer');
