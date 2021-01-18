import {useState,useEffect,useContext} from "react";
import "./style.css";
import "../../default.css";
import api from "../../Service/Api";
import { dateToString } from "../../utils/ConvertDate";
import DefaultPage from "../../components/Defaultpage/Index";
import CustomModal from "../../components/CustomModal/Index";
import CustomListItem from "../../components/CustomListItem/Index";
import {validarCPF,validarCNPJ} from "../../utils/Validation";
import {Context} from "../../Context/AuthContext";

function Usuario(){
    const [listUsuarios,setListUsuarios] = useState([]);
    const [identificador,setIdentificador] = useState("");
    const [nome,setNome] = useState("");
    const [tipoIdentificador,setTipoIdentificador] = useState(0);
    const [email,setEmail] = useState("");
    const [senha,setSenha] = useState("");
    const [confirmarSenha,setConfirmarSenha] = useState("");
    const [open,setOpen] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const [usuario,setUsuario] = useState(null);
    const [statusInput,setStatusInput] = useState(false);
    const [statusSalvar,setStatusSalvar] = useState(false);
    const [statusHabilitar,setStatusHabilitar] = useState(true);
    const {validarTempoTOKEN} = useContext(Context);

    async function loadUsuarios(){

        validarTempoTOKEN();

        await api.get("/usuario")
        .then((response)=>{
            console.log(response.data);
            setListUsuarios(response.data);
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }

    async function cadastrarUsuario(e){

        validarTempoTOKEN();

        e.preventDefault();
        //Verificando se o identificador contem os dígitos necessários
        if(identificador.length==11 || identificador.length==14){

            let statusIdentificador = identificador.length==11?validarCPF(identificador):validarCNPJ(identificador);
            identificador.length==11?setTipoIdentificador(1):setTipoIdentificador(2);
            
            //Verificando se o identificador é válido
            if(statusIdentificador){

                //Verificando se as duas senhas são compativéis
                if(senha==confirmarSenha){
                    await api.post("/usuario",{
                        idPessoa:{
                            identificador,
                            tipoIdentificador,
                            nome,
                            email,
                        },
                        senha,
                        status:1

                    }).then((response)=>{
                        loadUsuarios();
                        handleClose();
                    }).catch((err)=>{
                        try{
                            setErrorMessage(err.response.data["Error"]);
                            alert(errorMessage);
                        }catch(error){
                            alert(error);
                        }
                    })

                }else{
                    alert("Senhas incompativéis. Revise os dados e tente novamente");
                }
            }else{
                alert("CPF/CNPJ inválido. Revise os dados e tente novamente");
            }

        }else{
            alert("O CPF deve conter 11 dígitos e o CNPJ deve conter 14 dígitos, revise os dados e tente novamente!")
        }
    }

    async function handleStatusUsuario(id,status){

        validarTempoTOKEN();
        
        await api.patch(`/usuario/${id}/${status}`)
        .then((response)=>{
            loadUsuarios();
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }
        })
    }

    async function updateUsuario(e){

        validarTempoTOKEN();

        e.preventDefault();
        //Verificando se o identificador contem os dígitos necessários
        if(identificador.length==11 || identificador.length==14){

            let statusIdentificador = identificador.length==11?validarCPF(identificador):validarCNPJ(identificador);
            identificador.length==11?setTipoIdentificador(1):setTipoIdentificador(2);
            
            //Verificando se o identificador é válido
            if(statusIdentificador){

                //Verificando se as duas senhas são compativéis
                if(senha==confirmarSenha){

                    await api.put(`/usuario/${usuario.idUsuario}`,{
                        idUsuario:usuario.idUsuario,
                        idPessoa:{
                            idPessoa:usuario.idPessoa.idPessoa,
                            identificador,
                            tipoIdentificador,
                            nome,
                            email,
                        },
                        senha,
                        status:usuario.status

                    }).then((response)=>{
                        loadUsuarios();
                        handleClose();
                    }).catch((err)=>{
                        try{
                            setErrorMessage(err.response.data["Error"]);
                            alert(errorMessage);
                        }catch(error){
                            alert(error);
                        }
                    })

                }else{
                    alert("Senhas incompativéis. Revise os dados e tente novamente");
                }
            }else{
                alert("CPF/CNPJ inválido. Revise os dados e tente novamente");
            }

        }else{
            alert("O CPF deve conter 11 dígitos e o CNPJ deve conter 14 dígitos, revise os dados e tente novamente!")
        }
    }

    function handleOpen(){
        setOpen(true);
    }

    function handleClose(){
        setOpen(false);
        cleanFields();
        setUsuario(null);
        setStatusHabilitar(true);
        setStatusSalvar(false);
        setStatusInput(false);
    }


    function setvaluesOnFields(usuario){
        console.log(usuario.senha);
        setNome(usuario.idPessoa.nome);
        setIdentificador(usuario.idPessoa.identificador);
        setEmail(usuario.idPessoa.email);
    }

    function cleanFields(){
        setNome("");
        setIdentificador("");
        setEmail("");
        setSenha("");
        setConfirmarSenha("");
    }

    useEffect(()=>{
        loadUsuarios();
    },[])
    return (
        <DefaultPage>
            <CustomModal
                handleOpen={handleOpen}
                handleClose={handleClose}
                open={open}
                classNameForm="form_usuarios"
                submitFunction={usuario==null?cadastrarUsuario:updateUsuario}
                title={usuario==null?"Cadastro de Usuario":"Atualização de Usuario"}
            >

                <input type="number" required
                placeholder="Identificador" 
                readOnly={statusInput} value={identificador}
                onChange={e=>setIdentificador(e.target.value)}/>

                <input type="text" required
                placeholder="nome" 
                readOnly={statusInput} value={nome}
                onChange={e=>setNome(e.target.value)}/>

                <input type="email" required
                placeholder="email" 
                readOnly={statusInput} value={email}
                onChange={e=>setEmail(e.target.value)}/>

                <input type="password" required
                placeholder="senha"
                value={senha}
                readOnly={statusInput}
                onChange={e=>setSenha(e.target.value)}/>

                <input type="password" required
                placeholder="confirmar senha"
                value={confirmarSenha}
                readOnly={statusInput}
                onChange={e=>setConfirmarSenha(e.target.value)}/>

                <button type="submit" hidden={statusSalvar}>
                    Salvar
                </button>

                <button onClick={(e)=>{
                    e.preventDefault();
                    setStatusHabilitar(true);
                    setStatusSalvar(false);
                    setStatusInput(false);}}
                    hidden={statusHabilitar}>
                        Habilitar
                </button>

            </CustomModal>

            <ul className="lista">
                {listUsuarios.map((usuario)=>(
                    <CustomListItem
                        buttonType="update"
                        buttonTitle={usuario.status==0?"Ativar":"Desativar"}
                        buttonFunction={handleStatusUsuario}
                        idItem={usuario.idUsuario}
                        buttonStatus={usuario.status==0?1:0}>
                            <div className="data_usuario">
                                <p className="titulo_dado">Nome:</p>
                                <p className="data">{usuario.idPessoa.nome}</p>
                            </div>
                            <div className="data_usuario">
                                <p className="titulo_dado">CPF/CNPJ:</p>
                                <p className="data">{usuario.idPessoa.identificador}</p>
                            </div>
                            <div className="data_usuario">
                                <p className="titulo_dado">STATUS:</p>
                                <p className="data">{usuario.status==1?"Ativo":"Desativo"}</p>
                            </div>
                            <div className="data_usuario">
                                <p className="titulo_dado">Criado Em:</p>
                                <p className="data">{dateToString(usuario.criadoEm)}</p>
                            </div>
                            <div className="data_usuario">
                                <p className="titulo_dado">Atualizado Em:</p>
                                <p className="data">{dateToString(usuario.atualizadoEm)}</p>
                            </div>
                            <div className="data_usuario">
                                <button className="button_atualizar"
                                onClick={()=>{
                                    setUsuario(usuario);
                                    setvaluesOnFields(usuario);
                                    setStatusHabilitar(false);
                                    setStatusSalvar(true);
                                    setStatusInput(true);
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

export default Usuario;