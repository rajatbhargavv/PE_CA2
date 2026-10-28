import {Schema, model} from "mongoose";

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    availablity: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
});

const Book = model('Book', bookSchema);

export default Book;