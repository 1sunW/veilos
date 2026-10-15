import { type URLMeta } from "@rewriters/url";

import type {
	default as BareClient,
	BareResponseFetch,
} from "@mercuryworkshop/bare-mux";
import { ScramjetDB } from "@/types";
import { IDBPDatabase } from "idb";
import { openScramjetDB } from "@/shared/db";

const CACHE_DURATION_MINUTES = 60;
const CACHE_KEY = "publicSuffixList";

async function getDB(): Promise<IDBPDatabase<ScramjetDB>> {
	return openScramjetDB();
}

async function getCachedSuffixList(): Promise<{
	data: string[];
	expiry: number;
} | null> {
	try {
		const db = await getDB();
		if (!db.objectStoreNames.contains("publicSuffixList")) return null;

		return (await db.get("publicSuffixList", CACHE_KEY)) || null;
	} catch (e) {
		console.warn("Failed to getCachedSuffixList from IDB", e);

		return null;
	}
}

async function setCachedSuffixList(data: string[]): Promise<void> {
	try {
		const db = await getDB();
		if (!db.objectStoreNames.contains("publicSuffixList")) return;
		await db.put(
			"publicSuffixList",
			{
				data,
				expiry: Date.now() + CACHE_DURATION_MINUTES * 60 * 1000,
			},
			CACHE_KEY
		);
	} catch (e) {
		console.warn("Failed to setCachedSuffixList in IDB", e);
	}
}

export async function getSiteDirective(
	meta: URLMeta,
	referrerURL: URL,
	client: BareClient
): Promise<string> {
	if (!referrerURL) {
		return "none";
	}

	if (meta.origin.origin === referrerURL.origin) {
		return "same-origin";
	}

	const sameSite = await isSameSite(meta.origin, referrerURL, client);
	if (sameSite) {
		return "same-site";
	}

	return "cross-site";
}

export async function isSameSite(
	url1: URL,
	url2: URL,
	client: BareClient
): Promise<boolean> {
	const registrableDomain1 = await getRegistrableDomain(url1, client);
	const registrableDomain2 = await getRegistrableDomain(url2, client);

	return registrableDomain1 === registrableDomain2;
}

async function getRegistrableDomain(
	url: URL,
	client: BareClient
): Promise<string> {
	const publicSuffixes = await getPublicSuffixList(client);

	const hostname = url.hostname.toLowerCase();
	const labels = hostname.split(".");
	let matchedSuffix = "";

	let isException = false;
	for (const suffix of publicSuffixes) {
		const actualSuffix = suffix.startsWith("!") ? suffix.substring(1) : suffix;
		const suffixLabels = actualSuffix.split(".");

		if (matchesSuffix(labels, suffixLabels)) {
			if (suffix.startsWith("!")) {
				matchedSuffix = actualSuffix;
				isException = true;
				break;
			}
			if (!isException && actualSuffix.length > matchedSuffix.length) {
				matchedSuffix = actualSuffix;
			}
		}
	}

	if (!matchedSuffix) {
		return labels.slice(-2).join(".");
	}

	const suffixLabelCount = matchedSuffix.split(".").length;
	const domainLabelCount = isException
		? suffixLabelCount
		: suffixLabelCount + 1;

	return labels.slice(-domainLabelCount).join(".");
}

function matchesSuffix(
	hostnameLabels: string[],
	suffixLabels: string[]
): boolean {
	if (hostnameLabels.length < suffixLabels.length) {
		return false;
	}

	const offset = hostnameLabels.length - suffixLabels.length;
	for (let i = 0; i < suffixLabels.length; i++) {
		const hostLabel = hostnameLabels[offset + i];
		const suffixLabel = suffixLabels[i];

		if (suffixLabel === "*") {
			continue;
		}

		if (hostLabel !== suffixLabel) {
			return false;
		}
	}

	return true;
}

export async function getPublicSuffixList(
	client: BareClient
): Promise<string[]> {
	const cached = await getCachedSuffixList();
	if (cached && Date.now() < cached.expiry) {
		return cached.data;
	}

	let publicSuffixesResponse: BareResponseFetch;
	try {
		publicSuffixesResponse = await client.fetch(
			"https://publicsuffix.org/list/public_suffix_list.dat"
		);
	} catch (err) {
		throw new Error(`Failed to fetch public suffix list: ${err}`);
	}
	const publicSuffixesRaw = await publicSuffixesResponse.text();

	const publicSuffixes = publicSuffixesRaw
		.split("\n")
		.map((line) => {
			const trimmed = line.trim();
			const spaceIndex = trimmed.indexOf(" ");

			return spaceIndex > -1 ? trimmed.substring(0, spaceIndex) : trimmed;
		})
		.filter((line) => line && !line.startsWith("//"));

	await setCachedSuffixList(publicSuffixes);

	return publicSuffixes;
}
