import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const DB_TITLE = process.env.DB_TITLE;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.5si1ej1.mongodb.net/${DB_TITLE}?retryWrites=true&w=majority`,
    }),
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
  })
);
// Este es el motor de la plantillas
app.set("views", "./public/views");
app.set("view engine", "ejs");

const getNombreSession = (req) => {
  console.log(req.session.nombre);
  return req.session.nombre ? req.session.nombre : "Invitado";
};
let login = true;
const singInOrUp= (req)=>{
    return req.session.nombre ? login=false : login = true; 
}
// let userName = "Invitado";

app.get("/", (req, res) => {
  let userName = getNombreSession(req);
  login = singInOrUp(req)
  res.render("login.ejs", { userName, login });
});

app.post("/login", (req, res) => {
  // let {nombre, password} = req.body
  // console.log(nombre, password)
  req.session.nombre = req.body.nombre;
  req.session.contador = 1;
  let userName = getNombreSession(req);
  console.log(userName);
  
  login = singInOrUp(req)
  res.redirect("/");
  return login , userName;
});
app.post("/logout", (req, res) => {
  let userName = getNombreSession(req);
  login = singInOrUp(req)
  req.session.destroy((err) => {
    if (err) {
      res.send(`<h1>Error al eliminar la sesion</h1>`);
    } else {
      res.render("logout.ejs", { userName });
    }
  });
//   userName = "Invitado";
  return login ;
});
//     if(req.session.contador){
//         req.session.contador ++

//         res.send(`<h1>Hola ${getNombreSession(req)}. Visitaste la página  ${req.session.contador} veces</h1>`)
//     }else {
//         console.log(req.session.nombre)
//         req.session.nombre = req.query.nombre
//         req.session.contador = 1
//         res.send(`<h1>Bienvenido ${getNombreSession(req)}.</h1>`)
//     }
// })

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
