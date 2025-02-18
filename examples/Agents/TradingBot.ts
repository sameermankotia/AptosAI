import { AptosAI, LiquidityPoolPlugin, MarketData, TradingDecision, utils } from '../../src';
import { OpenAI } from 'openai';
import { EventEmitter } from 'events';

interface TradingStrategy {
    name: string;
    description: string;
    parameters: {
        [key: string]: any;
    };
}

export class TradingBot extends EventEmitter {
    private aptosAI: AptosAI;
    private openai: OpenAI;
    private strategy: TradingStrategy;
    private isRunning: boolean = false;
    private lastTrade: Date | null = null;
    private minTradeInterval: number; // milliseconds
    
    constructor(
        nodeUrl: string,
        privateKey: string,
        openaiKey: string,
        strategy: string,
        config: {
            minTradeInterval?: number;
            maxSlippage?: number;
        } = {}
    ) {
        super();
        this.aptosAI = new AptosAI(nodeUrl, privateKey);
        this.openai = new OpenAI({ apiKey: openaiKey });
        this.strategy = this.loadStrategy(strategy);
        this.minTradeInterval = config.minTradeInterval || 5 * 60 * 1000; // 5 minutes default
        this.initializePlugins();
    }

    private initializePlugins() {
        const liquidityPlugin = new LiquidityPoolPlugin(this.aptosAI.getClient());
        this.aptosAI.registerPlugin("liquidityPool", liquidityPlugin);
    }

    async start() {
        if (this.isRunning) {
            throw new Error("Trading bot is already running");
        }

        this.isRunning = true;
        this.emit('started');

        while (this.isRunning) {
            try {
                await this.monitorAndTrade();
                await new Promise(resolve => setTimeout(resolve, 30000)); // 30-second interval
            } catch (error) {
                this.emit('error', error);
                console.error('Trading error:', error);
            }
        }
    }

    stop() {
        this.isRunning = false;
        this.emit('stopped');
    }

    async monitorAndTrade(): Promise<void> {
        try {
            // Check if enough time has passed since last trade
            if (this.lastTrade && 
                Date.now() - this.lastTrade.getTime() < this.minTradeInterval) {
                return;
            }

            // Get market data
            const marketData = await this.getMarketData();
            
            // Analyze using AI and strategy
            const decision = await this.analyzeMarket(marketData);
            
            if (decision.shouldTrade) {
                // Execute trade
                const txHash = await this.executeTrade(decision.trade);
                
                // Update last trade timestamp
                this.lastTrade = new Date();
                
                // Emit trade event
                this.emit('trade', {
                    txHash,
                    trade: decision.trade,
                    reasoning: decision.reasoning
                });
            }
        } catch (error) {
            throw new Error(`Trading cycle failed: ${error.message}`);
        }
    }

    private async getMarketData(): Promise<MarketData> {
        try {
            // Get data from multiple sources
            const [prices, volumes, liquidityDepth] = await Promise.all([
                this.fetchPrices(),
                this.fetchVolumes(),
                this.fetchLiquidity()
            ]);

            return {
                prices,
                volumes,
                liquidityDepth,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            throw new Error(`Failed to fetch market data: ${error.message}`);
        }
    }

    private async analyzeMarket(marketData: MarketData): Promise<TradingDecision> {
        try {
            const analysis = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `You are a trading bot using the ${this.strategy.name} strategy.
                            Strategy parameters: ${JSON.stringify(this.strategy.parameters)}`
                    },
                    {
                        role: "user",
                        content: `Analyze market data and suggest trades:
                            ${JSON.stringify(marketData, null, 2)}`
                    }
                ]
            });

            // Parse AI response into trading decision
            const decision = this.parseTradeDecision(analysis.choices[0].message.content);
            
            // Validate decision
            if (decision.shouldTrade) {
                await this.validateTrade(decision.trade);
            }

            return decision;
        } catch (error) {
            throw new Error(`Market analysis failed: ${error.message}`);
        }
    }

    private async executeTrade(trade: any): Promise<string> {
        try {
            // Prepare transaction payload
            const payload = {
                function: `${trade.protocol}::router::swap`,
                type_arguments: [trade.fromToken, trade.toToken],
                arguments: [trade.amount, trade.minOutput]
            };

            // Submit transaction
            const txHash = await this.aptosAI.submitTransaction(payload);
            
            return txHash;
        } catch (error) {
            throw new Error(`Trade execution failed: ${error.message}`);
        }
    }

    private async validateTrade(trade: any): Promise<void> {
        // Check token balances
        const balance = await this.aptosAI.getAccountBalance(
            this.aptosAI.getAddress(),
            trade.fromToken
        );

        if (BigInt(balance) < BigInt(trade.amount)) {
            throw new Error("Insufficient balance for trade");
        }

        // Validate price impact
        const quote = await this.aptosAI.executePluginAction(
            "liquidityPool",
            "calculateSwap",
            {
                fromToken: trade.fromToken,
                toToken: trade.toToken,
                amount: trade.amount
            }
        );

        if (parseFloat(quote.priceImpact) > 1.0) { // 1% max price impact
            throw new Error("Price impact too high");
        }
    }

    private loadStrategy(strategyName: string): TradingStrategy {
        // This would typically load from a strategy configuration file
        // This is a simplified example
        return {
            name: strategyName,
            description: "Simple momentum trading strategy",
            parameters: {
                lookbackPeriod: "24h",
                momentumThreshold: 0.05,
                maxTradeSize: "1000000000" // 10 APT
            }
        };