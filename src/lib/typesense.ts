import Typesense from "typesense";
import fs from "fs/promises";
import { resolve } from "path";
import dotenv from "dotenv";

dotenv.config();

const COLLECTION_NAME =
	process.env.REACT_APP_TYPESENSE_COLLECTION_NAME || "appleFaqs";
const PATH_TO_DATASET = resolve("src/data/faqData.jsonl");
const FORCE_REINDEX = process.env.FORCE_REINDEX === "true";

(async () => {
	console.log("Connecting to Typesense server...");

	const typesense = new Typesense.Client({
		apiKey: process.env.REACT_APP_TYPESENSE_ADMIN_API_KEY || "xyz",
		nodes: [
			{
				url: process.env.REACT_APP_TYPESENSE_URL || "http://localhost:8108",
			},
		],
		connectionTimeoutSeconds: 60,
	});

	try {
		// Check if the collection exists
		await typesense.collections(COLLECTION_NAME).retrieve();
		console.log(`Found existing collection: ${COLLECTION_NAME}`);

		if (!FORCE_REINDEX) {
			console.log("FORCE_REINDEX is false. Canceling operation...");
			return;
		}

		console.log("Deleting existing collection...");
		await typesense.collections(COLLECTION_NAME).delete();
	} catch (err) {
		if (err instanceof Error) {
			console.error(`Error retrieving/deleting collection: ${err.message}`);
		} else {
			console.error(`Error retrieving/deleting collection: ${err}`);
		}
	}

	console.log("Creating schema...");

	try {
		await typesense.collections().create({
			name: COLLECTION_NAME,
			fields: [
				{ name: "id", type: "string", facet: false },
				{ name: "question", type: "string", facet: false },
				{ name: "answer", type: "string", facet: false },
			],
		});
		console.log("Schema created successfully.");
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error creating schema: ${error.message}`);
		} else {
			console.error(`Error creating schema: ${error}`);
		}
	}

	console.log("Indexing data...");

	try {
		const dataset = await fs.readFile(PATH_TO_DATASET, "utf-8");

		const importResults = await typesense
			.collections(COLLECTION_NAME)
			.documents()
			.import(dataset);

		console.log("Import Results: ", importResults);
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error indexing data: ${error.message}`);
		} else {
			console.error(`Error indexing data: ${error}`);
		}
	}
})();
