<template>
  <div v-if="getData != [] || null" id="chart" ref="chart" class="chart">
    <transition name="butons">
      <v-container
        v-if="btn_state"
        style="width: fitcontent"
        ref="btns"
        class="btns"
      >
        <v-btn
          @click="getDailyData"
          class="btn mr-3"
          elevation="2"
          raised
          rounded
          small
          >Daily</v-btn
        >
        <v-btn
          @click="getWeeklyData"
          class="btn mr-3"
          elevation="2"
          raised
          rounded
          small
          >Weekly</v-btn
        >
        <v-btn
          @click="getMonthlyData"
          class="btn mr-3"
          elevation="2"
          raised
          rounded
          small
          >Monthly</v-btn
        >
      </v-container>
    </transition>
    <div v-if="waiting" class="waiting"></div>
    <p v-if="waiting" id="text" class="text">Waiting API{{ dots }}</p>
  </div>
</template>

<script>
import * as d3 from "d3";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      btn_state: false,
      height: null,
      width: null,
      svgHeight:null,
      svgWidth:null,
      dots: "",
    };
  },
  beforeMount() {
    if (this.$route.params.id) {
      if (this.$store.state.searchSymbol == null){
        this.$store.commit("setSearchSymbol", this.$route.params.id);
      }
      this.$store.dispatch("getChartData", this.$route.query.view);
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.getData != null) {
        //responsivce bir yapı için card nesnesinin width ve height değerlerini alıyoruz
        this.svgWidth = parseInt(window.getComputedStyle(this.$refs.chart).width);
        this.svgHeight=parseInt(
          window.getComputedStyle(this.$refs.chart).height
        );
        this.setChart();
      }
    }, 1000);

    //sayfa boyutu değişikliğini kontrol edip 
    //yeniden chart kurup card içine yerleştiriyoruz
    window.addEventListener("resize", this.resizeChart);
  },
  watch: {
    getData: {
      handler(val) {
        if (val != null || []) {
          this.$store.state.loader = false;
          this.btn_state = true;
          this.svgWidth = parseInt(
            window.getComputedStyle(this.$refs.chart).width
          );
          this.svgHeight = parseInt(
            window.getComputedStyle(this.$refs.chart).height
          );
          this.setChart();
        } else {
          this.$store.state.loader = false;
          this.btn_state = false;
        }
      },
    },

    waiting: {
      handler(val) {
        if (val) {
          var waitingDots = setInterval(() => {
            this.dots += ".";
            if (this.dots.length > 3) {
              this.dots = "";
            }
          }, 500);
        } else {
          clearInterval(waitingDots);
        }
      },
    },
  },
  computed: {
    ...mapState(["companyData", "waiting"]),
    ...mapGetters(["getData"]),
  },
  methods: {
    setChart() {
      if (document.getElementById("chartsvg")) {
        //data değiştiğinde eski svg'yi silip yeni svg oluşturuyoruz
        const chartsvg = document.getElementById("chartsvg");
        this.$refs.chart.removeChild(chartsvg);
      }
      
      let padding=null
      if(!this.$vuetify.breakpoint.mobile || !this.$vuetify.breakpoint.xs){
        padding = { top: 30, right: this.svgWidth/15, bottom: this.svgWidth/15, left: this.svgWidth/15 };
      }else{
        padding = { top: this.svgWidth/100, right: this.svgWidth/100, bottom: this.svgWidth/100, left: this.svgWidth/100 };
      }
      let margin = { top: 60, right: this.svgWidth/100, bottom: this.svgWidth/100, left: this.svgWidth/100 };

      //responsive bir chart için card nesnesinin widht ve height değerlerini,
      //svg'nin width ve height değerine eşiitliyoruz.
      //dıştan içe doğru yapımızı oluşturuyoruz
      let svg_width  = this.svgWidth
      let chart_width = svg_width - margin.left - margin.right
      let width = chart_width - padding.left - padding.right
      let vol_width = width;
      
      let svg_height = this.svgHeight;
      let chart_height = this.svgHeight-margin.top-margin.bottom;
      let candles_height = (chart_height*7) / 10;
      let height = candles_height - padding.top - padding.bottom
      let vol_height = ((chart_height*3)/10)-margin.bottom;

      let maxList = []; //grafikte y bandını gereksiz uzatmamak için
      let minList = []; //gelen verilerden önce her bir veriden max ve min değerlerini buluyoruz

      //ardından en yüksek ve en düşük değerlerin içinden
      //en yükseğini y ekseninin max değeri için kullanıyoruz
      //en düşüğünü y ekseninde min değeri olarak kullanıyoruz
      this.getData.forEach((item) => {
        maxList.push(Math.max(item.open, item.close, item.high));
        minList.push(Math.min(item.open, item.close, item.low));
      });

      this.getData.map((data) => data.volume);

      let max_value = Math.max(...maxList);
      let min_value = Math.min(...minList);

      //volume y ekseni için min max değerleri
      let maxVol = Math.max(...this.getData.map((data) => data.volume));
      let minVol = Math.min(...this.getData.map((data) => data.volume));

      const svg = d3
        .select(this.$refs.chart) //üzerinde çalışacağımız svg elementini chart divine ekliyoruz
        .append("svg")
        .attr("id", "chartsvg")
        .attr("width", svg_width)
        .attr("height", svg_height);

      svg
        .append("rect") //arka planı renklendirmek için svg elementine bir rect elementi ekliyoruz
        .attr("width", chart_width)
        .attr("height", chart_height)
        .attr("rx", 7)
        .attr("ry", 7)
        .attr("fill", "whitesmoke")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const vol = svg
        .append("g") // volume grafiğin yazılacağı g elementini svg elementimize ekliyoruz
        .attr("width", vol_width)
        .attr("height", vol_height)
        .attr(
          "transform",
          "translate(" +
            (margin.left + padding.left) +
            "," +
            (margin.top + candles_height) +
            ")"
        );

      const base = svg
        .append("g") //grafiğin yazılacağı g elementini svg elementimize ekliyoruz
        .attr("width", width)
        .attr("height", height)
        .attr(
          "transform",
          "translate(" +
            (margin.left + padding.left) +
            "," +
            (margin.top + padding.top) +
            ")"
        );

      const x = d3
        .scaleBand() //x ekseni işaretleme (bant)
        .domain(this.getData.map((d) => d.date))
        .range([0, width]);

      if(!this.$vuetify.breakpoint.mobile || !this.$vuetify.breakpoint.xs){
        base
          .append("g") //x ekseni bir grup oluşturup, hazırladığımız x bandını ekliyoruz
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("transform", "rotate(-25)")
          .style("text-anchor", "end");
      }

      const y = d3
        .scaleLinear() //y ekseni işaretleme (bant)
        .domain([min_value, max_value])
        .range([height, 0]);

      if(!this.$vuetify.breakpoint.mobile || !this.$vuetify.breakpoint.xs){
        base
          .append("g") //y ekseninde bir grup oluşturup, hazırladığımız y bandını ekliyoruz
          .call(d3.axisLeft(y));
      }
      base
        .selectAll("candles") //kalın çizgiler (open-close)
        .data(this.getData)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d.date);
        })
        .attr("y", function (d) {
          return y(d3.max([parseFloat(d.open), parseFloat(d.close)]));
        })
        .attr("width", 10)
        .attr("height", function (d) {
          return Math.abs(y(d.open) - y(d.close));
        })
        .attr("rx", 3)
        .classed("rise", function (d) {
          return d.close > d.open;
        })
        .classed("fall", function (d) {
          return d.open > d.close;
        })
        .attr(
          "transform",
          "translate(" + (width / this.getData.length / 2 - 5.5) + ")"
        ); //x ekseninde tarihleri alırken sağda solda yarım boşluk bırakıyor,
      //grafik geldiğinde sıfırdan başlıyor,
      //grafik ile x eksenini hizalamak için yarım bölüm kaydırıyoruz

      base
        .selectAll("sticks") //ince çizgiler (high-low)
        .data(this.getData)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d.date);
        })
        .attr("y", function (d) {
          if (parseFloat(d.high) > parseFloat(d.low)) {
            return y(d.high);
          } else {
            return y(d.low);
          }
        })
        .attr("width", 2)
        .attr("height", function (d) {
          return y(d.low) - y(d.high);
        })
        .classed("rise", function (d) {
          return d.close > d.open;
        })
        .classed("fall", function (d) {
          return d.open > d.close;
        })
        .attr(
          "transform",
          "translate(" + (width / this.getData.length / 2 - 1.5) + ")"
        ); //x ekseninde tarihleri alırken sağda solda yarım boşluk bırakıyor,
      //grafik geldiğinde sıfırdan başlıyor,
      //grafik ile x eksenini hizalamak için yarım bölüm kaydırıyoruz

      const vy = d3
        .scaleLinear() // volume için y ekseni işaretleme (bant)
        .domain([minVol, maxVol])
        .range([vol_height, 0]);

      if(!this.$vuetify.breakpoint.mobile || !this.$vuetify.breakpoint.xs){
        vol
          .append("g") // volume için y ekseninde bir grup oluşturup, hazırladığımız vy bandını ekliyoruz
          .call(d3.axisRight(vy))
          .attr("transform", "translate(" + vol_width + ")");
      }

      vol
        .selectAll("volBars") // volume grafiği
        .data(this.getData)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d.date);
        })
        .attr("y", function (d) {
          return vy(d.volume);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
          return vol_height - vy(d.volume);
        })
        .attr("fill", "rgb(40, 118, 146)");
    },

    getDailyData() {
      if (this.$route.query.view != "daily") {
        this.$store.state.loader = true;
        this.$store.state.chart_key++;
        this.$router.push({
          name: "Chart",
          params: { id: this.$route.params.id },
          query: { view: "daily" },
        });
      }
    },

    getWeeklyData() {
      if (this.$route.query.view != "weekly") {
        this.$store.state.loader = true;
        this.$store.state.chart_key++;
        this.$router.push({
          name: "Chart",
          params: { id: this.$route.params.id },
          query: { view: "weekly" },
        });
      }
    },

    getMonthlyData() {
      if (this.$route.query.view != "monthly") {
        this.$store.state.loader = true;
        this.$store.state.chart_key++;
        this.$router.push({
          name: "Chart",
          params: { id: this.$route.params.id },
          query: { view: "monthly" },
        });
      }
    },

    resizeChart(){
      this.svgWidth = parseInt(
        window.getComputedStyle(this.$refs.chart).width
      );
      this.svgHeight = parseInt(
        window.getComputedStyle(this.$refs.chart).height
      );
      setTimeout(() => {
        this.setChart();
        
      }, 200);
    }

  },

  beforeRouteUpdate(to, from, next) {
    console.log("from", from);
    console.log("to", to);
    this.$store.state.loader = true;
    this.$store.state.chart_key++;
    next();
  },

  beforeDestroy(){
    window.removeEventListener("resize", this.resizeChart);
  }
};
</script>

<style>
.chart {
  position: relative;
  height: 100%;
  justify-self: center;
  border-radius: 10px;
  width: 100%;
  margin-bottom: 150px;
}
.container {
  position: relative;
}
svg {
  border: 1px solid rgb(23, 65, 148);
  /*background-color: rgb(9, 40, 101);*/
  background-color: #6993b5;
  border-radius: 10px;
  box-shadow: 0 0 10px grey;
}
.btns {
  position: absolute;
  z-index: 2;
  top: 5px;
  left: 2.7%;
}
.btn {
  background-color: rgb(101, 132, 101);
}
.rise {
  fill: rgb(1, 120, 1);
}
.fall {
  fill: rgb(198, 0, 0);
}

.butons-enter-active {
  animation-delay: 0.5s;
  animation: toUp 1s ease-in-out;
}
@keyframes toUp {
  from {
    transform: translateY(200%);
    opacity: 0;
    z-index: -2;
  }
  to {
    transform: translateY(0);
    opacity: 1;
    z-index: 2;
  }
}

.waiting {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: rgb(161, 186, 193);
  opacity: 0.75;
  z-index: 3;
}
.text {
  position: absolute;
  left: 50%;
  transform: translate(-45%, 0);
  top: 35%;
  opacity: 1;
  font-size: 50px;
  z-index: 4;
  font-weight: bold;
  filter: drop-shadow(0 0 20px grey);
}
</style>
