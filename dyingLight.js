const quoteSketch = (p) => {
    let maxAlpha = 5;
    let radius = 250;

    p.setup = function () {
        let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent('quote-sketch-bg');
        p.noStroke();
    };

    p.draw = function () {
        p.background(0);

        let alpha = maxAlpha * (0.5 + 0.5 * Math.sin(p.frameCount * 0.01));
        let gradientSteps = 100;

        for (let r = radius; r > 0; r -= radius / gradientSteps) {
            let interAlpha = p.map(r, 0, radius, 0, alpha);
            p.fill(255, 230, 180, interAlpha);
            p.ellipse(p.width / 2, p.height / 2, r * 2);
        }
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};
new p5(quoteSketch);