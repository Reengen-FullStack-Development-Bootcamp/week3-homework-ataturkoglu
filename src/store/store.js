import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchCompany:null,
    searchSymbol:null,
    searchView:null,
    foundCompanies:null,
    companyData:null,
    chartState:true,
    loader:false,
    chart_key:0,
    user:"Guest",
    log_count:0,
    API:"cc7a52ffb5msha38b3d0953d7f6ep197d81jsn227207fde546",
  },
  mutations: {
    setData(state,payload){
      state.companyData=null
      state.companyData=payload
    },
    setSearchCompany(state,payload){
      state.searchCompany=payload
    },
    setSearchSymbol(state,payload){
      state.searchSymbol=payload
    },
    setSearchView(state,payload){
      state.searchView=payload
    },
    setFoundCompanies(state,payload){
      state.foundCompanies=payload
    }
  },
  getters:{
    getData(state){
      return state.companyData
    },
    getFoundCompanies(state){
      return state.foundCompanies
    }
  },

  actions: {

    async getChartData({commit,state},view){
      if(state.searchSymbol!=null){
        switch (view) {
          case "daily":{
            
            const daily_options = {
              method: 'GET',
              url: 'https://alpha-vantage.p.rapidapi.com/query',
              params: {
                function: 'TIME_SERIES_DAILY',
                symbol: `${state.searchSymbol}`,
                outputsize: '30',
                datatype: 'json'
              },
              headers: {
                'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
                'x-rapidapi-key': state.API
              }
            };
            
            await axios.request(daily_options).then(function (response) { 
              let data = response.data["Time Series (Daily)"]
              let list=[]
              Object.keys(data).forEach(item=>{
                  let obj = new Object({
                      date:item,
                      open:data[item]["1. open"],
                      close:data[item]["4. close"],
                      high:data[item]["2. high"],
                      low:data[item]["3. low"],
                      volume:data[item]["5. volume"]
                  })
                  list.push(obj)
              })
  
              commit("setData",list.slice(0,30))
  
            }).catch(function (error) {
              console.error(error);
            });
            break;
          }
  
          case "weekly":{
            
            const weekly_options = {
              method: 'GET',
              url: 'https://alpha-vantage.p.rapidapi.com/query',
              params: {function: 'TIME_SERIES_WEEKLY', symbol: `${state.searchSymbol}`, datatype: 'json'},
              headers: {
                'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
                'x-rapidapi-key': state.API
              }
            };
            
            axios.request(weekly_options).then(function (response) {
              let data = response.data["Weekly Time Series"]
              let list=[]
              Object.keys(data).forEach(item=>{
                  let obj = new Object({
                      date:item,
                      open:data[item]["1. open"],
                      close:data[item]["4. close"],
                      high:data[item]["2. high"],
                      low:data[item]["3. low"],
                      volume:data[item]["5. volume"]
                  })
                  list.push(obj)
              })
              
              commit("setData",list.slice(0,30))
  
            }).catch(function (error) {
              console.error(error);
            });  
  
            break;
          }
  
          case "monthly":{
            
            const montly_options = {
              method: 'GET',
              url: 'https://alpha-vantage.p.rapidapi.com/query',
              params: {symbol: `${state.searchSymbol}`, function: 'TIME_SERIES_MONTHLY', datatype: 'json'},
              headers: {
                'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
                'x-rapidapi-key': state.API
              }
            };
            
            axios.request(montly_options).then(function (response) {
              let data = response.data["Monthly Time Series"]
              let list=[]
              Object.keys(data).forEach(item=>{
                  let obj = new Object({
                      date:item,
                      open:data[item]["1. open"],
                      close:data[item]["4. close"],
                      high:data[item]["2. high"],
                      low:data[item]["3. low"],
                      volume:data[item]["5. volume"]
                  })
                  list.push(obj)
              })
              
              commit("setData",list.slice(0,13))
  
            }).catch(function (error) {
              console.error(error);
            });
  
            break;
          }
  
          default:{
  
            let default_options = {
              method: 'GET',
              url: 'https://alpha-vantage.p.rapidapi.com/query',
              params: {
                function: 'TIME_SERIES_DAILY',
                symbol: `${state.searchSymbol}`,
                outputsize: '30',
                datatype: 'json'
              },
              headers: {
                'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
                'x-rapidapi-key': state.API
              }
            };
            
            await axios.request(default_options).then(function (response) { 
              let data = response.data["Time Series (Daily)"]
              let list=[]
              Object.keys(data).forEach(item=>{
                  let obj = new Object({
                      date:item,
                      open:data[item]["1. open"],
                      close:data[item]["4. close"],
                      high:data[item]["2. high"],
                      low:data[item]["3. low"],
                      volume:data[item]["5. volume"]
                  })
                  list.push(obj)
              })
  
              commit("setData",list.slice(0,30))
  
            }).catch(function (error) {
              console.error(error);
            });
  
            break;
          }
        }
      }
    },

    getSymbolbyName({commit,state}){
      const options = {
        method: 'GET',
        url: 'https://alpha-vantage.p.rapidapi.com/query',
        params: {keywords: `${state.searchCompany}`, function: 'SYMBOL_SEARCH', datatype: 'json'},
        headers: {
          'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
          'x-rapidapi-key': 'cc7a52ffb5msha38b3d0953d7f6ep197d81jsn227207fde546'
        }
      };
      
      axios.request(options).then(function (response) {
        let data = response.data["bestMatches"]
        let list=[]
        data.forEach(item=>{
            let obj = new Object({
                text:item["2. name"],
                value:item["1. symbol"]
            })
            list.push(obj)
        })

        commit("setFoundCompanies",list)
      }).catch(function (error) {
        console.error(error);
      });
    }

  },
  modules: {
  }
})
