'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER, // numeros inteiros
        allowNull: false, // obrigatorio ter um id
        autoIncrement: true, // auto incrementar os numeros 1,2,3,3...
        primaryKey: true, // sra uma chave primária
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // A categoria deve ser unica não pode ser repitida
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

  async down(queryInterface) {
    await queryInterface.dropTable('categories');
  },
};
