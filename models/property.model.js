const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        price: {type: Number, required: true},
        type: {type: String, required: true},
        location: {type: String, required: true},
        photos: [String],
    },
    {timestamps: true}
);

module.exports = mongoose.models.Property || mongoose.model("Property", PropertySchema);