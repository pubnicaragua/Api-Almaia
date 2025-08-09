/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import Joi from "joi";
import { EmailService } from "../../../core/services/EmailService";

const ContactoAlmaiachema = Joi.object({
    nombre: Joi.string().max(100).required(),
    email: Joi.string().max(100).required(),
    telefono: Joi.string().max(50).required(),
    asunto: Joi.string().max(200).required(),
    mensaje: Joi.string().max(200).required(),
    to: Joi.string().max(100)
});
export const CONTACTO_SERVICES = {
    async contactoAlmaia(req: Request, res: Response) {
        try {
            const { value, error } = ContactoAlmaiachema.validate(req.body)
            if (error) {
                throw new Error("Campos requeridos (nombre, telefono, email)");
            }
            console.log('entra ==============>', req.body)
            const { nombre, telefono, email, asunto, mensaje, to } = req.body
            new EmailService().enviarEmail(
                to ? [to] : ["dxgabalt@gmail.com", "alexmedel@almaia.cl", "contacto@almaia.cl", "crivas@almaia.cl", "soporte@almaia.cl"],
                {
                    subject: "Nuevo contacto desde el sitio web AlmaIA",
                    html: `
                 <h2>¡🔐 CONTACTO RECIBIDO!</h2>
                <p>Hemos recibido un nuevo contacto 📲</p>
                <b>🧾 Datos del contacto:</b>
                <ul>
                <li>📛 Nombre: {{nombre}}</li>
                <li>📧 Correo electronico: {{email}}</li>
                <li>🚀 Asunto: {{asunto}}</li>
                <li>📝 Mensaje: {{mensaje}}</li>
                <li>📱 Telefono: {{telefono}}</li> 
                <li>🗓️ Fecha: {{fecha}}</li>
                <link href="https://nextjs.org/"/>
                </ul>
                `
                }, { nombre, telefono, email, asunto, mensaje, fecha: new Date().toLocaleDateString() })
            res.json({ message: "Contacto enviado" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

};
