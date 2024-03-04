import * as d3 from "d3";
import { eachDayOfInterval, format, parse, startOfDay } from "date-fns";
import useMeasure from "react-use-measure";
import { useState } from "react";

//MinRTT
//MeanThroughputMbps
//LossRate

export default function Chart({}) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState();
  let [ref, bounds] = useMeasure();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file.type !== "text/csv") {
      setError("Please upload a CSV file.");
      return;
    }
    d3.csv(URL.createObjectURL(file), function (d) {
      return {
        date: parse(d.date, "dd/MM/yyyy", new Date()),
        MinRTT: +d.MinRTT,
        MeanThroughputMbps: +d.MeanThroughputMbps,
        LossRate: +d.LossRate,
      };
    }).then((data) => {
      setData(data);
      setError(null);
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {error && <p>{error}</p>}
      <section className="dropDown">
        <select onChange={(e) => setSelectedColumn(e.target.value)}>
          <option value="MinRTT">RTT</option>
          <option value="LossRate">Connection Loss Rate</option>
          <option value="MeanThroughputMbps">Mean Throughput</option>
        </select>
        <div className="chartGen" ref={ref}>
          {bounds.width > 0 && data.length > 0 && (
            <ChartGen
              data={data}
              width={bounds.width}
              height={500}
              selectedColumn={selectedColumn}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function ChartGen({ data, width, height, selectedColumn }) {
  let margin = { top: 10, right: 100, bottom: 30, left: 100 };
  let startDay = startOfDay(data[0].date);
  let endDay = startOfDay(data[data.length - 1].date);
  let days = eachDayOfInterval({ start: startDay, end: endDay }).filter(
    (_, i) => i % 7 === 0
  );
  const [tooltipData, setTooltipData] = useState(null);

  // x and y axis
  let xScale = d3
    .scaleTime()
    .domain([startDay, endDay])
    .range([margin.left, width - margin.right]);
  let yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((d) => d[selectedColumn])) * 1.2])
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
    .x((d) => xScale(d.date))
    .y((d) => yScale(d[selectedColumn]));

  let d = line(data);

  return (
    <>
      <svg className="chartDraw" viewBox={`0 0 ${width} ${height + 20}`}>
        {/* x and y axis*/}
        <g
          className="xAxis"
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
          className="yAxis"
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
            strokeDasharray="2,2"
          />
        ))}

        {/* Line */}
        <path
          className="line"
          d={d}
          fill="none"
          stroke="steelblue"
          strokeWidth="1.5"
        />

        {/* Data point circles */}
        {data.map((d, i) => (
          <circle
            className="circle"
            key={i}
            cx={xScale(d.date)}
            cy={yScale(d[selectedColumn])}
            r={3}
            fill="steelblue"
            onMouseOver={() => setTooltipData(d)}
            onMouseOut={() => setTooltipData(null)}
          />
        ))}
      </svg>

      {/* Data point display*/}
      {tooltipData && (
        <div
          style={{
            position: "absolute",
            left: `${xScale(tooltipData.date)}px`,
            top: `${yScale(tooltipData[selectedColumn])}px`,
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid black",
          }}
        >
          <div>Date: {format(tooltipData.date, "MMM dd")}</div>
          <div>{`${selectedColumn}: ${tooltipData[selectedColumn]}`}</div>
        </div>
      )}
    </>
  );
}
