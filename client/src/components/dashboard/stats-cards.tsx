import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Play, Check, Crown } from "lucide-react";

export default function StatsCards() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard-stats"],
  });

  const cards = [
    {
      title: "Total Prompts",
      value: stats?.totalPrompts || 0,
      icon: Edit,
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500 bg-opacity-20",
    },
    {
      title: "Runs Today",
      value: stats?.runsToday || 0,
      icon: Play,
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500 bg-opacity-20",
    },
    {
      title: "Success Rate",
      value: `${stats?.successRate || 0}%`,
      icon: Check,
      iconColor: "text-green-400",
      bgColor: "bg-green-500 bg-opacity-20",
    },
    {
      title: "Current Plan",
      value: "Pro",
      icon: Crown,
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500 bg-opacity-20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="hover:border-emerald-500 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <card.icon className={`${card.iconColor} h-6 w-6`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
