import {
    model,
    ObjectId,
    Schema,
    SchemaDefinitionProperty,
    Types,
} from "mongoose";

interface GroupInterface {
    _id: ObjectId;
    name: string;
    nickName: string;
    bio?: string;
    owner: ObjectId;
    users?: ObjectId[];
    profilePath?: string;
    createdAt: Date;
    updatedAt: Date;
}

const GroupSchema = new Schema<GroupInterface>(
    {
        name: {
            type: String,
            minlength: 1,
            maxlength: 20,
            unique: true,
            required: true,
        },
        nickName: {
            type: String,
            minlength: 1,
            maxlength: 20,
            required: true,
        },
        bio: {
            type: String,
            minlength: 1,
            maxlength: 100,
            required: false,
        },
        profilePath: {
            type: String,
            required: false,
        },
        owner: {
            type: Types.ObjectId,
            required: true,
        },
        users: {
            type: [Types.ObjectId],
            required: false,
        },
    },
    { timestamps: true, versionKey: false }
);

export const GroupModel = model("groups", GroupSchema);
