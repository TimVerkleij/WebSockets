const router = require('express').Router()

router.get('/test', (req, res) => {
    res.send("Hey")
})

module.exports = router