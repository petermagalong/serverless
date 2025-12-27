const store = require('../store');

const response = require('./utils/response');
const ItemService = require('./services/itemService');

// Dependency injection: service depends on abstract store interface
const service = new ItemService(store);

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
  const item = await service.createItem(data);
  console.log('Item created:', item.id);
  return response(201, item);
};

exports.listItems = async () => {
  const items = await service.listItems();
  return response(200, items);
};

exports.getItem = async (event) => {
  const id = event.pathParameters && event.pathParameters.id;
  if (!id) return response(404, { error: 'Item not found' });
  const item = await store.findById(id);
  if (!item) return response(404, { error: 'Item not found' });
  return response(200, item);
};

exports.updateItem = async (event) => {
  const id = event.pathParameters && event.pathParameters.id;
  if (!id) return response(404, { error: 'Item not found' });
  let data;
  try {
    data = event.body ? JSON.parse(event.body) : {};
  } catch (err) {
    return response(400, { error: 'Invalid JSON' });
  }
  const updated = await service.updateItem(id, data);
  if (!updated) return response(404, { error: 'Item not found' });
  return response(200, updated);
};

exports.deleteItem = async (event) => {
  const id = event.pathParameters && event.pathParameters.id;
  if (!id) return response(404, { error: 'Item not found' });
  const removed = await store.remove(id);
  if (!removed) return response(404, { error: 'Item not found' });
  return response(200, { message: 'Item deleted' });
};