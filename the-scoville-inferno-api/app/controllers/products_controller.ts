import Product from '#models/product'
import { ProductsOrderColumnsEnum } from '#enums/product_enums'
import { createProductValidator, productsIndexValidator, updateProductValidator } from '#validators/product'
import type { HttpContext } from '@adonisjs/core/http'
import string from '@adonisjs/core/helpers/string'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export default class ProductsController {
  async index({ request, response }: HttpContext) {
    const filters = await request.validateUsing(productsIndexValidator, {
      data: request.qs(),
    })

    const page = filters.page ?? 1
    const perPage = filters.perPage ?? 12
    const order = filters.order ?? 'desc'

    const query = Product.query()
      .where('is_active', true)
      .preload('category', (q) => q.select('*'))
      .preload('brand', (q) => q.select('*'))
      .preload('heatLevel', (q) => q.select('*'))

    if (filters.categoryId) {
      query.where('category_id', filters.categoryId)
    }
    if (filters.categorySlug) {
      query.whereHas('category', (q) => q.where('slug', filters.categorySlug!))
    }
    if (filters.brandId) {
      query.where('brand_id', filters.brandId)
    }
    if (filters.brandSlug) {
      query.whereHas('brand', (q) => q.where('slug', filters.brandSlug!))
    }
    if (filters.heatLevelId) {
      query.where('heat_level_id', filters.heatLevelId)
    }
    if (filters.heatLevelSlug) {
      query.whereHas('heatLevel', (q) => q.where('slug', filters.heatLevelSlug!))
    }

    if (filters.minPrice !== undefined && filters.minPrice >= 0) {
      query.where('price', '>=', filters.minPrice)
    }
    if (filters.maxPrice !== undefined && filters.maxPrice >= 0) {
      query.where('price', '<=', filters.maxPrice)
    }

    if (filters.minScoville !== undefined && filters.minScoville >= 0) {
      query.where('scoville', '>=', filters.minScoville)
    }
    if (filters.maxScoville !== undefined && filters.maxScoville >= 0) {
      query.where('scoville', '<=', filters.maxScoville)
    }

    if (filters.inStock !== undefined) {
      query.where('in_stock', filters.inStock)
    }

    if (filters.search) {
      // search => Red Pepper => red Pepper => все будет норм так как ILike регистронезависимый
      query.whereILike('name', `%${filters.search}%`)
    }

    const sortColumnMap: Record<ProductsOrderColumnsEnum, string> = {
      [ProductsOrderColumnsEnum.name]: 'name',
      [ProductsOrderColumnsEnum.slug]: 'slug',
      [ProductsOrderColumnsEnum.description]: 'description',
      [ProductsOrderColumnsEnum.price]: 'price',
      [ProductsOrderColumnsEnum.scoville]: 'scoville',
      [ProductsOrderColumnsEnum.inStock]: 'in_stock',
    }
    const sortColumn = filters.sortBy ? sortColumnMap[filters.sortBy] : 'updated_at'
    query.orderBy(sortColumn, order)
    // Вторичная сортировка по уникальному id — стабилизирует порядок при одинаковых
    // значениях в основной колонке, иначе строки "переезжают" между страницами (дубли на стыке)
    query.orderBy('id', order)

    const products = await query.paginate(page, perPage)

    return response.ok(products)
  }


  async show({ params, response }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .where('is_active', true)
      .preload('category', (q) => q.select('*'))
      .preload('brand', (q) => q.select('*'))
      .preload('heatLevel', (q) => q.select('*'))
      .first()

    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    return response.ok({ data: product })
  }

  async adminIndex({ request, response }: HttpContext) {
    const page = Number(request.input('page', 1))
    const perPage = Number(request.input('perPage', 12))
    const search = request.input('search')

    const query = Product.query()
      .preload('category', (q) => q.select('*'))
      .preload('brand', (q) => q.select('*'))
      .preload('heatLevel', (q) => q.select('*'))
      .orderBy('updated_at', 'desc')
      .orderBy('id', 'desc')

    if (search) {
      query.whereILike('name', `%${search}%`)
    }

    const products = await query.paginate(page, perPage)

    return response.ok(products)
  }

  async adminShow({ params, response }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .preload('category', (q) => q.select('*'))
      .preload('brand', (q) => q.select('*'))
      .preload('heatLevel', (q) => q.select('*'))
      .first()

    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    return response.ok({ data: product })
  }



  async adminStore({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)

    const slug = await this.generateUniqueSlug(payload.name)

    await Product.create({ ...payload, slug })

    return response.created({
      message: 'Product created successfully',
    })
  }

  async adminUpdate({ params, request, response }: HttpContext) {
    const product = await Product.find(params.id)

    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    const payload = await request.validateUsing(updateProductValidator)

    product.merge(payload)
    await product.save()
    await product.load('category')

    return response.ok({ data: product })
  }

  async adminUploadImage({ request, response }: HttpContext) {
    const image = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    })

    if (!image) {
      return response.badRequest({ message: 'No image provided' })
    }

    if (!image.isValid) {
      return response.badRequest({ message: image.errors || 'Invalid file' })
    }

    const fileName = `${cuid()}.${image.extname}` // gifhdoj213shi4h23i432.png
    await image.move(app.makePath('public/uploads/products'), { name: fileName })

    return response.created({
      message: 'Image was uploaded',
      url: `/uploads/products/${fileName}`,
    })
  }

  async adminDestroy({ params, response }: HttpContext) {
    const product = await Product.find(params.id)

    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    await product.delete()

    return response.noContent()
  }

  private async generateUniqueSlug(name: string, ignoreId?: number): Promise<string> {
    // name = Super Hot Jalapeno
    const base = string.slug(name, { lower: true }) || 'product' // super-hot-jalapeno
    let slug = base
    let counter = 1

    while (true) {
      const query = Product.query().where('slug', slug) // ищу есть ли где то в базе: super-hot-jalapeno-1

      if (ignoreId) {
        query.whereNot('id', ignoreId)
      }

      const existing = await query.first()

      if (!existing) {
        // если нет то остнавливаю цикл и присваиваю продукты: super-hot-jalapeno-1
        break
      }
      slug = `${base}-${counter}` // если есть super-hot-jalapeno, super-hot-jalapeno-2
      counter++
    }

    return slug
  }
}