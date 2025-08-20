"use client";

import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/shadcn/components/ui/chart";
import avatar from "@/app/assets/img/avatar.png";
import { imageToBase64 } from "@/app/libs/utils";

const chartConfig = {
  value: {
    label: "",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function CommLineChart({ data }: { data: any }) {
  const [avatarBase64, setAvatarBase64] = useState<string>("");

  // 写死的7点正态分布数据，X轴从0到10000
  const fixedData = [
    { price: 100, value: 0 },
    { price: 900, value: 50 },
    { price: 1700, value: 230 },
    { price: 2500, value: 310 }, // 最高点（第四个点，正中间）
    { price: 3300, value: 230 },
    { price: 4100, value: 50 },
    { price: 4900, value: 20 },
    { price: 10000, value: 0 },
  ];

  let processedData = fixedData;

  // 当组件加载或数据变化时，转换图片为base64
  useEffect(() => {
    const convertImageToBase64 = async () => {
      try {
        const imageUrl = data?.kol?.profile_image_url || avatar.src;
        const base64 = await imageToBase64(imageUrl);
        setAvatarBase64(base64);
      } catch (error) {
        console.error("图片转换base64失败:", error);
        // 如果转换失败，使用默认头像
        try {
          const defaultBase64 = await imageToBase64(avatar.src);
          setAvatarBase64(defaultBase64);
        } catch (defaultError) {
          console.error("默认头像转换也失败:", defaultError);
        }
      }
    };

    convertImageToBase64();
  }, [data?.kol?.profile_image_url]);

  // 自定义参考线标签组件 - KOL头像
  const CustomLabel = (props: any) => {
    const { viewBox } = props;
    const { x } = viewBox;

    return (
      <g>
        {/* <defs>
          <clipPath id="avatarClip">
            <circle cx="20" cy="20" r="18" />
          </clipPath>
        </defs> */}
        {/* 头像背景圆圈 */}
        <circle
          cx={x}
          cy="20"
          r="18"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
        <foreignObject x={x - 18} y="2" width="36" height="36">
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              overflow: "hidden",
              backgroundImage: `url(${avatarBase64 || avatar.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </foreignObject>
        {/* <image
          x={x - 18}
          y="2"
          width="36"
          height="36"
          href={avatarBase64 || avatar.src}
          clipPath="url(#avatarClip)"
        /> */}
      </g>
    );
  };

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <AreaChart
        className="h-full w-full"
        accessibilityLayer
        data={processedData}
        margin={{
          top: 40,
          left: 20,
          right: 20,
        }}
      >
        <defs>
          <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-primary)"
              stopOpacity={0.5}
            />
            <stop
              offset="95%"
              stopColor="var(--color-primary)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} horizontal={false} />
        <XAxis
          dataKey="price"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
          scale="linear"
          type="number"
        />
        {/* <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        /> */}
        <Area
          dataKey="value"
          type="monotone"
          // type="natural"
          fill="url(#fillValue)"
          stroke="var(--color-primary)"
          strokeWidth={3}
          dot={{
            fill: "var(--color-primary)",
            strokeWidth: 2,
            r: 3,
          }}
          activeDot={{
            r: 6,
            fill: "var(--color-primary)",
          }}
        />
        {/* 显示current_value位置的竖线虚线和KOL头像 */}
        {data?.current_value !== undefined && (
          <ReferenceLine
            x={data.current_value}
            stroke="var(--color-primary)"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={<CustomLabel />}
            ifOverflow="extendDomain"
          />
        )}
      </AreaChart>
    </ChartContainer>
  );
}
