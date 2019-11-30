import React, { useState, useEffect } from "react";
import { VictoryPie, VictoryLabel, VictoryTooltip } from "victory";

const CustomPieLabel = props => {
  return (
    <g>
      <VictoryLabel {...props} />
      <VictoryTooltip
        {...props}
        x={200}
        y={250}
        orientation="top"
        pointerLength={0}
        cornerRadius={50}
        flyoutWidth={100}
        flyoutHeight={100}
        flyoutStyle={{ fill: "#252525", zIndex: 5, opacity: 1 }}
      />
    </g>
  );
};

CustomPieLabel.defaultEvents = VictoryTooltip.defaultEvents;

const NutriPieChart = ({ data, width }) => {
  const [pieMouseOverState, setPieMouseOver] = useState(false);
  const [useDummyDataState, setUseDummyData] = useState(true);

  useEffect(() => {
    const dummyDataTimer = setTimeout(() => {
      setUseDummyData(false);
    }, 100);
    return () => {
      clearTimeout(dummyDataTimer);
    };
  }, [useDummyDataState]);

  const dummyData = [
    { x: "", y: 0 },
    { x: "", y: 0 },
    { x: "", y: 0 }
  ];

  // console.log(data);
  const chartData = data && [
    { x: "carbs", y: data.percentCarbs },
    { x: "fat", y: data.percentFat },
    { x: "protein", y: data.percentProtein }
  ];

  return data ? (
    <svg viewBox={`0 0 ${width || 400} ${width || 400}`}>
      <VictoryPie
        standalone={false}
        colorScale={"qualitative"}
        style={{ labels: { fill: "#fff" } }}
        innerRadius={width / 4 || 100}
        labelRadius={(width / 40) * 12 || 120}
        labels={({ datum }) => `${datum.x}
      ${datum.y}%`}
        labelComponent={<CustomPieLabel />}
        data={useDummyDataState ? dummyData : chartData}
        events={[
          {
            target: "data",
            eventHandlers: {
              onMouseOver: () => {
                setPieMouseOver(true);
                return {
                  target: "labels",
                  mutation: () => ({
                    active: true,
                    style: { opacity: 1, fill: "#fff", fontSize: 20 }
                  })
                };
              },
              onMouseOut: () => {
                setPieMouseOver(false);
                return {
                  target: "labels",
                  mutation: () => ({ active: false })
                };
              }
            }
          }
        ]}
        animate={{
          duration: 1000,
          easing: "circleInOut"
        }}
      />
      {!pieMouseOverState ? (
        <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 20 }}
          x={width / 2 || 200}
          y={width / 2 || 200}
          text={`Total
        ${data.ENERC_KCAL.toFixed()}
      Calories`}
        />
      ) : null}
    </svg>
  ) : null;
};

export default NutriPieChart;
