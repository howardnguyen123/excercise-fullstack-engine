import { z } from 'zod';

const DeleteEmployeeSchema = z.object({
    id: z.string().min(1),
});

export default DeleteEmployeeSchema;
