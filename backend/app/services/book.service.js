const { ObjectId, ReturnDocument } = require('mongodb');

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection('contacts');
    }

    // Define method extract Contact data
    extractContactData(payload) {
    }

    async create(payload) {
    }

    async find(filter) {
    }

    async findByName(name) {
    }

    async findById(id) {
    }

    async update(id, payload) {
    }

    async delete(id) {
    }

    async findFavorite() {
    }

    async deleteAll() {
    }
}

module.exports = ContactService;