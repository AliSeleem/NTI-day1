import { FilterData } from "./filterData";
import { Users } from "./user";

declare module "express" {
	interface Request {
		filterData?: FilterData;
		user?: Users;
	}
}
