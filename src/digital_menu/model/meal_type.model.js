// src/models/MealType.js
import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

const MealType = sequelize.define('MealType', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,  
    },
    meal_type: {
        type: DataTypes.ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'),
        allowNull: false,
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
    },
     is_active: { 
        type: DataTypes.BOOLEAN,
        defaultValue: true, 
        allowNull: false,
    }
}, {
    tableName: 'meal_type',
    timestamps: true,
    paranoid: true,  
});

export default MealType;
