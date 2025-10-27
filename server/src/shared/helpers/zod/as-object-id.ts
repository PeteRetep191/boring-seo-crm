import { z } from 'zod';
import mongoose from 'mongoose';

const asObjectId = (field: string) => {
    return z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), { message: `Invalid ObjectId format for ${field}` })
        .transform((val) => new mongoose.Types.ObjectId(val));
};

export default asObjectId;
