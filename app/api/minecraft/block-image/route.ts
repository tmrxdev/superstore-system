import { NextRequest, NextResponse } from 'next/server'

// Minecraft item IDs to crafting wiki image mapping
const BLOCK_IMAGES: Record<string, string> = {
  'minecraft:diamond': 'https://minecraft.wiki/images/Diamond.png',
  'minecraft:emerald': 'https://minecraft.wiki/images/Emerald.png',
  'minecraft:gold_ingot': 'https://minecraft.wiki/images/Gold_Ingot.png',
  'minecraft:iron_ingot': 'https://minecraft.wiki/images/Iron_Ingot.png',
  'minecraft:netherite_ingot': 'https://minecraft.wiki/images/Netherite_Ingot.png',
  'minecraft:copper_ingot': 'https://minecraft.wiki/images/Copper_Ingot.png',
  'minecraft:coal': 'https://minecraft.wiki/images/Coal.png',
  'minecraft:dirt': 'https://minecraft.wiki/images/Dirt.png',
  'minecraft:stone': 'https://minecraft.wiki/images/Stone.png',
  'minecraft:grass_block': 'https://minecraft.wiki/images/Grass_Block.png',
  'minecraft:oak_log': 'https://minecraft.wiki/images/Oak_Log.png',
  'minecraft:dark_oak_log': 'https://minecraft.wiki/images/Dark_Oak_Log.png',
  'minecraft:spruce_log': 'https://minecraft.wiki/images/Spruce_Log.png',
  'minecraft:birch_log': 'https://minecraft.wiki/images/Birch_Log.png',
  'minecraft:oak_planks': 'https://minecraft.wiki/images/Oak_Planks.png',
  'minecraft:dark_oak_planks': 'https://minecraft.wiki/images/Dark_Oak_Planks.png',
  'minecraft:spruce_planks': 'https://minecraft.wiki/images/Spruce_Planks.png',
  'minecraft:birch_planks': 'https://minecraft.wiki/images/Birch_Planks.png',
  'minecraft:cobblestone': 'https://minecraft.wiki/images/Cobblestone.png',
  'minecraft:obsidian': 'https://minecraft.wiki/images/Obsidian.png',
  'minecraft:ender_pearl': 'https://minecraft.wiki/images/Ender_Pearl.png',
  'minecraft:blaze_powder': 'https://minecraft.wiki/images/Blaze_Powder.png',
  'minecraft:redstone': 'https://minecraft.wiki/images/Redstone_Dust.png',
  'minecraft:lapis_lazuli': 'https://minecraft.wiki/images/Lapis_Lazuli.png',
  'minecraft:amethyst_shard': 'https://minecraft.wiki/images/Amethyst_Shard.png',
  'minecraft:andesite': 'https://minecraft.wiki/images/Andesite.png',
  'minecraft:diorite': 'https://minecraft.wiki/images/Diorite.png',
  'minecraft:granite': 'https://minecraft.wiki/images/Granite.png',
  'minecraft:sand': 'https://minecraft.wiki/images/Sand.png',
  'minecraft:gravel': 'https://minecraft.wiki/images/Gravel.png',
  'minecraft:iron_ore': 'https://minecraft.wiki/images/Iron_Ore.png',
  'minecraft:gold_ore': 'https://minecraft.wiki/images/Gold_Ore.png',
  'minecraft:diamond_ore': 'https://minecraft.wiki/images/Diamond_Ore.png',
  'minecraft:deepslate_diamond_ore': 'https://minecraft.wiki/images/Deepslate_Diamond_Ore.png',
  'minecraft:ice': 'https://minecraft.wiki/images/Ice.png',
  'minecraft:snow_block': 'https://minecraft.wiki/images/Snow_Block.png',
  'minecraft:slime_block': 'https://minecraft.wiki/images/Slime_Block.png',
  'minecraft:honey_block': 'https://minecraft.wiki/images/Honey_Block.png',
  'minecraft:wither_skeleton_skull': 'https://minecraft.wiki/images/Wither_Skeleton_Skull.png',
  'minecraft:creeper_head': 'https://minecraft.wiki/images/Creeper_Head.png',
  'minecraft:dragon_egg': 'https://minecraft.wiki/images/Dragon_Egg.png',
  'minecraft:nether_star': 'https://minecraft.wiki/images/Nether_Star.png',
  'minecraft:bedrock': 'https://minecraft.wiki/images/Bedrock.png',
  'minecraft:end_stone': 'https://minecraft.wiki/images/End_Stone.png',
  'minecraft:netherrack': 'https://minecraft.wiki/images/Netherrack.png',
  'minecraft:soul_sand': 'https://minecraft.wiki/images/Soul_Sand.png',
  'minecraft:soul_soil': 'https://minecraft.wiki/images/Soul_Soil.png',
}

export async function GET(request: NextRequest) {
  try {
    const itemId = request.nextUrl.searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json(
        { error: 'itemId parameter is required' },
        { status: 400 }
      )
    }

    const normalizedId = itemId.toLowerCase()
    const imageUrl = BLOCK_IMAGES[normalizedId]

    if (!imageUrl) {
      return NextResponse.json(
        { error: `Block image not found for "${itemId}". Try items like "minecraft:diamond", "minecraft:emerald", etc.` },
        { status: 404 }
      )
    }

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Failed to fetch block image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch block image' },
      { status: 500 }
    )
  }
}
