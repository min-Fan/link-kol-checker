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
  iconSize = 60,
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
      size: number,
    ) => {
      ctx.save();
      ctx.translate(x, y);

      // 设置颜色为白色透明度
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";

      // 根据 SVG 原始尺寸 1920x1920 计算缩放比例
      const scale = size / 1920;
      ctx.scale(scale, scale);

      ctx.beginPath();

      // 第一个路径: M743.14,1204.2l311.62-539.74c6.91-11.97,6.95-26.7.1-38.7l-61.19-107.22c-14.96-25.91-52.36-25.91-67.33,0l-487.3,844.03c-14.96,25.91,3.74,58.31,33.66,58.31h974.6c29.92,0,48.62-32.39,33.66-58.31l-46.56-80.64c-6.94-12.03-19.78-19.44-33.66-19.44h-623.94c-29.92,0-48.62-32.39-33.66-58.31Z
      ctx.moveTo(743.14, 1204.2);
      ctx.lineTo(1054.76, 664.46);
      ctx.quadraticCurveTo(1061.67, 652.49, 1061.71, 637.76);
      ctx.lineTo(1000.52, 530.54);
      ctx.quadraticCurveTo(985.56, 504.63, 948.16, 504.63);
      ctx.lineTo(460.86, 1348.66);
      ctx.quadraticCurveTo(445.9, 1374.57, 479.6, 1406.97);
      ctx.lineTo(1454.2, 1406.97);
      ctx.quadraticCurveTo(1484.12, 1406.97, 1502.82, 1374.58);
      ctx.lineTo(1456.26, 1293.94);
      ctx.quadraticCurveTo(1449.32, 1281.91, 1435.44, 1274.5);
      ctx.lineTo(811.5, 1274.5);
      ctx.quadraticCurveTo(781.58, 1274.5, 762.88, 1306.89);
      ctx.closePath();

      // 第二个路径: M1244.98,1072.18l-167.66,290.4c-14.96,25.91,3.74,58.31,33.66,58.31h335.32c29.92,0,48.62-32.39,33.66-58.31l-167.66-290.4c-14.96-25.91-52.36-25.91-67.33,0Z
      ctx.moveTo(1244.98, 1072.18);
      ctx.lineTo(1077.32, 1362.58);
      ctx.quadraticCurveTo(1062.36, 1388.49, 1096.06, 1420.89);
      ctx.lineTo(1431.38, 1420.89);
      ctx.quadraticCurveTo(1461.3, 1420.89, 1479.98, 1388.5);
      ctx.lineTo(1312.32, 1098.1);
      ctx.quadraticCurveTo(1297.36, 1072.19, 1259.96, 1072.19);
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
