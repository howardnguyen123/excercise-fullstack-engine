import { z } from 'zod';

const CreateEmployeeSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().min(2).max(50).email(),
});

export default CreateEmployeeSchema;
