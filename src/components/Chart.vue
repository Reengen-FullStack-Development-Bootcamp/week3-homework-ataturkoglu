<template>
    <div id="chart" ref="chart">
		<v-container class="btns">
			<v-btn @click="getDailyData" class="btn mr-3" elevation="2" raised rounded small>Daily</v-btn>
			<v-btn @click="getWeeklyData" class="btn mr-3" elevation="2" raised rounded small>Weekly</v-btn>
			<v-btn @click="getMonthlyData" class="btn mr-3" elevation="2" raised rounded small>Mounthly</v-btn>
		</v-container>
    </div>
</template>

<script>
import * as d3 from "d3"
import { mapGetters, mapState } from "vuex"
export default {
    data(){
        return{
        }
    },
    mounted(){
		setTimeout(() => {
			if(this.getData!=null) this.setChart()
		}, 1000);
		this.$store.dispatch("getDatabyName")
    },
	watch:{
		getData: {
			handler(){
				this.setChart()
			}
		}
	},
	computed:{
		...mapState(["companyData"]),
		...mapGetters(["getData"]),
	},
    methods:{        
		setChart(){
			if(document.getElementById("chartsvg")){
				const chartsvg = document.getElementById("chartsvg")
				this.$refs.chart.removeChild(chartsvg)
			}
			let margin = {top: 100, right: 30, bottom: 70, left: 60};
			let width = 1000
			let height = 600

			let maxList = []
			let minList = []
			this.getData.forEach(item=>{
				maxList.push(Math.max(item.open,item.close,item.high))
				minList.push(Math.min(item.open,item.close,item.low))
			})
			let max_value = Math.max(...maxList)
			let min_value = Math.min(...minList)
			console.log("max",max_value = Math.max(...maxList))
			console.log("min",min_value = Math.min(...minList))

			document.getElementById("chart").style.height=height+margin.top+margin.bottom+"px"
			document.getElementById("chart").style.width=width+margin.left+margin.right+"px"

            const svg = d3.select(this.$refs.chart)
                .append("svg")
				.attr("id","chartsvg")
                .attr("width",width)
                .attr("height",height)

            svg.append("rect")
                .attr("width",width-margin.right)
                .attr("height",height-margin.bottom)
                .attr("fill","rgb(220, 220, 220)")
                .attr("transform","translate("+margin.left+","+margin.top+")")

            const base = svg.append("g")						//grafiğin yazılacağı bölüm
                .attr("width",width)
                .attr("height",height)
				.attr("transform","translate("+(margin.left*2)+",0)")

            const x = d3.scaleBand()							//x ekseni işaretleme
                .domain(this.getData.map(d=>d.date))
                .range([0,width-(margin.left*2)-margin.right])
                .padding(0.5);

            svg.append("g")										//x ekseni
                .attr("transform","translate("+(margin.left*2)+","+(height-margin.bottom)+")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform","translate(20,0)rotate(-25)")
                .style("text-anchor","end")

            const y = d3.scaleLinear()							//y ekseni işaretleme
                .domain([(min_value),(max_value)])
                .range([(height-margin.bottom-margin.top),0])
            
            svg.append("g")										//y ekseni 
                .attr("transform","translate("+(margin.left*2)+","+margin.top+")")
                .call(d3.axisLeft(y))

            base.selectAll("sticks")							//ince çizgiler
                .data(this.getData)
                .enter()
                .append("rect")
                .attr("x",function(d){return x(d.date)+margin.right})
                .attr("y",function(d){
						if(d.high>d.low){
							return y(d.high)+margin.top
						}else{
							return y(d.low)+margin.top
						}
				})
                .attr("width",2)
                .attr("height", d=>Math.abs(d.high-d.low))
            
            base.selectAll("candles")							//kalın çizgiler
                .data(this.getData)
                .enter()
                .append("rect")
                .attr("x",function(d){return x(d.date)+margin.right-2.5})
                .attr("y",function(d){
						if(d.open>d.close){
							return y(d.open)+margin.top
						}else{
							return y(d.close)+margin.top
						}
				})
                .attr("width",8)
                .attr("height", d=>Math.abs(d.open-d.close))
                .classed("rise", function(d) { return (d.close>d.open); })
                .classed("fall", function(d) { return (d.open>d.close); })
        },

		getDailyData(){
			this.$store.dispatch("getDailyData")
		},

		getWeeklyData(){
			this.$store.dispatch("getWeeklyData")
		},

		getMonthlyData(){
			this.$store.dispatch("getMonthlyData")
		}
    }
}
</script>

<style>
	#chart{
		position: relative;
		width: 1200px;
		height: 800px;
		justify-self: center;
		border: 1px solid rgb(101, 132, 101);
	}
	.btns{
		position: absolute;
		z-index: 5;
		top: 0;
		left: 0;
	}
	.btn{
		background-color: rgb(101, 132, 101);
	}
	.rise{
        fill: rgb(1, 120, 1);
    }
    .fall{
        fill: rgb(198, 0, 0);
    }
</style>