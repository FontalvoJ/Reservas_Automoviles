import Client from "../models/Client";

// Función para manejar la eliminación de la cuenta de cliente
export const deleteClientAccount = async (req, res) => {
  try {
    const clientId = req.userId;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await Client.findByIdAndDelete(clientId);

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting client account:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateClientAccount = async (req, res) => {
  try {
    const clientId = req.userId; // El clientId ya está disponible por el middleware `verifyToken`

    // Extraemos los datos de la solicitud
    const { name, identification, address, contact, email, password } =
      req.body;

    // Buscamos al cliente por su ID
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Creamos un objeto para almacenar los datos que se van a actualizar
    const updatedData = {};

    if (name) updatedData.name = name;
    if (identification) updatedData.identification = identification;
    if (address) updatedData.address = address;
    if (contact) updatedData.contact = contact;
    if (email) updatedData.email = email;

    // Si se proporciona una nueva contraseña, la encriptamos
    if (password) {
      updatedData.password = await Client.encryptPassword(password);
    }

    // Actualizamos el cliente en la base de datos con los nuevos datos
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      updatedData,
      {
        new: true, // Devolvemos el objeto actualizado
        runValidators: true, // Validamos los cambios contra el modelo
      }
    );

    // Devolvemos la respuesta con los datos del cliente actualizado
    return res.status(200).json({
      message: "Client account updated successfully",
      client: updatedClient,
    });
  } catch (error) {
    console.error("Error updating client account:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getClientInfo = async (req, res) => {
  try {
    const clientId = req.userId;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json({
      message: "Client information retrieved successfully",
      client,
    });
  } catch (error) {
    console.error("Error retrieving client information:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export default {
  deleteClientAccount,
  updateClientAccount,
  getClientInfo,
};
