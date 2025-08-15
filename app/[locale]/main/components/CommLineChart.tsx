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

  // 处理数据格式：price来自bins，value来自data，并在第一位补0
  let processedData =
    data?.bins?.map((price: any, index: number) => ({
      price,
      value: index === 0 ? 0 : data?.data?.[index - 1] || 0,
    })) || [];

  // 只有当 current_value 在合理范围内且不在 bins 中时，才添加这个点
  if (
    data?.current_value !== undefined &&
    data?.bins &&
    !data?.bins?.includes(data.current_value) &&
    data.current_value >= data.bins[0] &&
    data.current_value <= data.bins[data.bins.length - 1]
  ) {
    // 计算 current_value 对应的 value
    let valueForCurrentPrice = 0;
    if (
      data?.current_bin !== undefined &&
      data?.data?.[data.current_bin] !== undefined
    ) {
      valueForCurrentPrice = data.data[data.current_bin];
    }

    const currentValuePoint = {
      price: data.current_value,
      value: valueForCurrentPrice,
    };

    // 将点插入到正确的位置（保持价格排序）
    processedData.push(currentValuePoint);
    processedData.sort((a: any, b: any) => a.price - b.price);
  }

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
        <defs>
          <clipPath id="avatarClip">
            <circle cx="20" cy="20" r="18" />
          </clipPath>
        </defs>
        {/* 头像背景圆圈 */}
        <circle
          cx={x}
          cy="20"
          r="18"
          fill="hsl(var(--background))"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
        {/* 头像图片，使用clipPath裁剪为圆形 */}
        <image
          x={x - 18}
          y="2"
          width="36"
          height="36"
          href={avatarBase64 || avatar.src}
          clipPath="url(#avatarClip)"
        />
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
          top: 12,
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
        />
        {/* <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        /> */}
        <Area
          dataKey="value"
          type="natural"
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
        {data?.current_value !== undefined && data?.bins && (
          <ReferenceLine
            x={
              data.current_value < data.bins[0]
                ? data.bins[0]
                : data.current_value > data.bins[data.bins.length - 1]
                  ? data.bins[data.bins.length - 1]
                  : data.current_value
            }
            stroke="var(--color-primary)"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={<CustomLabel />}
          />
        )}
      </AreaChart>
    </ChartContainer>
  );
}
