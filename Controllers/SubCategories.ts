import SubCategoriesModel from "../Models/SubCategoriesModel";
import {
	createOne,
	deleteOne,
	getAll,
	getOne,
	updateOne,
} from "./refactorHandler";
import { SubCategories } from "../interfaces/SubCategories";

export const createSubCategory = createOne<SubCategories>(SubCategoriesModel);

export const getSubCategories = getAll<SubCategories>(
	SubCategoriesModel,
	"categories"
);

export const getSubCategory = getOne<SubCategories>(SubCategoriesModel);

export const updateSubCategory = updateOne<SubCategories>(SubCategoriesModel);

export const deleteSubCategory = deleteOne<SubCategories>(SubCategoriesModel);
