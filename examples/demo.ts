import { AptosAI, DeFiAdvisorAgent, TradingBot, utils } from '../src';
import dotenv from 'dotenv';
import { createInterface } from 'readline';

// Load environment variables
dotenv.config();

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string) => new Promise((resolve) => readline.question(query, resolve));

async function demonstrateFramework() {
    console.log("🚀 AptosAI Framework Demo");
    console.log("========================");

    // Initialize core framework
    const aptosAI = new AptosAI(
        process.env.APTOS_NODE_URL || 'https://fullnode.mainnet.aptoslabs.com',
        process.env.PRIVATE_KEY,
        process.env.OPENAI_API_KEY
    );

    // Demo 1: Basic Account Analysis
    console.log("\n📊 Demo 1: Basic Account Analysis");
    console.log("--------------------------------");
    
    const address = await question("Enter an Aptos address to analyze: ") as string;
    
    try {
        const resources = await aptosAI.getAccountResources(address);
        const balance = await aptosAI.getAccountBalance(address);
        
        console.log(`\nAccount Balance: ${utils.formatAmount(balance)} APT`);
        console.log(`Total Resources: ${resources.length}`);
    } catch (error) {
        console.error("Error in account analysis:", error);
    }

    // Demo 2: DeFi Advisor
    console.log("\n🤖 Demo 2: DeFi Advisor");
    console.log("----------------------");
    
    try {
        const advisor = new DeFiAdvisorAgent(
            process.env.APTOS_NODE_URL || 'https://fullnode.mainnet.aptoslabs.com',
            process.env.OPENAI_API_KEY || ''
        );

        console.log("\nAnalyzing portfolio...");
        const analysis = await advisor.analyzePortfolio(address);
        
        console.log("\nPortfolio Analysis:");
        console.log("------------------");
        console.log("Total Positions:", analysis.positions.length);
        console.log("\nAI Advice:");
        console.log(analysis.advice);

        // Get swap recommendation
        console.log("\nGetting swap recommendation...");
        const swapResult = await advisor.suggestOptimalSwap(
            "0x1::aptos_coin::AptosCoin",
            "0x...::USDC::USDC",
            "1000000000" // 10 APT
        );

        console.log("\nSwap Recommendation:");
        console.log("-------------------");
        console.log(swapResult.recommendation);
    } catch (error) {
        console.error("Error in DeFi advisor demo:", error);
    }

    // Demo 3: Trading Bot
    console.log("\n🤖 Demo 3: Trading Bot");
    console.log("--------------------");
    
    try {
        if (!process.env.PRIVATE_KEY) {
            console.log("Skipping trading bot demo (no private key provided)");
            return;
        }

        const bot = new TradingBot(
            process.env.APTOS_NODE_URL || 'https://fullnode.mainnet.aptoslabs.com',
            process.env.PRIVATE_KEY,
            process.env.OPENAI_API_KEY || '',
            'momentum',
            {
                minTradeInterval: 5 * 60 * 1000, // 5 minutes
                maxSlippage: 1.0 // 1%
            }
        );

        // Subscribe to events
        bot.on('trade', (data) => {
            console.log("\nTrade Executed:");
            console.log(`Transaction Hash: ${data.txHash}`);
            console.log(`Reasoning: ${data.reasoning}`);
        });

        bot.on('error', (error) => {
            console.error("Trading Error:", error);
        });

        console.log("\nStarting trading bot...");
        console.log("Press Ctrl+C to stop");

        // Run for demonstration
        await bot.monitorAndTrade();
        
        // In real usage, you would start the continuous monitoring:
        // await bot.start();
    } catch (error) {
        console.error("Error in trading bot demo:", error);
    }

    // Demo 4: Plugin System
    console.log("\n🔌 Demo 4: Plugin System");
    console.log("----------------------");
    
    try {
        // Get pool information
        const poolInfo = await aptosAI.executePluginAction(
            "liquidityPool",
            "getPoolInfo",
            {
                poolAddress: "0x..." // Replace with actual pool address
            }
        );

        console.log("\nPool Information:");
        console.log("-----------------");
        console.log(JSON.stringify(poolInfo, null, 2));

        // Calculate swap
        const swapQuote = await aptosAI.executePluginAction(
            "liquidityPool",
            "calculateSwap",
            {
                dex: "pancake",
                fromToken: "0x1::aptos_coin::AptosCoin",
                toToken: "0x...::USDC::USDC",
                amount: "1000000000" // 10 APT
            }
        );

        console.log("\nSwap Quote:");
        console.log("-----------");
        console.log(JSON.stringify(swapQuote, null, 2));
    } catch (error) {
        console.error("Error in plugin system demo:", error);
    }

    // Cleanup
    readline.close();
    console.log("\n✨ Demo Complete!");
}

// Run the demo
demonstrateFramework().catch(console.error);

/*
To run this demo:

1. Create a .env file with:
   APTOS_NODE_URL=https://fullnode.mainnet.aptoslabs.com
   PRIVATE_KEY=your_private_key_here
   OPENAI_API_KEY=your_openai_key_here

2. Run with:
   npm run demo
   
   or
   
   ts-node examples/demo.ts
*/