import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import authRouter from "./routes/auth.routes.js";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cinemaRouter from "./routes/cinema.routes.js";
import cineRequestRouter from "./routes/cine_requests.routes.js";
import moviesRouter from "./routes/movies.routes.js";
import publicMoviesRouter from "./routes/public_movies.routes.js";
import publicCinemaRouter from "./routes/public_cinemas.routes.js";

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// app.set("trust proxy", true);

app.use(helmet());

const limiter = rateLimit({
    max: 100,
    windowMs: 15 * 60 * 1000,
    message: "Too many requests from this IP, please try again later."
})
app.use('/api', limiter);

// const authLimiter = rateLimit({
//     max: 5, // 5 tentatives
//     windowMs: 15 * 60 * 1000, // par 15 minutes
//     message: 'Too many login/register attempts from this IP, please try again later.',
//     skipSuccessfulRequests: true,
// });
// app.use('/api/v1/auth/login', authLimiter);
// app.use('/api/v1/auth/register', authLimiter);

// app.use(mongoSanitize());
app.use(hpp(undefined));

if (process.env.NODE_ENV === "developement") {
    app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cinema", cinemaRouter);
app.use("/api/v1/cine-request", cineRequestRouter);
app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/public/movies", publicMoviesRouter);
app.use("/api/v1/public-cinemas", publicCinemaRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;