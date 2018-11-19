/* eslint-disable class-methods-use-this */
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:mongoUtils');


class Mongo {

  constructor() {
    this.url = 'mongodb://localhost:27017';
    this.dbName = 'libraryApp';
  }

  async getCollection(collectionName) {

    const client = await MongoClient.connect(this.url);
    debug('Connected to mongo server');

    const db = client.db(this.dbName);
    const collection = await db.collection(collectionName);

    return { client, collection };
  }
}

module.exports = new Mongo();
