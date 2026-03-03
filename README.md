````markdown
# 🚀 Crypto Portfolio Tracker

A modern cryptocurrency portfolio tracking application built with React, TypeScript, and Redux Toolkit. Track your investments in real-time with beautiful charts and detailed analytics.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Running Tests](#-running-tests)
- [Building for Production](#-building-for-production)
- [Deployment](#-deployment)

## ✨ Features

### 📊 **Real-time Crypto Data**

- Live prices from CoinGecko API
- Top 100 cryptocurrencies by market cap
- Search and filter coins
- Detailed coin information with price charts

### 💼 **Portfolio Management**

- Add buy/sell transactions
- FIFO calculation for realized profit
- Average buy price tracking
- Transaction history for each coin
- Realized and unrealized P&L

### 📈 **Interactive Charts**

- Price history with multiple timeframes (24h, 7d, 30d, 1y)
- Portfolio growth chart with invested vs current value
- Portfolio distribution pie chart
- Mini charts in market overview

### 🎯 **Goal Setting**

- Set profit, value, or percentage goals
- Visual progress bars
- Notifications when goals are reached
- Persistent storage in localStorage

### 📤 **Data Management**

- Export to CSV (transactions, holdings, full report)
- JSON backup and restore
- Print/PDF support
- Import transactions from CSV

### 🌓 **User Experience**

- Dark/Light theme toggle
- Fully responsive design
- Smooth animations (Framer Motion)
- Loading skeletons for better UX
- Error boundaries for graceful failures

## 🛠️ Tech Stack

| Category             | Technologies                      |
| -------------------- | --------------------------------- |
| **Frontend**         | React 18, TypeScript, TailwindCSS |
| **State Management** | Redux Toolkit, RTK Query          |
| **Charts**           | Recharts                          |
| **Routing**          | React Router                      |
| **Animations**       | Framer Motion                     |
| **API**              | CoinGecko API                     |
| **Build Tool**       | Vite                              |
| **Deployment**       | Vercel                            |

## 🚀 Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- CoinGecko API key (optional, for higher rate limits)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crypto-portfolio-tracker.git
   cd crypto-portfolio-tracker
   ```
````

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your CoinGecko API key:

   ```env
   VITE_COINGECKO_API_KEY=your_api_key_here
   VITE_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage Guide

### Adding Your First Transaction

1. Go to the **Market** page
2. Click on any cryptocurrency (e.g., Bitcoin)
3. Click **"Add to Portfolio"** button
4. Enter amount, purchase price, and date
5. Click **"Add to Portfolio"**

### Viewing Portfolio Performance

1. Navigate to **Portfolio** page
2. View summary statistics (total invested, current value, P&L)
3. Check portfolio distribution pie chart
4. Analyze growth chart over different time periods
5. Click on any asset to see detailed transaction history

### Selling Cryptocurrency

1. Go to **Portfolio** page
2. Find the asset you want to sell
3. Click **"Sell"** button
4. Enter amount and sell price
5. Click **"Sell"** to complete transaction

### Setting Goals

1. Go to **Portfolio** page
2. Scroll to **"Portfolio Goals"** section
3. Click **"Add Goal"**
4. Choose goal type (profit, value, or percentage)
5. Set target and optional deadline
6. Track progress with visual indicators

### Exporting Data

1. Go to **Portfolio** page
2. Click **"Export"** button
3. Choose export format:
   - 📄 Transactions only (CSV)
   - 📊 Current holdings (CSV)
   - 📑 Full report (CSV)
   - 🔧 JSON backup
   - 🖨️ Print/PDF

### Importing Transactions from CSV

1. Go to **Tools** page
2. Select **"Import Transactions"** tab
3. Paste CSV data in the required format:
   ```
   date,type,coin,amount,price,notes
   2024-01-15,buy,Bitcoin,0.5,42000,First purchase
   2024-02-01,buy,Ethereum,2,2800,
   ```
4. Click **"Preview"** to validate
5. Click **"Import Transactions"** to add to portfolio

### Using DCA Calculator

1. Go to **Tools** page
2. Select **"DCA Calculator"** tab
3. Enter coin price, monthly investment, period, and expected growth
4. Click **"Calculate DCA Strategy"**
5. View results and growth chart

### Switching Themes

- Click the theme toggle in settings
- Or go to **Settings** > **Appearance**
- Choose between Light 🌞 and Dark 🌙 modes

### Managing Settings

1. Go to **Settings** page
2. Configure:
   - Appearance (theme, compact mode)
   - Currency preference
   - Notifications and auto-refresh
   - Data backup and restore
3. Changes are saved automatically

## 🏗️ Project Structure

```
src/
├── app/                    # Redux store configuration
├── features/               # Feature-based modules
│   ├── crypto/             # Cryptocurrency data
│   ├── portfolio/          # Portfolio management
│   ├── charts/             # Chart components
│   └── tools/              # DCA calculator, import tools
├── pages/                  # Page components
│   ├── Home/               # Market overview
│   ├── CoinDetails/        # Coin details page
│   ├── Portfolio/          # Portfolio page
│   ├── Tools/              # Tools page
│   └── Settings/           # User settings
├── shared/                 # Shared utilities
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Helper functions
│   ├── types/              # TypeScript types
│   └── context/            # React context
└── main.tsx                # Entry point
```

## 🧪 Running Tests

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📦 Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables:
   - `VITE_COINGECKO_API_KEY`
   - `VITE_COINGECKO_BASE_URL`
4. Deploy 🚀

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```
2. Upload `dist/` folder to your hosting service
3. Configure your server to serve `index.html` for all routes

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes using conventional commits
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Conventional Commits

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code refactoring
- `perf:` Performance
- `test:` Tests
- `chore:` Maintenance
