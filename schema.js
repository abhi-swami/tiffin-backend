const { pgTable, serial, timestamp, varchar } = require('drizzle-orm/pg-core');

const demoUsers = pgTable('users', {
  id: serial('id').primaryKey(),
  first_name: varchar('first_name', { length: 100 }).notNull(),
  last_name: varchar('last_name', { length: 100 }).notNull(),
  mobile_number: varchar('mobile_number', { length: 10 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

module.exports = { demoUsers };
