import { CookieStore } from "@/shared/cookie";
import { rewriteCss } from "@rewriters/css";
import { rewriteHtml, rewriteSrcset } from "@rewriters/html";
import { rewriteUrl, unrewriteBlob, URLMeta } from "@rewriters/url";

export const htmlRules: {
	[key: string]: "*" | string[] | ((...any: any[]) => string | null);
	fn: (value: string, meta: URLMeta, cookieStore: CookieStore) => string | null;
}[] = [
	{
		fn: (value: string, meta: URLMeta) => {
			return rewriteUrl(value, meta);
		},

		src: ["embed", "script", "img", "frame", "source", "input", "track"],
		href: ["a", "link", "area", "use", "image"],
		data: ["object"],
		action: ["form"],
		formaction: ["button", "input", "textarea", "submit"],
		poster: ["video"],
		"xlink:href": ["image"],
	},
	{
		fn: (value: string, meta: URLMeta) => {
			const url = rewriteUrl(value, meta);

			return url;
		},
		src: ["iframe"],
	},
	{
		fn: (value: string, meta: URLMeta) => {
			return null;
		},
		sandbox: ["iframe"],
	},
	{
		fn: (value: string, meta: URLMeta) => {
			if (value.startsWith("blob:")) {
				return unrewriteBlob(value);
			}

			return rewriteUrl(value, meta);
		},
		src: ["video", "audio"],
	},
	{
		fn: () => "",

		integrity: ["script", "link"],
	},
	{
		fn: () => null,

		nonce: "*",
		csp: ["iframe"],
		credentialless: ["iframe"],
	},
	{
		fn: (value: string, meta: URLMeta) => rewriteSrcset(value, meta),

		srcset: ["img", "source"],
		imagesrcset: ["link"],
	},
	{
		fn: (value: string, meta: URLMeta, cookieStore: CookieStore) =>
			rewriteHtml(
				value,
				cookieStore,
				{
					origin: new URL(meta.origin.origin),
					base: new URL(meta.origin.origin),
				},
				true
			),

		srcdoc: ["iframe"],
	},
	{
		fn: (value: string, meta: URLMeta) => rewriteCss(value, meta),
		style: "*",
	},
	{
		fn: (value: string, meta: URLMeta) => {
			if (value === "_top" || value === "_unfencedTop")
				return meta.topFrameName;
			else if (value === "_parent") return meta.parentFrameName;
			else return value;
		},
		target: ["a", "base"],
	},
];
