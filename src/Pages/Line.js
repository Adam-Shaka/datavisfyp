import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'


export default function LineChart() {

    //download graph fucntion
    const downloadGraph = () => {
        var svg = document.querySelector('svg'); 
        var svgData = new XMLSerializer().serializeToString(svg); 
        var svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"}); 
        var svgUrl = URL.createObjectURL(svgBlob); 
        var downloadLink = document.createElement("a"); 
        downloadLink.href = svgUrl; 
        downloadLink.download = "LineChart.svg"; 
        document.body.appendChild(downloadLink); 
        downloadLink.click(); 
        document.body.removeChild(downloadLink); 
    }

    //graph creation function
    const graphGen = async () => {
        // gets data from csv hosted on git hub currently (will be changed to user input hopefully)
        let data = await d3.csv('https://raw.githubusercontent.com/Adam-Shaka/Testing-.csv/main/rtt%20second%20time%20period.csv')
        var parseTime = d3.timeParse("%Y-%m-%d");
      
        data.forEach((d) => {
          d.date = parseTime(d.date);
          d.rtt = +d.rtt;
        });
        console.log(data)
    
        // graph dimensions and margins
        var margin = { top: 20, right: 20, bottom: 50, left: 70 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
        
        // add svg to line section to display graph
        var svg = d3.select(".lineChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
        // add x axis and y axis
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);
    
        x.domain(d3.extent(data, (d) => { return d.date; }));
        var maxYValue = d3.max(data, function(d) { return d.rtt; }); // get the maximum rtt value in the data
        var desiredMaxYValue = maxYValue * 1.2; // increase the maximum y value by 20%
        
        y.domain([0, desiredMaxYValue]); // set the domain of the y scale
      
        svg.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(x));
    
        svg.append("g")
          .call(d3.axisLeft(y));
        // add horizontal lines at each y-axis tick
    var yAxisTicks = y.ticks();
    yAxisTicks.shift();
    yAxisTicks.forEach((tick) => {
        svg.append("line")
            .attr("x1", 0)
            .attr("y1", y(tick))
            .attr("x2", width)
            .attr("y2", y(tick))
            .attr("stroke", "black")
            .attr("stroke-dasharray", "2,2");
    });  
        // add the line
        var rttLine = d3.line()
        .x((d) => { return x(d.date); })
        .y((d) => { return y(d.rtt); });
      
        svg.append("path")
          .data([data])
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", rttLine);
        
          var rttLine = d3.line()
    .x((d) => { return x(d.date); })
    .y((d) => { return y(d.rtt); });
  
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", rttLine);
  }
      
    
      useEffect(() => {
        graphGen();
      }, []);

        return (
            <div>
                <section className="section">
                    <div className="info-upload-download">
                        <div>
                            <h2>Line Chart Generation</h2>
                            <p>Select the .CSV file you wish to use:</p>
                            <input id="csv" type="file" accept=".csv" />

                        </div>
                    </div>
                </section>
                <section className="section">
                        <div className="lineChart">
                        <button onClick={downloadGraph}>Download Graph</button>
                        </div>
                </section>
            </div>
        );
        
 }

