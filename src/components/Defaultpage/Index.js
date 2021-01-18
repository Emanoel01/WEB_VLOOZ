import "../../default.css";
import Header from "../Header/Index";

function DefaultPage (props){
    return (
        <>
        <div className="content">
            <Header/>
            <div className="">
                {props.children}
            </div>
        </div>
        <div className="div-message-responsive">
            <p className="p-message-responsive">
                Desculpe, mas no momento esse sistema web não possui responsividade.
            </p>
        </div>
    </>
    )
}

export default DefaultPage;