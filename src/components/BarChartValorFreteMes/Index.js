import {useEffect,useState,useContext} from "react";
import * as d3 from 'd3';
import './style_valor.css';
import api from "../../Service/Api";
import {Context} from "../../Context/AuthContext";
import {verifyMonth} from "../../utils/ConvertDate";

function BarchartValorFretesMes(props){

    const { validarTempoTOKEN } = useContext(Context);
    const [messageError,setMessageError] = "";

    async function handleQntdFretesMes(){
        validarTempoTOKEN();
        await api.get(`/dashboard/valor/${props.ano}`)
        .then((response)=>{
            const data = response.data;
            const dataArray = [];
            for(let i=0;i<data.length;i++){
                let mes = data[i]["mes"];
                let quantidade = (data[i]["valor"])/1000;
                dataArray.push({"mes":verifyMonth(mes),"valor":(parseFloat(quantidade).toFixed(3))});
            }
            createChart(dataArray);
        }).catch((err)=>{
            try{
                setMessageError(err.response.data);
                alert(messageError);
            }catch(error){
                alert(error);
            }
        })

    }

    function clearChart(){
        d3.select('#chart-container-valor').selectChildren().remove();
    }

    const  createChart=(datas)=>{

        //FUNCAO QUE REMOVE TODOS OS ELEMENTOS DA DIV PARA NAO SE REPETIREM
        clearChart();

        //DEFININDO A DIV 
        const svg = d3.select('#chart-container-valor').append("svg")
        .attr('width',props.width)
        .attr('height',props.height);

        //CRIANDO O GRÁFICO
        const chart = svg.append('g').attr('transform',`translate(30,5)`);

        //DEFININDO TAMANHO E ELEMENTOS DO EIXO X
        const xAxis = d3.scaleBand()
            .range(props.xRange)
            .domain(datas.map((data)=>data.mes))
            .padding(0.4)

        //DEFININDO TAMANHO E ELEMENTOS DO EIXO Y
        const yAxis = d3.scaleLinear()
        .range(props.yRange)
        .domain(props.yDomain)

        //COLOCANDO ELEMENTOS DO EIXO Y NO GRAFICO
        chart.append('g').call(d3.axisLeft(yAxis));

        //COLOCANDO ELEMENTOS DO EIXO X NO GRAFICO
        chart.append('g').attr('transform',`translate(0,${props.yRange[0]})`)
        .call(d3.axisBottom(xAxis));

        // Linhas na vertical
        chart.append('g')
            .attr('class', 'grid')
            .attr('y1', 0)
            .attr('y2', props.height)
            .call(d3.axisBottom()
                .scale(xAxis)
                .tickSize(props.height - 110, 0, 0)
                .tickFormat(''));

        // Linhas na horizontal
        chart.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft()
                .scale(yAxis)
                .tickSize(-props.width, 0, 0)
                .tickFormat(''));

        //CRIANDO AS BARRAS
        chart.selectAll()
            .data(datas)
            .enter()
            .append('rect')
            .attr('x', (s) => xAxis(s.mes))
            .attr('y', (s) => yAxis(s.valor))
            .attr('height', (s) => props.height - yAxis(s.valor) - 30)
            .attr('width', xAxis.bandwidth());

        //COLOCANDO  OS VALORES DE CADA BARRA
        chart.selectAll()
            .data(datas)
            .enter()
            .append('text')
            .attr('class', 'value')
            .attr('x', (a) => xAxis(a.mes) + xAxis.bandwidth() / 2)
            .attr('y', (a) => yAxis(a.valor) + 30)
            .attr('text-anchor', 'middle')
            .text((a) => a.valor);
        }

        useEffect(()=>{
            handleQntdFretesMes();
            // setInterval(createChart(dataQntd,2000));
        },[props.ano])
        // createChart(dataQntd);
        return (
             <div id="chart-container-valor"/>
        )
    }

export  default BarchartValorFretesMes;