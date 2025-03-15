import { toast } from "react-toastify";

const notify = ({type="success",message="Something went Wrong"}: {type:string,message:string}) => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast.info(message);
      break;
    default:
      toast.info(message);
  }
}

export default notify
