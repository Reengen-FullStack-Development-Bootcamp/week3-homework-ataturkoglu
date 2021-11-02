<template>
    <div id="candleChart" ref="candle">
    </div>
</template>

<script>
import * as d3 from "d3"
export default {
    data(){
        return{
            data:{
                "2021-06-10":{
                    "open": "294.2900",
                    "high": "277.4600",
                    "low": "253.6700",
                    "close": "257.2400",
                    "volume": "24563619"
                },
                "2021-06-11":{
                    "open": "264.2900",
                    "high": "257.4600",
                    "low": "243.6700",
                    "close": "230.2400",
                    "volume": "24563619"
                },
                "2021-06-12":{
                    "open": "384.2900",
                    "high": "357.4600",
                    "low": "253.6700",
                    "close": "327.2400",
                    "volume": "24563619"
                },
                "2021-06-13":{
                    "open": "284.2900",
                    "high": "257.4600",
                    "low": "253.6700",
                    "close": "257.2400",
                    "volume": "24563619"
                },
                "2021-06-14":{
                    "open": "204.2900",
                    "high": "257.4600",
                    "low": "253.6700",
                    "close": "257.2400",
                    "volume": "24563619"
                },
                "2021-06-15":{
                    "open": "304.2900",
                    "high": "257.4600",
                    "low": "253.6700",
                    "close": "257.2400",
                    "volume": "24563619"
                },
            }
        }
    },

    computed:{
        dated(){
            let list=[]
            Object.keys(this.data).forEach(item=>{
                let obj = new Object({
                    ...this.data[item],
                    date:item
                })
                list.push(obj)
            })
            return list
        },
    },
    mounted(){
        this.setChart()
    },
    methods: {
        setChart(){
            const svg = d3.select(this.$refs.candle)
                .append("svg")
                .attr("width",950)
                .attr("height",450)

            const base = svg.append("g")
                .attr("width",850)
                .attr("height",350)
                .attr("transform","translate(50,50)")

            base.append("rect")
                .attr("width","100%")
                .attr("height","100%")
                .attr("fill","rgb(139, 139, 187)")

            const x = d3.scaleBand()
                .domain(this.dated.map(d=>d.date))
                .range([0,850])
                .padding(0.5);

            svg.append("g")
                .attr("transform","translate(100,400)")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform","translate(20,0)")
                .style("text-anchor","end")

            const y = d3.scaleLinear()
                .domain([0,500])
                .range([350,0])
            
            svg.append("g")
                .attr("transform","translate(100,50)")
                .call(d3.axisLeft(y))

            /*base.selectAll("mybar").
				data(this.dated).
				enter().
				append("rect").
				attr("x", function(d) { return x(d.date)+50; }).
				attr("y", function(d) { return y(d.open); }).
				attr("width", x.bandwidth()).
				attr("height", function(d) { return 350 - y(d.open); }).
				attr("fill", "#601f79")*/

            /*svg.selectAll("rect")
                .data(this.dated)
                .enter()
                .append("rect")
                .attr("y", function(d) {return y(d3.max([d.open, d.close]));})
                .attr("height", function(d) { 
                    return y(-Math.abs(d.open - d.close));})
                .classed("rise", function(d) { return (d.close>d.open); })
                .classed("fall", function(d) { return (d.open>d.close); });*/

            /*base.selectAll("sticks")
                .data(this.dated)
                .enter()
                .append("rect")
                .attr("x",function(d){return x(d.date)+82})
                .attr("y",function(d){return y(d.open)})
                .attr("width",2)
                .attr("height", d=>Math.abs(d.open-d.close))
                .classed("rise", function(d) { return (d.close>d.open); })
                .classed("fall", function(d) { return (d.open>d.close); });*/
            base.selectAll("sticks")
                .data(this.dated)
                .enter()
                .append("rect")
                .attr("x",function(d){return x(d.date)+82})
                .attr("y",function(d){return y(d.open)})
                .attr("width",2)
                .attr("height", d=>Math.abs(d.open-d.close))
            
            base.selectAll("candles")
                .data(this.dated)
                .enter()
                .append("rect")
                .attr("x",function(d){return x(d.date)+79})
                .attr("y",function(d){return y(d.high)})
                .attr("width",8)
                .attr("height", d=>Math.abs(d.high-d.low))
                .classed("rise", function(d) { return (d.close>d.open); })
                .classed("fall", function(d) { return (d.open>d.close); })
            






                /*
                .style("stroke","black")
                .style("stroke-width",1)
                .style("stroke-linecap", "round")
                .attr("x1", 200)     // x position of the first end of the line
                .attr("y1", 100)     // y position of the first end of the line
                .attr("x2", 200)     // x position of the second end of the line
                .attr("y2", 200);    // y position of the second end of the line */

        }
    },
}
</script>

<style scoped>
    #candleChart{
        height: 502px;
        width: 1002px;
        border: 1px solid rgb(139, 139, 187);
        margin-bottom: 50px;
    }
    .rise{
        fill: green;
    }
    .fall{
        fill: rgb(198, 0, 0);
    }
</style>