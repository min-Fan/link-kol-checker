"use client";

import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/shadcn/components/ui/chart";
import { Skeleton } from "@/app/shadcn/components/ui/skeleton";
import {
  get7DaysPriceCurve,
  IGet7DaysPriceCurveData,
} from "@/app/libs/request";
import { AreaChartIcon, X } from "lucide-react";

const chartConfig = {
  value: {
    label: "",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface PriceCurveChartProps {
  screenName: string;
}

export function PriceCurveChart({ screenName }: PriceCurveChartProps) {
  const [chartData, setChartData] = useState<IGet7DaysPriceCurveData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response: any = await get7DaysPriceCurve({
          screen_name: screenName,
        });

        if (response.code === 200) {
          setChartData(response.data);
        } else {
          setError(response.msg || "Price curve data fetching failed");
        }
      } catch (err) {
        console.error("Price curve data fetching failed:", err);
        setError("Network request failed");
      } finally {
        setLoading(false);
      }
    };

    if (screenName) {
      fetchData();
    }
  }, [screenName]);

  // 处理数据格式，将API返回的数据转换为图表需要的格式
  const processedData =
    chartData?.data.map((value, index) => ({
      value,
      label: chartData.labels[index] || `第${index + 1}天`,
    })) || [];

  if (loading) {
    return (
      <ChartContainer config={chartConfig} className="h-full w-full flex-1">
        <div className="h-full w-full flex flex-col">
          {/* 模拟图表区域 */}
          <div className="flex-1 w-full mb-4">
            <Skeleton className="h-full w-full bg-primary/30" />
          </div>
          {/* 模拟X轴标签 */}
          <div className="flex justify-between px-4 h-6">
            <Skeleton className="h-3 w-8 bg-primary/30" />
            <Skeleton className="h-3 w-8 bg-primary/30" />
            <Skeleton className="h-3 w-8 bg-primary/30" />
            <Skeleton className="h-3 w-8 bg-primary/30" />
            <Skeleton className="h-3 w-8 bg-primary/30" />
            <Skeleton className="h-3 w-8 bg-primary/30" />
          </div>
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer config={chartConfig} className="h-full w-full flex-1">
        <div className="h-full w-full flex items-center justify-center flex-col gap-2 sm:gap-4">
          <div className="flex items-center justify-center p-4 bg-primary/20 rounded-full">
            <X className="w-10 h-10 min-w-10 min-h-10 text-muted-foreground" />
          </div>
          <div className="text-sm sm:text-md text-muted-foreground text-center font-sf">
            {error}
          </div>
        </div>
      </ChartContainer>
    );
  }

  if (!chartData || processedData.length === 0) {
    return (
      <ChartContainer config={chartConfig} className="h-full w-full flex-1">
        <div className="h-full w-full flex items-center justify-center flex-col gap-2 sm:gap-4">
          <div className="flex items-center justify-center p-4 bg-primary/20 rounded-full">
            <AreaChartIcon className="w-10 h-10 min-w-10 min-h-10 text-muted-foreground" />
          </div>
          <div className="text-sm sm:text-md text-muted-foreground font-sf text-center">
            No data
          </div>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-full w-full flex-1">
      <AreaChart
        className="h-full w-full"
        accessibilityLayer
        data={processedData}
        margin={{
          top: 0,
          left: 5,
          right: 5,
        }}
      >
        <defs>
          <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-primary)"
              stopOpacity={0.5}
            />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} horizontal={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-border/20 bg-background p-2 shadow-md shadow-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: payload[0].color }}
                    />
                    <span className="font-sf text-sm font-medium">
                      Price Curve
                    </span>
                  </div>
                  <div className="font-sf text-muted-foreground">
                    Price:{" "}
                    <span className="font-sf text-foreground">
                      ${payload[0].value}
                    </span>
                  </div>
                  <div className="font-sf text-muted-foreground">
                    Time:{" "}
                    <span className="font-sf text-foreground">
                      {payload[0].payload.label}
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          dataKey="value"
          type="monotone"
          fill="url(#fillValue)"
          stroke="var(--color-primary)"
          strokeWidth={3}
          dot={{
            fill: "var(--color-primary)",
            stroke: "var(--color-primary)",
            strokeWidth: 0,
            r: 4,
            fillOpacity: 1,
          }}
          activeDot={{
            r: 6,
            fill: "var(--color-primary)",
            stroke: "var(--color-primary)",
            strokeWidth: 0,
            fillOpacity: 1,
          }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
