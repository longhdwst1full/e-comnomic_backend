import mongoose from "mongoose";

const validateMongodb = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error("This is not valid or not found")
};

export { validateMongodb }