import { Router } from "express";
import * as carsCtrl from "../controllers/cars.controllers";
import { authJwt, validateRoles } from "../middlewares/authJwt";

const router = Router();

router.get("/allCars", authJwt.verifyToken, carsCtrl.getAllCars);

router.get(
  "/carsByAdmin",
  [authJwt.verifyToken, validateRoles("admin")],
  carsCtrl.getCarsByAdmin
);

router.post(
  "/createCar",
  [authJwt.verifyToken, validateRoles("admin")],
  carsCtrl.createCar
);

router.put(
  "/updateCar/:id",
  [authJwt.verifyToken, validateRoles("admin")],
  carsCtrl.updateCar
);

router.delete(
  "/deleteCar/:id",
  [(authJwt.verifyToken, validateRoles("admin"))],
  carsCtrl.deleteCar
);

export default router;
