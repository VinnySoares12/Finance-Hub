# Finance Hub

### Personal Finance Analytics Platform

Finance Hub is a personal finance analytics platform designed to help users organize, monitor, and understand their financial data through a simple and interactive interface.

Instead of relying on spreadsheets, users can manage income, expenses, savings, and monthly balances while accessing financial indicators and comparisons that help them better understand their spending behavior.

🌐 **Live Demo:** https://finance-hub-ten-theta.vercel.app

---

## Overview

Finance Hub was built to combine personal finance management with data analysis.

Users can register their monthly income, define how much they want to save, track expenses, monitor available balances, and analyze financial performance over time.

The platform transforms financial records into useful indicators such as monthly spending, savings percentage, expense trends, and month-over-month comparisons.

---

## Analytics & Insights

Finance Hub provides financial indicators that help users understand their monthly performance.

Current analytics include:

- Total monthly spending
- Highest-spending category
- Expense trends
- Savings percentage
- Remaining monthly balance
- Month-over-month comparisons
- Savings balance tracking
- Historical monthly financial overview

The goal is to transform individual financial records into information that is easier to analyze and understand.

---

## Key Features

- Monthly income management
- Expense registration and categorization
- Automatic expense calculations
- Savings goal configuration
- Savings balance tracking
- Remaining balance calculation
- Monthly financial history
- Spending analysis by category
- Month-over-month financial comparisons
- Personal user accounts
- Secure authentication
- User-specific financial data
- Responsive interface for desktop and mobile
- Excel report generation

---

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- CSS

### Data & Backend

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

### Reporting

- ExcelJS
- Excel `.xlsx` report generation

### Development & Deployment

- Git
- GitHub
- Vercel

---

## Data Model

Finance Hub uses PostgreSQL through Supabase to store and organize financial information.

The application currently works with the following main entities:

### `profiles`

Stores user profile information.

### `finance_settings`

Stores financial configuration associated with each user.

### `monthly_savings`

Stores monthly savings information and historical savings balances.

### `expenses`

Stores individual expense records used for financial calculations and analysis.

Each user's financial data is isolated through Supabase Row Level Security.

---

## Reporting

Finance Hub allows users to export financial information to Excel.

The reporting functionality is implemented using **ExcelJS**, generating `.xlsx` files that allow users to review and store their financial information outside the application.

This adds an additional reporting layer beyond the application's dashboard and analytics interface.

---

## Authentication & Data Security

Finance Hub uses Supabase Authentication with email and password.

Financial information is separated by user through **Row Level Security (RLS)** policies, preventing users from accessing financial records belonging to other accounts.

The deployed application also uses additional web security headers configured through Vercel.

---

## Project Structure

```text
Finance-Hub/
│
├── .claude/
├── docs/
├── src/
├── supabase/
│   └── migrations/
│
├── .env.example
├── .gitignore
├── README.md
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
