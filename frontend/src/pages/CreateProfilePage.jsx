import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav/nav";

// const isProd = process.env.NODE_ENV === "production";

const CreateProfilePage = () => {
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // const nav = useNavigate();

  // const signUp = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.post("/api/user/signup", {
  //       name,
  //       email,
  //       password,
  //     });
  //     const { data } = response;
  //     nav("/LoginPage");
  //     console.log("User successfully created", data);
  //   } catch (error) {
  //     console.log(error, "Registration failed");
  //   }
  // };
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    try {
      await axios.post("/api/user/signup", data);

      if (isProd) {
        nav("/login");
      }
    } catch (e) {
      if (e?.response?.data?.error?.message) {
        setError(e?.response?.data?.error?.message);
      } else {
        setError("An Error occured, try again later");
      }
    }
  };

  return (
    <div>
      <header>
        <div>
          <Nav />
        </div>
        <h1>Create a New Account</h1>
      </header>
      <h3>Please enter your data</h3>
      <form onSubmit={submit}>
        {/* <input
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
        /> */}
        <input name="name" type="text" placeholder="Your name" />
        <input name="email" type="text" placeholder="your email" />
        <input name="password" type="password" placeholder="***********" />
        {error && <small style={{ color: "red" }}>{error}</small>}
        <button>Create Account</button>
      </form>
    </div>
  );
};

export default CreateProfilePage;
