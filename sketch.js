function setup() {
  let canvas = createCanvas(windowWidth, windowHeight * 0.6);
  canvas.parent("sketch-holder");
  background(200);
}

function draw() {
  fill(0);
  ellipse(mouseX, mouseY, 30, 30);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight * 0.6);
}
