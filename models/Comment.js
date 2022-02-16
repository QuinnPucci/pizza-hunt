const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const CommentSchema = new Schema(
    {  
    writtenBy: {
        type: String
    },
    commentBody: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    // validate data for a reply through reply schema
    replies: [ReplySchema]
 },
 {
     toJSON: {
         virtuals: true,
         getters: true
     },
     id: false
 }
)

CommentSchema.virtual('replyCount').get(function(){
    return this.replies.length
})

const ReplySchema = new Schema(
    {
        // set custom ID to avoid confusion with with parent comment _id
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => Types.ObjectId
        },
        replyBody: {
            type: String
        },
        writtenBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
)

const Comment = model('Comment', CommentSchema)

module.exports = Comment