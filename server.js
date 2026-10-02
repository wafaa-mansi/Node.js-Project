import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import {
    MongoClient,
    ObjectId
} from "mongodb";

import errorHandler, {
    writeErrorLog
} from "./middleware/errorHandler.js";


dotenv.config();


const app =
    express();


const PORT =
    process.env.PORT || 3000;



app.use(cors());

app.use(express.json());



const client =
    new MongoClient(
        process.env.MONGO_URI
    );


let studentsCollection;



async function startServer() {

    try {

        await client.connect();


        console.log(
            "Connected to MongoDB Atlas"
        );


        const db =
            client.db(
                "UserManagement"
            );


        studentsCollection =
            db.collection(
                "users"
            );


        app.listen(
            PORT,
            function () {

                console.log(
                    `Server running on http://localhost:${PORT}`
                );

            }
        );

    }
    catch (error) {

        writeErrorLog(
            500,
            "Database connection failed"
        );


        process.exit(1);

    }

}



startServer();



app.get(
    "/",
    function (req, res) {

        res.status(200).json({

            success: true,

            message:
                "Student API is running"

        });

    }
);



app.get(
    "/api/students",
    async function (req, res, next) {

        try {

            const students =
                await studentsCollection
                    .find({})
                    .toArray();


            res.status(200).json({

                success: true,

                data: students

            });

        }
        catch (error) {

            const serverError =
                new Error(
                    "Internal Server Error"
                );


            serverError.statusCode =
                500;


            serverError.logMessage =
                "Database error while getting students";


            next(serverError);

        }

    }
);



app.get(
    "/api/students/:id",
    async function (req, res, next) {

        try {

            const id =
                req.params.id;


            if (
                !ObjectId.isValid(id)
            ) {

                const error =
                    new Error(
                        "Invalid student ID"
                    );


                error.statusCode =
                    400;


                return next(error);

            }


            const student =
                await studentsCollection
                    .findOne({

                        _id:
                            new ObjectId(id)

                    });


            if (!student) {

                const error =
                    new Error(
                        "Student not found"
                    );


                error.statusCode =
                    404;


                return next(error);

            }


            res.status(200).json({

                success: true,

                data: student

            });

        }
        catch (error) {

            const serverError =
                new Error(
                    "Internal Server Error"
                );


            serverError.statusCode =
                500;


            serverError.logMessage =
                "Database error while getting student";


            next(serverError);

        }

    }
);



app.post(
    "/api/students",
    async function (req, res, next) {

        try {

            const {
                name,
                email,
                age
            } = req.body;



            if (
                !name ||
                !email ||
                age === undefined
            ) {

                const error =
                    new Error(
                        "Name, email and age are required"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            if (
                typeof name !== "string" ||
                typeof email !== "string" ||
                typeof age !== "number"
            ) {

                const error =
                    new Error(
                        "Invalid student data"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            if (
                name.trim() === "" ||
                email.trim() === ""
            ) {

                const error =
                    new Error(
                        "Name and email cannot be empty"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            if (
                !Number.isInteger(age) ||
                age <= 0
            ) {

                const error =
                    new Error(
                        "Age must be a positive integer"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailRegex.test(email)
            ) {

                const error =
                    new Error(
                        "Invalid email address"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            const existingStudent =
                await studentsCollection
                    .findOne({

                        email:
                            email.trim()

                    });


            if (existingStudent) {

                const error =
                    new Error(
                        "Email already exists"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            const newStudent = {

                name:
                    name.trim(),

                email:
                    email.trim(),

                age:
                    age

            };



            const result =
                await studentsCollection
                    .insertOne(
                        newStudent
                    );



            res.status(201).json({

                success: true,

                message:
                    "Student created successfully",

                data: {

                    _id:
                        result.insertedId,

                    ...newStudent

                }

            });

        }
        catch (error) {

            const serverError =
                new Error(
                    "Internal Server Error"
                );


            serverError.statusCode =
                500;


            serverError.logMessage =
                "Database error while creating student";


            next(serverError);

        }

    }
);



app.put(
    "/api/students/:id",
    async function (req, res, next) {

        try {

            const id =
                req.params.id;



            if (
                !ObjectId.isValid(id)
            ) {

                const error =
                    new Error(
                        "Invalid student ID"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            const {
                name,
                email,
                age
            } = req.body;



            if (
                !name ||
                !email ||
                age === undefined
            ) {

                const error =
                    new Error(
                        "Name, email and age are required"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            if (
                typeof name !== "string" ||
                typeof email !== "string" ||
                typeof age !== "number"
            ) {

                const error =
                    new Error(
                        "Invalid student data"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            if (
                name.trim() === "" ||
                email.trim() === ""
            ) {

                const error =
                    new Error(
                        "Name and email cannot be empty"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            if (
                !Number.isInteger(age) ||
                age <= 0
            ) {

                const error =
                    new Error(
                        "Age must be a positive integer"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailRegex.test(email)
            ) {

                const error =
                    new Error(
                        "Invalid email address"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            const student =
                await studentsCollection
                    .findOne({

                        _id:
                            new ObjectId(id)

                    });


            if (!student) {

                const error =
                    new Error(
                        "Student not found"
                    );


                error.statusCode =
                    404;


                return next(error);

            }



            const existingEmail =
                await studentsCollection
                    .findOne({

                        email:
                            email.trim(),

                        _id: {
                            $ne:
                                new ObjectId(id)
                        }

                    });


            if (existingEmail) {

                const error =
                    new Error(
                        "Email already exists"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            await studentsCollection
                .updateOne(

                    {
                        _id:
                            new ObjectId(id)
                    },

                    {
                        $set: {

                            name:
                                name.trim(),

                            email:
                                email.trim(),

                            age:
                                age

                        }
                    }

                );



            const updatedStudent =
                await studentsCollection
                    .findOne({

                        _id:
                            new ObjectId(id)

                    });



            res.status(200).json({

                success: true,

                message:
                    "Student updated successfully",

                data:
                    updatedStudent

            });

        }
        catch (error) {

            const serverError =
                new Error(
                    "Internal Server Error"
                );


            serverError.statusCode =
                500;


            serverError.logMessage =
                "Database error while updating student";


            next(serverError);

        }

    }
);



app.delete(
    "/api/students/:id",
    async function (req, res, next) {

        try {

            const id =
                req.params.id;



            if (
                !ObjectId.isValid(id)
            ) {

                const error =
                    new Error(
                        "Invalid student ID"
                    );


                error.statusCode =
                    400;


                return next(error);

            }



            const result =
                await studentsCollection
                    .deleteOne({

                        _id:
                            new ObjectId(id)

                    });



            if (
                result.deletedCount === 0
            ) {

                const error =
                    new Error(
                        "Student not found"
                    );


                error.statusCode =
                    404;


                return next(error);

            }



            res.status(200).json({

                success: true,

                message:
                    "Student deleted successfully"

            });

        }
        catch (error) {

            const serverError =
                new Error(
                    "Internal Server Error"
                );


            serverError.statusCode =
                500;


            serverError.logMessage =
                "Database error while deleting student";


            next(serverError);

        }

    }
);



app.use(
    function (req, res, next) {

        const error =
            new Error(
                "Route not found"
            );


        error.statusCode =
            404;


        next(error);

    }
);



app.use(
    errorHandler
);