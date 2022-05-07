(async () => {
  window.useLocalData = true;
  const url = window.useLocalData
    ? "http://localhost:8080"
    : "https://s3.amazonaws.com/datastore.portfolio.sampastoriza.com";
  // Fetch the data from AWS S3 and parse it
  const parsedData = await fetch(
    `${url}/visualization_data/subcontract_network.csv`
  )
    .then((result) => result.text())
    .then((text) => Papa.parse(text, { header: true, skipEmptyLines: true }))
    .then((data) => data.data);

  const costData = await fetch(`${url}/visualization_data/all_costs.csv`)
    .then((result) => result.text())
    .then((text) => Papa.parse(text, { header: true, skipEmptyLines: true }))
    .then((data) => data.data);

  // Parse data
  const seriesData = parsedData.map((datum) => ({
    from: datum.from,
    to: datum.to,
  }));
  const colorMap = {
    subawardee: "red",
    subcontract: "lightblue",
    contractee: "green",
  };
  const symbolMap = {
    subawardee: "square",
    subcontract: "triangle",
    contractee: "circle",
  };
  const typeMap = {
    subawardee: "Subcontractor",
    subcontract: "Subcontract",
    contractee: "Contractor",
  };
  const nodeData = costData.map((datum) => {
    return {
      id: datum.id,
      name: datum.type === "subcontract" ? " " : datum.name,
      color: colorMap[datum.type],
      custom: {
        type: typeMap[datum.type],
        name: datum.type === "subcontract" ? "" : datum.name,
        description: datum.type === "subawardee" ? "" : datum.description,
        cost: parseInt(datum.cost),
      },
      marker: {
        radius: parseInt(datum.scaled_radius),
        symbol: symbolMap[datum.type],
      },
    };
  });

  Highcharts.setOptions(personalTheme);
  Highcharts.chart("top-networks-container", {
    chart: {
      type: "networkgraph",
      height: "900px",
    },
    title: {
      text: "Top 8 Funded Subcontractors",
    },
    subtitle: {
      text: 'Source: <a href="https://www.usaspending.gov/award/CONT_AWD_HR001117C0025_9700_-NONE-_-NONE-/" target="_blank">USA Spending</a>',
    },
    plotOptions: {
      networkgraph: {
        keys: ["from", "to"],
        layoutAlgorithm: {
          enableSimulation: true,
        },
      },
    },
    series: [
      {
        dataLabels: {
          enabled: true,
          linkFormat: "",
          allowOverlap: true,
          style: {
            textOutline: false,
          },
        },
        data: seriesData,
        nodes: nodeData,
      },
    ],
    tooltip: {
      enabled: true,
      useHTML: true,
      shared: true,
      positioner: function () {
        return {
          x: this.chart.plotLeft,
          y: this.chart.plotTop,
        };
      },
      formatter: function () {
        return (
          `<div style="text-align: center"><b>${this.point.custom.type}</b></div><hr />` +
          (!!this.point.custom.name
            ? `<div style="width: 200px; white-space: pre-wrap;"><b>Name:</b> ${this.point.custom.name}</div><hr />`
            : "") +
          (!!this.point.custom.description
            ? `<div style="width: 200px; white-space: pre-wrap;"><b>Description:</b> ${this.point.custom.description}</div><hr />`
            : "") +
          (this.point.custom.cost > 0
            ? `<b>Cost:</b> \$${this.point.custom.cost.toLocaleString("en-US")}`
            : "")
        );
      },
    },
  });
})();
