import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const imagePath = join(process.cwd(), 'src/content/agents', params.path);
		const imageBuffer = readFileSync(imagePath);

		// Determine content type based on file extension
		const ext = params.path.split('.').pop()?.toLowerCase();
		let contentType = 'image/png'; // default

		switch (ext) {
			case 'jpg':
			case 'jpeg':
				contentType = 'image/jpeg';
				break;
			case 'gif':
				contentType = 'image/gif';
				break;
			case 'svg':
				contentType = 'image/svg+xml';
				break;
			case 'webp':
				contentType = 'image/webp';
				break;
		}

		return new Response(imageBuffer, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000'
			}
		});
	} catch (err) {
		error(404, 'Image not found');
	}
};
