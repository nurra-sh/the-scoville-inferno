import Order from '#models/order'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdminDashboardController {
  public async stats({ response }: HttpContext) {
    // 1. Sum the 'total' column from the orders table
    const salesQuery = await Order.query().sum('total as total_sales')
    const totalSales = Number(salesQuery[0]?.$extras.total_sales || 0)

    // 2. Count rows in the users table
    const usersQuery = await User.query().count('* as total_users')
    const totalUsers = Number(usersQuery[0]?.$extras.total_users || 0)

    // 3. Count rows in the orders table
    const ordersQuery = await Order.query().count('* as total_orders')
    const totalOrders = Number(ordersQuery[0]?.$extras.total_orders || 0)

    return response.ok({
      totalSales,
      totalUsers,
      totalOrders,
    })
  }
}