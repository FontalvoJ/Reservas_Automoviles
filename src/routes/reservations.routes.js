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

router.delete(
  "/deleteReservation/:reservationId",
  [authJwt.verifyToken, validateRoles("admin")],
  reservationCtrl.deleteReservation
);

router.get(
  "/userReservations",
  [authJwt.verifyToken, validateRoles("client")],
  reservationCtrl.getUserActiveReservations
);

router.get(
  "/listAllReservations",
  [authJwt.verifyToken, validateRoles("admin")],
  reservationCtrl.listAllReservations
);

export default router;
