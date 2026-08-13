const {z} = require('zod');

const createNoteSchema = z.object({
    title : z.string().trim().min(1,'title is required').max(100,'title should not exceed 100 words'),
    content : z.string().trim().min(1,'content is required')
});

const updateNoteSchema = z.object({
     title: z
        .string()
        .trim()
        .min(1, "Title cannot be empty")
        .max(100, "Title cannot exceed 100 characters")
        .optional(),

    content: z
        .string()
        .trim()
        .min(1, "Content cannot be empty")
        .optional(),

    completed: z
        .boolean()
        .optional()
}
);

module.exports = {createNoteSchema,updateNoteSchema};