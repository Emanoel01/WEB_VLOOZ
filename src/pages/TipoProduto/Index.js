import {useState,useEffect,useContext} from "react";
import "./style.css";
import "../../default.css";
import api from "../../Service/Api";
import { dateToString } from "../../utils/ConvertDate";
import DefaultPage from "../../components/Defaultpage/Index";
import CustomModal from "../../components/CustomModal/Index";
import CustomListItem from "../../components/CustomListItem/Index";
import {Context} from "../../Context/AuthContext";

function TipoProduto(){
    const [listTipoProduto,setListTipoProduto] = useState([]);
    const [tipoProduto,setTipoProduto] = useState("");
    const [open,setOpen] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const {validarTempoTOKEN} = useContext(Context);

    function handleOpen(){
        setOpen(true);
    }

    function handleClose(){
        setOpen(false);
    }

    async function loadTipoProduto(){

        validarTempoTOKEN();

        await api.get("/tipoProduto")
        .then((response)=>{
            console.log(response.data);
            setListTipoProduto(response.data);
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }

    async function cadastrarTipoProduto(){

        validarTempoTOKEN();

        await api.post("/tipoProduto",{
            tipoProduto
        }).then((response)=>{
            loadTipoProduto();
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }


    async function deleteTipoProduto(id){

        validarTempoTOKEN();

        await api.delete(`/tipoProduto/${id}`)
        .then((response)=>{
            loadTipoProduto();
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }

    useEffect(()=>{
        loadTipoProduto();
    },[])
    return (
        <DefaultPage>
            <CustomModal 
                handleOpen={handleOpen}
                handleClose={handleClose}
                open={open}
                classNameForm="form_tipo_produto"
                submitFunction={cadastrarTipoProduto}
                title="Cadastro Tipo de Produto">

                <input type="text" required
                placeholder="Tipo Produto"
                onChange={e=>setTipoProduto(e.target.value)}/>

                <button type="submit" >
                    Salvar
                </button>
            </CustomModal>

            <ul className="lista">
                {listTipoProduto.map((tipoProduto)=>(
                    <CustomListItem 
                        idItem={tipoProduto.idTipoProduto}
                        buttonTitle="deletar"
                        buttonType="delete"
                        buttonFunction={deleteTipoProduto}>
                            <div className="item_data_tipo_produto">
                                <p className="titulo_dado">Nome Taxa Produto:</p>
                                <p className="data">{tipoProduto.tipoProduto}</p>
                            </div>
                            <div className="item_data_tipo_produto">
                                <p className="titulo_dado">Criado Em:</p>
                                <p className="data">{dateToString(tipoProduto.criadoEm)}</p>
                            </div>
                            <div className="item_data_tipo_produto">
                                <p className="titulo_dado">Atualizado Em:</p>
                                <p className="data">{dateToString(tipoProduto.atualizadoEm)}</p>
                            </div>

                    </CustomListItem>
                ))}
            </ul>

        </DefaultPage>
    )
}

export default TipoProduto;