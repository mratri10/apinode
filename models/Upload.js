
module.exports = (sequelize, DataTypes) =>{
    const Upload = sequelize.define('Upload', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
          },
        idKategori:{
          type: DataTypes.STRING,
          allowNull:false
        },
        kategori:{
          type: DataTypes.STRING,
        },
        upload:{
          type: DataTypes.STRING,
          allowNull:false
        },
        createdAt:{
          type: DataTypes.DATE,
          allowNull:false
        },
        updatedAt:{
          type: DataTypes.DATE,
          allowNull:false
        }
    },{
        tableName:'uploads'
    })

    return Upload
}