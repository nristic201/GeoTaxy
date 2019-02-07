module.exports = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    database: "aips",
    password: "0000",
    entities: ["src/entiteti/*.ts"],
    logging: false
}

// module.exports = {
//     type: "mysql",
//     host: "10.14.0.5",
//     port: 3306,
//     username: "martinovic",
//     database: "db_martinovic",
//     password: "P@ssword123!",
//     entities: ["src/entiteti/*.ts"],
//     logging: false
// }