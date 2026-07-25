import vine from '@vinejs/vine'
import { ProductsOrderColumnsEnum } from '#enums/product_enums'

export const productsIndexValidator = vine.compile(
  vine.object({
    // Пагинация
    page: vine.number().min(1).optional(),
    perPage: vine.number().min(1).max(100).optional(),

    // Фильтры по справочникам (id или slug)
    categoryId: vine.number().min(1).optional(),
    categorySlug: vine.string().trim().optional(),
    brandId: vine.number().min(1).optional(),
    brandSlug: vine.string().trim().optional(),
    heatLevelId: vine.number().min(1).optional(),
    heatLevelSlug: vine.string().trim().optional(),

    // Диапазон цен
    minPrice: vine.number().min(0).optional(),
    maxPrice: vine.number().min(0).optional(),

    // Диапазон остроты
    minScoville: vine.number().min(0).optional(),
    maxScoville: vine.number().min(0).optional(),

    // Наличие
    inStock: vine.boolean().optional(),

    // Поиск
    search: vine.string().trim().minLength(1).optional(),

    // Сортировка
    sortBy: vine.enum(ProductsOrderColumnsEnum).optional(),
    order: vine.enum(['asc', 'desc']).optional(),
  })
)