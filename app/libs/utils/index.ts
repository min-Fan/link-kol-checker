export const formatPrecision = (
  input: string | number,
  precision: number = 8,
): string => {
  // 确保输入是一个数字
  const value = typeof input === "string" ? parseFloat(input) : input;

  // 如果输入无法解析为有效数字，直接返回 '0'
  if (isNaN(value)) return "0";

  // 判断数值小于指定精度的情况
  const factor = Math.pow(10, precision);
  if (Math.abs(value) < 1 / factor) return "0";

  // 保留精度并去掉尾随零
  // 使用精度控制，先去掉科学计数法
  let formattedValue = value.toFixed(precision).replace(/(\.0+|0+)$/, "");

  // 去掉不必要的零
  if (formattedValue.includes(".")) {
    formattedValue = formattedValue.replace(/0+$/, "").replace(/\.$/, "");
  }
  return formattedValue;
};

export const formatNumberKMB = (
  value: string | number,
  precision: number = 8,
): string => {
  if (Number(value) >= 1e9) {
    // 十亿及以上：使用 B
    return (Number(value) / 1e9).toFixed(2) + "B";
  } else if (Number(value) >= 1e6) {
    // 百万及以上：使用 M
    return (Number(value) / 1e6).toFixed(2) + "M";
  } else if (Number(value) >= 1e3) {
    // 千及以上：使用 K
    return (Number(value) / 1e3).toFixed(2) + "K";
  } else {
    // 千以下：保留原数值
    return formatPrecision(Number(value).toString(), precision);
  }
};

/**
 * Formats a date into "Joined Month Year" format.
 * Example: "Joined January 2025"
 * @param date - The date object, date string, or timestamp to format.
 * @returns The formatted date string or an empty string if the date is invalid.
 */
export function formatJoinedDate(date: Date | string | number): string {
  try {
    const dateObj = new Date(date);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date provided to formatJoinedDate:", date);
      return ""; // Or return a default string like "Joined Unknown"
    }

    const month = dateObj.toLocaleString("en-US", { month: "long" }); // Get full month name (e.g., "January")
    const year = dateObj.getFullYear(); // Get the full year (e.g., 2025)

    return `in ${month} ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return ""; // Return empty string on error
  }
}

export const formatCurrency = (
  value: number,
  precision: number = 0,
): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  });

  return formatter.format(value);
};

export function formatDateYMDHMS(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeAgo(input: number | string | Date): string {
  const date = new Date(input).getTime();
  const now = Date.now();
  const diff = Math.floor((now - date) / 1000); // 单位：秒

  if (diff < 60) return `${diff} second${diff !== 1 ? "s" : ""} ago`;
  if (diff < 3600)
    return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) !== 1 ? "s" : ""} ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) !== 1 ? "s" : ""} ago`;
  if (diff < 2592000)
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) !== 1 ? "s" : ""} ago`;
  if (diff < 31536000)
    return `${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) !== 1 ? "s" : ""} ago`;
  return `${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) !== 1 ? "s" : ""} ago`;
}

export function formatMoney(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
}

export const copy = async (text: string | undefined): Promise<boolean> => {
  try {
    if (text == undefined) return false;

    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 将图片URL转换为base64格式
 * @param url - 图片URL或本地图片路径
 * @returns Promise<string> - base64字符串
 */
export const imageToBase64 = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // 处理跨域问题

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("无法获取canvas上下文"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // 绘制图片到canvas
      ctx.drawImage(img, 0, 0);

      try {
        // 转换为base64
        const base64 = canvas.toDataURL("image/png");
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("图片加载失败"));
    };

    img.src = url;
  });
};

/**
 * 将本地图片文件转换为base64格式
 * @param file - 图片文件对象
 * @returns Promise<string> - base64字符串
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("文件读取失败"));
      }
    };

    reader.onerror = () => {
      reject(new Error("文件读取错误"));
    };

    reader.readAsDataURL(file);
  });
};
