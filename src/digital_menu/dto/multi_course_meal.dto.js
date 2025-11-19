import { createMultiCourseMealSchema } from "../../dto/multiCourseMeal.validation.js";
import { z } from "zod";

// Example Express route for creating a MultiCourseMeal
app.post("/multi-course-meal", async (req, res) => {
  try {
    const validatedData = createMultiCourseMealSchema.parse(req.body); // Validate request body

    // Proceed with creating the MultiCourseMeal (e.g., saving to the database)
    const multiCourseMeal = await MultiCourseMeal.create(validatedData);

    return res.status(201).json({
      message: "MultiCourseMeal created successfully",
      data: multiCourseMeal,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ error: error.message });
  }
});
