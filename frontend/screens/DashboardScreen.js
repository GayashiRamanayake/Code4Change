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
  Image
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const inventoryRes = await axios.get(`${API_URL}/inventory.json`);
      const inventoryData = inventoryRes.data 
        ? Object.keys(inventoryRes.data).map(key => ({ id: key, ...inventoryRes.data[key] }))
        : [];

      const usageRes = await axios.get(`${API_URL}/dailyUsage.json`);
      const usageData = usageRes.data 
        ? Object.keys(usageRes.data).map(key => ({ id: key, ...usageRes.data[key] }))
        : [];

      const salesRes = await axios.get(`${API_URL}/sales.json`);
      const salesData = salesRes.data 
        ? Object.keys(salesRes.data).map(key => ({ id: key, ...salesRes.data[key] }))
        : [];

      const stats = calculateDashboardStats(inventoryData, usageData, salesData);
      setDashboardData(stats);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateDashboardStats = (inventory, usage, sales) => {
    const today = new Date().toISOString().split('T')[0];
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(item => item.stock > 0 && item.stock <= (item.threshold || 5));
    const outOfStockItems = inventory.filter(item => item.stock === 0);
    const expiringItems = inventory.filter(item => item.expiryDate && item.expiryDate <= threeDaysFromNow);

    const totalValue = inventory.reduce((sum, item) => sum + ((item.stock || 0) * (item.unitPrice || 0)), 0);

    const itemUsage = {};
    usage.forEach(record => {
      const itemName = record.itemName || record.name;
      if (itemUsage[itemName]) itemUsage[itemName] += record.quantity || 0;
      else itemUsage[itemName] = record.quantity || 0;
    });

    const topUsedItems = Object.entries(itemUsage)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const dailySales = sales.filter(sale => sale.date === today).reduce((sum, sale) => sum + (sale.amount || 0), 0);
    const weeklySales = sales.filter(sale => sale.date >= oneWeekAgo).reduce((sum, sale) => sum + (sale.amount || 0), 0);
    const monthlySales = sales.filter(sale => sale.date >= oneMonthAgo).reduce((sum, sale) => sum + (sale.amount || 0), 0);

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
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('../../assets/images/dashcat.jpg')} 
          style={styles.headerImage} 
        />
        <Text style={styles.title}>Neko & Kopi</Text>
        <Text style={styles.subtitle}>Cafe Management Dashboard</Text>
      </View>

      {/* Critical Alerts */}
      {(dashboardData.outOfStockItems.length > 0 || 
        dashboardData.lowStockItems.length > 0 || 
        dashboardData.expiringItems.length > 0) && (
        <View style={styles.alertsSection}>
          <Text style={styles.alertsTitle}>Attention Required</Text>

          {dashboardData.outOfStockItems.length > 0 && (
            <View style={styles.alertCategory}>
              <Text style={styles.alertCategoryTitle}>Out of Stock ({dashboardData.outOfStockItems.length})</Text>
              {dashboardData.outOfStockItems.slice(0, 3).map((item, index) => (
                <View key={index}>{renderAlertItem({ item, type: 'outOfStock' })}</View>
              ))}
              {dashboardData.outOfStockItems.length > 3 && (
                <TouchableOpacity onPress={() => navigation.navigate('Inventory', { filter: 'outOfStock' })}>
                  <Text style={styles.viewMoreText}>View {dashboardData.outOfStockItems.length - 3} more →</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {dashboardData.lowStockItems.length > 0 && (
            <View style={styles.alertCategory}>
              <Text style={styles.alertCategoryTitle}>Low Stock ({dashboardData.lowStockItems.length})</Text>
              {dashboardData.lowStockItems.slice(0, 3).map((item, index) => (
                <View key={index}>{renderAlertItem({ item, type: 'lowStock' })}</View>
              ))}
              {dashboardData.lowStockItems.length > 3 && (
                <TouchableOpacity onPress={() => navigation.navigate('Inventory', { filter: 'lowStock' })}>
                  <Text style={styles.viewMoreText}>View {dashboardData.lowStockItems.length - 3} more →</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {dashboardData.expiringItems.length > 0 && (
            <View style={styles.alertCategory}>
              <Text style={styles.alertCategoryTitle}>Expiring Soon ({dashboardData.expiringItems.length})</Text>
              {dashboardData.expiringItems.slice(0, 2).map((item, index) => (
                <View key={index}>{renderAlertItem({ item, type: 'expiring' })}</View>
              ))}
              {dashboardData.expiringItems.length > 2 && (
                <TouchableOpacity onPress={() => navigation.navigate('Inventory', { filter: 'expiring' })}>
                  <Text style={styles.viewMoreText}>View {dashboardData.expiringItems.length - 2} more →</Text>
                </TouchableOpacity>
              )}
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
        
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Inventory')}>
          <MaterialCommunityIcons name="plus-box" size={28} color="#00796B" />
          <Text style={styles.actionText}>Add Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Daily Usage')}>
          <MaterialCommunityIcons name="clipboard-text" size={28} color="#00796B" />
          <Text style={styles.actionText}>Log Usage</Text>
        </TouchableOpacity>
       
      </View>

      {/* Top Used Items */}
      {dashboardData.topUsedItems.length > 0 && (
        <View style={styles.topItemsSection}>
          <Text style={styles.sectionTitle}>Most Used Items</Text>
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
    backgroundColor: '#D0E6FA',
    padding: 18, // slightly thicker overall padding
  },

  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#0D1B2A',
    fontSize: 16,
  },

  header: {
    backgroundColor: '#B3D9FF',
    padding: 20, // same as before
    marginTop: 15, 
    marginBottom: 15, // slightly more margin
    borderRadius: 12,
    elevation: 2,
  },

  headerImage: {
    width: 80, 
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    alignSelf: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D1B2A',
    textAlign: 'center',
  },

  subtitle: {
    color: '#0D1B2A',
    fontSize: 16,
    marginTop: 4, 
    textAlign: 'center',
  },

 alertsSection: {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 15,
  elevation: 2,
  width: '100%',       
  alignSelf: 'center', 
  marginBottom: 15,    
},

  alertsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0952baff',
    marginBottom: 15,
  },

  alertCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D1B2A',
    marginBottom: 10,
  },

  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginBottom: 6,
    borderLeftWidth: 4,
  },

  alertDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  alertItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D1B2A',
  },

  alertDetail: {
    fontSize: 12,
    color: '#0D1B2A',
    marginTop: 2,
  },

  viewMoreText: {
    color: '#1E88E5',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 5,
  },

  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    color: '#0D1B2A',
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  metricCard: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    margin: '1%',
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },

  metricNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#0D1B2A',
  },

  metricLabel: {
    fontSize: 12,
    color: '#0D1B2A',
    textAlign: 'center',
  },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  actionCard: {
    width: '48%',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    margin: '1%',
    backgroundColor: '#B3D9FF',
    elevation: 2,
  },

  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#0D1B2A',
  },

  topItemsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
  },

  topItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },

  topItemRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#B3D9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D1B2A',
  },

  topItemDetails: {
    flex: 1,
  },

  topItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D1B2A',
  },

  topItemQuantity: {
    fontSize: 12,
    color: '#0D1B2A',
    marginTop: 2,
  },

  topItemBar: {
    width: 100,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginLeft: 10,
  },

  usageBar: {
    height: '100%',
    borderRadius: 4,
  },

  insightsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
  },

  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  insightText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#0D1B2A',
  },
});

