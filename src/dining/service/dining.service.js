
// import { Op } from 'sequelize';
// import DiningTable from '../models/dining.models.js';

// // ✅ Create Dining Table
// export const createDiningTable = async (data) => {
//   return await DiningTable.create({
//     ...data,
//     is_active: data.is_active ?? true,  
//   });
// };

// // ✅ Get Dining Table by ID
// export const getDiningTableById = async (id) => {
//   return await DiningTable.findByPk(id, {
//     include: [
//       { model: User, as: 'createdByUser' },
//       { model: User, as: 'updatedByUser' },
//     ],
//   });
// };

// // ✅ Get All Dining Tables with filters & pagination
// export const getAllDiningTables = async ({
//   page = 1,
//   limit = 10,
//   filters = {},
//   order = 'DESC',  // Default to DESC
//   include = [],
// }) => {
//   const andConditions = [];

//   // Apply filters to the query
//   if (filters.table_number) {
//     andConditions.push({
//       table_number: { [Op.like]: `%${filters.table_number}%` },
//     });
//   }
//   if (filters.is_active !== undefined) {
//     andConditions.push({ is_active: filters.is_active });
//   }

//   // Pagination
//   const offset = (page - 1) * limit;

//   // Ensuring order is applied correctly and is either ASC or DESC
//   const orderDirection = (order?.toUpperCase() === 'ASC' || order?.toUpperCase() === 'DESC') 
//     ? order.toUpperCase() 
//     : 'DESC'; 
//   const orderBy = [['createdAt', orderDirection]];  // Default order by createdAt

//   try {
//     const result = await DiningTable.findAndCountAll({
//       where: andConditions.length ? { [Op.and]: andConditions } : {},
//       order: orderBy,
//       limit,
//       offset,
//       distinct: true,
//       include,
//       logging: console.log,
//     });

//     return {
//       total: result.count,
//       pages: Math.ceil(result.count / limit),
//       currentPage: page,
//       diningTables: result.rows,
//     };
//   } catch (error) {
//     console.error('Error executing query:', error);
//     throw error;
//   }
// };

// // ✅ Update Dining Table
// export const updateDiningTable = async (id, data) => {
//   const diningTable = await DiningTable.findByPk(id);

//   if (!diningTable) return null;

//   await diningTable.update({
//     ...data,
//     is_active: data.is_active ?? diningTable.is_active,
//   });

//   return diningTable;
// };

// // ✅ Delete Dining Table (Soft Delete)
// export const deleteDiningTable = async (id, payload = {}) => {
//   const diningTable = await DiningTable.findByPk(id);
//   if (!diningTable) return null;

//   if (payload && Object.keys(payload).length > 0) {
//     await diningTable.update(payload); 
//   }

//   await diningTable.destroy();  // Soft delete
//   return diningTable;
// };



import DiningTable from '../models/dining.models.js';


export const DiningTableService = {
  async create(data) {
    return await DiningTable.create(data);
  },

async findAll({ includeInactive = false, search, page = 1, limit = 10, orderBy = "createdAt", order = "asc" }) {
    const where = {};

    if (!includeInactive) {
      where.is_active = true;
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` }; 
    }

    const offset = (page - 1) * limit;

    return await DiningTable.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[orderBy, order.toUpperCase()]], 
    });
  },

  async findById(id) {
    return await DiningTable.findByPk(id);
  },

  async update(id, data) {
    const table = await DiningTable.findByPk(id);
    if (!table) return null;
    await table.update(data);
    return table;
  },

  async softDelete(id, deletedMeta) {
    if (!id) return null;

    const table = await DiningTable.findByPk(id);
    if (!table) return null;

    await table.update({
      is_active: false,
      ...deletedMeta
    });

    return table;
  },

  async restore(id) {
    const table = await DiningTable.findByPk(id);
    if (!table) return null;

    await table.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
    });
    return table;
  }
};
