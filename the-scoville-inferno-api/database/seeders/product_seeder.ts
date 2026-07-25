import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'
import Category from '#models/category'
import Brand from '#models/brand'
import HeatLevel from '#models/heat_level'

type ProductSeed = {
  name: string
  slug: string
  description: string
  price: number
  scoville: number
  inStock: boolean
  isActive: boolean
  categoryId: number
  brandId: number | null
  heatLevelId: number | null
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export default class extends BaseSeeder {
  async run() {
    // Load reference data keyed by slug so we can mix and match freely.
    const categories = await Category.all()
    const brands = await Brand.all()
    const heatLevels = await HeatLevel.all()

    const categoryBySlug = new Map(categories.map((c) => [c.slug, c]))
    const brandBySlug = new Map(brands.map((b) => [b.slug, b]))

    // Sorted ascending so we can resolve a heat level from a scoville value.
    const sortedHeatLevels = [...heatLevels].sort((a, b) => a.minScoville - b.minScoville)

    const heatLevelForScoville = (scoville: number) => {
      const match = sortedHeatLevels.find(
        (h) => scoville >= h.minScoville && (h.maxScoville === null || scoville < h.maxScoville)
      )
      return (match ?? sortedHeatLevels[sortedHeatLevels.length - 1]).id
    }

    // Pools of building blocks per category to generate varied, plausible names.
    const peppers = [
      { name: 'Jalapeño', scoville: 5000 },
      { name: 'Serrano', scoville: 18000 },
      { name: 'Cayenne', scoville: 40000 },
      { name: 'Thai', scoville: 75000 },
      { name: 'Habanero', scoville: 200000 },
      { name: 'Scotch Bonnet', scoville: 300000 },
      { name: 'Ghost Pepper', scoville: 855000 },
      { name: 'Trinidad Scorpion', scoville: 1400000 },
      { name: 'Carolina Reaper', scoville: 2200000 },
      { name: 'Pepper X', scoville: 2693000 },
    ]

    const brandSlugs = ['el-diablo', 'mad-dog', 'da-bomb', 'blairs']
    const pick = <T>(arr: T[], i: number) => arr[i % arr.length]

    const products: ProductSeed[] = []
    const seen = new Set<string>()

    const push = (
      p: Omit<ProductSeed, 'heatLevelId' | 'isActive' | 'inStock'> & Partial<ProductSeed>
    ) => {
      if (seen.has(p.slug)) return
      seen.add(p.slug)
      products.push({
        inStock: p.inStock ?? true,
        isActive: p.isActive ?? true,
        heatLevelId: heatLevelForScoville(p.scoville),
        ...p,
      })
    }

    // --- Hot sauces: one per pepper × per brand ---
    const sauces = categoryBySlug.get('hot-sauces')!
    let n = 0
    for (const pepper of peppers) {
      for (const brandSlug of brandSlugs) {
        const brand = brandBySlug.get(brandSlug)!
        const variant = pick(['Sauce', 'Hot Sauce', 'Reserve', 'Extract'], n)
        const name = `${pepper.name} ${variant}`
        push({
          name,
          slug: slugify(`${pepper.name}-${variant}-${brandSlug}`),
          description: `Острый соус на основе перца ${pepper.name} от ${brand.name}.`,
          price: Math.round((8 + (pepper.scoville / 100000) * 1.5 + (n % 5)) * 100) / 100,
          scoville: Math.round(pepper.scoville * (0.85 + (n % 4) * 0.05)),
          categoryId: sauces.id,
          brandId: brand.id,
          inStock: n % 7 !== 0,
        })
        n++
      }
    }

    // --- Whole peppers (fresh / dried) ---
    const peppersCat = categoryBySlug.get('peppers')!
    peppers.forEach((pepper, i) => {
      const form = i % 2 === 0 ? 'Fresh' : 'Dried'
      push({
        name: `${pepper.name} (${form})`,
        slug: slugify(`pepper-${pepper.name}-${form}`),
        description: `${form === 'Fresh' ? 'Свежие' : 'Сушёные'} перцы ${pepper.name}.`,
        price: Math.round((3 + pepper.scoville / 200000) * 100) / 100,
        scoville: pepper.scoville,
        categoryId: peppersCat.id,
        brandId: null,
      })
    })

    // --- Snacks ---
    const snacks = categoryBySlug.get('snacks')!
    const snackBases = ['Chips', 'Peanuts', 'Jerky', 'Popcorn', 'Crackers', 'Nuts Mix']
    snackBases.forEach((base, i) => {
      const pepper = pick(peppers, i + 3)
      const brand = brandBySlug.get(pick(brandSlugs, i))!
      push({
        name: `${pepper.name} ${base}`,
        slug: slugify(`snack-${pepper.name}-${base}`),
        description: `Снэк "${base}" с перцем ${pepper.name}.`,
        price: Math.round((4 + i * 0.75) * 100) / 100,
        scoville: Math.round(pepper.scoville * 0.4),
        categoryId: snacks.id,
        brandId: brand.id,
      })
    })

    // --- Marinades ---
    const marinades = categoryBySlug.get('marinades')!
    const marinadeStyles = ['BBQ', 'Teriyaki', 'Smoky', 'Citrus', 'Garlic']
    marinadeStyles.forEach((style, i) => {
      const pepper = pick(peppers, i + 1)
      const brand = brandBySlug.get(pick(brandSlugs, i + 2))!
      push({
        name: `${style} ${pepper.name} Marinade`,
        slug: slugify(`marinade-${style}-${pepper.name}`),
        description: `Маринад "${style}" с перцем ${pepper.name}.`,
        price: Math.round((6 + i * 0.5) * 100) / 100,
        scoville: Math.round(pepper.scoville * 0.3),
        categoryId: marinades.id,
        brandId: brand.id,
        isActive: i !== 4,
      })
    })

    // --- Gift sets ---
    const giftSets = categoryBySlug.get('gift-sets')!
    const giftTiers = [
      { tier: 'Starter', mult: 0.5, scoville: 50000 },
      { tier: 'Inferno', mult: 1.5, scoville: 855000 },
      { tier: 'Apocalypse', mult: 3, scoville: 2200000 },
    ]
    giftTiers.forEach((g, i) => {
      const brand = brandBySlug.get(pick(brandSlugs, i))!
      push({
        name: `${g.tier} Gift Box`,
        slug: slugify(`gift-${g.tier}`),
        description: `Подарочный набор уровня "${g.tier}" от ${brand.name}.`,
        price: Math.round(25 * g.mult * 100) / 100,
        scoville: g.scoville,
        categoryId: giftSets.id,
        brandId: brand.id,
      })
    })

    await Product.updateOrCreateMany('slug', products)
  }
}