import dashboardService from '../services/dashboardService.js';

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.calculateDashboardStats();
    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      details: error.message
    });
  }
};

export const getDashboardAlerts = async (req, res) => {
  try {
    const alerts = await dashboardService.generateAlerts();
    res.status(200).json({
      success: true,
      data: alerts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard alerts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts',
      details: error.message
    });
  }
};

export const getTopUsedItems = async (req, res) => {
  try {
    const { limit = 5, period = '30' } = req.query;
    const topItems = await dashboardService.getTopUsedItems(parseInt(limit), parseInt(period));
    res.status(200).json({
      success: true,
      data: topItems,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Top items error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top used items',
      details: error.message
    });
  }
};

export const getBusinessInsights = async (req, res) => {
  try {
    const insights = await dashboardService.generateBusinessInsights();
    res.status(200).json({
      success: true,
      data: insights,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Business insights error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate insights',
      details: error.message
    });
  }
};