import { Schema, Types, Document, model } from 'mongoose';

export interface IApiToken {
    publicId: string;
    secretHash: string;
    createdBy: Types.ObjectId;
    owner: Types.ObjectId;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IApiTokenDocument extends IApiToken, Document {
     _id: Types.ObjectId;
}

const apiTokenSchema = new Schema<IApiTokenDocument>({
    publicId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    secretHash: {
        type: String,
        required: true,
        trim: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});

apiTokenSchema.index({ owner: 1, publicId: 1 }, { unique: true });
apiTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ApiTokenModel = model<IApiTokenDocument>('ApiToken', apiTokenSchema);
export default ApiTokenModel;