
import {
  createPaymentService,
  getPaymentByIdService,
  updatePaymentService,
  deletePaymentService,
  getPaymentsService,
} from "../service/payment.service.js";

import {
  createPaymentSchema,
  updatePaymentSchema,
  getPaymentsQuerySchema,
  paymentIdParamSchema,
} from "../dto/payment.dto.js";

// Create Payment
export const createPaymentController = async (req, res) => {
  try {
    const validated = createPaymentSchema.parse(req.body);
    const payment = await createPaymentService(validated);
    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get Payment by ID
export const getPaymentByIdController = async (req, res) => {
  try {
    const { id } = paymentIdParamSchema.parse(req.params);
    const payment = await getPaymentByIdService(id);
    res.json({ success: true, data: payment });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

// Update Payment
export const updatePaymentController = async (req, res) => {
  try {
    const { id } = paymentIdParamSchema.parse(req.params);
    const validated = updatePaymentSchema.parse(req.body);
    const payment = await updatePaymentService(id, validated, validated.updated_by);
    res.json({ success: true, data: payment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete Payment (soft delete)
export const deletePaymentController = async (req, res) => {
  try {
    const { id } = paymentIdParamSchema.parse(req.params);
    // const { userId } = req.body;
    await deletePaymentService(id);
    res.json({ success: true, message: "Payment deactivated successfully" });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
};

// Get all Payments
export const getPaymentsController = async (req, res) => {
  try {
    const query = getPaymentsQuerySchema.parse(req.query);
    const result = await getPaymentsService(query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

