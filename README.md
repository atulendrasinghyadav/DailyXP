# DailyXP 🚀

DailyXP is a high-performance, gamified habit tracker that transforms your daily routines into an RPG-like experience. Build streaks, earn XP, level up, and compete on the global Wall of Fame.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

## ✨ Features

- **🎮 Gamified Habits**: Complete habits to earn XP. The more you do, the faster you level up.
- **🔥 Streak System**: Track your consistency. Don't break the chain!
- **🏆 Wall of Fame**: Compete with users globally on the leaderboard. Sorting is based on streaks, levels, XP, and longevity.
- **🎖️ Badge System**: Unlock unique achievements like "Early Bird," "Marathoner," and "Centurion."
- **📊 Interactive Dashboard**: A sleek, dark-themed interface with weekly/monthly/yearly views.
- **👤 Public Profiles**: Share your progress and badges with the world via custom public profile links.
- **🔒 Secure Auth**: Seamless Google and Email authentication powered by Firebase.

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Firebase](https://firebase.google.com/) (Firestore, Authentication)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A Firebase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/DailyXP.git
   cd DailyXP
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   Create a `.env.local` file in the root and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `src/app/`: Next.js pages and routes.
- `src/components/`: Reusable UI components (Dashboard, Profile, Leaderboard, etc.).
- `src/hooks/`: Custom React hooks for data management.
- `src/lib/`: Firebase configuration and utility functions.
- `src/context/`: Auth context for global user state.
- `src/types/`: TypeScript interfaces and types.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by Atulendra Singh Yadav
