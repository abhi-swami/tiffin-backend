const express = require('express');
const { eq } = require('drizzle-orm');

const { db } = require('./db');
const { demoUsers } = require('./schema');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());


function validateUserPayload(body) {
  const first_name = body.first_name?.trim();
  const last_name = body.last_name?.trim();
  const mobile_number = body.mobile_number?.trim();

  if (!first_name || !last_name || !mobile_number) {
    return { error: 'first_name, last_name, and mobile_number are required.' };
  }

  if (!/^\d{10}$/.test(mobile_number)) {
    return { error: 'mobile_number must be exactly 10 digits.' };
  }

  return {
    data: {
      first_name,
      last_name,
      mobile_number,
    },
  };
}

app.get('/', (req, res) => {

  res.json({ message: `Tiffin server is running.` });
});

app.get('/users', async (req, res, next) => {
  try {
    const users = await db.select().from(demoUsers);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.get('/users/:id', async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: 'A valid user id is required.' });
    }

    const users = await db.select().from(demoUsers).where(eq(demoUsers.id, userId));

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json(users[0]);
  } catch (error) {
    return next(error);
  }
});

app.post('/users', async (req, res, next) => {
  try {
    const validation = validateUserPayload(req.body);

    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const insertedUsers = await db
      .insert(demoUsers)
      .values(validation.data)
      .returning();

    return res.status(201).json(insertedUsers[0]);
  } catch (error) {
    return next(error);
  }
});

app.put('/users/:id', async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: 'A valid user id is required.' });
    }

    const validation = validateUserPayload(req.body);

    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const updatedUsers = await db
      .update(demoUsers)
      .set(validation.data)
      .where(eq(demoUsers.id, userId))
      .returning();

    if (updatedUsers.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json(updatedUsers[0]);
  } catch (error) {
    return next(error);
  }
});

app.delete('/users/:id', async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: 'A valid user id is required.' });
    }

    const deletedUsers = await db
      .delete(demoUsers)
      .where(eq(demoUsers.id, userId))
      .returning();

    if (deletedUsers.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

