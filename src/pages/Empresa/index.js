import {useState,useEffect,useContext} from "react";
import api from "../../Service/Api";
import "../../default.css";
import "./style.css";
import { dateToString } from "../../utils/ConvertDate";
import {validarCPF,validarCNPJ} from "../../utils/Validation";
import CustomModal from "../../components/CustomModal/Index";
import DefaultPage from "../../components/Defaultpage/Index";
import CustomListItem from "../../components/CustomListItem/Index";
import { Context } from "../../Context/AuthContext";


function Empresas (){

    const [empresas,setEmpresas] = useState([]);
    const [open,setOpen] = useState(false);
    const [nome,setNome] = useState("");
    const [identificador,setIdentificador] = useState("");
    const [nomeFantasia,setNomeFantasia] = useState("");
    const [email,setEmail] = useState("");
    const [empresa,setEmpresa] = useState(null);
    const [inputStatus,setInputStatus] = useState(false);
    const [statusHabilitar,setStatusHabilitar] = useState(true);
    const [statusSalvar,setStatusSalvar] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const [statusIdentificador,setStatusIdentificador] = useState(true);
    const {validarTempoTOKEN} = useContext(Context);

    function handleOpen(){
        setOpen(true);
    }

    function handleClose(){
        setOpen(false);
        setStatusHabilitar(true);
        setStatusSalvar(false);
        cleanValuesEmpresa();
        setEmpresa(null);
        setInputStatus(false);
    }

    async function loadEmpresas(){

        validarTempoTOKEN();

        await api.get("/empresa")
        .then((response)=>{
            const data = response.data;
            console.log(data);
            setEmpresas(data);
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }

    async function handleStatusEmpresa(idEmpresa,status){

        validarTempoTOKEN();

        await api.patch(`/empresa/${idEmpresa}/${status}`)
        .then((response)=>{
            loadEmpresas();
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }

    async function cadastrarEmpresa(e){
        validarTempoTOKEN();
        e.preventDefault();
        if(identificador.length==11 || identificador.length==14){

            // if(identificador.length==11){
            //     setStatusIdentificador(validarCPF(identificador));
            // }else{
            //    setStatusIdentificador(validarCNPJ(identificador));
            // }

            let statusIdentificador = identificador.length==11?validarCPF(identificador):validarCNPJ(identificador);

            if(statusIdentificador){
                await api.post("/empresa",{
                    nomeFantasia,
                    idPessoa:{
                        nome,
                        identificador,
                        tipoIdentificador:identificador.length==11?1:2,
                        email
                    }
                }).then((response)=>{
                    loadEmpresas();
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
            }else{
                alert("CPF/CNPJ INVÁLIDO");
            }

        }else{
            alert("O CPF DEVE TER 11 DÍGITOS E O CNPJ DEVE TER 14 DÍGITOS");
        }
    }

    async function updateEmpresa(e){
        validarTempoTOKEN();
        e.preventDefault();
        empresa.idPessoa.nome = nome;
        empresa.idPessoa.identificador = identificador;
        empresa.idPessoa.tipoIdentificador = identificador.length==11?1:2;
        empresa.idPessoa.email = email;
        empresa.nomeFantasia = nomeFantasia;

        await api.put(`/empresa/${empresa.idEmpresa}`,{
            idEmpresa:empresa.idEmpresa,
            nomeFantasia:empresa.nomeFantasia,
            idPessoa:{
                idPessoa:empresa.idPessoa.idPessoa,
                nome:empresa.idPessoa.nome,
                identificador:empresa.idPessoa.identificador,
                tipoIdentificador:empresa.idPessoa.tipoIdentificador,
                email:empresa.idPessoa.email
            }
        }).then((response)=>{
            handleClose();
            loadEmpresas();
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }

    function setValuesEmpresa(empresa){
        setNome(empresa.idPessoa.nome);
        setIdentificador(empresa.idPessoa.identificador);
        setNomeFantasia(empresa.nomeFantasia);
        setEmail(empresa.idPessoa.email);
    }

    function cleanValuesEmpresa(){
        setNome("");
        setIdentificador("");
        setNomeFantasia("");
        setEmail("");
    }

    useEffect(()=>{
        loadEmpresas();
    },[])


    return (
       <DefaultPage>
           <CustomModal
                handleOpen ={handleOpen}
                handleClose = {handleClose}
                classNameForm = "form_tipo_veiculo"
                open={open}
                submitFunction={empresa==null?cadastrarEmpresa:updateEmpresa}
                    title={empresa==null?"Cadastro de Empresa":"Atualização de Empresa"}>

                    <input type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e)=>setNome(e.target.value)}
                    required
                    readOnly={inputStatus}/>

                    <input type= "number"
                    placeholder="CPF/CNPJ"
                    value={identificador}
                    onChange={(e)=>setIdentificador(e.target.value)}
                    required
                    readOnly={inputStatus}/>

                    <input type="text"
                    placeholder="Nome Fantasia"
                    value={nomeFantasia}
                    onChange={(e)=>setNomeFantasia(e.target.value)}
                    required
                    readOnly={inputStatus}/>

                    <input type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                    readOnly={inputStatus}
                    />

                    <button onClick={(e)=>{
                    e.preventDefault();
                    setStatusHabilitar(true);
                    setStatusSalvar(false);
                    setInputStatus(false);
                    }} hidden={statusHabilitar}>
                    Habilitar
                    </button>

                    <button type="submit"
                    hidden={statusSalvar}>
                    salvar
                    </button>
               </CustomModal>

               <ul className="lista">

                    {empresas.map((empresa)=>(
                        <CustomListItem
                        idItem={empresa.idEmpresa}
                        buttonTitle={empresa.status==0?"Ativar":"Desativar"}
                        buttonType="update"
                        buttonStatus={empresa.status==0?1:0}
                        buttonFunction={handleStatusEmpresa}>

                            <div className="data_empresa">
                                <p className="titulo_dado">Nome:</p>
                                <p className="data">{empresa.idPessoa.nome}</p>
                            </div>
                            <div className="data_empresa">
                                <p className="titulo_dado">Identificador:</p>
                                <p className="data">{empresa.idPessoa.identificador}</p>
                            </div>
                            <div className="data_empresa">
                                <p className="titulo_dado">Nome Fantasia</p>
                                <p className="data">{empresa.nomeFantasia}</p>
                            </div>
                            <div className="data_empresa">
                                <p className="titulo_dado">Status:</p>
                                <p className="data">{ empresa.status==1?"Ativo":"Desativo"}</p>
                            </div>
                            <div className="data_empresa">
                                <p className="titulo_dado">Criado Em:</p>
                                <p className="data">{dateToString(empresa.criadoEm)}</p>
                            </div>
                            <div className="data_empresa">
                                <p className="titulo_dado">Atualizado Em:</p>
                                <p className="data">{dateToString(empresa.atualizadoEm)}</p>
                            </div>
                            <div className="data_empresa">
                                <button className="button_atualizar"
                                    onClick={()=>{
                                        setValuesEmpresa(empresa);
                                        handleOpen();
                                        setInputStatus(true);
                                        setEmpresa(empresa);
                                        setStatusHabilitar(false);
                                        setStatusSalvar(true)
                                    }}
                                >
                                    Vizualizar
                                </button>
                            </div>
                        </CustomListItem>
                    ))}
               </ul>
       </DefaultPage>
    )
}

export default Empresas;