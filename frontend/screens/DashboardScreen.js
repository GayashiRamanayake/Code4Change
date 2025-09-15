// screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  FlatList 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const API_URL = "https://neko-and-kopi-default-rtdb.firebaseio.com";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [dashboardData, setDashboardData] = useState({
    totalItems: 0,
    lowStockItems: [],
    outOfStockItems: [],
    expiringItems: [],
    totalValue: 0,
    topUsedItems: [],
    dailySales: 0,
    weeklySales: 0,
    monthlySales: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch comprehensive dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch inventory data
      const inventoryRes = await axios.get(`${API_URL}/inventory.json`);
      const inventoryData = inventoryRes.data 
        ? Object.keys(inventoryRes.data).map(key => ({ id: key, ...inventoryRes.data[key] }))
        : [];

      // Fetch usage data for analytics
      const usageRes = await axios.get(`${API_URL}/dailyUsage.json`);
      const usageData = usageRes.data 
        ? Object.keys(usageRes.data).map(key => ({ id: key, ...usageRes.data[key] }))
        : [];

      // Fetch sales data (if available)
      const salesRes = await axios.get(`${API_URL}/sales.json`);
      const salesData = salesRes.data 
        ? Object.keys(salesRes.data).map(key => ({ id: key, ...salesRes.data[key] }))
        : [];

      // Calculate comprehensive stats
      const stats = calculateDashboardStats(inventoryData, usageData, salesData);
      setDashboardData(stats);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Calculate all dashboard statistics
  const calculateDashboardStats = (inventory, usage, sales) => {
    const today = new Date().toISOString().split('T')[0];
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Inventory Analysis
    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(item => 
      item.stock > 0 && item.stock <= (item.threshold || 5)
    );
    const outOfStockItems = inventory.filter(item => item.stock === 0);
    const expiringItems = inventory.filter(item => 
      item.expiryDate && item.expiryDate <= threeDaysFromNow
    );

    // Calculate total inventory value
    const totalValue = inventory.reduce((sum, item) => 
      sum + ((item.stock || 0) * (item.unitPrice || 0)), 0
    );

    // Top used items analysis
    const itemUsage = {};
    usage.forEach(record => {
      const itemName = record.itemName || record.name;
      if (itemUsage[itemName]) {
        itemUsage[itemName] += record.quantity || 0;
      } else {
        itemUsage[itemName] = record.quantity || 0;
      }
    });

    const topUsedItems = Object.entries(itemUsage)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Sales calculations
    const dailySales = sales
      .filter(sale => sale.date === today)
      .reduce((sum, sale) => sum + (sale.amount || 0), 0);

    const weeklySales = sales
      .filter(sale => sale.date >= oneWeekAgo)
      .reduce((sum, sale) => sum + (sale.amount || 0), 0);

    const monthlySales = sales
      .filter(sale => sale.date >= oneMonthAgo)
      .reduce((sum, sale) => sum + (sale.amount || 0), 0);

    return {
      totalItems,
      lowStockItems,
      outOfStockItems,
      expiringItems,
      totalValue,
      topUsedItems,
      dailySales,
      weeklySales,
      monthlySales
    };
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Render alert item
  const renderAlertItem = ({ item, type }) => (
    <View style={styles.alertItem}>
      <View style={styles.alertContent}>
        <Text style={styles.alertItemName}>{item.name}</Text>
        <Text style={styles.alertDetail}>
          {type === 'lowStock' && `Stock: ${item.stock} (Min: ${item.threshold || 5})`}
          {type === 'outOfStock' && 'Out of Stock'}
          {type === 'expiring' && `Expires: ${item.expiryDate}`}
        </Text>
      </View>
      <View style={[styles.alertDot, { 
        backgroundColor: type === 'outOfStock' ? '#F44336' : 
                         type === 'expiring' ? '#FF9800' : '#FFC107' 
      }]} />
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#00796B" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with Cafe Name */}
      <View style={styles.header}>
        <Text style={styles.title}>Neko & Kopi</Text>
        <Text style={styles.subtitle}>Cafe Management Dashboard</Text>
      </View>

      {/* Critical Alerts Section */}
      {(dashboardData.outOfStockItems.length > 0 || 
        dashboardData.lowStockItems.length > 0 || 
        dashboardData.expiringItems.length > 0) && (
        <View style={styles.alertsSection}>
          <Text style={styles.alertsTitle}>🚨 Attention Required</Text>
          
          {dashboardData.outOfStockItems.length > 0 && (
            <View style={styles.alertCategory}>
              <Text style={styles.alertCategoryTitle}>Out of Stock ({dashboardData.outOfStockItems.length})</Text>
              {dashboardData.outOfStockItems.slice(0, 3).map((item, index) => (
                <View key={index}>
                  {renderAlertItem({ item, type: 'outOfStock' })}
                </View>
              ))}
              {dashboardData.outOfStockItems.length > 3 && (
                <TouchableOpacity onPress={() => navigation.navigate('Inventory')}>
                  <Text style={styles.viewMoreText}>View {dashboardData.outOfStockItems.length - 3} more →</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {dashboardData.lowStockItems.length > 0 && (
            <View style={styles.alertCategory}>
              <Text style={styles.alertCategoryTitle}>Low Stock ({dashboardData.lowStockItems.length})</Text>
              {dashboardData.lowStockItems.slice(0, 3).map((item, index) => (
                <View key={index}>
                  {renderAlertItem({ item, type: 'lowStock' })}
                </View>
              ))}
              {dashboardData.lowStockItems.length > 3 && (
                <TouchableOpacity onPress={() => navigation.navigate('Inventory')}>
                  <Text style={styles.viewMoreText}>View {dashboardData.lowStockItems.length - 3} more →</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {dashboardData.expiringItems.length > 0 && (
            <View style={styles.alertCategory}>
              <Text style={styles.alertCategoryTitle}>Expiring Soon ({dashboardData.expiringItems.length})</Text>
              {dashboardData.expiringItems.slice(0, 2).map((item, index) => (
                <View key={index}>
                  {renderAlertItem({ item, type: 'expiring' })}
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Key Metrics */}
      <Text style={styles.sectionTitle}>Today's Overview</Text>
      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, { backgroundColor: '#E8F5E8' }]}>
          <MaterialCommunityIcons name="package-variant" size={24} color="#2E7D32" />
          <Text style={styles.metricNumber}>{dashboardData.totalItems}</Text>
          <Text style={styles.metricLabel}>Total Items</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: '#E3F2FD' }]}>
          <MaterialCommunityIcons name="cash" size={24} color="#1565C0" />
          <Text style={styles.metricNumber}>₹{dashboardData.totalValue.toFixed(0)}</Text>
          <Text style={styles.metricLabel}>Inventory Value</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: '#FFF3E0' }]}>
          <MaterialCommunityIcons name="trending-up" size={24} color="#EF6C00" />
          <Text style={styles.metricNumber}>₹{dashboardData.dailySales.toFixed(0)}</Text>
          <Text style={styles.metricLabel}>Today's Sales</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: '#F3E5F5' }]}>
          <MaterialCommunityIcons name="chart-line" size={24} color="#6A1B9A" />
          <Text style={styles.metricNumber}>₹{dashboardData.weeklySales.toFixed(0)}</Text>
          <Text style={styles.metricLabel}>Weekly Sales</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Inventory')}
        >
          <MaterialCommunityIcons name="plus-box" size={28} color="#00796B" />
          <Text style={styles.actionText}>Add Inventory</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Daily Usage')}
        >
          <MaterialCommunityIcons name="clipboard-text" size={28} color="#00796B" />
          <Text style={styles.actionText}>Log Usage</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Reports')}
        >
          <MaterialCommunityIcons name="chart-bar" size={28} color="#00796B" />
          <Text style={styles.actionText}>View Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Settings')}
        >
          <MaterialCommunityIcons name="cog" size={28} color="#00796B" />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Top Used Items */}
      {dashboardData.topUsedItems.length > 0 && (
        <View style={styles.topItemsSection}>
          <Text style={styles.sectionTitle}>Most Used Items</Text>
          <View style={styles.topItemsContainer}>
            {dashboardData.topUsedItems.map((item, index) => (
              <View key={index} style={styles.topItem}>
                <View style={styles.topItemRank}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                </View>
                <View style={styles.topItemDetails}>
                  <Text style={styles.topItemName}>{item.name}</Text>
                  <Text style={styles.topItemQuantity}>Used: {item.quantity} times</Text>
                </View>
                <View style={styles.topItemBar}>
                  <View 
                    style={[
                      styles.usageBar, 
                      { 
                        width: `${(item.quantity / dashboardData.topUsedItems[0].quantity) * 100}%`,
                        backgroundColor: index === 0 ? '#4CAF50' : '#81C784'
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Business Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Business Insights</Text>
        <View style={styles.insightCard}>
          <MaterialCommunityIcons name="lightbulb" size={20} color="#FF9800" />
          <Text style={styles.insightText}>
            {dashboardData.lowStockItems.length > 0 
              ? `${dashboardData.lowStockItems.length} items need restocking soon`
              : 'All inventory levels look healthy'}
          </Text>
        </View>
        
        <View style={styles.insightCard}>
          <MaterialCommunityIcons name="trending-up" size={20} color="#4CAF50" />
          <Text style={styles.insightText}>
            Weekly sales: ₹{dashboardData.weeklySales.toFixed(0)} 
            {dashboardData.weeklySales > dashboardData.dailySales * 7 
              ? ' (Above average)' 
              : ' (Monitor trends)'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold',
    color: '#333'
  },
  subtitle: { 
    color: '#666', 
    fontSize: 16,
    marginTop: 4
  },
  alertsSection: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  alertsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 15
  },
  alertCategory: {
    marginBottom: 15
  },
  alertCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    marginBottom: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107'
  },
  alertContent: {
    flex: 1
  },
  alertItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  alertDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  alertDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  viewMoreText: {
    color: '#00796B',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 5
  },
  sectionTitle: { 
    fontWeight: 'bold', 
    fontSize: 18,
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: '#333'
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 10
  },
  metricCard: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    margin: '1%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#fff'
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#333'
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 20
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    margin: '1%',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  actionText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333'
  },
  topItemsSection: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  topItemsContainer: {
    marginTop: 10
  },
  topItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  topItemRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00796B'
  },
  topItemDetails: {
    flex: 1
  },
  topItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  topItemQuantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  topItemBar: {
    width: 60,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginLeft: 10
  },
  usageBar: {
    height: '100%',
    borderRadius: 2
  },
  insightsSection: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8
  },
  insightText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333'
  }
});

//Firebase Structure Needed
/*{
  "inventory": { "item_id": { "name", "stock", "threshold", "unitPrice", "expiryDate" } },
  "dailyUsage": { "usage_id": { "itemName", "quantity", "date", "cost" } },
  "sales": { "sale_id": { "amount", "date", "items", "profit" } },
  "alerts": { "alert_id": { "type", "message", "priority", "resolved" } }
}*/