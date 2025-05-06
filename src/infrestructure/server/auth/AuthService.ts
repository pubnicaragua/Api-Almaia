import { Request, Response } from "express";
import { Usuario } from "../../../core/modelo/auth/Usuario";
import { DataService } from "../DataService";

const dataService:DataService<Usuario> = new DataService("login");

export const AuthService = {
    async login(req: Request, res: Response) {

    },
    async register(req: Request, res: Response) {},
    async changePassword(req: Request, res: Response) {}
}
