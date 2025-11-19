import {
  createProfile as createProfileService,
  getProfileById,
  getAllProfiles,
  updateProfile as updateProfileService,
  deleteProfile,
  restoreProfile,
} from "../service/profile.service.js";

// Generate full image URL
const formatImageUrl = (req, filename, folder = "profile") => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${folder}/${filename}`;
};

// ------------------ ADMIN CHECK ------------------
const requireAdmin = (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ status: "error", message: "Access denied: Admins only" });
    return false;
  }
  return true;
};

// ------------------ CREATE PROFILE ------------------
export const create = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const payload = {
      ...req.body,
      profile_image: req.file ? req.file.filename : null,
      created_by: req.user.id,
      created_by_name: req.user.name,
      created_by_email: req.user.email,
    };

    const profile = await createProfileService(payload);

    // Attach full image URL
    if (profile?.profile_image) {
      profile.profile_image_url = formatImageUrl(req, profile.profile_image);
    }

    return res.sendSuccess(profile, "Profile created successfully", 201);
  } catch (error) {
    console.error("Error creating profile:", error);
    return res.sendError("Failed to create profile", 400, error);
  }
};

// ------------------ UPDATE PROFILE ------------------
export const update = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const profileId = req.params.profile_id?.trim();
    if (!profileId) return res.sendError("Invalid profile ID", 400);

    const updatePayload = {
      ...req.body,
      updated_by: req.user.id,
      updated_by_name: req.user.name,
      updated_by_email: req.user.email,
    };

    // Add image only if provided, otherwise ignore
    if (req.file) updatePayload.profile_image = req.file.filename;

    const updated = await updateProfileService(profileId, updatePayload);
    if (!updated) return res.sendError("Profile not found or update failed", 404);

    // Add full image URL
    if (updated.profile_image) {
      updated.profile_image_url = formatImageUrl(req, updated.profile_image);
    }

    return res.sendSuccess(updated, "Profile updated successfully");
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.sendError("Failed to update profile", 400, error);
  }
};

// ------------------ GET ALL PROFILES ------------------
export const getAll = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const { page, limit, order, is_active } = req.query;

    const filters = {};
    if (is_active !== undefined) filters.is_active = is_active;

    const orderDirection =
      ["ASC", "DESC"].includes(order?.toUpperCase()) ? order.toUpperCase() : "DESC";

    const result = await getAllProfiles({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      filters,
      order: orderDirection,
    });

    // Add full image URL
    result.data = result.data.map((profile) => ({
      ...profile,
      profile_image_url: profile.profile_image
        ? formatImageUrl(req, profile.profile_image)
        : null,
    }));

    return res.sendSuccess(result, "Profiles retrieved successfully");
  } catch (error) {
    console.error("Error retrieving profiles:", error);
    return res.sendError("Failed to retrieve profiles", 400, error);
  }
};

// ------------------ GET PROFILE BY ID ------------------
export const getById = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const profileId = req.params.profile_id?.trim();
    if (!profileId) return res.sendError("Invalid profile ID", 400);

    const profile = await getProfileById(profileId);
    if (!profile) return res.sendError("Profile not found", 404);

    profile.profile_image_url = profile.profile_image
      ? formatImageUrl(req, profile.profile_image)
      : null;

    return res.sendSuccess(profile, "Profile retrieved successfully");
  } catch (error) {
    console.error("Error retrieving profile:", error);
    return res.sendError("Failed to retrieve profile", 400, error);
  }
};

// ------------------ SOFT DELETE PROFILE ------------------
export const remove = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const profileId = req.params.profile_id?.trim();
    if (!profileId) return res.sendError("Invalid profile ID", 400);

    const payload = {
      deleted_by: req.user.id,
      deleted_by_name: req.user.name,
      deleted_by_email: req.user.email,
    };

    const deleted = await deleteProfile(profileId, payload);
    if (!deleted) return res.sendError("Profile not found or already deleted", 404);

    return res.sendSuccess(null, "Profile soft-deleted successfully");
  } catch (error) {
    console.error("Error deleting profile:", error);
    return res.sendError("Failed to delete profile", 400, error);
  }
};

// ------------------ RESTORE PROFILE ------------------
export const restore = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const profileId = req.params.profile_id?.trim();
    if (!profileId) return res.sendError("Invalid profile ID", 400);

    const updatePayload = {
      updated_by: req.user.id,
      updated_by_name: req.user.name,
      updated_by_email: req.user.email,
    };

    const restored = await restoreProfile(profileId, updatePayload);
    if (!restored) return res.sendError("Profile not found or already active", 404);

    restored.profile_image_url = restored.profile_image
      ? formatImageUrl(req, restored.profile_image)
      : null;

    return res.sendSuccess(restored, "Profile restored successfully");
  } catch (error) {
    console.error("Error restoring profile:", error);
    return res.sendError("Failed to restore profile", 400, error);
  }
};
