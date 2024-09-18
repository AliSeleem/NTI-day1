import mongoose, { isValidObjectId } from "mongoose";
import {
	PaginationQuery,
	queryString,
	SearchQuery,
} from "../interfaces/features";

class features {
	constructor(
		public mongooseQuery: mongoose.Query<any[], any>,
		private readonly queryString: queryString
	) {}

	filter() {
		const query = { ...this.queryString };
		const executed: string[] = ["page", "limit", "sort", "fields", "search"];
		for (const key in query) {
			if (executed.includes(key)) {
				delete query[key];
			}
		}
		let querystr: string = JSON.stringify(query);
		querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
		this.mongooseQuery = this.mongooseQuery.find(JSON.parse(querystr));
		return this;
	}

	sort() {
		if (this.queryString.sort) {
			const sortBy: string = this.queryString.sort.split(",").join(" ");
			this.mongooseQuery = this.mongooseQuery.sort(sortBy);
		} else {
			this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
		}
		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			const fields: string = this.queryString.fields.split(",").join(" ");
			this.mongooseQuery = this.mongooseQuery.select(fields);
		} else {
			this.mongooseQuery = this.mongooseQuery.select("-__v");
		}
		return this;
	}

	search(modelName: string) {
		if (this.queryString.search) {
			let query: SearchQuery = {};
			if (modelName === "products") {
				query.$or = [
					{ name: new RegExp(this.queryString.search, "i") },
					{ description: new RegExp(this.queryString.search, "i") },
				];
			} else {
				query = { name: new RegExp(this.queryString.search, "i") };
			}
			this.mongooseQuery = this.mongooseQuery.find(query);
		}
		return this;
	}

	pagination(docsCount: number) {
		const page: number = this.queryString.page || 1;
		const limit: number = this.queryString.limit || 10;
		const skip: number = (page - 1) * limit;
		const endIndex: number = page * limit;
		const pagination: PaginationQuery = {};
		pagination.currentPage = Number(page);
		pagination.limit = Number(limit);
		pagination.totalPages = Math.ceil(docsCount / limit);
		if (endIndex < docsCount) {
			pagination.next = Number(page) + 1;
		}
		if (skip > 0) {
			pagination.prev = Number(page) + 1;
		}
		this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
		return { ...this, paginationResult: pagination };
	}
}

export default features;
