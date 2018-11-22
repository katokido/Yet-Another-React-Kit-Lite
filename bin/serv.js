import path from 'path'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import 'colors'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../webpack.config.js'

const isProduction = process.env.NODE_ENV === 'production'
const app = express()
const port = 3090
const host = 'localhost'

if (isProduction) {
  app.use(helmet())
  app.disable('x-powered-by')
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}
app.use(compression())

const startListen = () => {
  console.log('startListen')
  app.listen(port, (err) => {
    if (err) {
      console.log(`\n${err}`)
    }
    console.log(`\nExpress: Listening on port ${port}, open up http://${host}:${port}/ \n`.green)
  })
}

if (!isProduction) {
  // let listend = false
  const compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }))
  app.use(webpackHotMiddleware(compiler))
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../index.html'))
  })
  startListen()
} else {
  app.use(express.static(path.join(__dirname, '../dist')))
  startListen()
}
