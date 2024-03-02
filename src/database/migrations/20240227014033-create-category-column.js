'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // na linha debaixo vamos criar uma coluna na tabela de products, e vai se chamar category_id, e o proximo vamos dizer como vai ser essa coluna
    await queryInterface.addColumn('products', 'category_id', {
      type: Sequelize.INTEGER,
      // aqui estamos criado uma nova coluna na tabela do products porem esta column esta fazendo referencia a tabela de categories ou seja esta se referndo a um campo em outra tabela
      // cria a referencia  pegando o model categories e dentro de categories estou me referindo ao id
      references: { model: 'categories', key: 'id' },
      // caso atualize a tabela de products vamos atulizar tambem a tabela de categories
      onUpdate: 'CASCADE',
      //caso delete a fique nulo
      onUpdate: 'SET NULL',
      allowNull: true, // podemos criar um produto sem categoria
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'category_id');
  },
};
