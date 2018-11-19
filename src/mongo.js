/* eslint-disable class-methods-use-this */
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:mongoUtils');


class Mongo {

  async getCollection(collectionName) {

    const client = await MongoClient.connect(Mongo.url);
    debug('Connected to mongo server');

    const db = client.db(Mongo.dbName);
    const collection = await db.collection(collectionName);

    return { client, collection };
  }
}

Mongo.url = 'mongodb://localhost:27017';
Mongo.dbName = 'libraryApp';

module.exports = new Mongo();
