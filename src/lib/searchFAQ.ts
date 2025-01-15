import Typesense from "typesense";

const COLLECTION_NAME = "appleFaqs";

export const searchFAQ = async (query: string) => {
	const typesense = new Typesense.Client({
		apiKey: import.meta.env.VITE_TYPESENSE_SEARCH_ONLY_API_KEY || "xyz",
		nodes: [
			{
				url: import.meta.env.VITE_TYPESENSE_URL || "http://localhost:8108",
			},
		],
		connectionTimeoutSeconds: 60,
	});

	try {
		const searchParameters = {
			q: query,
			query_by: "question,answer",
			num_typos: 2,
			per_page: 5,
			highlight_full_fields: "question,answer",
			prefix: true,
			sort_by: "_text_match:desc",
			min_len_1typo: 3,
			min_len_2typo: 6,
			exhaustive_search: true,
		};

		const collections = await typesense.collections().retrieve();
		const faqCollection = collections.find(
			(c: any) => c.name === COLLECTION_NAME
		);

		if (!faqCollection) {
			throw new Error(`Collection ${COLLECTION_NAME} not found`);
		}

		const searchResults = await typesense
			.collections(COLLECTION_NAME)
			.documents()
			.search(searchParameters);

		if (!searchResults.hits?.length) {
			return [
				{
					answer:
						"I couldn't find a specific answer to your question. Could you please rephrase or ask something else?",
				},
			];
		}

		return searchResults.hits.map((hit) => hit.document);
	} catch (error) {
		console.error("Error searching FAQs:", error);

		return [
			{
				answer:
					"I'm having trouble accessing the answer database at the moment. Please check if Typesense is running and properly configured.",
			},
		];
	}
};
