const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

//-------------------------------
//------------ SERVER -----------
//-------------------------------

//const PORT = process.env.PORT
const server = http.createServer(app)

server.listen(config.PORT, () =>
{
    logger.info(`Server running on port ${config.PORT}`)
})