import { useRef } from "react";
import { useInView } from "motion/react";
import { motion } from "motion/react";
import Typewriter from "typewriter-effect";

// 创建一个动画包装组件
export default function AnimateOnView({
  children,
  animation = "fade-up",
  // 距离
  distance = 100,
  delay = 0,
  className,
  typewriter = false, // 新增打字机效果选项
  typewriterStrings = [],
  duration = 0.5,
}: {
  children: React.ReactNode;
  animation?:
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "fade"
    | "scale";
  distance?: number;
  delay?: number;
  className?: string;
  typewriter?: boolean;
  typewriterStrings?: string[];
  duration?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {});

  // 如果启用打字机效果且children是文本
  if (typewriter) {
    return (
      <motion.div
        className={className}
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration, delay }}
      >
        <Typewriter
          options={{
            strings: typewriterStrings,
            autoStart: true,
            loop: false,
          }}
        />
      </motion.div>
    );
  }

  const getAnimationProps = () => {
    switch (animation) {
      case "fade-up":
        return {
          initial: { y: distance, opacity: 0 },
          animate: {
            y: isInView ? 0 : distance,
            opacity: isInView ? 1 : 0,
          },
        };
      case "fade-down":
        return {
          initial: { y: -distance, opacity: 0 },
          animate: {
            y: isInView ? 0 : -distance,
            opacity: isInView ? 1 : 0,
          },
        };
      case "fade-left":
        return {
          initial: { x: -distance, opacity: 0 },
          animate: {
            x: isInView ? 0 : -distance,
            opacity: isInView ? 1 : 0,
          },
        };
      case "fade-right":
        return {
          initial: { x: distance, opacity: 0 },
          animate: {
            x: isInView ? 0 : distance,
            opacity: isInView ? 1 : 0,
          },
        };
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: {
            opacity: isInView ? 1 : 0,
          },
        };
      case "scale":
        return {
          initial: { scale: 0 },
          animate: {
            scale: isInView ? 1 : 0,
          },
        };
    }
  };

  return (
    <motion.div
      className={className}
      ref={ref}
      {...getAnimationProps()}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}
