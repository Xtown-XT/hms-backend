import { sequelize } from "../../db/index.js";
import { DataTypes } from "sequelize";
import Guest from "../../frontoffice/model/guest.model.js";
import MealItem from "../../digital_menu/model/meal_item.model.js";
import Room from "../../frontoffice/model/room.model.js";

const Cart = sequelize.define(
    "Cart",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        guest_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Guest,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        room_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Room,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        meal_item_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: MealItem,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        status: {
            type: DataTypes.ENUM("Active", "CheckedOut", "Cancel"),
            defaultValue: "Active",
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "cart",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        paranoid: true,
    }
);

Cart.belongsTo(Guest, {
    foreignKey: "guest_id",
    as: "guest",
});

Cart.belongsTo(MealItem, {
    foreignKey: "meal_item_id",
    as: "mealItem",
});

Cart.belongsTo(Room, {
    foreignKey: "room_id",
    as: "room",
});

export default Cart;
