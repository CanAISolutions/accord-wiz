import { getProvinceRules, PROVINCES } from "@/lib/canadaRentalRules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DepositCapsChart() {
  const data = PROVINCES.map(p => {
    const r = getProvinceRules(p.code as any);
    const months = r?.securityDeposit?.allowed ? (r?.securityDeposit?.maxMonths ?? 0) : 0;
    return { name: p.code, months };
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security deposit caps (months of rent)</CardTitle>
      </CardHeader>
      <CardContent style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="months" fill="#60a5fa" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


