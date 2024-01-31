import {AdminUserService} from "../../domain/services/admin.user.service";
import {AbstractController} from "./abstract.controller";

export abstract class AdminAbstractController extends AbstractController {
  constructor(protected _adminUserService: AdminUserService) {
    super();
  }

  protected async isAdminUser(userId: string): Promise<boolean> {
    return this._adminUserService.isAdmin(userId);
  }
}
