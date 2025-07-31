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

## טכנולוגיות

### Frontend (client/)
- React 18 עם Vite
- Hooks: useState, useEffect
- Zustand לניהול state גלובלי
- React Router לניווט
- קומפוננטות מודולריות (ייחודיות ורב-שימושיות)
- עיצוב מודרני עם CSS Variables

### Backend (server/)
- Node.js + Express
- MongoDB עם Mongoose
- ארכיטקטורה מודולרית:
  - controllers/ - לוגיקת בקשות
  - services/ - עיבוד נתונים
  - routes/ - נתיבים
  - dal/ - גישה למסד נתונים
  - utils/, config/ - כלים וקונפיגורציה

## התקנה והרצה

### דרישות מקדימות
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

## תכונות עיקריות

- **ניהול אימונים**: הוספה, עריכה, מחיקה וצפייה באימונים
- **מעקב אחרי התקדמות**: מעקב אחרי משקלים, חזרות וזמנים
- **סטטיסטיקות**: גרפים וניתוח נתונים
- **ממשק משתמש מודרני**: עיצוב נקי וידידותי למשתמש
- **תמיכה בעברית**: ממשק מלא בעברית עם תמיכה ב-RTL

## ארכיטקטורה

### Frontend
- **קומפוננטות ייחודיות**: WorkoutCard, WorkoutForm
- **קומפוננטות רב-שימושיות**: Button, Input
- **ניהול state**: Zustand לניהול state גלובלי
- **ניווט**: React Router עם Hooks
- **עיצוב**: CSS Variables עם תמיכה ב-RTL

### Backend
- **שכבות מופרדות**: Controller, Service, DAL
- **CRUD מלא**: יצירה, קריאה, עדכון ומחיקה
- **חיבור למסד נתונים**: MongoDB עם Mongoose
- **טיפול בשגיאות**: middleware לטיפול בשגיאות
- **אבטחה**: Helmet, CORS, Rate Limiting

## API Endpoints

### אימונים
- `GET /api/workouts` - קבלת כל האימונים
- `GET /api/workouts/:id` - קבלת אימון לפי ID
- `POST /api/workouts` - יצירת אימון חדש
- `PUT /api/workouts/:id` - עדכון אימון
- `DELETE /api/workouts/:id` - מחיקת אימון
- `PATCH /api/workouts/:id/complete` - סימון אימון כהושלם
- `GET /api/workouts/completed` - אימונים שהושלמו
- `GET /api/workouts/range` - אימונים בטווח תאריכים

## פיתוח

### הוספת תכונות חדשות
1. הוסף מודל חדש ב-`server/models/`
2. צור controller ב-`server/controllers/`
3. הוסף routes ב-`server/routes/`
4. צור קומפוננטות React ב-`client/src/components/`
5. עדכן את ה-store ב-`client/src/store/`

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