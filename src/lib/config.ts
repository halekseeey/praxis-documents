import type { SocialLink } from '$lib/types/nav';

import type { PromoConfig, SiteConfig } from './types/config';

export const topLevelOrder = [
	'Getting Started',
	'Core Concepts',
	'Tokenomics',
	'Agents',
	'Tools',
	'Providers',
	'Services'
];

export const siteConfig: SiteConfig = {
	version: '0.0.1',
	title: 'Documentation'
};

export let socialLinks: SocialLink[] = [
	// {
	//     title: 'LinkedIn',
	//     href: 'https://www.linkedin.com/in/giovanirodriguez26/',
	//     icon: 'linkedin'
	// },
	{
		title: 'GitHub',
		href: 'https://github.com/code-gio',
		icon: 'github'
	}
];

export let promoConfig: PromoConfig = {
	title: 'Need help with your project?',
	description:
		'I offer custom development services, consulting, and technical guidance for your web applications.',
	ctaText: "Let's work together",
	ctaLink: 'mailto:info@codegio.com',
	lightImage: '/images/dev-services-light.jpg',
	darkImage: '/images/dev-services-dark.jpg'
};

export const supportedCodeLanguages = [
	'typescript',
	'javascript',
	'bash',
	'markdown',
	'json',
	'html',
	'css',
	'svelte',
	'shell',
	'tsx',
	'python',
	'plaintext'
];
