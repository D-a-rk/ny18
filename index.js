const { client_token, database } = require('./config.json')

const Client = require('./structures/client')
const client = new Client()

const { connect } = require('mongoose')
connect(database)

client.init(process.env.token)