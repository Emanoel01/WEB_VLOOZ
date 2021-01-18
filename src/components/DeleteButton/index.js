import "../../default.css";

function DeleteButton(props){
    return (
        <div className="action_button">
            <button className="button_delete" hidden={props.hidden}
                onClick={(e)=>{
                    var r = window.confirm("Confirma Alteração?");

                    if(r){
                        props.type==="delete"?props.function(props.idItem):props.function(props.idItem,props.status);
                    }else{
                        alert("O item NÃO foi alterado");
                    }
                }}
                >
                 {props.title}
            </button>
        </div>
    )
}

export default DeleteButton;