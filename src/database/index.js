import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/Users';
import Product from '../app/models/Product';
import Category from '../app/models/Category';

import configDataBase from '../config/database';

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();// iniciando a conexão 
  }
  init() {
    this.connection = new Sequelize(configDataBase); // criando as configuraçoes para a conexão com Postgress
    models.map((model) => model.init(this.connection)).map((model) => model.associate && model.associate(this.connection.models),
      );
  }
  // iniciando a conexão com o mongoBD
  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/codeburguer',
    );
  }
}
export default new Database();
