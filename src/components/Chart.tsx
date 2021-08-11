import React from "react";
import { Text } from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts";

export default function Chart({
  data,
  legend = true,
}: {
  data: any; //PriceEvent[];
  legend: boolean;
}) {
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
    <>
      <ResponsiveContainer width="95%" height={legend ? 400 : 200}>
        <LineChart
          data={data.slice(data.length >= 24 ? data.length - 25 : 0)}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {legend && (
            <XAxis
              dataKey="time"
              tickFormatter={(date: string, i: number) => {
                if (i % 2 === 0) {
                  return new Date(date).toLocaleDateString("en-AU", {
                    month: "numeric",
                    day: "numeric",
                  });
                } else {
                  return "";
                }
              }}
            ></XAxis>
          )}
          {legend && (
            <YAxis dataKey="price" tickFormatter={(price: any) => `$${price}`}>
              <Label
                angle={270}
                position="left"
                style={{ textAnchor: "middle" }}
              >
                Price
              </Label>
            </YAxis>
          )}

          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      {legend && <Text>Time</Text>}
    </>
  );
}
