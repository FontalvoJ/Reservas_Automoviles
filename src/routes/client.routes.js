import { Router } from "express";
import * as clientsCtrl from "../controllers/clients.controllers";
import { authJwt, validateRoles } from "../middlewares/authJwt";

const router = Router();

// Ruta para eliminar la cuenta de un cliente
router.delete(
  "/clientDelete",
  [authJwt.verifyToken, validateRoles("client")],
  clientsCtrl.deleteClientAccount
);

router.put(
  "/clientUpdate",
  [authJwt.verifyToken, validateRoles("client")],
  clientsCtrl.updateClientAccount
);

export default router;
