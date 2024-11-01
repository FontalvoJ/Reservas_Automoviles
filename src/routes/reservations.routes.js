import { Router } from "express";
import * as reservationCtrl from "../controllers/reservations.controller";
import { authJwt, validateRoles } from "../middlewares/authJwt";

const router = Router();

router.post(
  "/createReservation",
  [authJwt.verifyToken, validateRoles("client")],
  reservationCtrl.createReservation
);

router.put(
  "/updateReservationStatus/:reservationId",
  [authJwt.verifyToken, validateRoles("admin")],
  reservationCtrl.updateReservationStatus
);

router.get(
  "/allReservations",
  [authJwt.verifyToken, validateRoles("admin")],
  reservationCtrl.getAllReservations
);

router.delete(
  "/deleteReservation/:reservationId",
  [authJwt.verifyToken, validateRoles("admin")],
  reservationCtrl.deleteReservation
);

export default router;
