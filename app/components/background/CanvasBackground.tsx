"use client";
import React, { useEffect, useRef } from "react";

interface CanvasBackgroundProps {
  className?: string;
  iconSize?: number; // 图标大小，默认 40
  scrollSpeed?: number; // 滚动速度，默认 10
  spacing?: number; // 图标间距，默认基于图标大小计算
}

export default function CanvasBackground({
  className,
  iconSize = 40,
  scrollSpeed = 10,
  spacing,
}: CanvasBackgroundProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    // 绘制 Linkol 图标的函数
    const drawLinkolIcon = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number
    ) => {
      ctx.save();
      ctx.translate(x, y);

      // 设置颜色为白色透明度
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";

      // 根据 SVG 路径绘制图标形状
      const scale = size / 16; // SVG 原始尺寸是 16x16
      ctx.scale(scale, scale);

      ctx.beginPath();
      // SVG 路径: M1.33333 1.33333H5.7778V5.7778H10.2222V10.2222H14.6667V14.6667H1.33333V1.33333Z
      ctx.moveTo(1.33333, 1.33333);
      ctx.lineTo(5.7778, 1.33333);
      ctx.lineTo(5.7778, 5.7778);
      ctx.lineTo(10.2222, 5.7778);
      ctx.lineTo(10.2222, 10.2222);
      ctx.lineTo(14.6667, 10.2222);
      ctx.lineTo(14.6667, 14.6667);
      ctx.lineTo(1.33333, 14.6667);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // 动画函数
    const animate = () => {
      timeRef.current += 0.02;

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // 保持画布背景透明，不绘制背景色

      ctx.save();

      // 整体旋转 -30 度
      ctx.translate(rect.width / 2, rect.height / 2);
      ctx.rotate((-30 * Math.PI) / 180);
      ctx.translate(-rect.width / 2, -rect.height / 2);

      // 使用 props 中的图标大小和间距
      const currentIconSize = iconSize;
      const currentSpacing = spacing || iconSize * 1.5;
      // 增加更多行列以确保旋转后角落也能铺满
      const extraPadding = Math.max(rect.width, rect.height);
      const rows = Math.ceil((rect.height + extraPadding) / currentSpacing) + 8;
      const cols = Math.ceil((rect.width + extraPadding) / currentSpacing) + 8;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // 计算基础位置，从更远的负坐标开始以确保覆盖角落
          let x = col * currentSpacing - currentSpacing * 6;
          const y = row * currentSpacing - currentSpacing * 6;

          // 奇偶行错开滚动
          if (row % 2 === 0) {
            // 偶数行向右滚动
            x += (timeRef.current * scrollSpeed) % (currentSpacing * 2);
          } else {
            // 奇数行向左滚动
            x -= (timeRef.current * scrollSpeed) % (currentSpacing * 2);
          }

          drawLinkolIcon(ctx, x, y, currentIconSize);
        }
      }

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // 初始化
    resizeCanvas();
    animate();

    // 处理窗口大小变化
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full absolute inset-0 pointer-events-none ${
        className || ""
      }`}
    />
  );
}
