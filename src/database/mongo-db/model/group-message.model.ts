import {
    model,
    ObjectId,
    Schema,
    SchemaDefinitionProperty,
    Types,
} from "mongoose";

interface GroupMessageInterface {
    _id: ObjectId;
    group: ObjectId;
    sender: ObjectId;
    replyTo?: ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const GroupMessageSchema = new Schema<GroupMessageInterface>(
    {
        content: {
            type: String,
            maxlength: 5000,
            required: true,
        },
        group: {
            type: Types.ObjectId,
            required: true,
            ref: "groups",
        },
        sender: {
            type: Types.ObjectId,
            required: true,
            ref: "users",
        },
        replyTo: {
            type: Types.ObjectId,
            required: false,
            ref: "groupMessages",
        },
    },
    { timestamps: true, versionKey: false }
);

export const GroupMessageModel = model("groupMessages", GroupMessageSchema);
