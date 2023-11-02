import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as crawl from "./crawl.js";

// const data = [
//     {
//         event: 49,
//         name: "Bit Crusher",
//         ratings: {
//             overall: 3.3,
//             fun: 4.2,
//             innovation: 3,
//             theme: 3.8,
//             graphics: 4.0,
//             audio: 3.9,
//             humor: 4.4,
//             mood: 5
//         }
//     }, {
//         event: 50,
//         name: "Crush Bitter",
//         ratings: {
//             overall: 4.3,
//             fun: 3.2,
//             innovation: 4,
//             theme: 1.8,
//             graphics: 5.0,
//             audio: 4.9,
//             humor: 3.4,
//             mood: 3
//         }
//     }, {
//         event: 51,
//         name: "Hand me a plazma-gun!",
//         ratings: {
//             overall: 2.2,
//             fun: 1.2,
//             innovation: 5,
//             theme: 4.5,
//             graphics: 4.2,
//             audio: 2.6,
//             humor: 2.4,
//             mood: 3.2
//         }
//     }
// ];
//
// const new_data = [
//     {
//         event: 51,
//         name: "Stuff",
//         ratings: {
//             overall: 4.9,
//             fun: 3.9,
//             innovation: 1.1,
//             theme: 2.3,
//             graphics: 3.8,
//             audio: 4.9,
//             humor: 3.0,
//             mood: 1.2
//         }
//     }, {
//         event: 43,
//         name: "Stars in the sky",
//         ratings: {
//             overall: 2.2,
//             fun: 3.5,
//             innovation: 3.8,
//             theme: 3.2,
//             graphics: 3.3,
//             audio: 3.7,
//             humor: 3.1,
//             mood: 4.4
//         }
//     }, {
//         event: 48,
//         name: "Can I get a pizza over here?",
//         ratings: {
//             overall: 4.4,
//             fun: 3.2,
//             innovation: 2.2,
//             theme: 5.0,
//             graphics: 5.0,
//             audio: 4.2,
//             humor: 2.2,
//             mood: 4.1
//         }
//     }, {
//        revent: 54,
//         name: "Game #2",
//         ratings: {
//             overall: 5.0,
//             fun: 1.2,
//             innovation: 3.6,
//             theme: 3.7,
//             graphics: 4.4,
//             audio: 4.9,
//             humor: 3.0,
//             mood: 2.0
//         }
//     }
// ];

const data = await crawl.crawlGames("yngvarr");
const new_data = await crawl.crawlGames("philstrahl");

const width = 1024;
const height = 600;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

const categories = ['fun', 'innovation', 'theme', 'graphics', 'audio', 'humor', 'mood'];

const colorScheme = d3.scaleOrdinal()
    .domain(categories)
    .range(d3.schemeSet2);

function buildLinesData(games) {
    return categories.map(category => ({
        category,
        values: games.map(g => ({
            game: g.name,
            value: g.ratings[category]
        })).filter(g => g.value !== undefined)
    }));
}

function update(xAxis, yAxis, xScale, yScale, bars, plots, points, line, games) {
    xScale.domain(games.map(d => d.name));
    xAxis.transition().duration(1000).call(d3.axisBottom(xScale));

    const barsData = bars.selectAll("rect").data(games);

    barsData.enter()
        .append("rect")
        .merge(barsData)
            .attr("fill", "#69b3a2")
        .transition()
        .duration(1000)
            .attr("x", d => xScale(d.name))
            .attr("y", d => yScale(d.ratings.overall))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.ratings.overall) - marginBottom);

    barsData.exit().remove();

    const categoryData = buildLinesData(games);
    const plotsData = plots.selectAll("path").data(categoryData);
    const pointsData = points.selectAll("g").data(categoryData);

    plotsData.enter()
        .append("path")
        .merge(plotsData)
            .attr("stroke", d => colorScheme(d.category))
            .style("stroke-width", 4)
            .style("fill", "none")
        .transition()
        .duration(1000)
            .attr("d", d => line(d.values));

    plotsData.exit().remove();

    const postPointsData = pointsData.enter()
        .append("g")
        .merge(pointsData)
        .style("fill", d => colorScheme(d.category));

    pointsData.exit().remove();

    const pointsInnerData = postPointsData.selectAll("circle").data(d => d.values);

    pointsInnerData.enter()
        .append("circle")
        .merge(pointsInnerData)
            .attr("r", 5)
            .attr("stroke", "white")
        .transition()
        .duration(1000)
            .attr("cx", d => xScale(d.game) + xScale.bandwidth() / 2)
            .attr("cy", d => yScale(d.value));

    pointsInnerData.exit().remove();
}

function init() {
    data.sort((a, b) => a.event - b.event);
    new_data.sort((a, b) => a.event - b.event);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([marginLeft, width - marginRight])
        .padding(.2);

    const yScale = d3.scaleLinear()
        .domain([0, 5])
        .range([height - marginBottom, marginTop]);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(xScale));

    const yAxis = svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(yScale));

    const bars = svg.append("g").classed("bars", true);
    const plots = svg.append("g").classed("plots", true);
    const points = svg.append("g").classed("points", true);

    const line = d3.line()
        .x(d => xScale(d.game) + xScale.bandwidth() / 2)
        .y(d => yScale(d.value));

    document.getElementById('stats-plot').append(svg.node());

    update(xAxis, yAxis, xScale, yScale, bars, plots, points, line, data);

    let b = true;
    document.addEventListener("keydown", e => {
        if (e.repeat) return;

        b = !b;
        if (b) {
            update(xAxis, yAxis, xScale, yScale, bars, plots, points, line, data);
        } else {
            update(xAxis, yAxis, xScale, yScale, bars, plots, points, line, new_data);
        }
    });
}

init();
