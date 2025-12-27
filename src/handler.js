const store = require('../store');
const response = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

exports.createItem = async (event) => {
  const data = event.body ? JSON.parse(event.body) : {};
  const item = { id: makeId(), ...data, createdAt: new Date().toISOString() };
  store.create(item);
  return response(201, item);
};

exports.listItems = async () => response(200, store.getAll());

exports.getItem = async (event) => {
  const id = event.pathParameters && event.pathParameters.id;
  const item = store.findById(id);
  if (!item) return response(404, { error: 'Item not found' });
  return response(200, item);
};

exports.updateItem = async (event) => {
  const id = event.pathParameters && event.pathParameters.id;
  if (!id) return response(404, { error: 'Item not found' });
  const idx = store.findIndex((i) => i.id === id);
  if (idx === -1) return response(404, { error: 'Item not found' });
  let data;
  try {
    data = event.body ? JSON.parse(event.body) : {};
  } catch (err) {
    return response(400, { error: 'Invalid JSON' });
  }
  const updated = store.update(id, { ...data, updatedAt: new Date().toISOString() });
  if (!updated) return response(404, { error: 'Item not found' });
  return response(200, updated);
};

exports.deleteItem = async (event) => {
  const id = event.pathParameters && event.pathParameters.id;
  if (!id) return response(404, { error: 'Item not found' });
  const idx = store.findIndex((i) => i.id === id);
  if (idx === -1) return response(404, { error: 'Item not found' });
  const removed = store.remove(id);
  if (!removed) return response(404, { error: 'Item not found' });
  return response(200, { message: 'Item deleted' });
};

exports.deleteAllItems = async () => {
  store.deleteAll();
  return response(200, { message: 'All items deleted' });
}