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
import BrandsController from '#controllers/brands_controller'
import CategoriesController from '#controllers/categories_controller'
import HeatLevelsController from '#controllers/heat_levels_controller'
import ProductsController from '#controllers/products_controller'

const AuthController = () => import('#controllers/auth_controller')
router.get('/', async () => {
  return {
    hello: 'world',
  }
}).prefix('/api/v1')

// AUTH ROUTES
router
  .group(() => {
    ; ((((router
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
        .prefix('/products'))
  })
  .prefix('/api/v1')