# 🚀 Progress App
> **Grow, Track, Achieve, Be Better.**

Progress App is a comprehensive personal development platform designed to help you bridge the gap between your current self and your peak potential. By combining goal setting, habit tracking, and data visualization, it provides the framework necessary for sustained growth.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Key Features

### 🎯 Goal Management
Transform abstract ambitions into concrete plans. Define long-term objectives and decompose them into actionable milestones with visual progress tracking.

### 📅 Daily Habit Tracker
Forge lasting habits with a visual streak system. Consistency is automated through intelligent tracking and completion metrics.

### 📊 Progress Analytics
Turn effort into insights. Visualize your journey through interactive charts and performance metrics that highlight your evolution with:
- Weekly completion trends
- Streak analytics
- Real-time statistics
- AI-generated insights

### 🏆 Milestones & Goals
Track your long-term ambitions with:
- Progress bars (0-100%)
- Target date tracking
- Status management
- Visual completion indicators

### 📓 Reflection Journal
Enhance self-awareness by documenting your thoughts, hurdles, and lessons learned throughout your journey with:
- Mood tracking (5 levels)
- Tag system for organization
- Chronological timeline view
- Rich text entries

### 📈 Comprehensive Dashboard
Get an at-a-glance view of your progress with:
- Completion rate metrics
- Active streak counters
- Daily motivational quotes
- Quick access to all features

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS 3 |
| **Backend** | Node.js, Express |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT with bcrypt |
| **Charts** | Recharts |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas account)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ron-Niri/Progress.git
   cd Progress
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   
   Create `server/.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_secure_random_string
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

---

## 📁 Project Structure

```
Progress/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (Dashboard, Goals, etc.)
│   │   ├── context/        # React Context (Auth)
│   │   ├── utils/          # Utility functions (API client)
│   │   └── index.css       # Global styles & Tailwind
│   └── package.json
├── server/                 # Express backend API
│   ├── models/             # Mongoose schemas (User, Habit, Goal, Journal)
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth middleware
│   └── index.js            # Server entry point
├── STYLE.md                # Design system documentation
├── DEPLOYMENT.md           # Production deployment guide
├── ROADMAP.md              # Feature roadmap
├── CONTRIBUTING.md         # Contribution guidelines
└── package.json            # Root package with scripts

```

---

## 🎨 Design & Style

For detailed information on the visual identity and design principles of the Progress App, please refer to the [STYLE.md](./STYLE.md) guide.

**Design Philosophy:** Minimalist Growth - A clean, professional aesthetic focused on clarity and calm productivity.

---

## 📚 Documentation

- **[Deployment Guide](./DEPLOYMENT.md)** - Complete guide for deploying to production
- **[Feature Roadmap](./ROADMAP.md)** - Planned features and development timeline
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute to the project
- **[Style Guide](./STYLE.md)** - Design system and UI patterns

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on:
- Code of conduct
- Development setup
- Pull request process
- Code style guidelines

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Design inspiration from modern productivity tools
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

---

## 📞 Support

- 🐛 [Report a Bug](https://github.com/Ron-Niri/Progress/issues)
- 💡 [Request a Feature](https://github.com/Ron-Niri/Progress/issues)

---

**Built with ❤️ for personal growth and human potential.**
