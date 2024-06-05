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
    await queryInterface.createTable("transactions", {
      id: Sequelize.UUID,
      address: Sequelize.TEXT,
      orderId: Sequelize.INTEGER,
      priceTotal: Sequelize.DOUBLE,
      qtyTotal: Sequelize.INTEGER,
      resi: Sequelize.STRING,
      resiLink: Sequelize.STRING,
      status: Sequelize.ENUM("unpaid", "paid", "canceled"),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("transactions");
  },
};
