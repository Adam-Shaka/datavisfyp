import * as d3 from "d3";
import { eachDayOfInterval, format, parse, startOfDay } from "date-fns";
import useMeasure from "react-use-measure";
import { useEffect, useState } from "react";

export default function Chart({}) {
  let [ref, bounds] = useMeasure();
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("Min_RTT"); // Add state for selected column

  //get csv data and set it up for use
  useEffect(() => {
    d3.csv(
      "https://raw.githubusercontent.com/Adam-Shaka/Testing-.csv/main/all%20results%20second%20time%20period2%20comp.csv",
      function (d) {
        return {
          Date: parse(d.Date, "MM/dd", new Date()),
          Min_RTT: +d.Min_RTT,
          Connection_Loss_Rate: +d.Connection_Loss_Rate,
          MeanThroughput: +d.MeanThroughput,
          Test_Count: +d.Test_Count,
        };
      }
    ).then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    d3.csv(
      "https://raw.githubusercontent.com/Adam-Shaka/Testing-.csv/main/all%20results%20first%20time%20period2%20comp.csv",
      function (d2) {
        return {
          Date: parse(d2.Date, "MM/dd", new Date()),
          Min_RTT: +d2.Min_RTT,
          Connection_Loss_Rate: +d2.Connection_Loss_Rate,
          MeanThroughput: +d2.MeanThroughput,
          Test_Count: +d2.Test_Count,
        };
      }
    ).then((data2) => {
      setData2(data2);
    });
  }, []);

  return (
    <div>
      <h1>A comparison of both data sets</h1>
      <text>
        View a comparison of the data that looks at the impact of the war in
        Ukraine on Ukraines internet infastructure
      </text>

      <section className="dropDown">
        <select onChange={(e) => setSelectedColumn(e.target.value)}>
          <option value="Min_RTT">RTT</option>
          <option value="Connection_Loss_Rate">Connection Loss Rate</option>
          <option value="MeanThroughput">Mean Throughput</option>
          <option value="Test_Count">Test Count</option>
        </select>
        <div className="chartGen" ref={ref}>
          {bounds.width > 0 && data.length > 0 && data2.length > 0 && (
            <ChartGen
              data={data}
              data2={data2}
              width={bounds.width}
              height={500}
              selectedColumn={selectedColumn}
            />
          )}
        </div>
      </section>
      <section className="donwload">
        <button onClick={downloadGraph}>Download Graph</button>
      </section>
    </div>
  );
}

//Download function
const downloadGraph = () => {
  var svg = document.querySelector("svg");
  var svgData = new XMLSerializer().serializeToString(svg);
  var svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "LineChart.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

//Setting up the chart
function ChartGen({ data, data2, width, height, selectedColumn }) {
  let margin = { top: 10, right: 100, bottom: 30, left: 100 };
  let startDay = startOfDay(data[0].Date);
  let endDay = startOfDay(data[data.length - 1].Date);
  let days = eachDayOfInterval({ start: startDay, end: endDay }).filter(
    (_, i) => i % 7 === 0
  );
  let maxVal1 = d3.max(data.map((d) => d[selectedColumn]));
  let maxVal2 = d3.max(data2.map((d2) => d2[selectedColumn]));
  let maxVal = Math.max(maxVal1, maxVal2);
  const [tooltipData, setTooltipData] = useState(null);

  // x and y axis
  let xScale = d3
    .scaleTime()
    .domain([startDay, endDay])
    .range([margin.left, width - margin.right]);
  let yScale = d3
    .scaleLinear()
    .domain([0, maxVal * 1.2])
    .range([height - margin.bottom, margin.top]);

  const xAxis = d3
    .axisBottom(xScale)
    .tickValues(days)
    .tickFormat(d3.timeFormat("%d-%m"));
  const yAxis = d3.axisLeft(yScale);
  const yAxisTicks = yScale.ticks();

  //line
  let line = d3
    .line()
    .x((d) => xScale(d.Date))
    .y((d) => yScale(d[selectedColumn]));

  let line2 = d3
    .line()
    .x((d) => xScale(d.Date))
    .y((d) => yScale(d[selectedColumn]));

  let d = line(data);
  let d2 = line2(data2);

  return (
    <>
      <svg className="chartDraw" viewBox={`0 0 ${width} ${height + 20}`}>
        {/* x and y axis*/}
        <g
          transform={`translate(0, ${height - margin.bottom})`}
          ref={(node) => d3.select(node).call(xAxis)}
        />
        <text
          transform={`translate(${width / 2}, ${height})`}
          style={{ textAnchor: "middle" }}
        >
          Date
        </text>
        <g
          transform={`translate(${margin.left}, 0)`}
          ref={(node) => d3.select(node).call(yAxis)}
        />
        <text
          transform="rotate(-90)"
          y={0}
          x={0 - height / 2}
          dy="1em"
          style={{ textAnchor: "middle" }}
        >
          {selectedColumn}
        </text>

        {/* Dashed lines */}
        {yAxisTicks.slice(1).map((tick, index) => (
          <line
            key={index}
            x1={margin.left}
            y1={yScale(tick)}
            x2={width - margin.right}
            y2={yScale(tick)}
            stroke="black"
            strokeDasharray="5"
          />
        ))}

        {/* Line */}
        <path d={d} fill="none" stroke="steelblue" strokeWidth="1.5" />
        <path d={d2} fill="none" stroke="red" strokeWidth="1.5" />

        {/* Data point circles */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xScale(d.Date)}
            cy={yScale(d[selectedColumn])}
            r={3}
            fill="steelblue"
            onMouseOver={() => setTooltipData(d)}
            onMouseOut={() => setTooltipData(null)}
          />
        ))}
        {data2.map((d2, i2) => (
          <circle
            key={i2}
            cx={xScale(d2.Date)}
            cy={yScale(d2[selectedColumn])}
            r={3}
            fill="red"
            onMouseOver={() => setTooltipData(d2)}
            onMouseOut={() => setTooltipData(null)}
          />
        ))}
      </svg>

      {/* Data point display*/}
      {tooltipData && (
        <div
          style={{
            position: "absolute",
            left: `${xScale(tooltipData.Date)}px`,
            top: `${yScale(tooltipData[selectedColumn])}px`,
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid black",
          }}
        >
          <div>Date: {format(tooltipData.Date, "MMM dd")}</div>
          <div>{`${selectedColumn}: ${tooltipData[selectedColumn]}`}</div>
        </div>
      )}
    </>
  );
}
