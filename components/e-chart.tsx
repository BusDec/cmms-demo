"use client";

import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
  CanvasRenderer,
]);

type Props = {
  option: Record<string, unknown>;
  height?: number;
  ariaLabel: string;
  className?: string;
  fill?: boolean;
};

export function EChart({ option, height, ariaLabel, className, fill }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chart = echarts.init(node, undefined, { renderer: "canvas" });
    chart.setOption({ ...option, animation: !reduce });
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(node);
    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [option]);

  return (
    <div
      ref={ref}
      role="img"
      tabIndex={0}
      aria-label={ariaLabel}
      className={cn("echart", fill && "echart-fill", className)}
      style={height ? { height } : undefined}
    />
  );
}
