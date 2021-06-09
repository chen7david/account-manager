const router = require('koa-router')()

router.get('/', async (ctx) => {
    const {id} = ctx.request.query
    
    ctx.body = id
})

module.exports = router