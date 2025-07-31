# אפליקציה למעקב אחרי אימוני כושר

אפליקציה מלאה למעקב אחרי אימוני כושר עם ארכיטקטורה מודולרית.

## מבנה הפרויקט

```
Tracker/
├── client/          # React Frontend (Vite)
├── server/          # Node.js Backend (Express + MongoDB)
├── package.json     # Root package.json
└── README.md
```

- Node.js (גרסה 16 ומעלה)
- MongoDB (מותקן או MongoDB Atlas)

### התקנה מהירה

1. **התקנת כל התלויות:**
```bash
npm run install-all
```

2. **הגדרת משתני סביבה:**
צור קובץ `.env` בתיקיית `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
NODE_ENV=development
```

### הרצת הפרויקט

**הרצה מהירה (Backend + Frontend יחד):**
```bash
npm run dev
```

**או הרצה נפרדת:**

1. **הרצת Backend:**
```bash
npm run server
```

2. **הרצת Frontend:**
```bash
npm run client
```

האפליקציה תהיה זמינה ב:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### בדיקות
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Build
```bash
# Build Frontend
npm run build

# Start Production
npm start
```

## רישיון

MIT License 
