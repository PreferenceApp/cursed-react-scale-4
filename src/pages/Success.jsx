import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from './Loading';
import { useUser } from '../context/UserContext.jsx';

export default function Success() {
  const { user, discordUser, login, event } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if(discordUser === null)
    {
      window.location.href = "/";
    }
    else
    {
      navigate("/");
    }
  }, [navigate]);

  return <Loading/>;
}