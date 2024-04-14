import toast from "react-hot-toast";

function handleError(message, error) {
  console.log(`${message}: ${error}`);
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.error
  )
    toast.error(error.response.data.error);
  else toast.error("server not responding, try again later");
}

export default handleError;
