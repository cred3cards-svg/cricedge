# **App Name**: Cricket Edge

## Core Features:

- User Authentication: Secure user authentication using Firebase Auth with email/password and Google OAuth. Includes basic age verification.
- Demo Credit Faucet: A faucet feature that allows users to claim demo credits daily within a defined cap.
- Market Creation and Management: Admin-controlled creation, publishing, locking, resolving, and voiding of markets for cricket fixtures.
- Automated Market Lock: Cloud Function to automatically lock markets when the associated match start time arrives.
- CPMM Pricing and Trading: Quote generation and trade execution against a Constant Product Market Maker (CPMM) with slippage checks and fees. Enforces market state and time constraints.
- Betfair API Integration: Scheduled Cloud Functions that fetch cricket fixtures, odds, and results from the Betfair API, storing the raw payloads for audit purposes.
- Automated Result Settlement: Cloud Function tool that monitors match results, determines winners, and executes settlements by crediting user wallets and updating positions based on CPMM outcomes.

## Style Guidelines:

- Primary color: A vibrant yellow (#FFC107) to represent the excitement of cricket and prediction markets.
- Background color: A light gray (#F5F5F5), providing a neutral backdrop that emphasizes content and avoids distractions.
- Accent color: A deep orange (#FF7043), for calls to action and essential UI elements, drawing the user's attention to interactive features.
- Body and headline font: 'Inter' for a modern, machined, objective, neutral look.
- Code font: 'Source Code Pro' for displaying code snippets.
- Simple, crisp icons related to cricket, markets, and user actions, designed for clarity and ease of recognition.
- A clean and intuitive layout with clear hierarchy, prioritizing market data and trade execution for an efficient user experience.