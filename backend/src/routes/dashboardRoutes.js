import express from 'express';
import { 
  getDashboardStats, 
  getDashboardAlerts, 
  getTopUsedItems, 
  getBusinessInsights 
} from '../controllers/dashboardController.js';

const router = express.Router();

// Get comprehensive dashboard statistics
router.get('/stats', getDashboardStats);

// Get dashboard alerts (low stock, expiring, etc.)
router.get('/alerts', getDashboardAlerts);

// Get top used items with optional filters
router.get('/top-items', getTopUsedItems);

// Get business insights and recommendations
router.get('/insights', getBusinessInsights);

export default router;
