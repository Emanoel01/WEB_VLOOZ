import {useState,useEffect,useContext} from "react";
import {dateToString} from "../../utils/ConvertDate";
import api from "../../Service/Api";
import DefaultPage from "../../components/Defaultpage/Index";
import CustomListItem from "../../components/CustomListItem/Index";
import CustomModal from "../../components/CustomModal/Index";
import "./style.css";
import "../../default.css";
import {Context} from "../../Context/AuthContext";

function TaxaValorQuilometro(){

    const [listTaxas,setListTaxas] = useState([]);
    const [nomeTaxa,setNomeTaxa] = useState("");
    const [porcentagem,setPorcentagem] = useState(0.0);
    const [open,setOpen]  = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const {validarTempoTOKEN} = useContext(Context);

    async function loadTaxasKm(){

        validarTempoTOKEN();

        await api.get("/taxaValorQuilometro")
        .then((response)=>{
            setListTaxas(response.data);
            console.log(response.data);
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }

    async function cadastrarTaxaKm(){

        validarTempoTOKEN();

        await api.post("/taxaValorQuilometro",{
            nome:nomeTaxa,
            porcentagem
        }).then((response)=>{
            loadTaxasKm();
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }

    function handleOpen(){
        setOpen(true);
    }

    function handleClose(){
        setOpen(false);
    }

    useEffect(()=>{
        loadTaxasKm();
    },[])

    async function deleteTaxaKm(id){

        validarTempoTOKEN();

        await api.delete(`/taxaValorQuilometro/${id}`)
        .then((response)=>{
            loadTaxasKm();
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }

    return (
        <DefaultPage>
            <CustomModal
                handleOpen={handleOpen}
                handleClose={handleClose}
                open={open}
                classNameForm="form_taxa_valor_km"
                submitFunction={cadastrarTaxaKm}
                title="Cadastro Taxa Valor Km">

                    <input type="text" required 
                    placeholder="nome taxa"
                    onChange={e=>setNomeTaxa(e.target.value)}/>

                    <input type="number" required
                    placeholder="porcentagem" 
                    onChange={e=>setPorcentagem(e.target.value)}
                    step="0.0010"/>

                    <button type="submit">
                        Salvar
                    </button>

            </CustomModal>

            <ul className="lista">
                {listTaxas.map((taxaValorQuilometro)=>(
                    <CustomListItem
                        idItem={taxaValorQuilometro.idTaxaValorQuilometro}
                        buttonTitle="deletar"
                        buttonType="delete"
                        buttonFunction={deleteTaxaKm}>

                            <div className="item_data_taxa_km">
                                <p className="titulo_dado">Nome Taxa:</p>
                                <p className="data">{taxaValorQuilometro.nome}</p>
                            </div>
                            <div className="item_data_taxa_km">
                                <p className="titulo_dado">Porcentagem:</p>
                                <p className="data">{taxaValorQuilometro.porcentagem}</p>
                            </div>
                            <div className="item_data_taxa_km">
                                <p className="titulo_dado">Criado Em:</p>
                                <p className="data">{dateToString(taxaValorQuilometro.criadoEm)}</p>
                            </div>
                            <div className="item_data_taxa_km">
                                <p className="titulo_dado">Atualizado Em:</p>
                                <p className="data">{dateToString(taxaValorQuilometro.atualizadoEm)}</p>
                            </div>

                    </CustomListItem>
                ))}
            </ul>

        </DefaultPage>
    )
}

export default TaxaValorQuilometro;