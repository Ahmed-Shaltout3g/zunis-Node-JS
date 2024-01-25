import { connectionDB } from "../../DB/connection.js";
import * as allRoutes from "../Modules/index.routes.js";
import { globalResponse } from "./errorHandling.js";
import cors from "cors";
export const initatApp = (express, app) => {
  const port = process.env.PORT || 5000;

  app.use(express.json());
  connectionDB();
  app.use(cors());
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
