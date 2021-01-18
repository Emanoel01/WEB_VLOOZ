import {React,useState,useContext,useEffect} from "react";
import "./style.css";
import { Context } from "../../Context/AuthContext";

function Login (){

    const [email,setEmail] = useState("");
    const [senha,setSenha] = useState("");
    const { authenticated,handleLogin } = useContext(Context);

     useEffect(()=>{
         const token = localStorage.getItem("token");

         if(token){
             localStorage.removeItem("token");
         }

     },[]);

    return (
        <div className="body">
            <div className="container_login">
                <div className="logo">
                    <p>VLOOZ</p>
                </div>
                <div className="form">
                    <form action="" onSubmit={(e)=>{handleLogin(email,senha,e)}}>
                        <input type="email" 
                        placeholder="email" 
                        onChange={e=>setEmail(e.target.value)}
                        className="inputs"
                        />

                        <input type="password" 
                        placeholder="senha" 
                        onChange={e=>setSenha(e.target.value)}
                        className="inputs"
                        />
                        
                        <br/>

                        <button type="submit" >
                            Login
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;