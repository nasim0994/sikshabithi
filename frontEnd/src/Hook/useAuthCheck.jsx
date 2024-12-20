import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useJwt } from "react-jwt";
import { userLoggedIn } from "../Redux/api/user/userSlice";

export default async function useAuthCheck() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);
  const token = localStorage?.getItem("token");
  const { isExpired } = useJwt(token);
  if (isExpired) {
    localStorage.removeItem("token");
  }

  useEffect(() => {
    if (token) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/loggedUser`, {
        headers: {
          authorization: `bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.success) {
            dispatch(
              userLoggedIn({
                token: token,
                data: data,
              })
            );
          }
        })
        .finally(() => {
          setAuthChecked(true);
        });
    }
  }, [dispatch, setAuthChecked, token]);

  return authChecked;
}
