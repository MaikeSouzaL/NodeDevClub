'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        // id de cada usuario
        type: Sequelize.UUID, // tipo que queremos neste caso o id sera numeros
        defaultValue: Sequelize.UUID, // sera gerado um id automatico
        allowNull: false, // sera obrigatório
        primaryKey: true, // sera uma chave primaria
      },
      name: {
        // tabela nome
        type: Sequelize.STRING, // o nome sera do tipo string
        allowNull: false, // sera obrigatorio
      },
      email: {
        // tabela email
        type: Sequelize.STRING, // sera do tipo string
        allowNull: false, // obrigatorio
        unique: true, // cada usuario tera email unico e não pode ser duplicado
      },
      password_hash: {
        // tabela de senha que sera criptografada
        type: Sequelize.STRING, // sera do tipo string
        allowNull: false, // sera obrigatoria
      },
      admin: {
        // tabela de admin caso seja
        type: Sequelize.BOOLEAN, // tera um campo boleano
        defaultValue: false, // ira iniciar com valor false
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
    await queryInterface.dropTable('users');
  },
};
