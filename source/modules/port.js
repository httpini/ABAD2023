module.exports = {
    port: process.env.PORT || 8020,
    callback: function(){
        console.log("Abriendo el servidor http://localhost:8020")
    },
    db_host: process.env.DB_HOST || "127.0.0.1",
    db_user: process.env.DB_USER || "root",
    db_password: process.env.DB_PASSWORD || null,
    db_name: process.env.DB_NAME || "abad",
    db_port: process.env.DB_PORT || null
}