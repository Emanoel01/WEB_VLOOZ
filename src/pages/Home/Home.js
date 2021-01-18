import "./style.css";
import api from "../../Service/Api";
import {useState,useContext,useEffect} from "react";
import {Context} from "../../Context/AuthContext";
import {getYear} from "../../utils/ConvertDate";
import DefaultPage from "../../components/Defaultpage/Index";
import BarchartQntdFretesMes from "../../components/BarChartQntdFretesMes/Index";
import BarchartValorFretesMes from "../../components/BarChartValorFreteMes/Index";


function Home (){

    const {validarTempoTOKEN} = useContext(Context);
    const [ano,setAno] = useState(0);
    const [anos,setAnos] = useState([]);

    async function getYears(){
        validarTempoTOKEN();

        await api.get("/dashboard/anos")
        .then((response)=>{
            setAnos(response.data);
        }).catch((err)=>{
            alert(err);
        })
    }

    useEffect(()=>{
        setAno(getYear());
        getYears();
    },[]);

    return(
        <DefaultPage>
            <h1 className="titulo_dashboard">Análise de Frete</h1>
                <br/><br/>
            <div className="div_select_qntd">
                {/* <p>Escolha um ano :</p> */}
                <select className="select_qntd" onChange={(e)=>{
                    setAno(e.target.value);
                }}>
                    <option value={0}>Selecione o ano</option>
                    {anos.map((ano)=>(
                        <option key={ano} value={ano}>{ano}</option>
                    ))}
                </select>
            </div>
            <h2>Quantidade de Fretes Solicitados por mês no ano de : {ano}</h2>
            <BarchartQntdFretesMes
                width="700"
                height="420"
                xRange={[0,700]}
                yRange={[390,0]}
                yDomain={[0,10]}
                ano={ano}>
            </BarchartQntdFretesMes>

            <br/><br/>

            <h2>Valor total dos Fretes Solicitados por mês no ano de: {ano}</h2>
            <BarchartValorFretesMes
                width="700"
                height="420"
                xRange={[0,700]}
                yRange={[390,0]}
                yDomain={[0,10]}
                ano={ano}>
            </BarchartValorFretesMes>
        </DefaultPage>
    )
}

export default Home;