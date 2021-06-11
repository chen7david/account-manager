const router = require('koa-router')()
const { validation, worker  } = require('./../middleware')
const controller = require('./../controllers/AuthController')

router.get('/connections', controller.connections)
router.get('/pubkey', controller.getPubKey)

router.get('/renewkeys',
    worker.loadFromAccessToken, 
    worker.hasAnyRole('admin'), 
    controller.renewkeys
)

router.post('/login',
    validation.validate(validation.schema.login),
    worker.loadFromUsername,
    worker.loadDevice,
    worker.checkDevice,  
    worker.checkPassword,
    worker.checkEmail,
    controller.authenticate
)

router.post('/qrlogin', 
    worker.loadFromRefreshToken, 
    worker.loadDevice,
    worker.checkDevice,  
    worker.swapuseragent,
    worker.loadDevice,
    worker.checkDevice, 
    worker.checkEmail,
    controller.qrlogin
)


router.post('/refresh', 
    worker.loadFromRefreshToken,
    worker.loadDevice,
    worker.checkDevice,
    controller.refresh
)

router.post('/email-verification',
    validation.validate(validation.schema.username),
    worker.loadFromUsername,
    controller.sendEmailVerification
)

router.patch('/email-verification',
    validation.validate(validation.schema.verificationCode),
    controller.verifyEmail
)

router.post('/device-verification', 
    worker.loadFromAccessToken,
    worker.loadDevice,
    worker.checkDevice,
    controller.sendDeviceVerification
)

router.patch('/device-verification',
    validation.validate(validation.schema.verificationCode),
    controller.verifyDevice
)

router.post('/device-primary', 
    worker.loadFromAccessToken,
    worker.loadDevice,
    worker.checkDevice,
    controller.sendMakePrimaryDevice
) 

router.patch('/device-primary',
    validation.validate(validation.schema.verificationCode),
    controller.makePrimaryDevice
)

router.post('/password-recovery', 
    validation.validate(validation.schema.username),
    worker.loadFromUsername,
    controller.sendPasswordRecovery
)

router.patch('/password-recovery',
    validation.validate(validation.schema.passwordRecovery),
    controller.recoverPassword
)



module.exports = router