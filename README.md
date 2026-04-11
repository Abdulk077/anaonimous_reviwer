# Anonymous User Management System
A secure, Node.js backend using **Prisma 7** and **PostgreSQL (Docker)** featuring UUID identification and role-based access control.

---

## 📂 Project Structure
```text
.
├── prisma/
│   ├── schema.prisma          # Database models & Enum definitions
│   └── migrations/            # SQL migration history
├── node_modules/              # Project dependencies
├── .env                       # Database connection string (DO NOT COMMIT)
├── .gitignore                 # Files to ignore (node_modules, .env)
├── docker-compose.yml         # PostgreSQL container configuration
├── index.js                   # Main application entry point
├── package.json               # Scripts and dependencies
└── README.md                  # Project documentation