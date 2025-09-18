import dashboardRepository from '../repositories/dashboardRepository.js';

class DashboardService {

  // Main method to calculate all dashboard statistics
  async calculateDashboardStats() {
    try {
      // Fetch all required data
      const [inventoryData, usageData, salesData] = await Promise.all([
        dashboardRepository.getInventoryData(),
        dashboardRepository.getUsageData(),
        dashboardRepository.getSalesData()
      ]);

      // Calculate date ranges
      const today = new Date().toISOString().split('T')[0];
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Inventory Analysis
      const totalItems = inventoryData.length;
      const lowStockItems = inventoryData.filter(item => 
        item.stock > 0 && item.stock <= (item.threshold || 5)
      );
      const outOfStockItems = inventoryData.filter(item => item.stock === 0);
      const expiringItems = inventoryData.filter(item => 
        item.expiryDate && item.expiryDate <= threeDaysFromNow
      ).map(item => ({
        ...item,
        daysUntilExpiry: Math.ceil(
          (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        )
      }));

      // Calculate total inventory value
      const totalValue = inventoryData.reduce((sum, item) => 
        sum + (item.stock * (item.unitPrice || 0)), 0
      );

      // Top used items analysis
      const topUsedItems = this.calculateTopUsedItems(usageData, 5);

      // Sales calculations
      const dailySales = salesData
        .filter(sale => sale.date === today)
        .reduce((sum, sale) => sum + sale.amount, 0);

      const weeklySales = salesData
        .filter(sale => sale.date >= oneWeekAgo)
        .reduce((sum, sale) => sum + sale.amount, 0);

      const monthlySales = salesData
        .filter(sale => sale.date >= oneMonthAgo)
        .reduce((sum, sale) => sum + sale.amount, 0);

      return {
        totalItems,
        lowStockItems,
        outOfStockItems,
        expiringItems,
        totalValue,
        topUsedItems,
        dailySales,
        weeklySales,
        monthlySales,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      throw new Error('Failed to calculate dashboard statistics');
    }
  }

  // Calculate top used items from usage data
  calculateTopUsedItems(usageData, limit = 5) {
    const itemUsage = {};
    
    usageData.forEach(record => {
      const itemName = record.itemName;
      if (!itemName) return;
      
      if (itemUsage[itemName]) {
        itemUsage[itemName] += record.amount || 0;
      } else {
        itemUsage[itemName] = record.amount || 0;
      }
    });

    const sortedItems = Object.entries(itemUsage)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);

    // Add percentage calculation
    const totalUsage = sortedItems.reduce((sum, item) => sum + item.quantity, 0);
    return sortedItems.map(item => ({
      ...item,
      percentage: totalUsage > 0 ? ((item.quantity / totalUsage) * 100).toFixed(1) : 0
    }));
  }

  // Generate alerts for dashboard
  async generateAlerts() {
    try {
      const inventoryData = await dashboardRepository.getInventoryData();
      const alerts = [];

      // Out of stock alerts
      inventoryData.filter(item => item.stock === 0).forEach(item => {
        alerts.push({
          id: `out_of_stock_${item.id}`,
          type: 'out_of_stock',
          priority: 'critical',
          title: 'Out of Stock',
          message: `${item.name} is completely out of stock`,
          itemId: item.id,
          itemName: item.name,
          createdAt: new Date().toISOString(),
          resolved: false
        });
      });

      // Low stock alerts
      inventoryData.filter(item => 
        item.stock > 0 && item.stock <= (item.threshold || 5)
      ).forEach(item => {
        alerts.push({
          id: `low_stock_${item.id}`,
          type: 'low_stock',
          priority: 'high',
          title: 'Low Stock Warning',
          message: `${item.name} is running low (${item.stock} remaining, threshold: ${item.threshold || 5})`,
          itemId: item.id,
          itemName: item.name,
          createdAt: new Date().toISOString(),
          resolved: false
        });
      });

      // Expiring items alerts
      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      inventoryData.filter(item => 
        item.expiryDate && item.expiryDate <= threeDaysFromNow
      ).forEach(item => {
        const daysUntilExpiry = Math.ceil(
          (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        
        alerts.push({
          id: `expiring_${item.id}`,
          type: 'expiring',
          priority: daysUntilExpiry <= 1 ? 'critical' : 'high',
          title: 'Item Expiring Soon',
          message: `${item.name} expires in ${daysUntilExpiry} day(s)`,
          itemId: item.id,
          itemName: item.name,
          createdAt: new Date().toISOString(),
          resolved: false
        });
      });

      // Sort by priority (critical > high > medium > low)
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return alerts.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    } catch (error) {
      console.error('Error generating alerts:', error);
      throw new Error('Failed to generate alerts');
    }
  }

  // Get top used items with period filter
  async getTopUsedItems(limit = 5, periodDays = 30) {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);
      const startDateStr = startDate.toISOString().split('T')[0];

      const usageData = await dashboardRepository.getUsageData(startDateStr, endDate);
      return this.calculateTopUsedItems(usageData, limit);
    } catch (error) {
      console.error('Error getting top used items:', error);
      throw new Error('Failed to get top used items');
    }
  }

  // Generate business insights
  async generateBusinessInsights() {
    try {
      const [inventoryData, usageData] = await Promise.all([
        dashboardRepository.getInventoryData(),
        dashboardRepository.getUsageData()
      ]);

      const insights = [];

      // Inventory health insight
      const lowStockCount = inventoryData.filter(item => 
        item.stock > 0 && item.stock <= (item.threshold || 5)
      ).length;
      const outOfStockCount = inventoryData.filter(item => item.stock === 0).length;

      if (outOfStockCount > 0) {
        insights.push({
          type: 'warning',
          title: 'Stock Critical',
          description: `${outOfStockCount} item(s) are completely out of stock and need immediate restocking.`,
          impact: 'high',
          actionable: true,
          data: { outOfStockCount }
        });
      } else if (lowStockCount > 0) {
        insights.push({
          type: 'recommendation',
          title: 'Restock Soon',
          description: `${lowStockCount} item(s) are running low and should be restocked soon.`,
          impact: 'medium',
          actionable: true,
          data: { lowStockCount }
        });
      } else {
        insights.push({
          type: 'trend',
          title: 'Inventory Healthy',
          description: 'All inventory levels are within acceptable ranges.',
          impact: 'low',
          actionable: false,
          data: { status: 'good' }
        });
      }

      // Usage trend insight
      const recentUsage = usageData.filter(usage => {
        const usageDate = new Date(usage.dateStr);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return usageDate >= weekAgo;
      });

      const previousWeekUsage = usageData.filter(usage => {
        const usageDate = new Date(usage.dateStr);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return usageDate >= twoWeeksAgo && usageDate < weekAgo;
      });

      const recentTotal = recentUsage.reduce((sum, usage) => sum + usage.amount, 0);
      const previousTotal = previousWeekUsage.reduce((sum, usage) => sum + usage.amount, 0);

      if (recentTotal > previousTotal * 1.2) {
        insights.push({
          type: 'trend',
          title: 'Usage Increasing',
          description: `Item usage has increased by ${((recentTotal / previousTotal - 1) * 100).toFixed(0)}% this week.`,
          impact: 'medium',
          actionable: true,
          data: { trend: 'increasing', percentage: ((recentTotal / previousTotal - 1) * 100).toFixed(0) }
        });
      }

      return insights;

    } catch (error) {
      console.error('Error generating business insights:', error);
      throw new Error('Failed to generate business insights');
    }
  }
}

export default new DashboardService();