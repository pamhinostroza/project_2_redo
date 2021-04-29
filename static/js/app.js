// Creating function
fetch("http://127.0.0.1:5000/data/", { method: 'POST' }).then(response => response.json()).then((teslaDeaths) => {


    // Bar Plot
    var trace1 = {
        x: teslaDeaths.map(i => i.Year),
        y: teslaDeaths.map(i => i.PedestrianInvolvedCount),
        type: "bar",
        marker: {color: "yellow"}
    };
    var data = [trace1];
    var layout = {
        title: "Deaths per Year",
        xaxis: { title: "Years" },
        yaxis: { title: "Pedestrians" }
    };
    Plotly.newPlot("bar-plot", data, layout);

    // Pie Plot
    var trace2 = {
        labels: teslaDeaths.map(i => i.Country),
        values: teslaDeaths.map(i => i.Deaths),
        type: "pie"
    };
    var data = [trace2];
    var layout = {
        title: "Deaths per Country"
    };
    Plotly.newPlot("rate-bar-plot", data, layout);

    // MultiBar Plot (only deaths pulls)
    var trace1 = {
        x: teslaDeaths.map(i => i.Year),
        y: teslaDeaths.map(i => i.Deaths),
        name: 'Deaths',
        type: 'bar'
    };
    var trace2 = {
        x: teslaDeaths.map(i => i.Year),
        y: teslaDeaths.map(i => i.ByTeslaCount),
        name: 'By Tesla',
        type: 'bar'
    };
    var trace3 = {
        x: teslaDeaths.map(i => i.Year),
        y: teslaDeaths.map(i => i.ByOtherPartyCount),
        name: 'By Other Party',
        type: 'bar'
      };
      var trace4 = {
        x: teslaDeaths.map(i => i.Year),
        y: teslaDeaths.map(i => i.ByUndeterminedCount),
        name: 'By Undetermined',
        type: 'bar'
      };
      var trace5 = {
        x: teslaDeaths.map(i => i.Year),
        y: teslaDeaths.map(i => i.ByInanimateObject),
        name: 'By Inanimate Object',
        type: 'bar'
      };
    var data = [trace1, trace2, trace3, trace4, trace5];
    var layout = {
        barmode: 'group',
        title: 'Deaths vs. Who is at Fault'
    };
    Plotly.newPlot('line-plot', data, layout);

    // d3.js graph
    // Setting the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Appending the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Reading the data
    d3.csv("project_2_redo/static/data/tesla_deaths_per_country_per_year.csv", function (data) {
        // List of groups (here I have one group per column)
        var allGroup = d3.map(data, function (d) { return (d.Country) }).keys()
        // Adding the options to the button
        d3.select("#selectButton")
            .selectAll('myOptions')
            .data(allGroup)
            .enter()
            .append('option')
            .text(function (d) { return d; }) // text showed in the menu
            .attr("value", function (d) { return d; }) // corresponding value returned by the button
        // A color scale (one color for each group)
        var myColor = d3.scaleOrdinal()
            .domain(allGroup)
            .range(d3.schemeSet2);
        // Adding the X axis (it is a date format)
        var x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return d.Year; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(7));
        // Adding the Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.Deaths; })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        // Initializing line with the first group of the list
        var line = svg
            .append('g')
            .append("path")
            .datum(data.filter(function (d) { return d.Country == allGroup[0] }))
            .attr("d", d3.line()
                .x(function (d) { return x(d.Year) })
                .y(function (d) { return y(+d.Deaths) })
            )
            .attr("stroke", function (d) { return myColor("valueA") })
            .style("stroke-width", 4)
            .style("fill", "none")
        // A function that updates the chart
        function update(selectedGroup) {
            // Creating new data with the selection?
            var dataFilter = data.filter(function (d) { return d.Country == selectedGroup })
            // Give these new data to update line
            line
                .datum(dataFilter)
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.Year) })
                    .y(function (d) { return y(+d.Deaths) })
                )
                .attr("stroke", function (d) { return myColor(selectedGroup) })
        }
        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function (d) {
            // Recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            // Run the updateChart function with this selected option
            update(selectedOption)
        })
    });
});