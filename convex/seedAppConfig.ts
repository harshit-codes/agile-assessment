import { mutation } from "./_generated/server";

export const seedBrandingConfig = mutation({
  handler: async (ctx) => {
    const now = new Date().toISOString();
    
    const brandingConfigs = [
      {
        key: "companyName",
        value: "Agile Academy",
        category: "branding",
        description: "Company name displayed in branding",
        updatedAt: now,
      },
      {
        key: "websiteUrl",
        value: "theagilecoach.com",
        category: "branding", 
        description: "Main website URL for branding",
        updatedAt: now,
      },
      {
        key: "logoPath",
        value: "/logo.png",
        category: "branding",
        description: "Path to company logo",
        updatedAt: now,
      },
      {
        key: "poweredByText",
        value: "Powered by Agile Academy",
        category: "branding",
        description: "Powered by text for footer",
        updatedAt: now,
      },
    ];

    // Check if configs already exist
    for (const config of brandingConfigs) {
      const existing = await ctx.db
        .query("appConfig")
        .withIndex("by_key", (q) => q.eq("key", config.key))
        .first();
      
      if (!existing) {
        await ctx.db.insert("appConfig", config);
        console.log(`Created config: ${config.key}`);
      } else {
        console.log(`Config already exists: ${config.key}`);
      }
    }

    return "Branding configuration seeded successfully";
  },
});