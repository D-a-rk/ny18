const { set, Schema, model } = require('mongoose')

set('strictQuery', true);

module.exports = {
  users: model('User', new Schema({
    userId: String,
    color: String,
    limit: { type: Number, default: 0 },
    ability: { type: Boolean, default: false }
  })),

  roles: model('Role', new Schema({
    roleId: String,
    ability: { type: Boolean, default: false }
  })),

  markers: model('Marker', new Schema({
    channelId: String,
    guildId: String,
    messageId: String,
    markers: Array,
  }))
}