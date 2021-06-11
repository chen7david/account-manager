const router = require('koa-router')()
const controller = require('../controllers/UserController')
const { validation, worker  } = require('./../middleware')
const routes = ['/user', '/users', '/user-devices', '/user-roles']

router.param('id', controller.loadInstance)
router.use(routes, worker.loadFromAccessToken)
router.use('/users', worker.hasAnyRole('admin'))

router.post('/register',
    validation.validate(validation.schema.createUser),
    controller.create
)

/* USER */
router.get('/user', controller.getSelf)
router.get('/user-devices', controller.getSelfRelated('devices'))
router.get('/user-roles', controller.getSelfRelated('roles'))
router.patch('/user-roles/:id', controller.sycnRoles)

/* USERS */
router.get('/users', controller.index)
router.get('/users/:id', controller.view)
router.get('/users/:id/roles', controller.getRelated('roles'))
router.post('/users/:id/roles', controller.addRole)
router.delete('/users/:id/roles', controller.removeRole)
router.get('/users/:id/devices', controller.getRelated('devices'))
router.delete('/users/:id', controller.delete)
router.patch('/users/:id',
    validation.validate(validation.schema.updateUser),
    controller.update
)


module.exports = router