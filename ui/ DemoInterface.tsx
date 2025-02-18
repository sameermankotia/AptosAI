import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Wallet, Bot, BarChart3, ArrowRightLeft, Coins, Shield, Activity, AlertTriangle } from 'lucide-react';

const DemoInterface = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedToken, setSelectedToken] = useState('APT');
  const [swapAmount, setSwapAmount] = useState('');
  const [riskLevel, setRiskLevel] = useState('LOW');

  // Simulated data for demonstration
  useEffect(() => {
    setChartData([
      { name: 'Jan', value: 100 },
      { name: 'Feb', value: 120 },
      { name: 'Mar', value: 115 },
      { name: 'Apr', value: 130 },
      { name: 'May', value: 145 },
      { name: 'Jun', value: 160 }
    ]);
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAnalysis({
        totalValue: '$45,230',
        positions: [
          { protocol: 'PancakeSwap', type: 'Liquidity Pool', value: '$20,000' },
          { protocol: 'Liquidswap', type: 'Farm', value: '$15,230' },
          { protocol: 'Stargate', type: 'Stake', value: '$10,000' }
        ],
        recommendations: [
          'Consider rebalancing LP positions to optimize yields',
          'Current APR trends suggest moving liquidity to Stargate pools',
          'Monitor impermanent loss on ETH/APT pool'
        ]
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">AptosAI Framework Demo</CardTitle>
              <CardDescription>
                Explore AI-powered DeFi analysis and trading capabilities
              </CardDescription>
            </div>
            <Badge variant="outline" className="ml-2">
              v1.0.0
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Portfolio Analysis
          </TabsTrigger>
          <TabsTrigger value="trading" className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Smart Trading
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Risk Analysis
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Live Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Portfolio Advisor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter Aptos address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAnalyze}
                    disabled={loading || !address}
                  >
                    {loading ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </div>

                {analysis && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Total Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analysis.totalValue}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Active Positions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysis.positions.map((pos, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-sm">{pos.protocol} - {pos.type}</span>
                              <span className="font-medium">{pos.value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">AI Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-4 space-y-2">
                          {analysis.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm">{rec}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Portfolio Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8884d8" 
                        name="Portfolio Value"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Smart Swap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">From Token</label>
                    <Select value={selectedToken} onValueChange={setSelectedToken}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APT">APT</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="ETH">ETH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                    />
                  </div>
                  <Button className="w-full">Calculate Best Route</Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Route Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Best Price</span>
                        <span className="font-medium">$1,234.56</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price Impact</span>
                        <span className="font-medium text-yellow-600">0.45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Minimum Received</span>
                        <span className="font-medium">1,230 USDC</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Protocol Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Alert>
                    <AlertDescription>
                      Current Risk Level: {' '}
                      <Badge 
                        variant={riskLevel === 'LOW' ? 'default' : 'destructive'}
                      >
                        {riskLevel}
                      </Badge>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Key Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Value Locked</span>
                          <span className="font-medium">$100M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protocol Age</span>
                          <span className="font-medium">1.5 years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Audit Status</span>
                          <Badge variant="outline" className="ml-2">
                            Audited
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Security Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        • Smart contract audited by leading firms
                      </p>
                      <p className="text-sm">
                        • No major vulnerabilities detected
                      </p>
                      <p className="text-sm">
                        • Regular security updates implemented
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Live Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        name="TVL"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-2 border rounded">
                      <Activity className="w-4 h-4 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Swap: 100 APT → 1,234 USDC
                        </p>
                        <p className="text-xs text-gray-500">
                          2 minutes ago
                        </p>
                      </div>
                      <Badge>Success</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DemoInterface;