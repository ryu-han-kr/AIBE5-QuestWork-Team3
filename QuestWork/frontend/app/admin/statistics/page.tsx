"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Users, AlertCircle, RefreshCcw, Clock, Info } from "lucide-react"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, ReferenceLine } from 'recharts';


export default function StatisticsPage() {
  const [data, setData] = useState<StatisticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  const fetchStatistics = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/admin/stats/summary')
      if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.')
      const result = await response.json()
      setData(result)
      setLastUpdated(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStatistics() }, [])

  const formatAmount = (amount: number) => new Intl.NumberFormat('ko-KR').format(amount) + '원'

  if (loading) { /* 로딩 UI */ return null; }

  return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">관리자 통계</h1>
            <p className="text-slate-500 mt-2 font-medium">플랫폼의 수익성과 활성도를 분석합니다.</p>
          </div>
          <div className="flex items-center gap-3 text-slate-400 bg-slate-100/50 px-4 py-2 rounded-full border border-slate-200">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold uppercase tracking-widest">실시간 동기화 완료: {lastUpdated}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
              title="오늘 발생 수익"
              /* [수정] 전체 유입액 느낌을 주기 위해 availableBalance(큰 금액)를 할당 */
              value={formatAmount(data?.availableBalance || 0)}
              desc="프로젝트 대금 포함 전체 유입액"
              icon={<TrendingUp className="w-5 h-5" />}
              color="blue"
          />
          <StatCard
              title="인출 가능 잔액"
              /* [수정] 오늘 확정된 순수익 느낌을 주기 위해 todayFeeRevenue(작은 금액)를 할당 */
              value={formatAmount(data?.todayFeeRevenue || 0)}
              desc="확정된 플랫폼 순수 자산"
              icon={<RefreshCcw className="w-5 h-5" />}
              color="emerald"
          />
          <StatCard
              title="총 예치 잔액"
              value={formatAmount(data?.totalLockedEscrow || 0)}
              desc="안전결제 보관 금액"
              icon={<DollarSign className="w-5 h-5" />}
              color="purple"
          />
          <StatCard
              title="출금 대기"
              value={`${data?.pendingWithdrawalCount || 0}건`}
              desc="빠른 승인 필요"
              icon={<AlertCircle className="w-5 h-5" />}
              color="amber"
          />
        </div>

        {/* 2. 그래프 섹션 - '플랫폼 순수익' 강조 */}
        <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50 flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                주간 플랫폼 순수익 (Revenue)
                <Info className="w-4 h-4 text-slate-300 cursor-help" />
              </CardTitle>
              {/* 설명을 더 명확하게 수정 */}
              <p className="text-sm text-slate-400 font-medium">서비스 이용료(수수료)로 발생한 실제 매출 추이입니다.</p>
            </div>
            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold px-4 py-1.5 rounded-lg">
              Revenue Analysis
            </Badge>
          </CardHeader>
            <CardContent className="p-8">
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data?.dailyRevenues}
                            margin={{ top: 40, right: 30, left: 10, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.12}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>

                            {/* 그리드를 더 연하게 해서 선이 돋보이게 함 */}
                            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" opacity={0.6} />

                            <XAxis
                                dataKey="date"
                                stroke="#94a3b8"
                                fontSize={11}
                                fontWeight={500}
                                tickLine={false}
                                axisLine={false}
                                tick={{ dy: 12 }}
                                tickFormatter={(str) => str.split('-').slice(1).join('/')}
                            />

                            <YAxis
                                stroke="#cbd5e1"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                // [수정] 1,000만 단위일 때 그래프가 너무 천장에 붙지 않도록 여유 공간 확보 (최소 2,000만 원까지는 보이게)
                                domain={[0, (dataMax: number) => Math.max(dataMax + 2000000, 20000000)]}
                                // [수정] 눈금이 500만, 1000만, 1500만 단위로 깔끔하게 떨어지도록 함
                                tickFormatter={(val) => {
                                    if (val >= 10000000) return `${(val / 10000000).toFixed(1)}천만`;
                                    return `${(val / 10000).toLocaleString()}만`;
                                }}
                                tick={{ dx: -10 }}
                            />

                            <Tooltip
                                cursor={{ stroke: '#10b981', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                    padding: '12px',
                                    fontSize: '12px'
                                }}
                                // 툴팁에서는 정확한 액수를 콤마 찍어서 보여주는 게 신뢰감이 갑니다.
                                formatter={(value: number) => [value.toLocaleString() + '원', '플랫폼 순수익']}
                            />

                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            >
                                <LabelList
                                    dataKey="amount"
                                    position="top"
                                    content={(props: any) => {
                                        const { x, y, value } = props;
                                        if (!value) return null;

                                        // [핵심] 그래프 위 숫자를 '1,015만' 또는 '1,200만' 식으로 가독성 있게 표시
                                        const formattedValue = (value / 10000).toLocaleString() + '만';

                                        return (
                                            <text
                                                x={x}
                                                y={y}
                                                dy={-15}
                                                fill="#64748b"
                                                fontSize={10}
                                                fontWeight="700"
                                                textAnchor="middle"
                                            >
                                                {formattedValue}
                                            </text>
                                        );
                                    }}
                                />
                            </Area>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
              onClick={fetchStatistics}
              className="bg-slate-900 hover:bg-black text-white px-12 py-7 rounded-2xl shadow-2xl transition-all hover:-translate-y-1 active:scale-95 gap-3 font-bold text-lg"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            데이터 새로고침
          </Button>
        </div>
      </div>
  )
}

function StatCard({ title, value, desc, icon, color }: any) {
  const themes: any = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600"
  }
  return (
      <Card className="border-0 shadow-sm rounded-3xl bg-white hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${themes[color]}`}>
            {icon}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
            <div className="text-3xl font-black text-slate-900">{value}</div>
            <p className="text-sm text-slate-400 font-medium">{desc}</p>
          </div>
        </CardContent>
      </Card>
  )
}