import {useState,useEffect,useContext} from "react";
import DefaultPage from "../../components/Defaultpage/Index";
import CustomModal from "../../components/CustomModal/Index";
import CustomListItem from "../../components/CustomListItem/Index";
import {dateToString} from "../../utils/ConvertDate";
import api from "../../Service/Api";
import "../../default.css";
import "./style.css";
import {Context} from "../../Context/AuthContext";

function TaxaValorProduto(){

    const [listTaxas,setListTaxas] = useState([]);
    const [taxa,setTaxa] = useState("");
    const [porcentagem,setPorcentagem] = useState(0.0);
    const [open,setOpen] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const {validarTempoTOKEN} = useContext(Context);

    function handleOpen(){
        setOpen(true);
    }

    function handleClose(){
        setOpen(false);
    }

    async function loadTaxas(){

        validarTempoTOKEN();

        await api.get("/taxaProduto")
        .then((response)=>{
            console.log(response.data);
            setListTaxas(response.data);
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }

    async function cadastrarTaxaProduto(){

        validarTempoTOKEN();

        await api.post("/taxaProduto",{
            nome:taxa,
            porcentagem
        }).then((response)=>{
            loadTaxas();
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }


    async function deleteTaxaProduto(id){

        validarTempoTOKEN();

        await api.delete(`/taxaProduto/${id}`)
        .then((response)=>{
            loadTaxas();
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
        loadTaxas();
    },[])


    return (
        <DefaultPage>
            <CustomModal
                handleOpen={handleOpen}
                handleClose={handleClose}
                open={open}
                classNameForm="form_taxa_produto"
                submitFunction={cadastrarTaxaProduto}
                title="Cadastro de Taxa do Valor do Produto">

                <input type="text" required
                placeholder="nome taxa"
                onChange={e=>setTaxa(e.target.value)}/>

                <input type="number" required
                placeholder="porcentagem"
                onChange={e=>setPorcentagem(e.target.value)}
                step="0.010"
                />

                <button type="submit">
                    Salvar
                </button>
            </CustomModal>

            <ul className="lista">
                {listTaxas.map((taxaValorProduto)=>(
                    <CustomListItem 
                        idItem={taxaValorProduto.idTaxaValorProduto}
                        buttonType="delete"
                        buttonTitle="deletar"
                        buttonFunction={deleteTaxaProduto}>
                            <div className="item_data_taxa_produto">
                                <p className="titulo_dado">Nome Taxa Produto:</p>
                                <p className="data">{taxaValorProduto.nome}</p>
                            </div>
                            <div className="item_data_taxa_produto">
                                <p className="titulo_dado">Porcentagem:</p>
                                <p className="data">{taxaValorProduto.porcentagem}</p>
                            </div>
                            <div className="item_data_taxa_produto">
                                <p className="titulo_dado">Criado Em:</p>
                                <p className="data">{dateToString(taxaValorProduto.criadoEm)}</p>
                            </div>
                            <div className="item_data_taxa_produto">
                                <p className="titulo_dado">Atualizado Em:</p>
                                <p className="data">{dateToString(taxaValorProduto.atualizadoEm)}</p>
                            </div>

                    </CustomListItem>
                ))}
            </ul>
        </DefaultPage>
    )
}

export default TaxaValorProduto;