import {useState,useEffect,useContext} from "react";
import DefaultPage from "../../components/Defaultpage/Index";
import { dateToString } from "../../utils/ConvertDate";
import CustomModal from "../../components/CustomModal/Index";
import CustomListItem from "../../components/CustomListItem/Index";
import api from "../../Service/Api";
import "./style.css";
import "../../default.css";
import {Context} from "../../Context/AuthContext";

function Frete(){
        const [open,setOpen] = useState(false);
        const [fretes,setFretes] = useState([]);
        const [messageError,setMessageError] = useState("");
        const {validarTempoTOKEN} = useContext(Context);
        const [valorFrete,setValorFrete] = useState(0.0);
        const [kmTotal,setKmTotal] = useState(0.0);
        const [tempoViagem,setTempoViagem] = useState(0);
        const [locais,setLocais] = useState([]);
        const [produtos,setProdutos] = useState([]);
        const [tipoVeiculo,setTipoVeiculo] = useState("");


        function handleOpen(){
            setOpen(true);
        }
    
        function handleClose(){
            setOpen(false);
        }

        async function handleFretes(){
            validarTempoTOKEN();
            await api.get("/frete")
            .then((response)=>{
                setFretes(response.data);
                console.log("Fretes", response.data);
            }).catch((err)=>{
                try{
                    setMessageError(err.response.data["Error"]);
                    alert(messageError);
                }catch(error){
                    alert(error);
                }
            })
        }

        async function handleParadasFrete(id){
            validarTempoTOKEN();
            await api.get(`/freteParada/frete/${id}`)
            .then((response)=>{
                setLocais(response.data);
                console.log("Locais",response.data);
            }).catch((err)=>{
                try{
                    setMessageError(err.response.data["Error"]);
                    alert(messageError);
                }catch(error){
                    alert(error);
                }
            })
        }

        async function handleProdutos(id){
            validarTempoTOKEN();
            await api.get(`/especificacaoProduto/frete/${id}`)
            .then((response)=>{
                setProdutos(response.data);
                console.log("produtos",response.data);
            }).catch((err)=>{
                try{
                    setMessageError(err.response.data["Error"]);
                    alert(messageError);
                }catch(error){
                    alert(error);
                }
            })
        }

        useEffect(()=>{
            handleFretes();
        },[])

    return (
        <DefaultPage>
            <CustomModal
                hiddenButton={1}
                title="Informações Frete"
                open={open}
                handleClose={handleClose}
                classNameForm="form_frete">

                    <input type="text" readOnly={true}
                    value={`Valor: R$ ${valorFrete}`}/>

                    <input type="text" readOnly={true}
                    value={`Distância: ${kmTotal} KM`}/>

                    <input type="text" readOnly={true}
                    value={`Duração: ${tempoViagem} min`}/>

                    <input type="text" readOnly ={true}
                    value={`Tipo de Veículo Necessário: ${tipoVeiculo}`}/>

                    {locais.map((local)=>(
                        <div className="locais" key={local.idParada}>
                                <h3>PONTO DE PARADA:</h3>
                            <p> <span className="titulo_pontos_parada">***Origem:</span> {local.idParada.localOrigem}</p>
                            <p> <span className="titulo_pontos_parada">***Destino:</span> {local.idParada.localDestino}</p>
                        </div>
                    ))}

                    {produtos.map((produto)=>(
                        <div className="produtos" key={produto.idEspecificacaoProdutos}>
                                <h3>Produto</h3>
                            <u>
                                <li className="item_lista_produto"><span className="titulo_pontos_parada">Descrição: </span> {produto.descricaoProduto}</li>
                                <li className="item_lista_produto"><span className="titulo_pontos_parada">Valor: </span>R${produto.valorTotalProduto}</li>
                                <li className="item_lista_produto"><span className="titulo_pontos_parada">Tipo Produto: </span> {produto.idTipoProduto.tipoProduto}</li>
                                <li className="item_lista_produto"><span className="titulo_pontos_parada">Quantidade: </span> {produto.qntdProduto} unidades</li>
                                <li className="item_lista_produto"><span className="titulo_pontos_parada">Cubagem Total Produto: </span>{produto.cubagemTotalProduto} m3</li>
                                <li className="item_lista_produto"><span className="titulo_pontos_parada">Peso:</span> {produto.pesoProduto} KG</li>
                            </u>
                        </div>
                    ))}


            </CustomModal>

            <ul className="lista">
                {fretes.map((frete)=>(
                    <CustomListItem
                        idItem={frete.idFrete}
                        hiddenButton={1}>
                            <div className="item_data_frete">
                                <p className="titulo_dado">Valor Frete</p>
                                <p className="data">R$ {parseFloat(frete.valorTotal.toFixed(2))}</p>
                            </div>
                            <div className="item_data_frete">
                                <p className="titulo_dado">Distância:</p>
                                <p className="data">{parseFloat(frete.distanciaTotal.toFixed(2))} KM</p>
                            </div>
                            <div className="item_data_frete">
                                <p className="titulo_dado">Tempo viagem:</p>
                                <p className="data">{frete.tempoViagem} minutos</p>
                            </div>
                            <div className="item_data_frete">
                                <p className="titulo_dado">Data Entrega:</p>
                                <p className="data">{dateToString(frete.dataEntrega)}</p>
                            </div>
                            <div className="item_data_frete">
                                <button className="button_atualizar" onClick={(e)=>{
                                    setKmTotal(parseFloat(frete.distanciaTotal.toFixed(2)))
                                    setValorFrete(frete.valorTotal.toFixed(2));
                                    setTempoViagem(frete.tempoViagem);
                                    setTipoVeiculo(frete.idTipoVeiculo.tipoVeiculo);
                                    handleParadasFrete(frete.idFrete);
                                    handleProdutos(frete.idFrete);
                                    handleOpen();
                                }}>
                                    Vizualizar
                                </button>
                            </div>
                    </CustomListItem>
                ))}
            </ul>

        </DefaultPage>
    )
}

export default Frete;