import "../../default.css";
import DeleteButton from "../../components/DeleteButton/index";

function CustomListItem(props){
    return(
        <li className="item_lista" key={props.idItem}>
            <div className="data_item_lista">
                {props.children}
            </div>
            <DeleteButton
                hidden={props.hiddenButton===1?true:false}
                title={props.buttonTitle}
                type={props.buttonType}
                status={props.buttonStatus}
                idItem={props.idItem}
                function={props.buttonFunction}
            />
        </li>
    )
}

export default CustomListItem;