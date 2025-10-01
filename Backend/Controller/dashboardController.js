const Order = require("../Models/orderbookingModel"); 
const Product = require("../Models/ProductsModel");
const User = require("../Models/usersModel");

const getDashboardData = async (req, res) => {
  try {
    // 1. Total Orders
    const totalOrders = await Order.countDocuments();

    // 2. Total Users
    const totalUsers = await User.countDocuments();

    // 3. Products grouped by Category and Size
    const productAggregation = await Product.aggregate([
      {
        $group: {
          _id: { category: "$category", size: "$sizes" },
          count: { $sum: 1 },
          totalStock: { $sum: "$stock" }
        }
      },
      {
        $group: {
          _id: "$_id.category",
          sizes: {
            $push: { size: "$_id.size", count: "$count", stock: "$totalStock" }
          },
          totalCount: { $sum: "$count" },
          totalStock: { $sum: "$totalStock" }
        }
      },
      {
        $project: {
          category: "$_id",
          sizes: 1,
          count: "$totalCount",
          totalStock: 1,
          _id: 0
        }
      }
    ]);

    // Response
    res.status(200).json({
      totalOrders,
      totalUsers,
      products: productAggregation
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

module.exports = { getDashboardData };
