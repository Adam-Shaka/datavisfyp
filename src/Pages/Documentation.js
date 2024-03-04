import React from "react";

export default function Documentation() {
  return (
    <div>
      <h1>Documentation</h1>
      <p>
        When using the chart generation feature please ensure that you follow
        the following to ensure the chart is generated correctly
      </p>
      <p>
        <ul>
          <li>
            Data should be downloaded from M-Labs big query database using the
            unified downloads section.{" "}
            <a href="https://console.cloud.google.com/bigquery?project=measurement-lab&p=measurement-lab&d=ndt&t=unified_downloads&page=table">
              Link to M-Lab Big Query
            </a>
            (this will require a google acount)
          </li>
          <li>
            The data is collected using an SQL command. This should look
            something like this:
            <ul>
              <li>
                SELECT date,a.LossRate, a.MeanThroughputMbps, a.MinRTT,
                client.Geo.CountryName FROM
                `measurement-lab.ndt.unified_downloads` where date between
                '2023-05-14' and '2023-12-21' and client.Geo.CountryName =
                "Ukraine"
              </li>
            </ul>
          </li>
          <li>
            When this data is collected, ensure to download in the .CSV format.
            Other data formats will not work and may create errors.
          </li>
          <li>
            It is expected that you use the headings provided by M-Lab. Do not
            change these or the chart generation may fail.
          </li>
          <li>
            The chart generation feature is made to work with the following
            headings:
            <ul>
              <li>date - keep the downloaded format dd/mm/yyyy</li>
              <li>MinRTT</li>
              <li>MeanThroughputMbps</li>
              <li>LossRate</li>
            </ul>
          </li>
          <li>Navigate through graphs using the drop down.</li>
          <li>Graphs can be downloaded using the download button.</li>
        </ul>
      </p>
    </div>
  );
}
