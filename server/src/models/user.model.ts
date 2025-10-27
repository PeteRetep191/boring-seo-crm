import { Schema, Types, Document, model } from 'mongoose';
import { ISessionDocument } from './session.model';

export interface IUser {
  name: string;
  email: string;
  password: string;
  archived: boolean;
  lastSession?: ISessionDocument;
  isLoggedIn?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  withoutPassword(): IUser;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Индексы (только нужное)
userSchema.index({ email: 1 }, { unique: true });

// Виртуалки (только сессия + вычисление isLoggedIn)
userSchema.virtual('lastSession', {
  ref: 'Session',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
  options: {
    sort: { lastActivity: -1, createdAt: -1 },
  },
});

userSchema.virtual('isLoggedIn').get(function (this: IUserDocument) {
  const s = (this as any).lastSession as ISessionDocument | undefined;
  return !!(s && (s as any).expiresAt && (s as any).expiresAt > new Date());
});

// Автопопуляция только lastSession
userSchema.pre(/^find/, function (this: any) {
  this.populate({ path: 'lastSession', select: '-tokenHash' });
});

// Методы
userSchema.methods.withoutPassword = function (): IUser {
  const obj = this.toObject();
  delete (obj as any).password;
  return obj;
};

const UserModel = model<IUserDocument>('User', userSchema);
export default UserModel;