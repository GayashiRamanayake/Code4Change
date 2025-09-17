import Joi from 'joi';

// Dashboard Statistics Schema
export const dashboardStatsSchema = Joi.object({
  totalItems: Joi.number().min(0).required(),
  lowStockItems: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    stock: Joi.number().min(0).required(),
    threshold: Joi.number().min(0).required(),
    category: Joi.string().optional()
  })).required(),
  outOfStockItems: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    category: Joi.string().optional()
  })).required(),
  expiringItems: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    expiryDate: Joi.string().required(),
    daysUntilExpiry: Joi.number().required()
  })).required(),
  totalValue: Joi.number().min(0).required(),
  topUsedItems: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().min(0).required(),
    percentage: Joi.number().min(0).max(100).optional()
  })).required(),
  dailySales: Joi.number().min(0).required(),
  weeklySales: Joi.number().min(0).required(),
  monthlySales: Joi.number().min(0).required()
});

// Alert Schema
export const alertSchema = Joi.object({
  id: Joi.string().required(),
  type: Joi.string().valid('out_of_stock', 'low_stock', 'expiring', 'quality_issue').required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
  title: Joi.string().required(),
  message: Joi.string().required(),
  itemId: Joi.string().optional(),
  itemName: Joi.string().optional(),
  createdAt: Joi.string().isoDate().required(),
  resolved: Joi.boolean().default(false)
});

// Business Insight Schema
export const businessInsightSchema = Joi.object({
  type: Joi.string().valid('recommendation', 'warning', 'trend', 'opportunity').required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  impact: Joi.string().valid('low', 'medium', 'high').required(),
  actionable: Joi.boolean().default(true),
  data: Joi.object().optional()
});

// Usage Analytics Schema
export const usageAnalyticsSchema = Joi.object({
  itemName: Joi.string().required(),
  totalUsage: Joi.number().min(0).required(),
  averageDaily: Joi.number().min(0).required(),
  trend: Joi.string().valid('increasing', 'decreasing', 'stable').required(),
  lastUsed: Joi.string().isoDate().required()
});