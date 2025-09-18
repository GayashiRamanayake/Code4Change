import { database } from '../config/firebaseConfig.js';
import { 
  ref, 
  get, 
  query, 
  orderByChild, 
  startAt, 
  endAt, 
  limitToLast,
  onValue,
  off 
} from 'firebase/database';

class DashboardRepository {
  
  // Get all inventory data
  async getInventoryData() {
    try {
      const inventoryRef = ref(database, 'inventory');
      const snapshot = await get(inventoryRef);
      
      if (!snapshot.exists()) return [];
      
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key],
        stock: Number(data[key].stock || 0),
        threshold: Number(data[key].threshold || 5),
        unitPrice: Number(data[key].unitPrice || 0)
      }));
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw new Error('Failed to fetch inventory data');
    }
  }

  // Get usage data (from logUsage collection based on your DailyUsageScreen)
  async getUsageData(startDate = null, endDate = null) {
    try {
      const usageRef = ref(database, 'logUsage');
      let queryRef;

      if (startDate && endDate) {
        queryRef = query(
          usageRef,
          orderByChild('dateStr'),
          startAt(startDate),
          endAt(endDate)
        );
      } else {
        // Get last 30 days by default
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDateStr = thirtyDaysAgo.toISOString().split('T')[0];
        
        queryRef = query(
          usageRef,
          orderByChild('dateStr'),
          startAt(startDateStr)
        );
      }

      const snapshot = await get(queryRef);
      
      if (!snapshot.exists()) return [];
      
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key],
        amount: Number(data[key].amount || 0),
        dateISO: data[key].dateISO,
        dateStr: data[key].dateStr
      }));
    } catch (error) {
      console.error('Error fetching usage data:', error);
      throw new Error('Failed to fetch usage data');
    }
  }

  // Get sales data (you'll need to create this collection)
  async getSalesData(startDate = null, endDate = null) {
    try {
      const salesRef = ref(database, 'sales');
      let queryRef;

      if (startDate && endDate) {
        queryRef = query(
          salesRef,
          orderByChild('date'),
          startAt(startDate),
          endAt(endDate)
        );
      } else {
        // Get last 30 days by default
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDateStr = thirtyDaysAgo.toISOString().split('T')[0];
        
        queryRef = query(
          salesRef,
          orderByChild('date'),
          startAt(startDateStr)
        );
      }

      const snapshot = await get(queryRef);
      
      if (!snapshot.exists()) return [];
      
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key],
        amount: Number(data[key].amount || 0)
      }));
    } catch (error) {
      console.error('Error fetching sales data:', error);
      // Return empty array if sales collection doesn't exist yet
      return [];
    }
  }

  // Get inventory items by category
  async getInventoryByCategory(category) {
    try {
      const inventoryData = await this.getInventoryData();
      return inventoryData.filter(item => item.category === category);
    } catch (error) {
      console.error('Error fetching inventory by category:', error);
      throw new Error('Failed to fetch inventory by category');
    }
  }

  // Get usage data for specific item
  async getUsageByItem(itemName, days = 30) {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const usageData = await this.getUsageData(startDateStr, endDate);
      return usageData.filter(usage => usage.itemName === itemName);
    } catch (error) {
      console.error('Error fetching usage by item:', error);
      throw new Error('Failed to fetch usage by item');
    }
  }

  // Real-time listener for inventory changes
  subscribeToInventoryChanges(callback) {
    const inventoryRef = ref(database, 'inventory');
    const unsubscribe = onValue(inventoryRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const inventory = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          stock: Number(data[key].stock || 0),
          threshold: Number(data[key].threshold || 5)
        }));
        callback(inventory);
      } else {
        callback([]);
      }
    });
    
    return () => off(inventoryRef, 'value', unsubscribe);
  }
}

export default new DashboardRepository();