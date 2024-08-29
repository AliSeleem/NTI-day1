import CategoriesModel from "../Models/CategoriesModel";
import {
	createOne,
	deleteOne,
	getAll,
	getOne,
	updateOne,
} from "./refactorHandler";
import { Categories } from "../interfaces/Categories";

export const createCategory = createOne<Categories>(CategoriesModel);

export const getCategories = getAll<Categories>(CategoriesModel, "categories");

export const getCategory = getOne<Categories>(CategoriesModel);

export const updateCategory = updateOne<Categories>(CategoriesModel);

export const deleteCategory = deleteOne<Categories>(CategoriesModel);
