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

// Ruta para actualizar la cuenta de un cliente
router.put(
  "/clientUpdate",
  [authJwt.verifyToken, validateRoles("client")],
  clientsCtrl.updateClientAccount
);

// Ruta para obtener la información del cliente autenticado
router.get(
  "/clientGetData",
  [authJwt.verifyToken, validateRoles("client")],
  clientsCtrl.getClientInfo
);

export default router;
