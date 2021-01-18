import {useState,useEffect,useContext} from "react";
import "./style.css";
import "../../default.css";
import api from "../../Service/Api";
import { dateToString } from "../../utils/ConvertDate";
import DefaultPage from "../../components/Defaultpage/Index";
import CustomModal from "../../components/CustomModal/Index";
import CustomListItem from "../../components/CustomListItem/Index";
import {Context} from "../../Context/AuthContext";

function TipoVeiculo (){

    const [listaTipoVeiculo,setListaTipoVeiculo] = useState([]);
    const [open,setOpen] = useState(false);
    const [tipoVeiculo,setTipoVeiculo] = useState("");
    const [metragemCubicaMaxima,setMetragemCubicaMaxima] = useState(0.0);
    const [metragemCubicaMinima,setMetragemCubicaMinima] = useState(0.0);
    const [quilometragemMaxima,setQuilometragemMaxima] = useState(0.0);
    const [pesoCargaMaxima,setPesoCargaMaxima] = useState(0.0);
    const [errorMessage,setErrorMessage] = useState("");
    const {validarTempoTOKEN} = useContext(Context);


  async function loadTipoVeiculo(){

      validarTempoTOKEN();

      await api.get("/tipoVeiculo")
     .then((response)=>{
       const data = response.data;
       setListaTipoVeiculo(data);
     }).catch((err)=>{
       try{
        setErrorMessage(err.response.data["Error"])
        alert(errorMessage);
       }catch(error){
        alert(error);
       }
     })
   }

  async function cadastrarTipoVeiculo(e){

    validarTempoTOKEN();

      e.preventDefault();
     await api.post("/tipoVeiculo",{
        tipoVeiculo,
        metragemCubicaMaxima,
        metragemCubicaMinima,
        pesoCargaMaxima,
        quilometragemMaxima
     })
     .then((response)=>{
       const data = response.data;
       console.log("dados = " + data);
        loadTipoVeiculo();
        setOpen(false);
     })
     .catch((err)=>{
       try{
          setErrorMessage(err.response.data["Error"]);
          alert(errorMessage);
       }catch(error){
          alert(error);
       }
     })
   }

   async function deleteTipoVeiculo(id){

      validarTempoTOKEN();

     await api.delete(`/tipoVeiculo/${id}`)
     .then((response)=>{
        loadTipoVeiculo();
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
      loadTipoVeiculo();
    },[]);

    function handleOpen(){
        setOpen(true);
    }

    function handleClose(){
        setOpen(false);
    }

    return(
        <DefaultPage>
              <CustomModal
                handleOpen={handleOpen}
                handleClose={handleClose}
                classNameForm="form_tipo_veiculo"
                open={open}
                submitFunction={cadastrarTipoVeiculo}
                title="cadastro de tipo de veículo">

                <input
                type="text"
                placeholder="Tipo Veículo"
                onChange={(e)=>setTipoVeiculo(e.target.value)}
                required
                />

                <input
                type="number"
                required
                onChange={(e)=>setMetragemCubicaMaxima(e.target.value)}
                placeholder={"Metragem Cúbica Máxima"}
                step="0.010"
                />

                <input type="number"
                required
                onChange={(e)=>setMetragemCubicaMinima(e.target.value)}
                placeholder={"Metragem Cúbica Mínima"}
                step="0.00010"
                />

                <input type="number"
                required
                onChange={(e)=>setPesoCargaMaxima(e.target.value)}
                placeholder={"Peso Carga Máxima"}
                step="0.010"
                />

                <input type="number"
                required
                onChange={(e)=>setQuilometragemMaxima(e.target.value)}
                placeholder={"Quilometragem Máxima"}
                step="0.010"
                />

                <button type="submit">
                  salvar
                </button>
              </CustomModal>

                <ul className="lista">

                    {listaTipoVeiculo.map((tipoVeiculo)=>(
                        <CustomListItem 
                          idItem={tipoVeiculo.idTipoVeiculo}
                          buttonTitle="deletar"
                          buttonType="delete"
                          buttonFunction={deleteTipoVeiculo}>

                          <div className="item_data">
                              <p className="titulo_dado">Tipo veículo:</p>
                              <p className="data">{tipoVeiculo.tipoVeiculo}</p>
                          </div>
                          <div className="item_data">
                              <p className="titulo_dado">Metragem cúbica máxima:</p>
                              <p className="data">{tipoVeiculo.metragemCubicaMaxima} m3</p>
                          </div>
                          <div className="item_data">
                              <p className="titulo_dado">Metragem cúbica mínima:</p>
                              <p className="data">{tipoVeiculo.metragemCubicaMinima} m3</p>
                          </div>
                          <div className="item_data">
                              <p className="titulo_dado">Peso máximo:</p>
                              <p className="data">{tipoVeiculo.pesoCargaMaxima} Kg</p>
                          </div>
                          <div className="item_data">
                              <p className="titulo_dado">Quilometragem máxima:</p>
                              <p className="data">{tipoVeiculo.quilometragemMaxima} Km</p>
                          </div>
                          <div className="item_data">
                              <p className="titulo_dado">Criado em:</p>
                              <p className="data">{dateToString(tipoVeiculo.criadoEm)}</p>
                          </div>
                          <div className="item_data">
                              <p className="titulo_dado">Atualizado em:</p>
                              <p className="data">{dateToString(tipoVeiculo.atualizadoEm)}</p>
                          </div>
                        </CustomListItem>
                    ))}
                </ul>
        </DefaultPage>
    )
}

export default TipoVeiculo;