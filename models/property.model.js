const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        title: {type: String, required: true},
        description: {type: String, required: true},
        price: {type: Number, required: true},
        type: {type: String, required: true},
        location: {type: String, required: true},
        photos: [String],
        reviews: [
            {
                firstName: {type: String, required: true},
                lastName: {type: String, required: true},
                rating: {type: Number, required: true, min: 0, max: 5},
                comment: {type: String, required: true},
                avatar: {type: String, required: true}
            }
        ]
    },
    {timestamps: true}
);

module.exports = mongoose.models.Property || mongoose.model("Property", PropertySchema);