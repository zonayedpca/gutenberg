/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

const ToolbarLinkControlContext = createContext( {
	createSuggestion: null,
	currentLink: null,
	updateCurrentLink: null,
	shouldShowSuggestions: null,
	setShouldShowSuggestions: null,
} );
export default ToolbarLinkControlContext;
