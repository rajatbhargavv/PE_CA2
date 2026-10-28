import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import e from "express";
import Book from "./models/bookModel.js";
import { json } from "express";

configDotenv();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;
// console.log(MONGO_URI)

const app = e();
app.use(json());
const root = "/api/books"

mongoose.connect(MONGO_URI).then(()=>{
    console.log("Connected");
}).catch(()=>{
    console.log("failed");
});

app.listen(PORT, ()=>{
    console.log("server listening on port")
})

app.get(`${root}`, async (req, res)=>{
    // console.log("get req");
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        
        console.log(page, limit)
        
        const santPage = page<1?1:page;
        const santLimit = limit<1?10:limit;
    
        const skip = (santPage-1)*santLimit;

        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks/santLimit);

        const hasNext = santPage<totalPages;
    
        const books = await Book.find().skip(skip).limit(santLimit).sort({createdAt: -1});

        res.status(200).json({
            success: true,
            books,
            metaData: {
                page: santPage,
                limit: santLimit,
                totalBooks,
                totalPages,
                hasNext
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Something went wrong"});
    }    
});

app.post(`${root}`, async (req, res)=>{
    try {
        const {title, author, availablity, category} = req.body;

        console.log(title, author, availablity, category)

        const book = new Book({
            title, author, category, availablity
        });
        book.save();

        res.status(200).json({
            success: true,
            book
        });    
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
    
})

app.patch(`${root}/:id`, async (req, res) => {
    try {
        const { id } = req.params;
        const { availablity } = req.body;
        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { availablity },
            { new: true, runValidators: true }
        );
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({
            message: "updated",
            book: updatedBook
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});