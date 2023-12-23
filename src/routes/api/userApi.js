const express = require('express');
const { User } = require('../../models/UserModel.js');

userApiRouter = express.Router();

userApiRouter.use(express.json());
userApiRouter.use(express.urlencoded({ extended: true }));

userApiRouter
  .route('/')
  .get(async (req, res) => {
    try {
      const users = await getUsers();
      console.log(users);
      res.send(JSON.stringify(users));
    } catch (error) {
      console.log(err);
      res.status(500).send('Error getting users');
    }
  })
  .post(async (req, res) => {
    try {
      const user = new User(req.body);
      await createUser(user);

      res.send({ message: 'User added.' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Error adding user' });
    }
  });

userApiRouter
  .route('/:id')
  .get(async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await getUser(userId);

      res.send(user);
    } catch (err) {
      console.log(err);
      res.status(500).send('Error getting user');
    }
  })
  .put(async (req, res) => {
    try {
      const userId = req.params.id;
      const updates = new User(req.body);

      const result = await updateUser(userId, updates);
      console.log(result);

      if (result.modifiedCount === 1) {
        console.log(`Successfully modified one user.`);
      } else {
        console.log(`No user modified`);
      }

      res.send({ message: `User updated.` });
    } catch (err) {
      console.log(err);
      res.status(500).send('Error modifying user');
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await deleteUser(req.params.id);
      console.log(result);

      if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.');
        res.status(200).send(result);
      } else {
        console.log('No documents matched the query. Deleted 0 documents.');
        res
          .status(500)
          .error('No documents matched the query. Deleted 0 documents.');
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Error deleting user');
    }
  });

module.exports = {
  userApiRouter,
};
