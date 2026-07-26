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

export const createProductValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(2).maxLength(255),
        description: vine.string().trim().maxLength(5000).nullable().optional(),
        price: vine.number().min(0),
        imageUrl: vine.string().trim().maxLength(2048).nullable().optional(),
        scoville: vine.number().min(0).optional(),
        inStock: vine.boolean().optional(),
        isActive: vine.boolean().optional(),
        categoryId: vine.number().min(1),
        brandId: vine.number().min(1).nullable().optional(),
        heatLevelId: vine.number().min(1).nullable().optional(),
    })
)

export const updateProductValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(2).maxLength(255).optional(),
        description: vine.string().trim().maxLength(5000).nullable().optional(),
        price: vine.number().min(0).optional(),
        imageUrl: vine.string().trim().maxLength(2048).nullable().optional(),
        scoville: vine.number().min(0).optional(),
        inStock: vine.boolean().optional(),
        isActive: vine.boolean().optional(),
        categoryId: vine.number().min(1).optional(),
        brandId: vine.number().min(1).nullable().optional(),
        heatLevelId: vine.number().min(1).nullable().optional(),
    })
)
