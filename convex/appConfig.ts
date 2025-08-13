import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get configuration by key
export const getConfig = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("appConfig")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    
    return config?.value || null;
  },
});

// Get all configuration for a category
export const getConfigByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const configs = await ctx.db
      .query("appConfig")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
    
    return configs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {} as Record<string, string>);
  },
});

// Set configuration value
export const setConfig = mutation({
  args: { 
    key: v.string(), 
    value: v.string(),
    category: v.string(),
    description: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("appConfig")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    const now = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        category: args.category,
        description: args.description,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("appConfig", {
        key: args.key,
        value: args.value,
        category: args.category,
        description: args.description,
        updatedAt: now,
      });
    }
  },
});

// Get branding configuration (helper)
export const getBrandingConfig = query({
  handler: async (ctx) => {
    const brandingConfigs = await ctx.db
      .query("appConfig")
      .withIndex("by_category", (q) => q.eq("category", "branding"))
      .collect();
    
    const config = brandingConfigs.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);

    // Return with defaults
    return {
      companyName: config.companyName || "Agile Academy",
      websiteUrl: config.websiteUrl || "theagilecoach.com",
      logoPath: config.logoPath || "/logo.png",
      poweredByText: config.poweredByText || "Powered by Agile Academy",
    };
  },
});