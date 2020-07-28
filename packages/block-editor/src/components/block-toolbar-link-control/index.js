/**
 * WordPress dependencies
 */
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useCallback, useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockControls from '../block-controls';
import SettingsToolbarItem from './settings-toolbar-item';
import LinkInputToolbarItem from './link-input-toolbar-item';
import computeDisplayUrl from './compute-display-url';
import ToolbarLinkControlContext from './context';

export default function ToolbarLinkControl( {
	initialLink,
	createSuggestion,
	close,
	onChange,
} ) {
	const [ currentLink, setCurrentLink ] = useState( {
		...initialLink,
		url: computeDisplayUrl( initialLink.url ),
	} );

	const [ preferredDropdown, setPreferredDropdown ] = useState(
		'suggestions'
	);

	const updateCurrentLink = useCallback(
		( data, replace = false ) => {
			setCurrentLink( {
				...( replace ? {} : currentLink ),
				...data,
				url: data.url ? computeDisplayUrl( data.url ) : currentLink.url,
			} );
		},
		[ currentLink ]
	);

	const finishLinkEditing = ( acceptChanges = true ) => {
		if ( acceptChanges ) {
			onChange( currentLink );
		}
		close();
	};

	const contextValue = useMemo(
		() => ( {
			createSuggestion,
			currentLink,
			updateCurrentLink,
			preferredDropdown,
			setPreferredDropdown,
		} ),
		[
			createSuggestion,
			currentLink,
			updateCurrentLink,
			preferredDropdown,
			setPreferredDropdown,
		]
	);

	return (
		<BlockControls __experimentalIsExpanded={ true }>
			<ToolbarLinkControlContext.Provider value={ contextValue }>
				<ToolbarGroup>
					<LinkInputToolbarItem />
				</ToolbarGroup>
				<ToolbarGroup className="toolbar-link-control__input-group">
					<SettingsToolbarItem />
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton
						name="done"
						title={ __( 'Done' ) }
						onClick={ () => finishLinkEditing( true ) }
					>
						Done
					</ToolbarButton>
				</ToolbarGroup>
			</ToolbarLinkControlContext.Provider>
		</BlockControls>
	);
}
