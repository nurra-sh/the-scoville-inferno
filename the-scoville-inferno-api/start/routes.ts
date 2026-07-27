/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { RolesEnum } from '#enums/role_enums'
const ProductsController = () => import('#controllers/products_controller')
const HeatLevelsController = () => import('#controllers/heat_levels_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const BrandsController = () => import('#controllers/brands_controller')
const AuthController = () => import('#controllers/auth_controller')
const ProfilesController = () => import('#controllers/profiles_controller')
const CartsController = () => import('#controllers/carts_controller')
const OrdersController = () => import('#controllers/orders_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
}).prefix('/api/v1')

// AUTH ROUTES
router
  .group(() => {
    ; (((((router
      .group(() => {
        router.post('/login', [AuthController, 'login'])
        router.post('/register', [AuthController, 'register'])
        router.get('/me', [AuthController, 'me']).use(middleware.auth({ guards: ['api'] }))
      })
      .prefix('/auth'),
      router
        .group(() => {
          router.get('/', [BrandsController, 'index'])
        })
        .prefix('/brands')),
      router
        .group(() => {
          router.get('/', [CategoriesController, 'index'])
        })
        .prefix('/categories')),
      router
        .group(() => {
          router.get('/', [HeatLevelsController, 'index'])
        })
        .prefix('/heat-levels')),
      router
        .group(() => {
          router.get('/', [ProductsController, 'index'])
          router.get('/:id', [ProductsController, 'show'])
        })
        .prefix('/products')),
      router
        .group(() => {
          router.patch('/', [ProfilesController, 'update'])
        })
        .prefix('/profile')),
      router
        .group(() => {
          router.get('/', [CartsController, 'index'])
          router.post('/', [CartsController, 'store'])
          router.delete('/clear', [CartsController, 'clear'])
          router.patch('/:id', [CartsController, 'update'])
          router.delete('/:id', [CartsController, 'destroy'])
        })
        .prefix('/cart')
        .use(middleware.auth({ guards: ['api'] }))
      router
        .group(() => {
          router.get('/', [OrdersController, 'index'])
          router.post('/checkout-session', [OrdersController, 'createCheckoutSession'])
          router.post('/cod', [OrdersController, 'createCodOrder'])
      })
      .prefix('/orders')
      .use(middleware.auth({ guards: ['api'] }))
      router.post('/webhooks/stripe', [OrdersController, 'handleWebhook'])
  })
  .prefix('/api/v1')


// Admin router
// Admin router
router
  .group(() => {
    router
      .group(() => {
        router.get('/', [ProductsController, 'adminIndex'])
        router.post('/', [ProductsController, 'adminStore'])
        router.post('/upload-image', [ProductsController, 'adminUploadImage'])
        router.get('/:id', [ProductsController, 'adminShow'])
        router.patch('/:id', [ProductsController, 'adminUpdate'])
        router.delete('/:id', [ProductsController, 'adminDestroy'])
      })
      .prefix('/products')
  })
  .prefix('/api/v1/admin')
  .use([middleware.auth({ guards: ['api'] }), middleware.role([RolesEnum.ADMIN])])