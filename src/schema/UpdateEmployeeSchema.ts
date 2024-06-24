import { z } from 'zod';

const UpdateEmployeeSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().min(2).max(50).email(),
    id: z.string().min(1),
});

export default UpdateEmployeeSchema;
