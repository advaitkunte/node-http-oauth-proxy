// config/database.js
module.exports = {

    'url' : process.env.MONGO_URI_PASSPORT, // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    'url_sessions': process.env.MONGO_URI_PASSPORT_SESSIONS
};