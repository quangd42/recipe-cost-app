const db = require('./connection');
const { ObjectId } = require('mongodb');

const createIngredient = async (ingredient) => {
  const client = await db.connect();
  const collection = client.db(db.dbName).collection('ingredients');

  const res = await collection.insertOne(ingredient);

  return res;
};

const getIngredient = async (ingredientId) => {
  const client = await db.connect();
  const collection = client.db(db.dbName).collection('ingredients');

  const objectId = new ObjectId(ingredientId);
  const res = await collection.findOne({ _id: objectId });

  return res;
};

const getIngredients = async () => {
  const client = await db.connect();
  const collection = client.db(db.dbName).collection('ingredients');

  const options = {
    sort: { name: 1 },
    projection: { _id: 1, name: 1, unit: 1, unitCost: 1 },
  };
  const res = await collection.find({}, options).toArray();

  return res;
};

const updateIngredient = async (ingredientId, updates) => {
  const client = await db.connect();
  const collection = client.db(db.dbName).collection('ingredients');

  const objectId = new ObjectId(ingredientId);
  const filter = { _id: objectId };
  const updateDoc = {
    $set: updates,
  };

  const res = await collection.updateOne(filter, updateDoc);

  return res;
};

const deleteIngredient = async (ingredientId) => {
  const client = await db.connect();
  const collection = client.db(db.dbName).collection('ingredients');

  const objectId = new ObjectId(ingredientId);
  const filter = { _id: objectId };

  const res = await collection.deleteOne(filter);

  return res;
};

module.exports = {
  createIngredient,
  getIngredient,
  getIngredients,
  updateIngredient,
  deleteIngredient,
};
