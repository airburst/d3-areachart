import { responsivefy } from './responsivefy'
const d3 = require('d3')

export class AreaChart {

    constructor(data, options) {
        this.data = data
        this.fullWidth = (options.width) ? options.width : 800
        this.fullHeight = (options.height) ? options.height : 400
        this.margin = (options.margin) ? options.margin : {top: 10, right: 0, bottom: 30, left: 30}
        this.width = this.fullWidth - this.margin.left - this.margin.right
        this.height = this.fullHeight - this.margin.top - this.margin.bottom
        this.chartColour = (options.chartColour) ? options.chartColour : 'lightblue'
        this.axisColour = (options.axisColour) ? options.axisColour : '#262626'
        this.responsive = (options.responsive !== undefined) ? options.responsive : true
        this.canvas = {}
        this.xScale = {}
        this.yScale = {}
    }

    render() {
        this.canvas = this.createCanvas()
        this.createChart()
        this.prepareAxes()
        this.createAreaChart()
        this.createAxes()
    }

    createCanvas() {
        let canvas = d3.select('.chart')
            .append('svg')
            .attr('width', this.fullWidth)
            .attr('height', this.fullHeight)
        if (this.responsive) { canvas.call(responsivefy) }
        return canvas
            .append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    }

    createChart() {
        this.canvas.append('rect')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('fill', 'none')
    }

    prepareAxes() {
        this.prepareXAxis()
        this.prepareYAxis()
    }

    prepareXAxis() {
        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(this.data.values, d => d.distance)])
            .range([0, this.width])
    }

    prepareYAxis() {
        this.yScale = d3.scaleLinear()
            .domain([
                //d3.min(this.data.values, d => d.elevation),
                0,
                d3.max(this.data.values, d => d.elevation)
            ])
            .range([this.height, 0])
    }

    createAxes() {
        this.createXAxis()
        this.createYAxis()
        d3.selectAll('.domain').style('stroke', this.axisColour)
        d3.selectAll('.tick').selectAll('line').style('stroke', this.axisColour)
        d3.selectAll('.tick').selectAll('text').style('fill', this.axisColour)
    }

    createXAxis() {
        let xAxis = d3.axisBottom(this.xScale)      //.ticks(n, '.1s')
        this.canvas.append('g')
            .attr('class', 'xaxis')
            .attr('transform', `translate(0, ${this.height})`)
            .call(xAxis)
            
    }

    createYAxis() {
        let yAxis = d3.axisLeft(this.yScale)     //.ticks(n)
        this.canvas.append('g')
            .attr('class', 'yaxis')
            .call(yAxis)
    }

    createAreaChart() {
        let area = d3.area()
            .x(d => this.xScale(d.distance))
            .y0(this.yScale(this.yScale.domain()[0]))
            .y1(d => this.yScale(d.elevation))
            .curve(d3.curveCatmullRom.alpha(0.5))

        this.canvas
            .append('path')
                .attr('class', 'area')
                .attr('d', area(this.data.values))
                .style('fill', this.chartColour)
    }

}
