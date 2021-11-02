import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchCompany:null,
    searchSymbol:null,
    foundCompanies:null,
    companyData:null,
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
    async getDailyData({commit,state}){
      const options = {
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
          'x-rapidapi-key': 'cc7a52ffb5msha38b3d0953d7f6ep197d81jsn227207fde546'
        }
      };
      
      await axios.request(options).then(function (response) { 
        let data = response.data["Time Series (Daily)"]
        let list=[]
        Object.keys(data).forEach(item=>{
            let obj = new Object({
                date:item,
                open:data[item]["1. open"],
                close:data[item]["4. close"],
                high:data[item]["2. high"],
                low:data[item]["3. low"]
            })
            list.push(obj)
        })
        if(list.length>0) console.log("Daily coming")
        commit("setData",list.slice(0,30))
      }).catch(function (error) {
        console.error(error);
      });
    },

    async getWeeklyData({commit}){
      const options = {
        method: 'GET',
        url: 'https://alpha-vantage.p.rapidapi.com/query',
        params: {function: 'TIME_SERIES_WEEKLY', symbol: 'MSFT', datatype: 'json'},
        headers: {
          'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
          'x-rapidapi-key': 'cc7a52ffb5msha38b3d0953d7f6ep197d81jsn227207fde546'
        }
      };
      
      axios.request(options).then(function (response) {
        let data = response.data["Weekly Time Series"]
        let list=[]
        Object.keys(data).forEach(item=>{
            let obj = new Object({
                date:item,
                open:data[item]["1. open"],
                close:data[item]["4. close"],
                high:data[item]["2. high"],
                low:data[item]["3. low"]
            })
            list.push(obj)
        })
        if(list.length>0) console.log("Weekly coming")
        
        commit("setData",list.slice(0,30))
      }).catch(function (error) {
        console.error(error);
      });
    },

    async getMonthlyData({commit}){
      const options = {
        method: 'GET',
        url: 'https://alpha-vantage.p.rapidapi.com/query',
        params: {symbol: 'MSFT', function: 'TIME_SERIES_MONTHLY', datatype: 'json'},
        headers: {
          'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
          'x-rapidapi-key': 'cc7a52ffb5msha38b3d0953d7f6ep197d81jsn227207fde546'
        }
      };
      
      axios.request(options).then(function (response) {
        let data = response.data["Monthly Time Series"]
        let list=[]
        Object.keys(data).forEach(item=>{
            let obj = new Object({
                date:item,
                open:data[item]["1. open"],
                close:data[item]["4. close"],
                high:data[item]["2. high"],
                low:data[item]["3. low"]
            })
            list.push(obj)
        })
        if(list.length>0) console.log("Weekly coming")
        
        commit("setData",list.slice(0,13))
      }).catch(function (error) {
        console.error(error);
      });
    },

    getDatabyName({commit,state}){
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
        console.log("store",list);
      }).catch(function (error) {
        console.error(error);
      });
    }

  },
  modules: {
  }
})
