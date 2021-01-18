import "../../default.css";
import { Modal } from "@material-ui/core";

function CustomModal(props){
    return(
        <div className="content_save_and_search">
                    <button className="add" onClick={props.handleOpen} hidden={props.hiddenButton===1?true:false}>
                        Adicionar
                    </button>
                    <Modal
                        open={props.open}
                        onClose={props.handleClose}
                        >
                        <div  className="form_modal">
                          <form className={props.classNameForm} onSubmit={props.submitFunction}>
                              <div className="content_modal">
                                    <h3>{props.title}</h3>
                                    {props.children}
                              </div>
                          </form>
                        </div>
                    </Modal>
               </div>
    )
}
export default CustomModal;