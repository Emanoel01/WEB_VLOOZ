import "./style.css";
import "../../default.css";
import api from "../../Service/Api";
import {useEffect,useState,useContext} from "react";
import {dateToString} from "../../utils/ConvertDate";
import { Modal } from "@material-ui/core";
import DefaultPage from "../../components/Defaultpage/Index";
import CustomListItem from "../../components/CustomListItem/Index";
import {Context} from "../../Context/AuthContext";


function FaixaPreco (){

    const [faixasPrecos,setFaixasPrecos] = useState([]);
    const [tipoVeiculos,setTipoVeiculos] = useState([]);
    const [open,setOpen] = useState(false);
    const [idTipoVeiculo,setIdTipoVeiculo] = useState(0);
    const [quilometragemMaxima,setQuilometragemMaxima] = useState(0.0);
    const [quilometragemMinima,setQuilometragemMinima] = useState(0.0);
    const [valor,setvalor] = useState(0.0);
    const [errorMessage,setErrorMessage] = useState("");
    const {validarTempoTOKEN} = useContext(Context);

    function handleOpen(){
        setOpen(true);
    }

    function handleClose(){
        setOpen(false);
    }

    async function loadFaixasPrecos(){

        validarTempoTOKEN();

        await api.get("/faixaPrecoTipoVeiculo")
        .then((response)=>{
            console.log(response.data);
            setFaixasPrecos(response.data);
        }).catch((err)=>{
             try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
             }catch(error){
                alert(error);
             }
        })
    }

    async function deleteFaixaPreco(id){

        validarTempoTOKEN();

        await api.delete(`/faixaPrecoTipoVeiculo/${id}`)
        .then((response)=>{
            loadFaixasPrecos();
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }

    async function loadTipoVeiculos(){

        validarTempoTOKEN();

        await api.get("/tipoVeiculo")
        .then((response)=>{
            console.log(response.data);
            setTipoVeiculos(response.data);
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }

    async function filterFaixaPrecoByTipoVeiculo(id){

        validarTempoTOKEN();

        if(id===-1){
            loadFaixasPrecos();
        }else{
            await api.get(`/faixaPrecoTipoVeiculo/tipoVeiculo/${id}`)
            .then((response)=>{
                setFaixasPrecos(response.data);
            }).catch((err)=>{
                try{
                    setErrorMessage(err.response.data["Error"]);
                    alert(errorMessage);
                }catch(error){
                    alert(error);
                }
            })
        }
    }

    async function cadastrarFaixaPreco (e){

        validarTempoTOKEN();

        e.preventDefault();
        await api.post("/faixaPrecoTipoVeiculo",{
            idTipoVeiculo:{
                idTipoVeiculo:idTipoVeiculo
            },
            quilometragemMaxima,
            quilometragemMinima,
            valor
        })
        .then((response)=>{
            loadFaixasPrecos();
            handleClose();
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }finally{
                handleClose();
            }
        })
    }

    useEffect(()=>{
        loadFaixasPrecos();
        loadTipoVeiculos();
    },[])

    return(
        <DefaultPage>
            <div className="content_save_and_search">
                    <select
                        className="filter"
                        name="tipoVeiculos"
                        onChange={(e)=>filterFaixaPrecoByTipoVeiculo(e.target.value)}>
                        <option value={-1} onSelect={loadFaixasPrecos}>Todos</option>
                        {tipoVeiculos.map((tipoVeiculo)=>(
                            <option value={tipoVeiculo.idTipoVeiculo} key={tipoVeiculo.idTipoVeiculo}>
                                {tipoVeiculo.tipoVeiculo}
                            </option>
                        ))}
                    </select>
                    <button className="add" onClick={handleOpen}>
                        Adicionar
                    </button>

                    <Modal
                    open={open}
                    onClose={handleClose}>
                        <form action="" className="form_modal_faixa_preco" onSubmit={cadastrarFaixaPreco}>
                            <div className="content_modal">
                                <h3>Cadastro de Faixa de Preço</h3>
                                <select required className="select" onChange={(e)=>setIdTipoVeiculo(e.target.value)}>
                                    {tipoVeiculos.map((tipoVeiculo)=>(
                                        <option value={tipoVeiculo.idTipoVeiculo} key={tipoVeiculo.idTipoVeiculo}>
                                            {tipoVeiculo.tipoVeiculo}
                                        </option>
                                    ))}
                                </select>
                                <input type="number" 
                                required={true} placeholder="Quilometragem Máxima"
                                step="0.010"
                                onChange={(e)=>setQuilometragemMaxima(e.target.value)}/>

                                <input type="number" required placeholder="Quilometragem Mínima"
                                step="0.010"
                                onChange={(e)=>setQuilometragemMinima(e.target.value)}/>

                                <input type="number" required placeholder="Valor"
                                step="0.010"
                                onChange={(e)=>setvalor(e.target.value)}/>
                                
                                <button type="submit">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </Modal>
               </div>


               <ul className="lista">

                {faixasPrecos.map((faixaPreco)=>(
                        <CustomListItem 
                        idItem={faixaPreco.idFaixaPrecoTipoVeiculo}
                        buttonTitle="deletar"
                        buttonType="delete"
                        buttonFunction={deleteFaixaPreco}>

                            <div className="data_faixa_preco">
                                <p className="titulo_dado">Tipo Veículo:</p>
                                <p className="data">{faixaPreco.idTipoVeiculo.tipoVeiculo}</p>
                            </div>
                            <div className="data_faixa_preco">
                                <p className="titulo_dado">KM Mínimo:</p>
                                <p className="data">{faixaPreco.quilometragemMinima} KM</p>
                            </div>
                            <div className="data_faixa_preco">
                                <p className="titulo_dado">KM Máximo:</p>
                                <p className="data">{faixaPreco.quilometragemMaxima} KM</p>
                            </div>
                            <div className="data_faixa_preco">
                                <p className="titulo_dado">Valor:</p>
                                <p className="data">R$ {faixaPreco.valor}</p>
                            </div>
                            <div className="data_faixa_preco">
                                <p className="titulo_dado">Criado Em:</p>
                                <p className="data">{dateToString(faixaPreco.criadoEm)}</p>
                            </div>
                            <div className="data_faixa_preco">
                                <p className="titulo_dado">Atualizado Em:</p>
                                <p className="data">{dateToString(faixaPreco.atualizadoEm)}</p>
                            </div>
                        </CustomListItem>
                    ))}

               </ul>
        </DefaultPage>
    )
}

export default FaixaPreco;