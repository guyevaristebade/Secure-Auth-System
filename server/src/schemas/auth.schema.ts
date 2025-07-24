import z from 'zod';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type loginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().min(6),
});

export type RegisterInput = z.infer<typeof registerSchema>;
