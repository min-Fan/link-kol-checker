"use client";
import { useEffect, useRef } from "react";
import { motion, useInView, HTMLMotionProps } from "motion/react";

interface CanimatedPathSvgProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  SvgComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  duration?: number;
  delay?: number;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  pathSelector?: string; // 用于选择特定的路径
  className?: string;
}

const CanimatedPathSvg = ({
  SvgComponent,
  duration = 2,
  delay = 0,
  strokeColor,
  fillColor,
  strokeWidth,
  className,
  pathSelector = "path,line,circle,ellipse,rect,g,g rect,filter feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDropShadow,feFlood,feGaussianBlur,feImage,feMerge,feMorphology,feOffset,feSpecularLighting,feTile,feTurbulence,feDistantLight,fePointLight,feSpotLight",
  ...props
}: CanimatedPathSvgProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(containerRef, { once: false });

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll(pathSelector);
    paths.forEach((path) => {
      let length;
      if (path instanceof SVGCircleElement) {
        const radius = path.r.baseVal.value;
        length = 2 * Math.PI * radius;
      } else if (path instanceof SVGEllipseElement) {
        const rx = path.rx.baseVal.value;
        const ry = path.ry.baseVal.value;
        length =
          Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
      } else if (path instanceof SVGRectElement) {
        const width = path.width.baseVal.value;
        const height = path.height.baseVal.value;
        length = 2 * (width + height);
      } else if (path instanceof SVGGElement) {
        length = Array.from(path.children).reduce((total, child) => {
          if (child instanceof SVGRectElement) {
            return (
              total +
              2 * (child.width.baseVal.value + child.height.baseVal.value)
            );
          }
          if (child instanceof SVGCircleElement) {
            return total + 2 * Math.PI * child.r.baseVal.value;
          }
          if (child instanceof SVGEllipseElement) {
            const rx = child.rx.baseVal.value;
            const ry = child.ry.baseVal.value;
            return (
              total +
              Math.PI *
                (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)))
            );
          }
          if (child instanceof SVGPathElement) {
            return total + child.getTotalLength();
          }
          return total;
        }, 0);
      } else if (path instanceof SVGElement && path.tagName.startsWith("fe")) {
        length = 100;
      } else {
        length = (path as SVGPathElement).getTotalLength();
      }

      const existingDashArray = path.getAttribute("stroke-dasharray");

      if (path instanceof SVGElement && !path.tagName.startsWith("fe")) {
        // 获取元素原始的属性
        const originalFill = path.getAttribute("fill") || "#ffffff";
        const originalStroke = path.getAttribute("stroke") || originalFill;
        const originalStrokeWidth = path.getAttribute("stroke-width") || "2";

        // 确定最终使用的属性值
        const finalFillColor = fillColor || originalFill;
        const finalStrokeColor = strokeColor || originalStroke;
        const finalStrokeWidth =
          strokeWidth !== undefined ? `${strokeWidth}` : originalStrokeWidth;

        // 设置 CSS 变量
        (path as SVGPathElement).style.setProperty(
          "--path-length",
          `${length}`,
        );
        (path as SVGPathElement).style.setProperty(
          "--fill-color",
          finalFillColor,
        );

        // 设置 stroke 属性以启用路径动画
        (path as SVGPathElement).style.stroke = finalStrokeColor;
        (path as SVGPathElement).style.strokeWidth = finalStrokeWidth;
        (path as SVGPathElement).style.fill = "none"; // 暂时移除 fill，只显示 stroke

        if (!existingDashArray) {
          (path as SVGPathElement).style.strokeDasharray = `${length}`;
        }

        (path as SVGPathElement).style.strokeDashoffset = `${length}`;

        if (isInView) {
          (path as SVGPathElement).style.animation =
            `dashAndFill ${duration}s ${delay}s ease-in-out forwards`;
        } else {
          (path as SVGPathElement).style.animation = "none";
          (path as SVGPathElement).style.strokeDashoffset = `${length}`;
          (path as SVGPathElement).style.fill = "none";
        }
      }
    });
  }, [
    duration,
    delay,
    strokeColor,
    strokeWidth,
    pathSelector,
    isInView,
    fillColor,
  ]);

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      <SvgComponent ref={svgRef} />
      <style>{`
        @keyframes dashAndFill {
          0% {
            stroke-dashoffset: var(--path-length);
            fill: none;
          }
          80% {
            stroke-dashoffset: 0;
            fill: none;
          }
          100% {
            stroke-dashoffset: 0;
            fill: var(--fill-color);
          }
        }
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default CanimatedPathSvg;
