import React, { useState, useEffect } from "react";
import {
  VictoryChart,
  VictoryBar,
  VictoryPie,
  VictoryAxis,
  VictoryStack,
  VictoryGroup,
  VictoryLabel,
  VictoryTooltip,
  VictoryTheme,
  VictoryPortal
} from "victory";
import moment from "moment";

export const TrackerBarChart = ({ data, chartType, width }) => {
  const chartKeys = ["carbs", "fat", "protein"];
  const chartData = data
    .sort((a, b) => a.date > b.date)
    .map(d => ({
      day: d.displayDate,
      date: d.date,
      calories: Number(d.ENERC_KCAL.toFixed(2)),
      carbs: Math.floor((d.ENERC_KCAL * d.percentCarbs) / 100),
      percentCarbs: d.percentCarbs,
      fat: Math.floor((d.ENERC_KCAL * d.percentFat) / 100),
      percentFat: d.percentFat,
      protein: Math.floor((d.ENERC_KCAL * d.percentProtein) / 100),
      percentProtein: d.percentProtein
    }));

  const chartStackData = chartKeys.map(key => {
    return chartData.map(d => ({
      day: d.day,
      calories: isNaN(Number(d[key])) ? 0 : Number(d[key]),
      label: key && Number(d[key]) > 0 ? key : null,
      date: d.date,
      percent: d[`percent${key[0].toUpperCase()}${key.slice(1)}`]
    }));
  });

  // console.log({ data, chartData, chartStackData });
  return (
    <div>
      <svg viewBox="0 0 500 350">
        {data.length > 0 ? (
          <VictoryChart
            standalone={false}
            domainPadding={{ x: [100, 0] }}
            theme={VictoryTheme.material}
            width={width}
          >
            <VictoryGroup
              offset={10}
              domainPadding={{ x: [0, 0] }}
              style={{ data: { width: 15 } }}
            >
              <VictoryStack
                // colorScale={"blue"}
                domainPadding={{ x: [50, 0] }}
              >
                <VictoryBar
                  data={chartData.map(d => ({
                    day: d.day,
                    calories: isNaN(d.calories) ? "0" : d.calories
                  }))}
                  style={{ data: { fill: "#458ca8" } }}
                  x="day"
                  y="calories"
                  labels={({ datum }) => `calories: ${datum.calories}`}
                  labelComponent={
                    <VictoryTooltip
                      text={({ datum }) => `calories: ${datum.calories}`}
                      cornerRadius={({ datum }) => 5}
                      pointerLength={({ datum }) => 10}
                      flyoutStyle={{
                        stroke: ({ datum }) =>
                          moment(datum.day).isSame(new Date())
                            ? "tomato"
                            : "black"
                      }}
                      constrainToVisibleArea
                      renderInPortal
                    />
                  }
                  // animate={{ duration: 2000, easing: "bounce" }}
                />
              </VictoryStack>
              <VictoryStack
                colorScale={"qualitative"}
                domainPadding={{ x: [50, 0] }}
              >
                {chartStackData.map((chartBar, index) => (
                  <VictoryBar
                    key={index}
                    data={chartBar}
                    x="day"
                    y="calories"
                    labels={({ datum }) =>
                      `${datum && datum.label}: ${datum && datum.percent}%`
                    }
                    labelComponent={
                      <VictoryTooltip
                        text={({ datum }) =>
                          `${datum && datum.label}: ${datum && datum.percent}%`
                        }
                        cornerRadius={() => {
                          return 5;
                        }}
                        pointerLength={() => 10}
                        flyoutStyle={{
                          stroke: ({ datum }) => {
                            return moment(datum && datum.date).dayOfYear() ===
                              moment(new Date()).dayOfYear()
                              ? "tomato"
                              : "black";
                          },
                          fill: "white"
                        }}
                        constrainToVisibleArea
                        renderInPortal
                      />
                    }
                    events={[
                      {
                        target: "data",
                        eventHandlers: {
                          onClick: () => console.log("stackbar clicked"),
                          onMouseOver: () => ({
                            target: "labels",
                            mutation: () => ({ active: true })
                          })
                        }
                      }
                    ]}
                    // animate={{ duration: 1000, easing: "bounceInOut" }}
                  />
                ))}
              </VictoryStack>
            </VictoryGroup>

            <VictoryAxis
              // scale="day"
              tickValues={chartData.map(d => moment(d.day).dayOfYear())}
              tickFormat={chartData.map(
                d => `${moment(d).format("Do")}
          ${moment(d).format("MMM")}`
              )}
            />
            <VictoryAxis
              dependentAxis
              orientation="left"
              tickFormat={y => `${y}
          KCal`}
              offsetX={40}
            />
          </VictoryChart>
        ) : null}

        <VictoryPortal>
          <g>
            <VictoryLabel
              x={410}
              y={10}
              textAnchor="middle"
              style={{ fontSize: 12 }}
              text={`% Protein`}
            />
            <rect x="440" y="0" width="20" height="20" fill="#efc94c" />

            <VictoryLabel
              x={330}
              y={10}
              textAnchor="middle"
              style={{ fontSize: 12 }}
              text={`% Fat`}
            />
            <rect x="350" y="0" width="20" height="20" fill="#45b29d" />

            <VictoryLabel
              x={255}
              y={10}
              textAnchor="middle"
              style={{ fontSize: 12 }}
              text={`% Carbs`}
            />
            <rect x="280" y="0" width="20" height="20" fill="#334d5c" />

            <VictoryLabel
              x={155}
              y={10}
              textAnchor="middle"
              style={{ fontSize: 12 }}
              text={`Total Calories`}
            />
            <rect x="200" y="0" width="20" height="20" fill="#458ca8" />
          </g>
        </VictoryPortal>
      </svg>
    </div>
  );
};

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
        flyoutStyle={{
          fill: "#252525",
          opacity: 1,
          transition: "all 0.5s ease-out"
        }}
      />
    </g>
  );
};

CustomPieLabel.defaultEvents = VictoryTooltip.defaultEvents;

export const TrackerPieChart = ({ data, chartType, width }) => {
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
    <svg viewBox="0 0 400 400">
      <VictoryPie
        standalone={false}
        colorScale={"qualitative"}
        style={{ labels: { fill: "#fff" } }}
        innerRadius={100}
        labelRadius={120}
        labels={({ datum }) =>
          datum.y > 0
            ? `${datum.x} 
      ${datum.y}%`
            : null
        }
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
                    style: {
                      opacity: 1,
                      fill: "#fff",
                      fontSize: 20,
                      transition: "all 0.25s ease-out"
                    }
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
          x={200}
          y={200}
          text={`Total 
        ${data.ENERC_KCAL.toFixed()} 
      Calories`}
        />
      ) : null}
    </svg>
  ) : null;
};
