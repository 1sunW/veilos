import {
	type RedirectTracker,
	type ReferrerPolicyData,
	type SiteDirective,
	ScramjetDB,
} from "@/types";
import { IDBPDatabase } from "idb";
import { openScramjetDB } from "@/shared/db";

const TRACKER_EXPIRY = 60 * 60 * 1000;
const SITE_HIERARCHY: Record<SiteDirective, number> = {
	none: 0,
	"same-origin": 1,
	"same-site": 2,
	"cross-site": 3,
};

async function getDB(): Promise<IDBPDatabase<ScramjetDB>> {
	return openScramjetDB();
}

async function getTracker(url: string): Promise<RedirectTracker | null> {
	try {
		const db = await getDB();
		if (!db.objectStoreNames.contains("redirectTrackers")) return null;

		return (await db.get("redirectTrackers", url)) || null;
	} catch (e) {
		console.warn("Failed to getTracker from IDB", e);

		return null;
	}
}

async function setTracker(
	url: string,
	tracker: RedirectTracker
): Promise<void> {
	try {
		const db = await getDB();
		if (!db.objectStoreNames.contains("redirectTrackers")) return;
		await db.put("redirectTrackers", tracker, url);
	} catch (e) {
		console.warn("Failed to setTracker in IDB", e);
	}
}

async function deleteTracker(url: string): Promise<void> {
	try {
		const db = await getDB();
		if (!db.objectStoreNames.contains("redirectTrackers")) return;
		await db.delete("redirectTrackers", url);
	} catch (e) {
		console.warn("Failed to deleteTracker from IDB", e);
	}
}

export async function initializeTracker(
	requestUrl: string,
	referrer: string | null,
	initialSite: string
): Promise<void> {
	const existing = await getTracker(requestUrl);
	if (existing) {
		return;
	}

	await setTracker(requestUrl, {
		originalReferrer: referrer || "",
		mostRestrictiveSite: initialSite as SiteDirective,
		referrerPolicy: "",
		chainStarted: Date.now(),
	});
}

export async function updateTracker(
	originalUrl: string,
	redirectUrl: string,
	newReferrerPolicy?: string
): Promise<void> {
	const tracker = await getTracker(originalUrl);
	if (!tracker) return;

	await deleteTracker(originalUrl);
	if (newReferrerPolicy) {
		tracker.referrerPolicy = newReferrerPolicy;
	}
	await setTracker(redirectUrl, tracker);
}

export async function getMostRestrictiveSite(
	requestUrl: string,
	currentSite: string
): Promise<string> {
	const tracker = await getTracker(requestUrl);
	if (!tracker) return currentSite;

	const trackedValue = SITE_HIERARCHY[tracker.mostRestrictiveSite];
	const currentValue = SITE_HIERARCHY[currentSite as SiteDirective] ?? 0;

	if (currentValue > trackedValue) {
		tracker.mostRestrictiveSite = currentSite as SiteDirective;
		await setTracker(requestUrl, tracker);

		return currentSite;
	}

	return tracker.mostRestrictiveSite;
}

export async function cleanTracker(requestUrl: string): Promise<void> {
	await deleteTracker(requestUrl);
}

export async function cleanExpiredTrackers(): Promise<void> {
	try {
		const now = Date.now();
		const db = await getDB();
		if (!db.objectStoreNames.contains("redirectTrackers")) return;
		const tx = db.transaction("redirectTrackers", "readwrite");

		for await (const cursor of tx.store) {
			const tracker = cursor.value as RedirectTracker;
			if (now - tracker.chainStarted > TRACKER_EXPIRY) {
				cursor.delete();
			}
		}

		await tx.done;
	} catch (e) {
		console.warn("Failed to cleanExpiredTrackers in IDB", e);
	}
}

export async function storeReferrerPolicy(
	url: string,
	policy: string,
	referrer: string
): Promise<void> {
	try {
		const db = await getDB();
		if (!db.objectStoreNames.contains("referrerPolicies")) return;
		const data: ReferrerPolicyData = { policy, referrer };
		await db.put("referrerPolicies", data, url);
	} catch (e) {
		console.warn("Failed to storeReferrerPolicy in IDB", e);
	}
}

export async function getReferrerPolicy(
	url: string
): Promise<ReferrerPolicyData | null> {
	try {
		const db = await getDB();
		if (!db.objectStoreNames.contains("referrerPolicies")) return null;

		return (await db.get("referrerPolicies", url)) || null;
	} catch (e) {
		console.warn("Failed to getReferrerPolicy from IDB", e);

		return null;
	}
}
