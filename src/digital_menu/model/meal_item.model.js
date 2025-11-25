// src/models/MealItem.js
import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';

import Cuisine from '../model/cuisine.model.js';
import MealType from '../model/meal_type.model.js';

const MealItem = sequelize.define('MealItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    cuisine_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Cuisine,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    meal_type_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: MealType,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    course_type: {
        type: DataTypes.ENUM('veg', 'non-veg'),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: true,
       
    },

    image: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    tableName: 'meal_items',
    timestamps: true,
    paranoid: true,
});

MealItem.belongsTo(Cuisine, {
    foreignKey: 'cuisine_id',
    as: 'cuisine',
});

MealItem.belongsTo(MealType, {
    foreignKey: 'meal_type_id',
    as: 'meal_type',
});

export default MealItem;
