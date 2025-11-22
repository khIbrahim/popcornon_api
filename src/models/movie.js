import { model, Schema } from "mongoose";

const movieSchema = new Schema(
  {
    title: { type: String, required: true },
    director: { type: String, required: true },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number, // e.g. IMDb rating
      min: 0,
      max: 10,
      default: 0,
    },
    price: {
      original: {
        type: Number,
      },
      current: {
        type: Number,
        required: true,
      },
    },
    rentalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    lateFeePerDay: {
      type: Number,
      required: true,
    },
    totalStock: {
      type: Number,
      default: 0,
    },
    availableStock: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["available", "out-of-stock"],
      default: "available",
    },
    description: {
      type: String,
      required: true,
    },
    poster: {
      type: String, 
    },
    trailerUrl: {
      type: String,
    },
    keywords: [{ type: String }],
    category: {
      type: String,
      enum: [
        "Action",
        "Comedy",
        "Drama",
        "Romance",
        "Horror",
        "Sci-Fi",
        "Documentary",
        "Animation",
        "Other",
      ],
      default: "Other",
    },
    duration: {
      type: String, // e.g. "2h15"
    },
  },
  {
    timestamps: true,
  }
);

movieSchema.pre("save", function (next) {
  if (this.availableStock > this.totalStock) {
    return next(new Error("Available stock cannot exceed total stock"));
  }

  if (this.availableStock === 0) {
    this.status = "out-of-stock";
  } else {
    this.status = "available";
  }

  next();
});

movieSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.availableStock !== undefined) {
    update.$set.status =
      update.$set.availableStock === 0 ? "out-of-stock" : "available";
  }
  next();
});

const movieModel = model("movie", movieSchema);
export default movieModel;
