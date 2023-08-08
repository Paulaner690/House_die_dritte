import { Router } from "express";
import multer from "multer";
import User from "./models/UserModel.js";
import { authentificateToken, generateAccessToken } from "./authToken.js";
import { createResetToken } from "./models/resetTokenModel.js";

export const userRouter = Router();

const multerMiddleware = multer();

// ============ für Cookie Haltbarkeit =====
const hoursInMillisek = (hours) => {
  return 1000 * 60 * 60 * hours;
};

// ! User ausgeben
userRouter.get("/user/aut", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// # Reset Password
userRouter.post("/resetPassword", async (req, res) => {
  const { email } = req.body;
  try {
    console.log("reset password for ", email);
    await createResetToken(email);
    return res.sendStatus(200);
  } catch (e) {
    if (e?.message === "No User with this email") {
      return res.status(404).send({ error: "User not found" });
    }

    return res.status(500).send({ error: "Unknown Error occurred" });
  }
});

userRouter.post("/resetPassword-confirm", async (req, res) => {
  const { id, token, password } = req.body;
  const isValidResetProcess = validateResetToken(id, token);
  try {
    if (!isValidResetProcess) {
      throw new Error("NonValidResetProcess");
    }

    const user = await User.findById(id);
    user.setPassword(password);

    await user.save();
    return res.send({
      data: { message: "New password confirmed" },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Something went wrong" });
  }
});

// ! SignUp / Create Profile
userRouter.post("/user/signup", multerMiddleware.none(), async (req, res) => {
  // Neuen User erstellen
  const { name, email } = req.body;
  const newUser = new User({ name, email });
  // user.setPassword (hash und salt setzen)
  newUser.setPassword(req.body.password);
  // user speichern
  try {
    await newUser.save();
    return res.send({
      data: {
        message: "New user created",
        user: { name, email },
      },
    });
  } catch (e) {
    console.log(e);
    if (e.name === "ValidationError") {
      return res.status(400).send({ error: e });
    }

    // Duplication Error email existiert bereits als user
    if (e.name === "MongoServerError" && e.code === 11000) {
      console.log("Account exists already");
      return res.status(400).send({
        error: { message: "Username and Password combination not valid" },
      });
    }

    return res.status(500).send({ error: { message: "Unknown Server error" } });
  }
});

// ! Login
userRouter.post("/user/login", multerMiddleware.none(), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+hash").select("+salt");

  const passwordIsValid = user.verifyPassword(password);
  if (passwordIsValid) {
    //===========TOKEN ==============
    const token = generateAccessToken({ email });
    console.log(token);
    res.cookie("auth", token, { httpOnly: true, maxAge: hoursInMillisek(4) });
    // Gültigkeit in millisek (4h) -> Cookie solltekürzer als Token haltbar sein
    // mit httpOnly nicht für JS lesbar

    //next step Cookie Parser middelware in auth datei -> da Validierung über Cookie stattfindet

    res.send({ message: "Success", data: user });
  } else {
    res.status(404).send({
      message: "Failed login",
      error: { message: "Password and Email combination is wrong" },
    });
  }
});

// ! LOGOUT
userRouter.get("/logout", (req, res) => {
  res.clearCookie("auth");
  res.send("OK");
});

// ! Cookie (parser) Test
userRouter.get("/secure", authentificateToken, async (req, res) => {
  console.log(req.userEmail);
  res.send({ email: req.userEmail });
});

// ! JSON Web Token
// wie ein schlüssel mit Ablaufdatum, Token wird immer mit 3 Sektionen erstellt. 1. Header = Algorithmus, 2. = Payload = nicht verschlüsselt (Bernd), 3. Verifizierungssignatur = wie werden Daten verschlüsselt, mit Secret (wie Fingerabdruck)
// npm jasonwebtoken

// ! Reset testen
// zum testen neuen user erstellen mit eigener Email(von mailGun anmeldung) den user dann in db posten

// email adresse auf mailgun verifizieren - sending - domain - rechts author.Recip. - input feld- trash mail eingeben - save
// trashmail öffnen und so lange öffnen bis verif.mail ankommt
// mail öffnen - verifizieren
// bei mailgun warten bis verif.
// wieder in trahmail - 2. mail verif.
// nun bei mailgun verif.
// thunderclient: new POST req - http://localhost:3000/api/user/resetPassword
// JSON { "email": "eigene Email", name: "Lisa", passwort:""}
// bei mailgun im reporting checken ob mail raus ist
// wieder bei trashmail schauen ob angekommen
