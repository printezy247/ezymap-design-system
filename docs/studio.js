const select = document.querySelector('#scene');
const format = document.querySelector('#format');
const button = document.querySelector('#play');
const timeline = document.querySelector('#time');
const timeLabel = document.querySelector('#time-label');
const frameLink = document.querySelector('#frame-link');
const summary = document.querySelector('#scene-summary');
const scenes = [...document.querySelectorAll('[data-scene]')];
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const query = new URLSearchParams(location.search);
const capture = query.has('frame');
const duration = Number(timeline.max) + 1;
const descriptions = {
  stack: 'Signal stack. Three layers fan out to reveal the market bars.',
  range: 'Range scan. A vertical marker sweeps through a highlighted price band.',
  relay: 'Signal relay. A pulse travels between three feed nodes.',
};
let animations = [];
let time = 0;
let playing = false;
let tick = 0;

function setTime(value) {
  time = Math.max(0, Math.min(duration - 1, Math.round(value)));
  timeline.value = time;
  timeline.setAttribute('aria-valuetext', (time / 1000).toFixed(2) + ' seconds');
  timeLabel.value = (time / 1000).toFixed(2) + ' s';
  const link = new URL(location.href);
  link.search = new URLSearchParams({ scene: select.value, format: format.value, frame: String(time) });
  frameLink.href = link.href;
}

function pause() {
  playing = false;
  cancelAnimationFrame(tick);
  button.textContent = 'Play';
  animations.forEach(animation => animation.pause());
}

function seek(value) {
  pause();
  setTime(value);
  animations.forEach(animation => { animation.currentTime = time; });
}

function updateClock() {
  if (!playing) return;
  setTime((animations[0].currentTime ?? 0) % duration);
  tick = requestAnimationFrame(updateClock);
}

function loadScene() {
  pause();
  const scene = scenes.find(item => item.dataset.scene === select.value);
  scenes.forEach(item => {
    delete item.dataset.motion;
    item.hidden = item !== scene;
  });
  scene.dataset.format = format.value;
  if (!preference.matches) scene.dataset.motion = 'ready';
  animations = scene.getAnimations({ subtree: true });
  button.disabled = animations.length === 0;
  timeline.disabled = animations.length === 0;
  summary.textContent = descriptions[select.value];
  seek(preference.matches ? 0 : time);
}

button.addEventListener('click', () => {
  if (playing) {
    seek(time);
    return;
  }
  playing = true;
  button.textContent = 'Pause';
  animations.forEach(animation => animation.play());
  updateClock();
});

select.addEventListener('change', () => {
  time = 0;
  loadScene();
});
format.addEventListener('change', () => {
  const scene = scenes.find(item => !item.hidden);
  scene.dataset.format = format.value;
  setTime(time);
});
timeline.addEventListener('input', () => seek(Number(timeline.value)));
preference.addEventListener('change', loadScene);

if (scenes.some(item => item.dataset.scene === query.get('scene'))) select.value = query.get('scene');
if (query.get('format') === 'portrait') format.value = 'portrait';
if (capture) {
  document.documentElement.dataset.capture = '';
  time = Number(query.get('frame')) || 0;
  document.title = select.selectedOptions[0].textContent + ' · EzyMap';
} else {
  document.querySelector('.studio-controls').hidden = false;
  frameLink.hidden = false;
}
loadScene();
