import { AptosAI, LiquidityPoolPlugin, PortfolioAnalysis, SwapQuote, utils } from '../../src';
import { OpenAI } from 'openai';

export class DeFiAdvisorAgent {
    private aptosAI: AptosAI;
    private openai: OpenAI;
    
    constructor(nodeUrl: string, openaiKey: string) {
        this.aptosAI = new AptosAI(nodeUrl);
        this.openai = new OpenAI({ apiKey: openaiKey });
        this.initializePlugins();
    }

    private initializePlugins() {
        const liquidityPlugin = new LiquidityPoolPlugin(this.aptosAI.getClient());
        this.aptosAI.registerPlugin("liquidityPool", liquidityPlugin);
    }

    async analyzePortfolio(address: string): Promise<PortfolioAnalysis> {
        try {
            // Get all positions and resources
            const [resources, transactions] = await Promise.all([
                this.aptosAI.getAccountResources(address),
                this.aptosAI.getAccountTransactions(address, { limit: 100 })
            ]);

            // Filter for DeFi positions
            const defiPositions = resources.filter(r => 
                r.type.includes("LiquidityPool") || 
                r.type.includes("Stake") ||
                r.type.includes("Farm")
            );

            // Calculate total value locked
            let totalValue = BigInt(0);
            for (const position of defiPositions) {
                if ('data' in position && 'value' in position.data) {
                    totalValue += BigInt(position.data.value);
                }
            }

            // Analyze transaction patterns
            const txPatterns = await this.analyzeTxPatterns(transactions);

            // Generate AI advice
            const advice = await this.generateAdvice(defiPositions, txPatterns, totalValue);

            return {
                positions: defiPositions,
                history: txPatterns,
                advice
            };
        } catch (error) {
            throw new Error(`Portfolio analysis failed: ${error.message}`);
        }
    }

    async suggestOptimalSwap(
        fromToken: string,
        toToken: string,
        amount: string
    ): Promise<{
        recommendation: string;
        quotes: SwapQuote[];
    }> {
        try {
            // Get quotes from multiple DEXes
            const dexes = ['pancake', 'liquidswap'];
            const quotes = await Promise.all(
                dexes.map(dex => 
                    this.aptosAI.executePluginAction(
                        "liquidityPool",
                        "calculateSwap",
                        {
                            dex,
                            fromToken,
                            toToken,
                            amount
                        }
                    )
                )
            );

            // Analyze quotes
            const bestQuote = quotes.reduce((best, current) => 
                BigInt(current.outputAmount) > BigInt(best.outputAmount) ? current : best
            );

            // Generate recommendation
            const recommendation = await this.generateSwapAdvice(
                quotes,
                bestQuote,
                fromToken,
                toToken,
                amount
            );

            return {
                recommendation,
                quotes
            };
        } catch (error) {
            throw new Error(`Swap analysis failed: ${error.message}`);
        }
    }

    async getRiskAssessment(protocol: string): Promise<{
        riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
        details: string;
    }> {
        try {
            // Get protocol data
            const protocolData = await this.getProtocolData(protocol);

            // Generate risk assessment
            const assessment = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a DeFi risk analyst specializing in Aptos protocols."
                    },
                    {
                        role: "user",
                        content: `Analyze the risk level of this protocol:
                            TVL: ${protocolData.tvl}
                            Age: ${protocolData.age}
                            Audit Status: ${protocolData.audited}
                            Past Incidents: ${protocolData.incidents}
                            `
                    }
                ]
            });

            // Parse assessment
            const riskAnalysis = assessment.choices[0].message.content;
            const riskLevel = this.determineRiskLevel(riskAnalysis);

            return {
                riskLevel,
                details: riskAnalysis
            };
        } catch (error) {
            throw new Error(`Risk assessment failed: ${error.message}`);
        }
    }

    private async analyzeTxPatterns(transactions: any[]): Promise<string> {
        const analysis = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "Analyze these blockchain transactions for patterns and insights."
                },
                {
                    role: "user",
                    content: `Transaction history: ${JSON.stringify(transactions)}`
                }
            ]
        });

        return analysis.choices[0].message.content;
    }

    private async generateAdvice(
        positions: any[],
        patterns: string,
        totalValue: bigint
    ): Promise<string> {
        const advice = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "Generate DeFi investment advice based on portfolio analysis."
                },
                {
                    role: "user",
                    content: `
                        Positions: ${JSON.stringify(positions)}
                        Patterns: ${patterns}
                        Total Value: ${utils.formatAmount(totalValue)}
                    `
                }
            ]
        });

        return advice.choices[0].message.content;
    }

    private async generateSwapAdvice(
        quotes: SwapQuote[],
        bestQuote: SwapQuote,
        fromToken: string,
        toToken: string,
        amount: string
    ): Promise<string> {
        const advice = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "Analyze swap quotes and provide trading recommendations."
                },
                {
                    role: "user",
                    content: `
                        Quotes: ${JSON.stringify(quotes)}
                        Best Quote: ${JSON.stringify(bestQuote)}
                        From Token: ${fromToken}
                        To Token: ${toToken}
                        Amount: ${amount}
                    `
                }
            ]
        });

        return advice.choices[0].message.content;
    }

    private async getProtocolData(protocol: string): Promise<{
        tvl: string;
        age: string;
        audited: boolean;
        incidents: string[];
    }> {
        // This would typically fetch data from multiple sources
        // This is a simplified example
        return {
            tvl: "1000000",
            age: "6 months",
            audited: true,
            incidents: []
        };
    }

    private determineRiskLevel(analysis: string): 'LOW' | 'MEDIUM' | 'HIGH' {
        const lowRiskTerms = ['safe', 'secure', 'reliable', 'established'];
        const highRiskTerms = ['dangerous', 'risky', 'unstable', 'vulnerable'];

        const analysisLower = analysis.toLowerCase();
        
        if (highRiskTerms.some(term => analysisLower.includes(term))) {
            return 'HIGH';
        } else if (lowRiskTerms.some(term => analysisLower.includes(term))) {
            return 'LOW';
        } else {
            return 'MEDIUM';
        }
    }
}