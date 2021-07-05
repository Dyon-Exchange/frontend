import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function Chart({ data }: any) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>${payload[0].payload.price}</p>
          <p>
            {new Date(payload[0].payload.time).toLocaleDateString("en", {
              month: "numeric",
              day: "numeric",
            })}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <LineChart
      width={1000}
      height={500}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <XAxis
        dataKey="time"
        tickFormatter={(date: string) =>
          new Date(date).toLocaleDateString("en", {
            month: "numeric",
            day: "numeric",
          })
        }
      />
      <YAxis dataKey="price" />
      <Tooltip content={<CustomTooltip />} />
      <Line
        type="monotone"
        dataKey="price"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
}
