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
    link: string;
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
            required: true,
        },
        link: {
            type: String,
            unique: true,
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
            ref: "users",
        },
        users: {
            type: [Types.ObjectId],
            required: false,
            ref: "users",
        },
    },
    { timestamps: true, versionKey: false }
);

GroupSchema.index({ link: "text", name: "text" });

export const GroupModel = model("groups", GroupSchema);
