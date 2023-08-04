import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav/nav";
import { UserContext } from "../user/UserContext.jsx"

const LoginPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { refetch } = useContext(UserContext);
  const nav = useNavigate();
  const [error, setError] = useState(null);

  const login = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("/api/user/login", {
        name,
        email,
        password,
      });
      const { data } = response.data;
      refetch();
      nav(`/ProfilePage/${data._id}`);
      console.log("successful", data);
    } catch (e) {
      console.log(e, "Login failed, please try again later");
    }
  };

  return (
    <>
      <header>
        <div>
          <Nav />
        </div>
      </header>
      <h1>Login</h1>
      <form onSubmit={login}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <small style={{ color: "red" }}>{error}</small>}
        <button>Login</button>
      </form>
    </>
  );
};

export default LoginPage;
