module.exports=(sequelize,DataTypes)=>{
    let alias = "usuario";
    let config={
        timestamps: false,
        deletedAt: false,
        tableName: "usuarios"
    }
    let cols = {
        id:{
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_name:{
            allowNull: false,
            type: DataTypes.STRING
        },
        password:{
            allowNull: false,
            type: DataTypes.STRING
        },
        permiso:{
            allowNull: false,
            type: DataTypes.STRING
        },
        name:{
            allowNull: false,
            type: DataTypes.STRING
        },
        last_name:{
            allowNull: false,
            type: DataTypes.STRING
        }
    }
    const Usuario = sequelize.define(alias, cols, config)


    return Usuario
}