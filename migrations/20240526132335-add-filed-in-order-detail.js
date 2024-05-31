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
      "order_details",
      "productName",
      Sequelize.STRING
    );
    await queryInterface.addColumn(
      "order_details",
      "productImage",
      Sequelize.STRING
    );
  },

  


  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("order_details", "productName");
    await queryInterface.removeColumn("order_details", "productImage");
  },
};
