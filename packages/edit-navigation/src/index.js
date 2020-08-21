/**
 * External dependencies
 */
import { map, set, flatten } from 'lodash';

/**
 * WordPress dependencies
 */
import '@wordpress/notices';
import {
	registerCoreBlocks,
	__experimentalRegisterExperimentalCoreBlocks,
} from '@wordpress/block-library';
import { render } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { decodeEntities } from '@wordpress/html-entities';
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import Layout from './components/layout';
import './store';

function disableInsertingNonNavigationBlocks( settings, name ) {
	if ( ! [ 'core/navigation', 'core/navigation-link' ].includes( name ) ) {
		set( settings, [ 'supports', 'inserter' ], false );
	}
	return settings;
}

/**
 * Fetches link suggestions from the API. This function is an exact copy of a function found at:
 *
 * wordpress/editor/src/components/provider/index.js
 *
 * It seems like there is no suitable package to import this from. Ideally it would be either part of core-data.
 * Until we refactor it, just copying the code is the simplest solution.
 *
 * @param {Object} search
 * @param {number} perPage
 * @return {Promise<Object[]>} List of suggestions
 */
function fetchLinkSuggestions( search, { perPage = 20 } = {} ) {
	const posts = apiFetch( {
		path: addQueryArgs( '/wp/v2/search', {
			search,
			per_page: perPage,
			type: 'post',
		} ),
	} );

	const terms = apiFetch( {
		path: addQueryArgs( '/wp/v2/search', {
			search,
			per_page: perPage,
			type: 'term',
		} ),
	} );

	const formats = apiFetch( {
		path: addQueryArgs( '/wp/v2/search', {
			search,
			per_page: perPage,
			type: 'post-format',
		} ),
	} );

	return Promise.all( [ posts, terms, formats ] ).then( ( results ) => {
		return map( flatten( results ), ( result ) => ( {
			id: result.id,
			url: result.url,
			title: decodeEntities( result.title ) || __( '(no title)' ),
			type: result.subtype || result.type,
		} ) );
	} );
}

export function initialize( id, settings ) {
	if ( ! settings.blockNavMenus ) {
		addFilter(
			'blocks.registerBlockType',
			'core/edit-navigation/disable-inserting-non-navigation-blocks',
			disableInsertingNonNavigationBlocks
		);
	}

	registerCoreBlocks();

	if ( process.env.GUTENBERG_PHASE === 2 ) {
		__experimentalRegisterExperimentalCoreBlocks( settings );
	}

	settings.__experimentalFetchLinkSuggestions = fetchLinkSuggestions;

	render(
		<Layout blockEditorSettings={ settings } />,
		document.getElementById( id )
	);
}
