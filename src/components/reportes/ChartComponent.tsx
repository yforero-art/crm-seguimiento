"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ChartDatum {
  label: string;
  value: number;
}

interface ChartComponentProps {
  data: ChartDatum[];
  titulo: string;
  tipo?: "linea" | "barras";
  color?: string;
  formatValue?: (value: number) => string;
}

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "var(--radius)",
  fontSize: 13,
};

export function ChartComponent({ data, titulo, tipo = "barras", color, formatValue }: ChartComponentProps) {
  // Línea morada para pipeline, barras azules para conversiones — por defecto;
  // `color` permite sobreescribir puntualmente.
  const colorFinal = color ?? (tipo === "linea" ? "hsl(var(--purple))" : "hsl(var(--primary))");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {tipo === "linea" ? (
              <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatValue}
                  width={formatValue ? 56 : 32}
                />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }} formatter={(v: number) => [formatValue ? formatValue(v) : v, ""]} />
                <Line type="monotone" dataKey="value" stroke={colorFinal} strokeWidth={2.5} dot={{ r: 4, fill: colorFinal }} activeDot={{ r: 6 }} />
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatValue}
                  width={formatValue ? 56 : 32}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent))" }}
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                  formatter={(v: number) => [formatValue ? formatValue(v) : v, ""]}
                />
                <Bar dataKey="value" fill={colorFinal} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
