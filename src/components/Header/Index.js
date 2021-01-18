import {useContext,useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import "./style.css";
import api from "../../Service/Api";

import {Context} from "../../Context/AuthContext";

function Header(){

    const { handleLogout,usuario } = useContext(Context);
    const [refreshUser,setRefreshUser] = useState(null);


    async function getUserData(){
        const emailBase64 = localStorage.getItem("user");
        const emailConvertido = new Buffer(emailBase64,"base64").toString("ascii");
        await api.post("usuario/login",{
            email:emailConvertido
        }).then((response)=>{
            setRefreshUser(response.data);
        }).catch((err)=>{
            try{
                alert(err.response.data["Error"]);
            }catch(error){
                alert(error);
            }
        })
    }

    useEffect(()=>{

        if(usuario!=null){
            setRefreshUser(usuario);
        }else{
            getUserData();
        }
    },[])

    return(
        <div className="content_header">
            <div className="item">
                <Link to="/home" className="links">
                    <p className="titulo">HOME</p>
                </Link>
            </div>
            <div className="item taxas">
                <p className="titulo">TAXAS E IMPOSTOS</p>
                <div className="dropdown dropdown_taxas">
                    <Link to="/imposto" className="links">
                        <p>Impostos</p>
                    </Link>
                    <Link to="/taxaValorProduto" className="links">
                        <p>Taxa Valor Produto</p>
                    </Link>
                    <Link to="/taxaValorQuilometro" className="links">
                        <p>Taxa Valor Quilometro</p>
                    </Link>
                    <Link to="/lucroVlooz" className="links">
                        <p>Lucro Vlooz</p>
                    </Link>

                </div>
            </div>
            <div className="item pessoas">
                <p className="titulo">PESSOAS</p>
                <div className="dropdown dropdown_pessoas">
                    <Link to="/empresas" className="links">
                        <p>Empresas</p>
                    </Link>
                    <Link to="/usuario" className="links">
                        <p>Usuarios</p>
                    </Link>
                </div>
            </div>
            <div className="item frete">
                <p className="titulo">FRETE</p>
                <div className="dropdown dropdown_frete">
                    <Link to="/frete" className="links">
                        <p>Fretes</p>
                    </Link>
                </div>
            </div>
            <div className="item produtos_veiculos">
                <p className="titulo">PRODUTOS/VEÍCULOS</p>
                <div className="dropdown dropdown_produtos_veiculos">
                    <Link to="/tipoVeiculo" className="links">
                        <p>TIPO VEÍCULO</p>
                    </Link>
                    <Link to="/faixaPreco" className="links">
                        <p>Faixa de Preços</p>
                    </Link>
                    <Link to="tipoProduto" className="links">
                        <p>Tipo Produto</p>
                    </Link>
                </div>
            </div>

            <div className="data_user">
                <div className="dropdown_user">
                    <p>{refreshUser!=null?refreshUser.idPessoa.nome:"Carregando informação"}</p>
                    <p>{refreshUser!=null?refreshUser.idPessoa.email:"Carregando informação"}</p>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header;