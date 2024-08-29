import { filterData } from "./filterData";
import { Users } from "./user";

// TODO: fix this errorrrrrrrrrrr

declare module "express" {
	interface Request {
		filterData?: filterData;
		files?: any;
		user?: Users;
	}
}
