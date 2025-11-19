import { sequelize } from '../../db/index.js'; 
import { DataTypes } from 'sequelize';  

const Cuisine = sequelize.define('Cuisine', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    cuisine_type: {
        type: DataTypes.ENUM('italian', 'chinese', 'indian', 'mexican', 'french', 'japanese', 'thai', 'vietnamese', 'korean'),
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    deleted_by: {
        type: DataTypes.UUID,
        allowNull: true,
    }
}, {
    tableName: 'cuisine',
    timestamps: true,
    paranoid: true, 
});

export default Cuisine;
