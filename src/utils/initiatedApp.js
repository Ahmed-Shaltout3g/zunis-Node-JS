import { connectionDB } from "../../DB/connection.js";
import * as allRoutes from "../Modules/index.routes.js";
import { globalResponse } from "./errorHandling.js";
import cors from "cors";
import morgan from "morgan";
export const initatApp = (express, app) => {
  const port = process.env.PORT || 5000;
  var whitelist = [
    "https://zunis-node-1dspyqtxq-ahmed-shaltouts-projects.vercel.app",
    "http://127.0.0.1:5500",
  ];
  app.use(express.json());
  if (process.env.ENV_MODE == "DEV") {
    app.use(cors());
    app.use(morgan("dev"));
  } else {
    app.use(async (req, res, next) => {
      if (!whitelist.includes(req.header("origin"))) {
        return next(new Error("Not allowed by CORS", { cause: 502 }));
      }
      await res.header("Access-Control-Allow-Origin", "*");
      await res.header("Access-Control-Allow-Header", "*");
      await res.header("Access-Control-Allow-Private-Network", "true");
      await res.header("Access-Control-Allow-Method", "*");
      next();
    });
    app.use(morgan("combined"));
  }
  connectionDB();

  app.use("/category", allRoutes.catagoryRoutes);
  app.use("/auth", allRoutes.authRoutes);
  app.use("/product", allRoutes.productRoutes);

  // app.use("/brand", allRoutes.brandRoutes);

  app.get("/", (req, res) => {
    res.send("hello from simple server :)");
  });
  app.all("*", (req, res) => {
    res.status(404).json({ message: "Not Found" });
  });
  app.use(globalResponse);
  app.listen(port, () =>
    console.log("> Server is up and running on port : " + port)
  );
};
