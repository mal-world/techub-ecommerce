// models/index.js
import { Sequelize, DataTypes } from 'sequelize';
import userModelDef from './userModel.js';

const sequelize = new Sequelize('postgres', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
});

const User = userModelDef(sequelize, DataTypes);

export { sequelize, User };