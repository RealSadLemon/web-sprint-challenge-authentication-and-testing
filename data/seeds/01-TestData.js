/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require('bcryptjs');
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: 1, username: 'rowValue1', password: bcrypt.hashSync('12345')},
    {id: 2, username: 'rowValue2', password: bcrypt.hashSync('12345')},
    {id: 3, username: 'rowValue3', password: bcrypt.hashSync('12345')}
  ]);
};
