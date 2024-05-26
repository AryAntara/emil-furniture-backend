'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('order_details', {
      id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      }, 
      orderId: Sequelize.INTEGER,
      productId: Sequelize.INTEGER, 
      price: Sequelize.DOUBLE, 
      qty: Sequelize.INTEGER,       
      lockedIn: Sequelize.DATE, 
      status: Sequelize.ENUM('ready', "out_of_stock", "process"), 
      isUsed: Sequelize.ENUM("yes", "no"), 
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('order_details');
  }
};
