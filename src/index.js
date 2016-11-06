import { AreaChart } from './AreaChart.js'
import { elevationData } from './data'

// Convert data into array of objects - { values: [{ x, y }] }
const refactorData = (data) => {
    let d = data.distance / data.elevation.length
    return { values: data.elevation.map((e, i) => {
        return { x: i * d, y: e }
    })}
}

const areaChart = new AreaChart(refactorData(elevationData), {
    width: 800,
    height: 300,
    margin : {top: 10, right: 30, bottom: 30, left: 30},
    chartColour: '#c8042b'
})

areaChart.render()
