/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { DataService } from "../DataService";
import { Docente } from "../../../core/modelo/colegio/Docente";
import { SupabaseClientService } from "../../../core/services/supabaseClient";
import { SupabaseClient } from "@supabase/supabase-js";
import Joi from "joi";
import { EmailService } from "../../../core/services/EmailService";

const supabaseService = new SupabaseClientService();
const client: SupabaseClient = supabaseService.getClient();

const ContactoAlmaiachema = Joi.object({
    nombre: Joi.string().max(50).required(),
    email: Joi.string().max(100).required(),
    telefono: Joi.string().max(50).required(),
});
export const CONTACTO_SERVICES = {
    async contactoAlmaia(req: Request, res: Response) {
        try {
            const { value, error } = ContactoAlmaiachema.validate(req.body)
            if (error) {
                throw new Error("Campos requeridos (nombre, telefono, correo)");
            }
            const { nombre, telefono, email } = req.body
            new EmailService().enviarEmail(["dxgabalt@gmail.com", "alexmedel@almaia.cl", "contacto@almaia.cl", "crivas@almaia.cl"], {
                subject: "Nuevo contacto desde el sitio web AlmaIA",
                html: `
                 <h2>¡🔐 CONTACTO RECIBIDO!</h2>
        <p>Hemos recibido un nuevo contacto 📲</p>
        <b>🧾 Datos del contacto:</b>
        <ul>
          <li>📛 Nombre: {{nombre}}</li>
          <li>📧 Correo electronico: {{email}}</li>
          <li>📱 Telefono: {{telefono}}</li> 
          <li>🗓️ Fecha: {{fecha}}</li>
          <link href="https://nextjs.org/"/>
        </ul>
                `
            }, { nombre, telefono, email, fecha: new Date().toLocaleDateString() })
            res.json({ message: "Contacto enviado" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

};
