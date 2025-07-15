export interface SiteConfig {
	/** Current version of the documentation/project */
	version: string;

	/** Main title of the documentation site */
	title: string;
}
export interface PromoConfig {
	title: string;
	description: string;
	ctaText: string;
	ctaLink: string;
	lightImage?: string;
	darkImage?: string;
}
