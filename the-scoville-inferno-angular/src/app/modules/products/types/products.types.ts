import { PaginationMeta } from "../../../core/types/global.types"
import { Brand } from "../../brands/types/brands.types"
import { Category } from "../../categories/types/categories.types"
import { HeatLevel } from "../../heat-levels/types/heat-levels.types"

export interface Product {
    id: number
    name: string
    slug: string
    description: string | null
    price: string
    imageUrl: string | null
    scoville: number
    inStock: boolean
    isActive: boolean
    categoryId: number
    brandId: number | null
    heatLevelId: number | null
    category: Category
    brand: Brand | null
    heatLevel: HeatLevel | null
    createdAt: string
    updatedAt: string | null
}

export type ProductsSortBy = 'name' | 'slug' | 'description' | 'price' | 'scoville' | 'inStock'

export interface ProductsFilters {
    page?: number
    perPage?: number
    categoryId?: number
    categorySlug?: string
    brandId?: number
    brandSlug?: string
    heatLevelId?: number
    heatLevelSlug?: string
    minPrice?: number
    maxPrice?: number
    minScoville?: number
    maxScoville?: number
    inStock?: boolean
    search?: string
    sortBy?: ProductsSortBy
    order?: 'asc' | 'desc'
}

export interface GetProductsResponse {
    meta: PaginationMeta
    data: Product[]
}

export interface GetProductResponse {
    data: Product
}


// ADMIN
export interface AdminProductsFilters {
    page?: number
    perPage?: number
    search?: string
}

export interface CreateProductBody {
    name: string
    description?: string | null
    price: number
    imageUrl?: string | null
    scoville?: number
    inStock?: boolean
    isActive?: boolean
    categoryId: number
    brandId?: number | null
    heatLevelId?: number | null
}

export type UpdateProductBody = Partial<CreateProductBody>

export interface MutateProductResponse {
    data: Product
}

export interface UploadImageResponse {
  message: string
    url: string
}