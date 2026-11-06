const player = document.getElementById('player');
const beyonce = document.getElementById('beyonce');
const gameArea = document.getElementById('game-area');

const config = { playerSpeed: 5, enemySpeed: 1.5 };
let playerPosition = { x: 100, y: 100 };
let beyoncePosition = { x: 300, y: 300 };
const keys = {};

window.addEventListener('keydown', (e) => {
  if (e.key.startsWith('Arrow')) e.preventDefault();
  keys[e.key] = true;
});
window.addEventListener('keyup', (e) => { delete keys[e.key]; });

function movePlayer() {
  const maxX = gameArea.clientWidth - 50;
  const maxY = gameArea.clientHeight - 50;
  if (keys.ArrowUp) playerPosition.y -= config.playerSpeed;
  if (keys.ArrowDown) playerPosition.y += config.playerSpeed;
  if (keys.ArrowLeft) playerPosition.x -= config.playerSpeed;
  if (keys.ArrowRight) playerPosition.x += config.playerSpeed;
  playerPosition.x = Math.max(0, Math.min(maxX, playerPosition.x));
  playerPosition.y = Math.max(0, Math.min(maxY, playerPosition.y));
}

function moveBeyonce() {
  const s = config.enemySpeed;
  if (beyoncePosition.x < playerPosition.x) beyoncePosition.x += s;
  else if (beyoncePosition.x > playerPosition.x) beyoncePosition.x -= s;
  if (beyoncePosition.y < playerPosition.y) beyoncePosition.y += s;
  else if (beyoncePosition.y > playerPosition.y) beyoncePosition.y -= s;
}

function updatePositions() {
  player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
  beyonce.style.transform = `translate(${beyoncePosition.x}px, ${beyoncePosition.y}px)`;
}

function checkCollision() {
  if (Math.abs(playerPosition.x - beyoncePosition.x) < 50 &&
      Math.abs(playerPosition.y - beyoncePosition.y) < 50) {
    alert('¡Beyoncé te atrapó!');
    playerPosition = { x: 100, y: 100 };
    beyoncePosition = { x: 300, y: 300 };
    for (const k in keys) delete keys[k];
  }
}

function gameLoop() {
  movePlayer();
  moveBeyonce();
  updatePositions();
  checkCollision();
  requestAnimationFrame(gameLoop);
}
gameLoop();

// ---- Panel de configuración ----
document.getElementById('playerSpeed').addEventListener('input', (e) => {
  config.playerSpeed = Number(e.target.value);
  document.getElementById('pv').textContent = e.target.value;
});
document.getElementById('enemySpeed').addEventListener('input', (e) => {
  config.enemySpeed = Number(e.target.value);
  document.getElementById('ev').textContent = e.target.value;
});
document.getElementById('bg').addEventListener('change', (e) => {
  gameArea.style.backgroundColor = e.target.value;
});

// Música generada con Web Audio (no requiere archivos)
let audioCtx = null, musicTimer = null, volume = 0.3, step = 0;
const notes = [262, 330, 392, 330, 294, 349, 440, 349];
function playNote() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = notes[step++ % notes.length];
  gain.gain.value = volume * 0.3;
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.25);
}
document.getElementById('musicBtn').addEventListener('click', (e) => {
  if (musicTimer) {
    clearInterval(musicTimer); musicTimer = null;
    e.target.textContent = '▶ Música';
  } else {
    audioCtx = audioCtx || new AudioContext();
    musicTimer = setInterval(playNote, 300);
    e.target.textContent = '⏸ Música';
  }
});
document.getElementById('volume').addEventListener('input', (e) => {
  volume = Number(e.target.value);
});
