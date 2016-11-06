import { responsivefy } from './responsivefy'
const d3 = require('d3')

export class AreaChart {

    constructor(data, options) {
        this.data = data
        this.fullWidth = 800
        this.fullHeight = 400
        this.margin = {top: 10, right: 0, bottom: 30, left: 30}
        this.width = this.fullWidth - this.margin.left - this.margin.right
        this.height = this.fullHeight - this.margin.top - this.margin.bottom
        this.canvas = {}
        this.xScale = {}
        this.yScale = {}
    }

    render() {
        this.canvas = this.createCanvas()
        this.createChart()
        this.createAxes()
        this.createAreaChart()
    }

    createCanvas() {
        return d3.select('.chart')
            .append('svg')
            .attr('width', this.fullWidth)
            .attr('height', this.fullHeight)
            .call(responsivefy)                 // Could make this optional
        .append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    }

    createChart() {
        this.canvas.append('rect')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('fill', 'none')
    }

    createAxes() {
        this.createXAxis()
        this.createYAxis()
    }

    createXAxis() {
        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(this.data.values, d => d.distance)])
            .range([0, this.width])
        let xAxis = d3.axisBottom(this.xScale)      //.ticks(n, '.1s')

        this.canvas.append('g')
            .attr('transform', `translate(0, ${this.height})`)
            .call(xAxis)
    }

    createYAxis() {
        this.yScale = d3.scaleLinear()
            .domain([
                d3.min(this.data.values, d => d.elevation),
                d3.max(this.data.values, d => d.elevation)
            ])
            .range([this.height, 0])
        let yAxis = d3.axisLeft(this.yScale)     //.ticks(n)

        this.canvas.append('g')
            .call(yAxis)
    }

    createAreaChart() {
        let area = d3.area()
            .x(d => this.xScale(d.distance))
            .y0(this.yScale(this.yScale.domain()[0]))
            .y1(d => this.yScale(d.elevation))

        this.canvas
            .append('path')
                .attr('class', 'area')
                .attr('d', area(this.data.values))
    }

}
