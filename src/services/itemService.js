function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

class ItemService {
  constructor(store) {
    this.store = store;
  }

  async createItem(data = {}) {
    const id = makeId();
    const item = { id, ...data, createdAt: new Date().toISOString() };
    await this.store.create(item);
    return item;
  }

  async listItems() {
    return await this.store.getAll();
  }

  async getItem(id) {
    if (!id) return null;
    return await this.store.findById(id);
  }

  async updateItem(id, data = {}) {
    if (!id) return null;
    return await this.store.update(id, { ...data, updatedAt: new Date().toISOString() });
  }

  async deleteItem(id) {
    if (!id) return false;
    return await this.store.remove(id);
  }
}

module.exports = ItemService;
