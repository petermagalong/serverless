const fs = require('fs');
const path = require('path');

const STORE_FILE = path.resolve(__dirname, 'store.json');

function load() {
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function save(store) {
  try {
    // atomic write: write to temp file then rename
    const tmp = `${STORE_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(store, null, 2), 'utf8');
    fs.renameSync(tmp, STORE_FILE);
  } catch (err) {
    console.error('Failed to save store:', err);
  }
}

module.exports = {
  getAll: () => load(),
  findById: (id) => load().find((i) => i.id === id),
  create: (item) => {
    const s = load();
    s.push(item);
    save(s);
    return item;
  },
  update: (id, data) => {
    const s = load();
    const idx = s.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    s[idx] = { ...s[idx], ...data };
    save(s);
    return s[idx];
  },
  remove: (id) => {
    const s = load();
    const idx = s.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    s.splice(idx, 1);
    save(s);
    return true;
  },
  deleteAll: () => {
    save([]);
  }
};
