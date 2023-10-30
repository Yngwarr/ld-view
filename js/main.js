import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const data = [
    {
        event: 49,
        name: "Bit Crusher",
        ratings: {
            overall: 3.3,
            fun: 4.2,
            innovation: 3,
            theme: 3.8,
            graphics: 4.0,
            audio: 3.9,
            humor: 4.4,
            mood: 5
        }
    }, {
        event: 50,
        name: "Crush Bitter",
        ratings: {
            overall: 4.3,
            fun: 3.2,
            innovation: 4,
            theme: 1.8,
            graphics: 5.0,
            audio: 4.9,
            humor: 3.4,
            mood: 3
        }
    }, {
        event: 51,
        name: "Hand me a plazma-gun!",
        ratings: {
            overall: 2.2,
            fun: 1.2,
            innovation: 5,
            theme: 4.5,
            graphics: 4.2,
            audio: 2.6,
            humor: 2.4,
            mood: 3.2
        }
    }
];

const new_data = [
    {
        event: 51,
        name: "Stuff",
        ratings: {
            overall: 4.9,
            fun: 3.9,
            innovation: 1.1,
            theme: 2.3,
            graphics: 3.8,
            audio: 4.9,
            humor: 3.0,
            mood: 1.2
        }
    }, {
        event: 43,
        name: "Stars in the sky",
        ratings: {
            overall: 2.2,
            fun: 3.5,
            innovation: 3.8,
            theme: 3.2,
            graphics: 3.3,
            audio: 3.7,
            humor: 3.1,
            mood: 4.4
        }
    }, {
        event: 48,
        name: "Can I get a pizza over here?",
        ratings: {
            overall: 4.4,
            fun: 3.2,
            innovation: 2.2,
            theme: 5.0,
            graphics: 5.0,
            audio: 4.2,
            humor: 2.2,
            mood: 4.1
        }
    }, {
       revent: 54,
        name: "Game #2",
        ratings: {
            overall: 5.0,
            fun: 1.2,
            innovation: 3.6,
            theme: 3.7,
            graphics: 4.4,
            audio: 4.9,
            humor: 3.0,
            mood: 2.0
        }
    }
];

const width = 1024;
const height = 600;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

function update(svg, xAxis, yAxis, xScale, yScale, games) {
    xScale.domain(games.map(d => d.name));
    xAxis.transition().duration(1000).call(d3.axisBottom(xScale));

    const data = svg.selectAll("rect")
        .data(games);

    data.enter()
        .append("rect")
        .merge(data)
            .attr("fill", "#69b3a2")
        .transition()
        .duration(1000)
            .attr("x", d => xScale(d.name))
            .attr("y", d => yScale(d.ratings.overall))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.ratings.overall) - marginBottom);

    data.exit()
        .remove();
}

function init() {
    data.sort((a, b) => a.event - b.event);
    new_data.sort((a, b) => a.event - b.event);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([marginLeft, width - marginRight])
        .padding(.2);

    const yScale = d3.scaleLinear()
        .domain([0, 5])
        .range([height - marginBottom, marginTop]);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(xScale));

    const yAxis = svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(yScale));

    document.getElementById('stats-plot').append(svg.node());

    update(svg, xAxis, yAxis, xScale, yScale, data);

    let b = true;
    document.addEventListener("keydown", e => {
        if (e.repeat) return;

        b = !b;
        if (b) {
            update(svg, xAxis, yAxis, xScale, yScale, data);
        } else {
            update(svg, xAxis, yAxis, xScale, yScale, new_data);
        }
    });
}

init();
