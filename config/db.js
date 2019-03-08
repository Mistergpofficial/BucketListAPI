module.exports = {
    port: process.env.PORT || 4000,
    mongo: {
        db_connection: 'localhost:27017',
        db_name: 'bucket'
    },
    env: process.env.JWT_KEY || "secret"
}