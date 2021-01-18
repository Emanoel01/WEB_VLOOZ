import {useState,useEffect,useContext} from "react";
import DefaultPage from "../../components/Defaultpage/Index";
import { dateToString } from "../../utils/ConvertDate";
import CustomModal from "../../components/CustomModal/Index";
import CustomListItem from "../../components/CustomListItem/Index";
import api from "../../Service/Api";
import "./style.css";
import "../../default.css";
import {Context} from "../../Context/AuthContext";

function LucroVlooz(){
    const [listLucroVlooz,setListLucroVlooz] = useState([]);
    const [open,setOpen] = useState(false);
    const [idEmpresa,setIdEmpresa] = useState(0);
    const [porcentagem,setPorcentagem] = useState(0.0);
    const [messageError,setMessageError] = useState("");
    const [empresas,setEmpresas] = useState([]);
    const {validarTempoTOKEN} = useContext(Context);

    async function loadEmpresas(){

        validarTempoTOKEN();

        await api.get("/empresa")
        .then((response)=>{
            setEmpresas(response.data);
            console.debug("empresas",empresas);
        })
        .catch((err)=>{
            try{
                setMessageError(err.response.data["Error"]);
            }catch(error){
                alert(error);
            }
        })
    }

    async function loadLucroVlooz(){

        validarTempoTOKEN();

        await api.get("/lucroVlooz")
        .then((response)=>{
            setListLucroVlooz(response.data);
            console.log(response.data);
        }).catch((err)=>{
            try{
                setMessageError(err.response.data);
                alert(messageError);
            }catch(error){
                alert(error);
            }
        })
    }

    async function cadastrarLucroVooz(){

        validarTempoTOKEN();

        await api.post("/lucroVlooz",{
            porcentagem,
            idEmpresa:{
                idEmpresa
            }
        }).then((response)=>{
            loadLucroVlooz();
        }).catch((err)=>{
            try{
                setMessageError(err.response.data);
                alert(messageError);
            }catch(error){
                alert(error);
            }
        })
    }

    async function deleteLucroVlooz(id){

        validarTempoTOKEN();

        await api.delete(`/lucroVlooz/${id}`)
        .then((response)=>{
            loadLucroVlooz();
        }).catch((err)=>{
            try{
                setMessageError(err.response.data);
                alert(messageError);
            }catch(error){
                alert(error);
            }
        });
    }

    function handleOpen(){
        setOpen(true);
    }

    function handleClose(){
        setOpen(false);
    }

    useEffect(()=>{
        loadEmpresas();
        loadLucroVlooz();
    },[]);

    return (
        <DefaultPage>
            <CustomModal 
                handleOpen={handleOpen}
                handleClose={handleClose}
                open={open}
                classNameForm="form_lucro_vlooz"
                submitFunction={cadastrarLucroVooz}
                title="Cadastro Lucro Vlooz"
                >

                    <select className="select" onChange={e=>setIdEmpresa(e.target.value)}>
                        <option value={0} key={0}>
                            Escolha uma empresa
                        </option>
                        {empresas.map((empresa)=>(
                            <option value={empresa.idEmpresa} key={empresa.idEmpresa}>
                                {empresa.nomeFantasia}
                            </option>
                        ))}
                    </select>

                    <input type="number" required
                    placeholder="porcentagem" 
                    step="0.0010" 
                    onChange={e=>setPorcentagem(e.target.value)}/>

                    <button type="submit">
                        Salvar
                    </button>
            </CustomModal>

            <ul className="lista">
                {listLucroVlooz.map((lucroVlooz)=>(
                    <CustomListItem
                        idItem ={lucroVlooz.idLucroVlooz}
                        buttonTitle="deletar"
                        buttonType="delete"
                        buttonFunction={deleteLucroVlooz}>
                            
                            <div className="item_data_lucro_vlooz">
                                <p className="titulo_dado">Nome Empresa:</p>
                                <p className="data">{lucroVlooz.idEmpresa.idPessoa.nome}</p>
                            </div>
                            <div className="item_data_lucro_vlooz">
                                <p className="titulo_dado">Identificador</p>
                                <p className="data">{lucroVlooz.idEmpresa.idPessoa.identificador}</p>
                            </div>
                            <div className="item_data_lucro_vlooz">
                                <p className="titulo_dado">Porcentagem:</p>
                                <p className="data">{lucroVlooz.porcentagem}</p>
                            </div>
                            <div className="item_data_lucro_vlooz">
                                <p className="titulo_dado">Criado Em:</p>
                                <p className="data">{dateToString(lucroVlooz.criadoEm)}</p>
                            </div>
                            <div className="item_data_lucro_vlooz">
                                <p className="titulo_dado">Atualizado Em:</p>
                                <p className="data">{dateToString(lucroVlooz.atualizadoEm)}</p>
                            </div>


                    </CustomListItem>
                ))}


            </ul>

        </DefaultPage>
    )
}

export default LucroVlooz;