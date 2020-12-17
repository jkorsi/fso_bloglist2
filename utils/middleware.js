const logger = require('./logger')

const requestLogger = (request, response, next) =>
{
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response, next) =>
{
    response.status(404).send({error: 'unknown endpoint'})
    next()
}

const errorHandler = (error, request, response, next) =>
{
    logger.error(error.message)

    if (error.name === 'CastError')
    {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError')
    {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

const tokenExtractor = (request, response, next) =>
{
    request.token = getToken(request)
    next()
}

const getToken = request =>
{
    const auth = request.get('authorization')
    if (auth && auth.toLowerCase().startsWith('bearer '))
    {
        return auth.substring(7)
    }
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor
}