import { Schema, Types, Document, model } from 'mongoose';

export interface ISession {
    userId: Types.ObjectId;
    tokenHash: string;
    ip: string;
    userAgent?: string | null;
    os?: string | null;
    device?: {
        model?: string | null;
        vendor?: string | null;
    };
    browser?: {
        name?: string | null;
        version?: string | null;
    };

    lastActivity: Date;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISessionDocument extends ISession, Document {
    _id: Types.ObjectId;
    updateActivity(): Promise<ISessionDocument>;
}

const sessionSchema = new Schema<ISessionDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tokenHash: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    ip: {
        type: String,
        required: true,
        trim: true
    },
    userAgent: {
        type: String,
        default: null,
        trim: true
    },
    os: {
        type: String,
        default: null,
        trim: true
    },
    device: {
        model : {
            type: String,
            default: null,
            trim: true
        },
        vendor: {
            type: String,
            default: null,
            trim: true
        }
    },
    browser: {
        name: {
            type: String,
            default: null,
            trim: true
        },
        version: {
            type: String,
            default: null,
            trim: true
        }
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
    id: false,    
});

sessionSchema.index({ userId: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index({ userId: 1 });
sessionSchema.index({ lastActivity: -1, createdAt: -1 });
sessionSchema.index({ expiresAt: 1 });

sessionSchema.set('toJSON', { virtuals: true });
sessionSchema.set('toObject', { virtuals: true });

sessionSchema.methods.updateActivity = async function(): Promise<ISessionDocument> {
    this.lastActivity = new Date();
    return this.save();
};

const SessionModel = model<ISessionDocument>('Session', sessionSchema);
export default SessionModel;