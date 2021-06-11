const router = require('koa-router')()
const controller = require('../controllers/RoleController')
const { validation, worker  } = require('../middleware')

router.param('id', controller.loadInstance)
router.use('/roles', worker.loadFromAccessToken, worker.hasAnyRole('admin'))

/* ROLES */
router.get('/roles', controller.index)
router.get('/roles/:id', controller.view)
router.get('/roles/:id/users', controller.getRelated('users'))
router.delete('/roles/:id', controller.delete)
router.patch('/roles/:id',
    validation.validate(validation.schema.updateRole),
    controller.update
)

module.exports = router