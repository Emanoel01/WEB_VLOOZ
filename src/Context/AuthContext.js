import React, { createContext,useState, useEffect }  from "react";
import history from "../history";
import api from "../Service/Api";


const Context = createContext();

function AuthProvider({ children }){
    const [authenticated,setAuthenticated] = useState(false);
    const [loading,setLoading] = useState(true);
    const [errorMessage,setErrorMessage] = useState("");
    const [usuario,setUsuario] = useState(null);

    useEffect(()=>{
        const token = localStorage.getItem("token");

        if(token){
            api.defaults.headers.token = token;
            setAuthenticated(true);
        }
        setLoading(false);
    },[]);

     async function getDadosUsuario(email){
         await api.post("/usuario/login",{
            email
        }).then((response)=>{
            setUsuario(response.data);
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
                console.log("erro");
            }catch(error){
                alert(error);
                console.log("erro");
            }
        })
    }


    async function handleLogin(email,senha,event){
        event.preventDefault();

        await api.post("/authentication",{
            email,
            senha
        }).then((response)=>{
            localStorage.setItem("token",response.data['token']);
            localStorage.setItem("date_token",new Date().getTime());
            localStorage.setItem("user", new Buffer(email).toString("base64"));
            api.defaults.headers.token = response.data["token"];
            getDadosUsuario(email,senha);
            history.push("/home");
            setAuthenticated(true);
            
        }).catch((err)=>{
            try{
                setErrorMessage(err.response.data["Error"]);
                alert(errorMessage);
            }catch(error){
                alert(error);
            }finally{
                setAuthenticated(false);
            }
        })
    }

    function handleLogout(){
        setAuthenticated(false);
        api.defaults.headers.token = undefined;
        localStorage.removeItem("token");
        localStorage.removeItem("date_token");
        history.push("/");
    }

    function validarTempoTOKEN(){
        const requisicaoTOKEN = localStorage.getItem("date_token");
        const dataAtual = new Date().getTime();

        const tempoRestante = dataAtual - requisicaoTOKEN;

        const tempoHora = tempoRestante/1000/3600;
        // const tempoMinuto = tempoRestante/1000/60;

        if(tempoHora>11){
            history.push("/");
            localStorage.removeItem("token");
            localStorage.removeItem("date_token");
            localStorage.removeItem("user");
        }
    }

    return(
        <Context.Provider value={{ loading, authenticated, handleLogin, handleLogout, validarTempoTOKEN, usuario}}>
            {children}
        </Context.Provider>
    );
}

export { Context,AuthProvider };