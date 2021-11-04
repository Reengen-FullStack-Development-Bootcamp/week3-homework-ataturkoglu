<template>
    <div v-if="getData!=[]||null" id="chart" ref="chart">
		<v-container style="width:fitcontent" ref="btns" class="btns">
			<v-btn @click="getDailyData" class="btn mr-3" elevation="2" raised rounded small>Daily</v-btn>
			<v-btn @click="getWeeklyData" class="btn mr-3" elevation="2" raised rounded small>Weekly</v-btn>
			<v-btn @click="getMonthlyData" class="btn mr-3" elevation="2" raised rounded small>Monthly</v-btn>
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
	beforeMount(){
		if(this.$route.params.id){
			console.log("id",this.$route.params.id)
			this.$store.commit("setSearchSymbol",this.$route.params.id)
			this.$store.dispatch("getDailyData")
		}
	},
    mounted(){
		setTimeout(() => {
			if(this.getData!=null) this.setChart()
		}, 1000);
		this.$store.dispatch("getSymbolbyName")
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
			if(document.getElementById("chartsvg")){                                    //data değiştiğinde eski svg'yi silip yeni svg oluşturuyoruz
				const chartsvg = document.getElementById("chartsvg")
				this.$refs.chart.removeChild(chartsvg)
			}
            
			let margin = {top: 70, right: 50, bottom: 50, left: 50};
			let padding = { top: 30, right: 70, bottom: 50, left: 70 }

			let width = 1000                                                            //işlemleri kolaylaştırmak için içten dışa doğru alanları oluşturuyoruz
			let height = 400                                                            //en içteki grafik dataların yazılacağı bölümden dışa doğru padding ve marginler
            let space = 10                                                            	//ile dışa doğru chart kısmının ve svg kısmının width ve hight değerlerini
            let vol_width = width														//hazır hale getiriyoruz
            let vol_height = 200
            let candles_height = height+margin.top
            let chart_height = candles_height+space+vol_height
            let chart_width = width+padding.left+padding.right
            let svg_width = chart_width+margin.left+margin.right
            let svg_height = chart_height+margin.top+margin.bottom


			let maxList = []                                                            //grafikte y bandını gereksiz uzakmamak için
			let minList = []                                                            //gelen verilerden önce her bir veriden max ve min değerlerini buluyoruz
            this.getData.forEach(item=>{                                                //ardından en yüksek ve en düşük değerlerin içinden 
				maxList.push(Math.max(item.open,item.close,item.high))                  //en yükseğini y ekseninin max değeri için kullanıyoruz
				minList.push(Math.min(item.open,item.close,item.low))                   //en düşüğünü y ekseninde min değeri olarak kullanıyoruz
            })
            
            this.getData.map(data=>data.volume)

			let max_value = Math.max(...maxList)
			let min_value = Math.min(...minList)

            let maxVol = Math.max(...this.getData.map(data=>data.volume))				//volume y ekseni için min max değerleri
            let minVol = Math.min(...this.getData.map(data=>data.volume))


            const svg = d3.select(this.$refs.chart)                                     //üzerinde çalışacağımız svg elementini chart divine ekliyoruz
                .append("svg")
				.attr("id","chartsvg")
                .attr("width",svg_width)
                .attr("height",svg_height)

            svg.append("rect")                                                          //arka planı renklendirmek için svg elementine bir rect elementi ekliyoruz
                .attr("width",chart_width)
                .attr("height",chart_height)
                .attr("rx",10)
                .attr("ry",10)
                .attr("fill","whitesmoke")
                .attr("transform","translate("+margin.left+","+margin.top+")")
                
            const vol = svg.append("g")						                        	// volume grafiğin yazılacağı g elementini svg elementimize ekliyoruz
                .attr("width",vol_width)
                .attr("height",vol_height)
				.attr("transform","translate("+(margin.left+padding.left)+","+(margin.top+candles_height+space)+")")
            

            const base = svg.append("g")						                        //grafiğin yazılacağı g elementini svg elementimize ekliyoruz
                .attr("width",width)
                .attr("height",height)
				.attr("transform","translate("+(margin.left+padding.left)+","+(margin.top+padding.top)+")")
				

            const x = d3.scaleBand()							                        //x ekseni işaretleme (bant)
                .domain(this.getData.map(d=>d.date))
                .range([0,width])


            base.append("g")										                    //x ekseni bir grup oluşturup, hazırladığımız x bandını ekliyoruz
                .attr("transform","translate(0,"+height+")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform","rotate(-25)")
                .style("text-anchor","end")

            const y = d3.scaleLinear()							                        //y ekseni işaretleme (bant)
                .domain([(min_value),(max_value)])
                .range([height,0])
            
            base.append("g")										                    //y ekseninde bir grup oluşturup, hazırladığımız y bandını ekliyoruz
                .call(d3.axisLeft(y))
            
			base.selectAll("candles")							                        //kalın çizgiler (open-close)
                .data(this.getData)
                .enter()
                .append("rect")
                .attr("x",function(d){return  x(d.date)})
                .attr("y",function(d) {return y(d3.max([parseFloat(d.open), parseFloat(d.close)]))})
                .attr("width",10)
                .attr("height", function(d) {return Math.abs(y(d.open)-y(d.close))})
                .attr("rx",3)
                .classed("rise", function(d) { return (d.close>d.open); })
                .classed("fall", function(d) { return (d.open>d.close); })
                .attr("transform","translate("+(width/this.getData.length/2-5.5)+")")   //x ekseninde tarihleri alırken sağda solda yarım boşluk bırakıyor,
                                                                                        //grafik geldiğinde sıfırdan başlıyor,
                                                                                        //grafik ile x eksenini hizalamak için yarım bölüm kaydırıyoruz

			base.selectAll("sticks")							                        //ince çizgiler (high-low)
				.data(this.getData)
				.enter()
				.append("rect")
				.attr("x",function(d){return x(d.date)})
				.attr("y",function(d){
						if(parseFloat(d.high)>parseFloat(d.low)){
							return y(d.high)
						}else{
							return y(d.low)
						}
				})
				.attr("width",2)
				.attr("height", function(d) {return y(d.low)-y(d.high)})
                .classed("rise", function(d) { return (d.close>d.open); })
                .classed("fall", function(d) { return (d.open>d.close); })
                .attr("transform","translate("+(width/this.getData.length/2-1.5)+")")    //x ekseninde tarihleri alırken sağda solda yarım boşluk bırakıyor,
                                                                                        //grafik geldiğinde sıfırdan başlıyor,
                                                                                        //grafik ile x eksenini hizalamak için yarım bölüm kaydırıyoruz


            const vy = d3.scaleLinear()							                        // volume için y ekseni işaretleme (bant)
                .domain([(minVol),(maxVol)])
                .range([vol_height,0])
            
            vol.append("g")										                        // volume için y ekseninde bir grup oluşturup, hazırladığımız vy bandını ekliyoruz
                .call(d3.axisRight(vy))
                .attr("transform","translate("+(vol_width)+")")

            vol.selectAll("volBars")                                                    // volume grafiği
                .data(this.getData)
                .enter()
                .append("rect")
                .attr("x",function(d){return x(d.date)})
                .attr("y",function(d){return vy(d.volume)})
				.attr("width", x.bandwidth())
				.attr("height", function(d) { return vol_height - vy(d.volume); })
				.attr("fill", "rgb(9,40,101)")



        },

		getDailyData(){
			this.$store.dispatch("getDailyData")
		},

		getWeeklyData(){
			this.$store.dispatch("getWeeklyData")
		},

		getMonthlyData(){
			this.$store.dispatch("getMonthlyData")
		},

		beforeRouteUpdate(to,from,next){
			console.log("to")
			console.log("from")
			next()
		}
    }
}
</script>

<style>
	#chart{
		position: relative;
		width: 1000px;
		height: 620px;
		justify-self: center;
		border-radius: 10px;
		box-shadow: 0px 0px 5px grey;
		border: 1px solid black;
        background-color: wheat;
	}
	.container{
		position: relative;
	}
	svg{
		border: 1px solid rgb(23, 65, 148);
		background-color: rgb(9, 40, 101);
        border-radius: 10px;
        box-shadow: 0 0 10px grey;
	}
	.btns{
		position: absolute;
		z-index: 2;
		top: 20px;
		left: 2.7%;
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