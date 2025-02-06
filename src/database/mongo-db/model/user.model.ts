import { model, ObjectId, Schema, SchemaDefinitionProperty } from "mongoose";

export interface UserInterface {
    _id: ObjectId;
    email: string;
    firstName: string;
    lastName?: string;
    bio?: string;
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
        } as SchemaDefinitionProperty<string>,

        firstName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 25,
        } as SchemaDefinitionProperty<string>,

        lastName: {
            type: String,
            required: false,
            minlength: 3,
            maxlength: 25,
        } as SchemaDefinitionProperty<string>,

        bio: {
            type: String,
            required: false,
            minlength: 1,
            maxlength: 100,
        } as SchemaDefinitionProperty<string>,
    },
    { timestamps: true, versionKey: false }
);

export const UserModel = model("users", UserSchema);
