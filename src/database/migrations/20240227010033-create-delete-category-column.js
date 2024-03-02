'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // a linha de codigo abaixo vamos removerColumun na tabela de products na coluna category
    await queryInterface.removeColumn('products', 'category');
  },

  async down(queryInterface, Sequelize) {
    // caso de erro vamos reverter a açao acima criando a tabela  como estava anteriormente
    await queryInterface.addColumn('producs', {
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },
};
