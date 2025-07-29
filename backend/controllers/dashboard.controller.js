
const User = require("../models/Auth.model");
const Order = require("../models/Order.model");

const getDailyData = async (model, dateField, matchCondition = {}) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dailyData = await model.aggregate([
    {
      $match: {
        [dateField]: { $gte: sevenDaysAgo },
        ...matchCondition,
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const dataMap = new Map();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateString = d.toISOString().split('T')[0];
    dataMap.set(dateString, 0);
  }

  dailyData.forEach(item => {
    dataMap.set(item._id, model === Order ? item.totalAmount : item.count);
  });
  
  return Array.from(dataMap.values()).reverse();
};

const calculatePercentageChange = (current, previous) => {
  if (previous === 0) {
  }
  return (((current - previous) / previous) * 100).toFixed(1);
};


const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(new Date().setDate(today.getDate() - 7));
    const fourteenDaysAgo = new Date(new Date().setDate(today.getDate() - 14));

    const totalUsers = await User.countDocuments();
    const usersLast7Days = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const usersPrevious7Days = await User.countDocuments({ createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } });
    const usersChange = calculatePercentageChange(usersLast7Days, usersPrevious7Days);
    const userChartData = await getDailyData(User, "createdAt");

    const totalIncomeResult = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0;
    
    const incomeLast7DaysResult = await Order.aggregate([
        { $match: { status: "Delivered", createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const incomeLast7Days = incomeLast7DaysResult.length > 0 ? incomeLast7DaysResult[0].total : 0;

    const incomePrevious7DaysResult = await Order.aggregate([
        { $match: { status: "Delivered", createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    const incomePrevious7Days = incomePrevious7DaysResult.length > 0 ? incomePrevious7DaysResult[0].total : 0;

    const incomeChange = calculatePercentageChange(incomeLast7Days, incomePrevious7Days);
    const incomeChartData = await getDailyData(Order, "createdAt", { status: "Delivered" });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          change: usersChange,
          chartData: userChartData,
        },
        income: {
          total: totalIncome,
          change: incomeChange,
          chartData: incomeChartData,
        },
      },
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    next(error);
  }
};



const getChartAndUsersData = async (req, res, next) => {
  try {
    const today = new Date();
    const twelveMonthsAgo = new Date(new Date().setMonth(today.getMonth() - 11));
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyAggregation = async (model) => {
      return await model.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);
    };

    const userMonthlyData = await monthlyAggregation(User);
    const orderMonthlyData = await monthlyAggregation(Order);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const labels = [];
    const usersData = Array(12).fill(0);
    const ordersData = Array(12).fill(0);
    
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      labels.push(monthNames[d.getMonth()]);
    }
    
    const mapDataToMonths = (sourceData, targetArray) => {
        sourceData.forEach(item => {
            const itemDate = new Date(item._id.year, item._id.month - 1);
            const monthDiff = (today.getFullYear() - itemDate.getFullYear()) * 12 + (today.getMonth() - itemDate.getMonth());
            const index = 11 - monthDiff;
            if (index >= 0 && index < 12) {
                targetArray[index] = item.count;
            }
        });
    };

    mapDataToMonths(userMonthlyData, usersData);
    mapDataToMonths(orderMonthlyData, ordersData);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt avatar');

    res.status(200).json({
      success: true,
      data: {
        mainChart: {
          labels,
          usersData,
          ordersData,
        },
        recentUsers,
      },
    });
  } catch (error) {
    console.error("Chart and Users Data Error:", error);
    next(error);
  }
};

module.exports = { getDashboardStats,getChartAndUsersData };