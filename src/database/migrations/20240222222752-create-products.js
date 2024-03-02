'use strict';

const { tuple } = require('yup');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER, // numeros inteiros
        allowNull: false, // obrigatorio ter um id
        autoIncrement: true, // auto incrementar os numeros 1,2,3,3...
        primaryKey: true, // sra uma chave primária
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        //  tabela de crição inicio
        type: Sequelize.DATE, // tipo data
        allowNull: false, // obrigatorio
      },
      updated_at: {
        // tabela de update
        type: Sequelize.DATE, // tipo data
        allowNull: false, // obrigatorio
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  },
};
