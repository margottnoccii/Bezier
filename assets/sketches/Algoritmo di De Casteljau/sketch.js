let controlPoints = [];
let t = 0;
let speed = 0.005; // Diminuito per rallentare l'animazione
let selectedPoint = null;

function setup() {
  createCanvas(500, 300);
  textSize(16);
  textAlign(CENTER, CENTER);

  // Aggiungere due punti di controllo iniziali per una curva lineare diagonale
  controlPoints.push(createVector(50, 250));
  controlPoints.push(createVector(450, 250));
}

function draw() {
  background(255);

  if (controlPoints.length > 0) {
    // Disegna i punti di controllo
    fill(0);
    for (let i = 0; i < controlPoints.length; i++) {
      ellipse(controlPoints[i].x, controlPoints[i].y, 10, 10);
      text(`P${i}`, controlPoints[i].x, controlPoints[i].y - 15); // Mostra il tipo di punto
    }

    // Disegna le linee di controllo
    stroke(0, 100);
    noFill();
    beginShape();
    for (let i = 0; i < controlPoints.length; i++) {
      vertex(controlPoints[i].x, controlPoints[i].y);
    }
    endShape();

    if (controlPoints.length >= 2) {
      // Disegna la curva di Bézier lineare usando de Casteljau
      stroke(0);
      noFill();
      beginShape();
      for (let tt = 0; tt <= 1; tt += 0.01) {
        let b = deCasteljau(controlPoints, tt);
        vertex(b.x, b.y);
      }
      endShape();

      // Disegna l'algoritmo di De Casteljau
      let intermediatePoints = controlPoints;
      while (intermediatePoints.length > 1) {
        let newPoints = [];
        for (let i = 0; i < intermediatePoints.length - 1; i++) {
          let p = p5.Vector.lerp(intermediatePoints[i], intermediatePoints[i + 1], t);
          newPoints.push(p);
        }
        stroke(0, 255, 0, 150);
        noFill();
        beginShape();
        for (let i = 0; i < newPoints.length; i++) {
          vertex(newPoints[i].x, newPoints[i].y);
        }
        endShape();

        // Disegna i punti agli estremi delle linee rette di interpolazione
        fill(0);
        noStroke();
        for (let i = 0; i < intermediatePoints.length; i++) {
          ellipse(intermediatePoints[i].x, intermediatePoints[i].y, 10, 10);
        }
        // Disegna i punti medi di interpolazione in verde
        fill(0, 255, 0);
        for (let i = 0; i < newPoints.length; i++) {
          ellipse(newPoints[i].x, newPoints[i].y, 10, 10);
        }

        intermediatePoints = newPoints;
      }

      // Disegna il punto sulla curva di Bézier calcolato con De Casteljau
      let pointOnCurve = deCasteljau(controlPoints, t);
      fill(255, 0, 0);
      ellipse(pointOnCurve.x, pointOnCurve.y, 10, 10);

      t += speed;
      if (t > 1) {
        t = 0;
      }
    }
  }

  // Trascinamento dei punti di controllo
  if (selectedPoint !== null) {
    controlPoints[selectedPoint].x = mouseX;
    controlPoints[selectedPoint].y = mouseY;
  }
}

// Funzione per calcolare i punti sulla curva di Bézier usando l'algoritmo di De Casteljau
function deCasteljau(points, t) {
  while (points.length > 1) {
    let newPoints = [];
    for (let i = 0; i < points.length - 1; i++) {
      let p = p5.Vector.lerp(points[i], points[i + 1], t);
      newPoints.push(p);
    }
    points = newPoints;
  }
  return points[0];
}

// Funzione per aggiungere punti di controllo tramite il clic del mouse
function mousePressed() {
  if (mouseY > 40) { // Evita di aggiungere punti sopra il testo
    let clickedPoint = getClickedPoint();
    if (clickedPoint !== -1) {
      selectedPoint = clickedPoint;
    } else {
      controlPoints.push(createVector(mouseX, mouseY));
    }
  }
}

function mouseReleased() {
  selectedPoint = null;
}

// Funzione per resettare i punti di controllo premendo 'R'
function keyPressed() {
  if (key === 'A' || key === 'a') {
    controlPoints = [];
    controlPoints.push(createVector(50, 250));
    controlPoints.push(createVector(450, 250));
    t = 0;
  }
}

// Funzione per ottenere l'indice del punto di controllo cliccato
function getClickedPoint() {
  for (let i = 0; i < controlPoints.length; i++) {
    let d = dist(mouseX, mouseY, controlPoints[i].x, controlPoints[i].y);
    if (d < 10) {
      return i;
    }
  }
  return -1;
}
