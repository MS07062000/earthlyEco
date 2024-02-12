import { useNavigate } from "react-router-dom";

const authorizationMiddleWare = (store: any) => (next: any) => (action: any) => {
  const { auth } = store.getState();
  const navigate = useNavigate();
  if (auth.user === null) {
    navigate("/login", { replace: true });
  } else {
    return next(action);
  }
};

export default authorizationMiddleWare;
