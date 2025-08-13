import { mutation } from "./_generated/server";

export const updateAllCharacterImages = mutation({
  handler: async (ctx) => {
    // Get all personality types
    const personalityTypes = await ctx.db.query("personalityTypes").collect();
    
    const updates = [];
    
    // Update each personality type with its character image URL
    for (const personalityType of personalityTypes) {
      const imageUrl = `/characters/${personalityType.shortName}.png`;
      
      await ctx.db.patch(personalityType._id, {
        characterImage: imageUrl,
      });
      
      updates.push({
        shortName: personalityType.shortName,
        name: personalityType.name,
        imageUrl: imageUrl,
      });
    }
    
    return {
      message: `Updated ${updates.length} personality types with character images`,
      updates: updates,
    };
  },
});