import { connectDB } from './config/db.js';
import app from './index.js';

const port = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
})