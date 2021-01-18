import {useState,useEffect,useContext} from "react";
import DefaultPage from "../../components/Defaultpage/Index";
import { dateToString } from "../../utils/ConvertDate";
import CustomModal from "../../components/CustomModal/Index";
import CustomListItem from "../../components/CustomListItem/Index";
import api from "../../Service/Api";
import "./style.css";
import "../../default.css";
import {Context} from "../../Context/AuthContext";
function Imposto (){

    const [open,setOpen] = useState(false);
    const [imposto,setImposto] = useState("");
    const [porcentagem,setPorcentagem] = useState(0.0);
    const [listImpostos,setListImpostos] = useState([]);
    const [messageError,setMessageError] = useState("");
    const {validarTempoTOKEN} = useContext(Context);

    function handleOpen(){
        setOpen(true);
    }

    function handleClose(){
        setOpen(false);
    }

    async function loadImpostos(){

        validarTempoTOKEN();

        await api.get("/imposto")
        .then((response)=>{
            setListImpostos(response.data);
            console.log(response.data);
        }).catch((Error)=>{
            try{
                setMessageError(Error.response.data["Error"]);
                alert(messageError);
            }catch(error){
                alert(error);
            }
        })
    }

    async function cadastrarImposto(){

        validarTempoTOKEN();

        await api.post("/imposto",{
            nome:imposto,
            porcentagem
        }).then((response)=>{
            loadImpostos();
        }).catch((err)=>{
            try{
                setMessageError(err.response.data["Error"]);
                alert(messageError);
            }catch(error){
                alert(error);
            }
        })
    }

    async function deleteImposto(id){

        validarTempoTOKEN();

        await api.delete(`/imposto/${id}`)
        .then((response)=>{
            loadImpostos();
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
        loadImpostos();
    },[]);


    return (
        <DefaultPage>
            <CustomModal
                handleOpen={handleOpen}
                handleClose={handleClose}
                open={open}
                classNameForm="form_imposto"
                submitFunction={cadastrarImposto}
                title="Cadastro De Imposto">

                    <input type="text" required 
                    placeholder="imposto"
                    onChange={e=>setImposto(e.target.value)} />

                    <input type="number" required
                    step="0.010" placeholder="porcentagem"
                    onChange={e=>setPorcentagem(e.target.value)} 
                    maxLength={4}/>

                    <button type="submit">
                        Salvar
                    </button>
            </CustomModal>

            <ul className="lista">
                {listImpostos.map((imposto)=>(
                    <CustomListItem
                        idItem={imposto.idImposto}
                        buttonTitle="deletar"
                        buttonType="delete"
                        buttonFunction={deleteImposto}>
                            <div className="item_data_imposto">
                                <p className="titulo_dado">Nome Imposto:</p>
                                <p className="data">{imposto.nome}</p>
                            </div>
                            <div className="item_data_imposto">
                                <p className="titulo_dado"> Porcentagem: </p>
                                <p className="data">{imposto.porcentagem}</p>
                            </div>
                            <div className="item_data_imposto">
                                <p className="titulo_dado">Criado Em:</p>
                                <p className="data">{dateToString(imposto.criadoEm)}</p>
                            </div>
                            <div className="item_data_imposto">
                                <p className="titulo_dado">Atualizado Em:</p>
                                <p className="data">{dateToString(imposto.atualizadoEm)}</p>
                            </div>
                    </CustomListItem>
                ))}
            </ul>
        </DefaultPage>
    )
}

export default Imposto;