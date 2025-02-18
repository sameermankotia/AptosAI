# AptosAI Framework 🤖

AptosAI is a powerful framework that enables developers to build AI-powered applications on the Aptos blockchain. It provides seamless integration between AI capabilities and blockchain interactions, making it easier to create intelligent DeFi applications, trading bots, and analytical tools.

![AptosAI Demo]-:
![Image 2-18-25 at 3 06 PM](https://github.com/user-attachments/assets/72280262-105a-4153-b921-030b1805d5f3)
![Image 2-18-25 at 3 06 PM 2](https://github.com/user-attachments/assets/a42fd92d-c671-42f5-ac7e-d2213137fa3f)
![Image 2-18-25 at 3 07 PM (1)](https://github.com/user-attachments/assets/ebc9a6b1-1f07-4ea3-88ac-4bd6fbd90bdc)
![Image 2-18-25 at 3 07 PM](https://github.com/user-attachments/assets/744c52f4-716a-4d3a-bf7c-0dfc5bdc1762)

## 🌟 Features

### Core Capabilities
- **🔗 Blockchain Integration**: Direct interaction with Aptos blockchain using the official SDK
- **🧠 AI Integration**: Built-in OpenAI support for transaction analysis and smart contract interaction
- **🔌 Plugin System**: Extensible architecture for adding DeFi protocol integrations
- **📊 Transaction Management**: Simplified transaction creation and submission
- **💼 Resource Management**: Easy access to account resources and balances

### DeFi Integration
- **📈 Automated Trading**: AI-powered trading strategies and execution
- **💰 Portfolio Analysis**: Smart portfolio management and optimization
- **🔄 Cross-DEX Operations**: Support for multiple DEX protocols
- **⚡ Real-time Monitoring**: Live tracking of positions and market data

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install aptos-ai

# Using yarn
yarn add aptos-ai
```

### Basic Usage

```typescript
import { AptosAI } from 'aptos-ai';

// Initialize the framework
const aptosAI = new AptosAI(
    "https://fullnode.mainnet.aptoslabs.com",
    privateKey,  // Optional: For transaction signing
    openaiKey   // Optional: For AI features
);

// Analyze a portfolio
const analysis = await aptosAI.analyzePortfolio("0x123...abc");
console.log("Portfolio Analysis:", analysis);

// Get optimal swap route
const swapRoute = await aptosAI.findOptimalSwap(
    "APT",
    "USDC",
    "1000000000" // 10 APT
);
console.log("Best Swap Route:", swapRoute);
```

## 🏗️ Architecture

The framework is built on a modular architecture with three main components:

```
┌─────────────────────────────────┐
│           Application           │
└───────────────┬─────────────────┘
                │
┌───────────────┼─────────────────┐
│               │                  │
│    Core       │      Plugin     │
│    Layer  ←───┴───→   Layer     │
│               │                  │
└───────────────┼─────────────────┘
                │
┌───────────────┴─────────────────┐
│            AI Layer             │
└─────────────────────────────────┘
```

### Core Layer
- Handles direct blockchain interactions
- Manages account and transaction handling
- Provides base AI integration

### Plugin Layer
- Implements protocol-specific logic
- Standardizes DeFi interactions
- Enables easy extension for new protocols

### AI Layer
- Processes blockchain data
- Generates insights and recommendations
- Handles risk assessment

## 🔌 Plugin System

Create custom plugins by implementing the `DeFiPlugin` interface:

```typescript
interface DeFiPlugin {
    execute(action: string, params: any): Promise<any>;
}

// Example: Liquidity Pool Plugin
class LiquidityPoolPlugin implements DeFiPlugin {
    async execute(action: string, params: any): Promise<any> {
        switch (action) {
            case "getPoolInfo":
                return this.getPoolInfo(params.poolAddress);
            case "calculateSwap":
                return this.calculateSwap(params);
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }
}
```

## 🎯 Example Applications

### 1. DeFi Advisor Agent

```typescript
const advisor = new DeFiAdvisorAgent(nodeUrl, openaiKey);

// Get portfolio analysis
const analysis = await advisor.analyzePortfolio("0x123...abc");
console.log("Portfolio Analysis:", analysis);

// Get swap recommendation
const recommendation = await advisor.suggestOptimalSwap(
    "APT",
    "USDC",
    "1000000000"
);
console.log("Swap Recommendation:", recommendation);
```

### 2. Trading Bot

```typescript
const bot = new TradingBot(nodeUrl, privateKey, openaiKey, "momentum");

// Start automated trading
bot.on('trade', (data) => {
    console.log("Trade executed:", data);
});

await bot.start();
```

## 📊 Demo UI

The framework includes a modern, interactive demo UI built with Next.js and Tailwind CSS. To run the demo:

```bash
# Install dependencies
npm install

# Start the demo
npm run dev
```

Features of the demo UI:
- Portfolio Analysis Dashboard
- Real-time Trading Interface
- Risk Assessment Tools
- Performance Monitoring

## 🛠️ Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aptos-ai.git
cd aptos-ai
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.template .env
# Edit .env with your configuration
```

4. Run tests:
```bash
npm test
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 🔒 Security

- Always store private keys securely
- Use environment variables for sensitive data
- Regularly update dependencies
- Test thoroughly before deployment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

Built with ❤️ for the Aptos Ecosystem By Sameeer Mankotia(sameermankotia2000@gmail.com)
