const dotenv = require("dotenv");

// Load local environment files without overriding variables supplied by the shell or CI.
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });
