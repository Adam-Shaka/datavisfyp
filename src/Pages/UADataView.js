import { useState } from "react";
import Chart1 from "./FirstDataSet";
import Chart2 from "./SecondDataSet";
import Chart3 from "./CompareDataSet";

export default function UkraineDataViewer() {
  const [chart, setChart] = useState("Chart1");

  return (
    <div>
      <button onClick={() => setChart("Chart1")}>
        Data from the 08/08/22 - 02/12/23
      </button>
      <button onClick={() => setChart("Chart2")}>
        Data from the 14/05/23 - 21/12/23
      </button>
      <button onClick={() => setChart("Chart3")}>Comparison of data</button>

      {chart === "Chart1" && <Chart1 />}
      {chart === "Chart2" && <Chart2 />}
      {chart === "Chart3" && <Chart3 />}
    </div>
  );
}
