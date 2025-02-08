import {
    model,
    ObjectId,
    Schema,
    SchemaDefinitionProperty,
    Types,
} from "mongoose";
import { types } from "util";

export interface UserInterface {
    _id: ObjectId;
    email: string;
    firstName: string;
    lastName?: string;
    bio?: string;
    groups?: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<UserInterface>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            minlength: 6,
            maxlength: 35,
        },

        firstName: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 25,
        },

        lastName: {
            type: String,
            required: false,
            minlength: 1,
            maxlength: 25,
        },

        bio: {
            type: String,
            required: false,
            minlength: 1,
            maxlength: 100,
        },

        groups: {
            type: [Types.ObjectId],
            required: false,
        },
    },
    { timestamps: true, versionKey: false }
);

export const UserModel = model("users", UserSchema);
