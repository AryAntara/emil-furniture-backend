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
    await queryInterface.renameTable('orders', 'carts');
    await queryInterface.renameColumn('order_details', 'orderId', 'cartId');
    await queryInterface.renameTable('order_details', 'cart_details');
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameTable('carts', 'orders');
    await queryInterface.renameColumn('cart_details', 'cartId','orderId');
    await queryInterface.renameTable('cart_details', 'order_details');
  }
};
