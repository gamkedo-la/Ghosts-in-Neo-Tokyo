const SAVE_FILE = 'save';

function save(state) {
  localStorage.setItem(SAVE_FILE, JSON.stringify(state));
};

function load() {
  player = JSON.parse(localStorage.getItem(SAVE_FILE));
};