const store = {};

const response = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

exports.createItem = async (event) => {
  let data;
  try {
    data = event.body ? JSON.parse(event.body) : {};
  } catch (err) {
    return response(400, { error: 'Invalid JSON' });
  }
  const id = makeId();
  const item = { id, ...data, createdAt: new Date().toISOString() };
  store[id] = item;
  console.log('Item created:', store);
  return response(201, item);
};

exports.listItems = async () => {
  const items = Object.values(store);
  return response(200, items);
};

exports.getItem = async (event) => {
  const id = event.pathParameters && event.pathParameters.id;
  if (!id || !store[id]) return response(404, { error: 'Item not found' });
  return response(200, store[id]);
};

exports.updateItem = async (event) => {
  const id = event.pathParameters && event.pathParameters.id;
  if (!id || !store[id]) return response(404, { error: 'Item not found' });
  let data;
  try {
    data = event.body ? JSON.parse(event.body) : {};
  } catch (err) {
    return response(400, { error: 'Invalid JSON' });
  }
  const updated = { ...store[id], ...data, updatedAt: new Date().toISOString() };
  store[id] = updated;
  return response(200, updated);
};

exports.deleteItem = async (event) => {
  const id = event.pathParameters && event.pathParameters.id;
  if (!id || !store[id]) return response(404, { error: 'Item not found' });
  delete store[id];
  return response(200, { message: 'Item deleted' });
};