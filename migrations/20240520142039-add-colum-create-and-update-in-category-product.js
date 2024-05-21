"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      "product_category",
      "createdAt",
      Sequelize.DATE
    );

    await queryInterface.addColumn(
      "product_category",
      "updatedAt",
      Sequelize.DATE
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      "product_category",
      "createdAt",
      Sequelize.DATE
    );

    await queryInterface.removeColumn(
      "product_category",
      "updatedAt",
      Sequelize.DATE
    );
  },
};
