import BaseService from "../../services/service.js";
import {
  createGuestSchema,
  updateGuestSchema,
  deleteGuestSchema,
} from "../dto/guest.dto.js";
import Guest from "../model/guest.model.js";

const guestService = new BaseService(Guest);

const isAdmin = (req) => req.user && req.user.role === "admin";

// CREATE Guest
export const createGuest = async (req, res) => {
  try {
    if (!isAdmin(req))
      return res.status(403).json({ message: "Admins only." });

    const data = createGuestSchema.parse(req.body);

    const payload = {
      ...data,
      created_by: req.user?.id || null,
    };

    const guest = await guestService.create(payload);
    return res.status(201).json({ message: "Guest created", data: guest });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// GET ALL
export const getAllGuests = async (req, res) => {
  try {
    if (!isAdmin(req))
      return res.status(403).json({ message: "Admins only." });

    const {
      search,
      page = 1,
      limit = 10,
      order = "DESC",
    } = req.query;

    const result = await guestService.getAll({
      search,
      searchFields: [
        "firstname", "lastname", "phone", "email",
        "id_proof_no", "nationality"
      ],
      page: Number(page),
      limit: Number(limit),
      orderBy: "createdAt",  // FIXED
      order,
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

// GET BY ID
export const getGuestById = async (req, res) => {
  try {
    if (!isAdmin(req))
      return res.status(403).json({ message: "Admins only." });

    const guest = await guestService.getById(req.params.id);
    if (!guest) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Guest retrieved", data: guest });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// UPDATE
export const updateGuest = async (req, res) => {
  try {
    if (!isAdmin(req))
      return res.status(403).json({ message: "Admins only." });

    const data = updateGuestSchema.parse(req.body);

    const payload = {
      ...data,
      updated_by: req.user?.id || null,
    };

    const guest = await guestService.update(req.params.id, payload);
    if (!guest) return res.status(404).json({ message: "Not found" });

    return res.json({ message: "Guest updated", data: guest });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// DELETE / BULK DELETE
export const deleteGuest = async (req, res) => {
  try {
    if (!isAdmin(req))
      return res.status(403).json({ message: "Admins only." });

    const data = deleteGuestSchema.parse({
      id: req.params.id,
      ids: req.body.ids,
    });

    let result;

    if (data.id) {
      result = await guestService.delete(data.id);
    } else {
      result = [];
      for (const id of data.ids) {
        result.push(await guestService.delete(id));
      }
    }

    return res.json({ message: "Guest(s) deleted", data: result });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// RESTORE
export const restoreGuest = async (req, res) => {
  try {
    if (!isAdmin(req))
      return res.status(403).json({ message: "Admins only." });

    const guest = await Guest.findByPk(req.params.id, { paranoid: false });
    if (!guest) return res.status(404).json({ message: "Not found" });

    await guest.restore();
    return res.json({ message: "Guest restored", data: guest });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
