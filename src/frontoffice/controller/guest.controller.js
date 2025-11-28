// import BaseService from "../../services/service.js";
// import {
//   createGuestSchema,
//   updateGuestSchema,
//   deleteGuestSchema,
// } from "../dto/guest.dto.js";
// import Guest from "../model/guest.model.js";

// const guestService = new BaseService(Guest);

// const isAdmin = (req) => req.user && req.user.role === "admin";

// // CREATE Guest
// export const createGuest = async (req, res) => {
//   try {
//     if (!isAdmin(req))
//       return res.status(403).json({ message: "Admins only." });

//     const data = createGuestSchema.parse(req.body);

//     const payload = {
//       ...data,
//       created_by: req.user?.id || null,
//     };

//     const guest = await guestService.create(payload);
//     return res.status(201).json({ message: "Guest created", data: guest });

//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

// // GET ALL
// export const getAllGuests = async (req, res) => {
//   try {
//     if (!isAdmin(req))
//       return res.status(403).json({ message: "Admins only." });

//     const {
//       search,
//       page = 1,
//       limit = 10,
//       order = "DESC",
//     } = req.query;

//     const result = await guestService.getAll({
//       search,
//       searchFields: [
//         "firstname", "lastname", "phone", "email",
//         "id_proof_no", "nationality"
//       ],
//       page: Number(page),
//       limit: Number(limit),
//       orderBy: "createdAt",  // FIXED
//       order,
//     });

//     return res.status(200).json({
//       message: "Guests fetched",
//       total: result.count,
//       page: Number(page),
//       totalPages: Math.ceil(result.count / limit),
//       data: result.rows,
//     });

//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

// // GET BY ID
// export const getGuestById = async (req, res) => {
//   try {
//     if (!isAdmin(req))
//       return res.status(403).json({ message: "Admins only." });

//     const guest = await guestService.getById(req.params.id);
//     if (!guest) return res.status(404).json({ message: "Not found" });

//     return res.json({ message: "Guest retrieved", data: guest });

//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

// // UPDATE
// export const updateGuest = async (req, res) => {
//   try {
//     if (!isAdmin(req))
//       return res.status(403).json({ message: "Admins only." });

//     const data = updateGuestSchema.parse(req.body);

//     const payload = {
//       ...data,
//       updated_by: req.user?.id || null,
//     };

//     const guest = await guestService.update(req.params.id, payload);
//     if (!guest) return res.status(404).json({ message: "Not found" });

//     return res.json({ message: "Guest updated", data: guest });

//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

// // DELETE / BULK DELETE
// export const deleteGuest = async (req, res) => {
//   try {
//     if (!isAdmin(req))
//       return res.status(403).json({ message: "Admins only." });

//     const data = deleteGuestSchema.parse({
//       id: req.params.id,
//       ids: req.body.ids,
//     });

//     let result;

//     if (data.id) {
//       result = await guestService.delete(data.id);
//     } else {
//       result = [];
//       for (const id of data.ids) {
//         result.push(await guestService.delete(id));
//       }
//     }

//     return res.json({ message: "Guest(s) deleted", data: result });

//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

// // RESTORE
// export const restoreGuest = async (req, res) => {
//   try {
//     if (!isAdmin(req))
//       return res.status(403).json({ message: "Admins only." });

//     const guest = await Guest.findByPk(req.params.id, { paranoid: false });
//     if (!guest) return res.status(404).json({ message: "Not found" });

//     await guest.restore();
//     return res.json({ message: "Guest restored", data: guest });

//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

import BaseService from "../../services/service.js";
import {
  createGuestSchema,
  updateGuestSchema,
  deleteGuestSchema,
} from "../dto/guest.dto.js";
import Guest from "../model/guest.model.js";
import Room from "../model/room.model.js";

const guestService = new BaseService(Guest);

const isAdmin = (req) => req.user && req.user.role === "admin";

// CREATE
// export const createGuest = async (req, res) => {
//   try {
//     if (!isAdmin(req))
//       return res.status(403).json({ message: "Admins only." });

//     const data = createGuestSchema.parse(req.body);

//     const payload = {
//       ...data,
//       created_by: req.user?.id || null,
//     };

//     const guest = await guestService.create(payload);
//     return res.status(201).json({ message: "Guest created", data: guest });
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

export const createGuest = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admins only." });
    }

    // Validate request body
    const data = createGuestSchema.parse(req.body);

    // Check if room exists
    if (data.room_no) {
      const room = await Room.findOne({ where: { room_no: data.room_no } });
      if (!room) {
        return res.status(400).json({ message: `Room number ${data.room_no} does not exist.` });
      }
    }

    // Add created_by field
    const payload = {
      ...data,
      created_by: req.user?.id || null,
    };

    // Create guest
    const guest = await guestService.create(payload);

    return res.status(201).json({ message: "Guest created successfully", data: guest });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({ message: "Validation error", errors: error.errors });
    }
    console.error("Create Guest Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET ALL
export const getAllGuests = async (req, res) => {
  try {
    if (!isAdmin(req))
      return res.status(403).json({ message: "Admins only." });

    const { search, page = 1, limit = 10, order = "DESC" } = req.query;

    const result = await guestService.getAll({
      search,
      searchFields: ["firstname", "lastname", "phone", "email", "id_proof_no"],
      page: Number(page),
      limit: Number(limit),
      orderBy: "createdAt",
      order,
      include: [{ model: Room, as: "roomDetails" }],
    });

    return res.status(200).json({
      message: "Guests fetched",
      total: result.count,
      page: Number(page),
      totalPages: Math.ceil(result.count / limit),
      data: result.rows,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// GET by ID
export const getGuestById = async (req, res) => {
  try {
    if (!isAdmin(req))
      return res.status(403).json({ message: "Admins only." });

    const guest = await Guest.findByPk(req.params.id, {
      include: [{ model: Room, as: "roomDetails" }],
    });

    if (!guest) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Guest retrieved", data: guest });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const updateGuest = async (req, res) => {
  try {
    if (!isAdmin(req))
      return res.status(403).json({ message: "Admins only." });

    const data = updateGuestSchema.parse(req.body);

    const payload = {
      ...data,
      updated_by: req.user?.id || null,
    };

    const updated = await guestService.update(req.params.id, payload);

    if (!updated) {
      return res.status(404).json({ message: "Guest not found" });
    }

    return res.status(200).json({
      message: "Guest updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Guest Error:", error);
    return res.status(400).json({ error: error.message });
  }
};
export const deleteGuest = async (req, res) => {
  try {
    // ✅ Must wrap req.params in { params: ... } to match Zod schema
    const parsed = deleteGuestSchema.parse({ params: req.params });

    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admins only." });
    }

    const deleted = await guestService.delete(parsed.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Guest not found" });
    }

    return res.status(200).json({
      message: "Guest deleted successfully",
    });

  } catch (error) {
    console.error("Delete Guest Error:", error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.errors,
      });
    }

    return res.status(500).json({ error: error.message });
  }
};

