Highcharts.setOptions(personalTheme);
Highcharts.chart("timeline-container", {
  chart: {
    type: "timeline",
  },
  xAxis: {
    visible: false,
  },
  yAxis: {
    visible: false,
  },
  title: {
    text: "Timeline of Raytheon Contract",
  },
  subtitle: {
    text: 'Source: <a href="https://www.usaspending.gov/award/CONT_AWD_HR001117C0025_9700_-NONE-_-NONE-/" target="_blank">USA Spending</a>',
  },
  legend: {
    enabled: false,
  },
  series: [
    {
      data: [
        {
          name: "15 subcontracts awarded to Alliant Techsystems Operations LLC",
          label: "August 30, 2016",
          description:
            "August 30, 2016 <br /><b>Total Cost of all Subcontracts: </b>$428,805,895",
        },
        {
          name: "Contract awarded to Raytheon Company",
          label: "October 31, 2016",
          description:
            "October 31, 2016 <br /><b>Description of Contract: </b>HYPERSONIC AIR-BREATHING WEAPON CONCEPT (HAWC) PHASE 2",
        },
        {
          name: "Contracts awarded to Advanced Thermal Batteries",
          label: "August & September 2017",
          description:
            "August & September 2017 <br /><b>Description of Contract: </b>Iron Batteries",
        },
        {
          name: "Contract awarded to Dytran Instruments Inc",
          label: "March 26, 2019",
          description:
            "August & September 2017 <br /><b>Description of Contract: </b>Accelerometers, Amplifiers, Cable/CableAssyHV, Non-complex Machined.",
        },
        {
          name: "Contract Ended",
          label: "March 31, 2022",
          description:
            "March 31, 2022 <br /><b>Description of Contract: </b>HYPERSONIC AIR-BREATHING WEAPON CONCEPT (HAWC) PHASE 2",
        },
      ],
    },
  ],
});
