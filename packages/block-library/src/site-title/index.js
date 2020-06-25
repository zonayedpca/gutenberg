/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { mapMarker as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';

const { name } = metadata;
export { metadata, name };

export const settings = {
	title: __( 'Site Title' ),
	description: __(
		'The name of the site is an important setting that determines how the website is displayed in various places, including the title bar of a web browser, search engine results, and RSS feeds. It can also be edited in Settings > General.'
	),
	icon,
	edit,
};
