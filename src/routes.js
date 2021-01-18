import React, {useContext} from "react";
import {Switch, Route, Redirect} from "react-router-dom";

import Login from "./pages/Login/index";
import Home from "./pages/Home/Home";
import { Context } from "./Context/AuthContext";
import TipoVeiculo from "./pages/TipoVeiculo/Index";
import Empresas from "./pages/Empresa/index";
import FaixaPreco from "./pages/FaixaPreco/index";
import Imposto from "./pages/Imposto/Index";
import TaxaValorProduto from "./pages/TaxaValorProduto/Index";
import TaxaValorQuilometro from "./pages/TaxaValorQuilometro/Index";
import TipoProduto from "./pages/TipoProduto/Index";
import LucroVlooz from "./pages/LucroVlooz/Index";
import Usuario from "./pages/Usuario/Index";
import Frete from "./pages/Frete/Index";

function CustomRoute({isPrivate, ...rest}){
    const { loading , authenticated } = useContext(Context);

    if(loading){
        return <h1>Loading</h1>
    }

    if(isPrivate && !authenticated){
        return <Redirect to="/"/>
    }

    return <Route {...rest} />

}

export default function Routes(){
    return(
        <Switch>
            <CustomRoute    exact path="/" component={Login}/>
            <CustomRoute isPrivate exact path="/home" component={Home}/>
            <CustomRoute isPrivate exact path="/tipoVeiculo" component={TipoVeiculo}/>
            <CustomRoute isPrivate exact path="/empresas" component={Empresas}/>
            <CustomRoute isPrivate exact path="/faixaPreco" component={FaixaPreco}/>
            <CustomRoute isPrivate exact path="/imposto" component={Imposto}/>
            <CustomRoute isPrivate exact path="/taxaValorProduto" component={TaxaValorProduto}/>
            <CustomRoute isPrivate exact path="/taxaValorQuilometro" component={TaxaValorQuilometro}/>
            <CustomRoute isPrivate exact path="/tipoProduto" component={TipoProduto}/>
            <CustomRoute isPrivate exact path="/lucroVlooz" component={LucroVlooz}/>
            <CustomRoute isPrivate exact path="/usuario" component={Usuario}/>
            <CustomRoute isPrivate exact path="/frete" component={Frete}/>
        </Switch>
    );
}