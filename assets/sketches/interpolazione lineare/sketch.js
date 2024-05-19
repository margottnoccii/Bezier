let x1, y1, x2, y2;  // Coordinate dei punti A e B
let t = 0;           // Valore di interpolazione
let isDragging = false;  // Variabile per tenere traccia se l'utente sta trascinando il punto
let manualStart = false;  // Variabile per tenere traccia se l'utente ha cliccato un punto sulla linea

function setup() {
  createCanvas(500, 300);
  // Coordinate dei punti A e B
  x1 = 50;
  y1 = 50;
  x2 = 450;
  y2 = 250;
  textFont('helvetica', 16);
}

function draw() {
  background(255);
  
  // Disegna i punti A e B
  fill(0);
  ellipse(x1, y1, 10, 10);
  ellipse(x2, y2, 10, 10);
  textAlign(CENTER, CENTER);
  text('A (P0)', x1, y1-7 - 15);
  text('B (P1)', x2+12, y2 - 25);

  if (!isDragging && !manualStart) {
    // Incrementa il valore di interpolazione t
    t += 0.002;  // Rallenta la velocità di spostamento
    if (t > 1) {
      t = 0;  // Resetta t a 0 per ricominciare l'animazione
    }
  }

  // Calcola le coordinate del punto interpolato
  let x = lerp(x1, x2, t);
  let y = lerp(y1, y2, t);
  
  // Disegna la linea tra i punti A e B
  stroke(160);
  strokeWeight(2);
  line(x1, y1, x2, y2);
  
    // Disegna i punti A e B
  fill(0);
  noStroke();
  ellipse(x1, y1, 10, 10);
  ellipse(x2, y2, 10, 10);
  
  // Disegna il punto interpolato
  noStroke();
  fill(255, 0, 0);
  ellipse(x, y, 10, 10);

  // Visualizza il valore di t
  noStroke();
  fill(0);
  text('t: ' + t.toFixed(2), 290, height - 200);
  
  // Visualizza la formula di interpolazione lineare
  let formulaX = `Px = P0x + t(P1x - P0x) = ${x1} + ${t.toFixed(2)}(${x2} - ${x1}) = ${x.toFixed(2)}`;
  let formulaY = `Py = P0y + t(P1y - P0y) = ${y1} + ${t.toFixed(2)}(${y2} - ${y1}) = ${y.toFixed(2)}`;
  textFont('helvetica', 14);
  textAlign(LEFT, CENTER);
  text(formulaX, 10, height - 40);
  text(formulaY, 10, height - 20);
}

function mousePressed() {
  // Calcola la distanza del mouse dalla linea tra i punti A e B
  let d1 = dist(mouseX, mouseY, x1, y1);
  let d2 = dist(mouseX, mouseY, x2, y2);
  let dLine = dist(x1, y1, x2, y2);

  // Se il mouse è abbastanza vicino alla linea, permette il dragging
  if (d1 + d2 >= dLine - 0.5 && d1 + d2 <= dLine + 0.5) {
    isDragging = true;
    manualStart = true;
    let dMouse = dist(mouseX, mouseY, x1, y1);
    t = constrain(dMouse / dLine, 0, 1);
  }
}

function mouseDragged() {
  if (isDragging) {
    // Calcola il valore di t basato sulla posizione del mouse
    let dLine = dist(x1, y1, x2, y2);
    let dMouse = dist(mouseX, mouseY, x1, y1);
    t = constrain(dMouse / dLine, 0, 1);
  }
}

function mouseReleased() {
  isDragging = false;
  manualStart = false;  // Reset manualStart when dragging stops
}

// Funzione di interpolazione lineare (lerp)
function lerp(start, stop, amt) {
  return start + (stop - start) * amt;
}
