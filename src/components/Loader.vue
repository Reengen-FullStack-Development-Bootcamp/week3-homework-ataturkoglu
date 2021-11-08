<template>
  <div class="loader">
    <span class="loader-block"></span>
    <span class="loader-block"></span>
    <span class="loader-block"></span>
    <span class="loader-block"></span>
    <span class="loader-block"></span>
    <span class="loader-block"></span>
    <span class="loader-block"></span>
    <span class="loader-block"></span>
    <span class="loader-block"></span>
    </div>
</template>

<script>
export default {
    methods:{
        loader(){
        let list = document.getElementsByClassName("loader-block")
        //let delay = 0

        for (let index = 0; index < list.length; index++) {
            list[index].style.background=`rgb(${Math.floor(Math.random()*120)},${Math.floor(Math.random()*120)},${Math.floor(Math.random()*120)})`
            list[index].style.animationDelay=(Math.random())+"s"
            //delay+=0.3
        }

        }
    },
    mounted(){
        this.loader()
    }
}
</script>

<style>
    .loader {
        position: absolute;
        top:25%;
        left: 45%;
        width: 10.4vw;
        height: 10.4vw;
        margin: auto;
        margin-top: 10vh;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        z-index: 100;
    }

    .loader-block {
        position: relative;
        width: 3vw;
        height: 3vw;
        margin: .2vw;
        opacity: 0;
        background: rgb(90, 90, 125);
        animation: show 1s alternate infinite;
    }

    @keyframes show {
        0%{
            opacity: 0;
        }
        100%{
            opacity: 1;
        }
    }
</style>