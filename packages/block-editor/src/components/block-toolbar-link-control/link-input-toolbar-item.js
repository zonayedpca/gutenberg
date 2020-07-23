/**
 * External dependencies
 */
import { unstable_CompositeItemWidget as ToolbarWidget } from 'reakit/Composite';

/**
 * WordPress dependencies
 */
import {
	__experimentalToolbarItem as ToolbarItem,
	Popover,
	__experimentalToolbarContext as ToolbarContext,
	__experimentalInputControl as InputControl,
	Icon,
	Spinner,
} from '@wordpress/components';
import { link as linkIcon } from '@wordpress/icons';
import {
	useContext,
	useEffect,
	useState,
} from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import LinkControlSearchResults from '../link-control/search-results';
import LinkControlSearchInput from '../link-control/search-input';
import useCreatePage from '../link-control/use-create-page';
import ToolbarLinkControlContext from './context';

export default function LinkInputToolbarItem() {
	const toolbar = useContext( ToolbarContext );

	const [ editUrl, setEditUrl ] = useState( '' );
	return (
		<ToolbarItem>
			{ ( htmlProps ) => (
				<div
					{ ...htmlProps }
					className="toolbar-link-control__input-wrapper"
				>
					<ToolbarWidget
						as={ ToolbarLinkEditorControl }
						{ ...toolbar }
						value={ editUrl }
						onChange={ setEditUrl }
					/>
				</div>
			) }
		</ToolbarItem>
	);
}

const ToolbarLinkEditorControl = function ( props ) {
	const {
		createSuggestion,
		currentLink,
		updateCurrentLink,
		preferredDropdown,
		setPreferredDropdown,
	} = useContext( ToolbarLinkControlContext );

	const { createPage, isCreatingPage, errorMessage } = useCreatePage(
		createSuggestion
	);

	const { createErrorNotice } = useDispatch( 'core/notices' );
	useEffect( () => {
		if ( errorMessage ) {
			createErrorNotice( errorMessage, { type: 'snackbar' } );
		}
	}, [ errorMessage ] );

	return (
		<LinkControlSearchInput
			currentLink={ currentLink }
			placeholder="Start typing"
			renderSuggestions={ renderSuggestions }
			value={ currentLink.url }
			onCreateSuggestion={ createPage }
			onChange={ ( url ) => {
				setPreferredDropdown( 'suggestions' );
				updateCurrentLink( { url } );
			} }
			onSelect={ ( link ) => {
				updateCurrentLink( link, true );
			} }
			showInitialSuggestions={ false }
			allowDirectEntry
			showSuggestions={ preferredDropdown === 'suggestions' }
			withCreateSuggestion
			renderControl={ ( controlProps, inputProps, isLoading ) => {
				return (
					<InputControl
						{ ...controlProps }
						{ ...inputProps }
						{ ...props }
						className="toolbar-link-control__input-control"
						value={ inputProps.value }
						onKeyDown={ ( event ) => {
							inputProps.onKeyDown( event );
							props.onKeyDown( event );
						} }
						onChange={ ( value, { event } ) => {
							inputProps.onChange( event );
							props.onChange( event );
						} }
						onFocus={ ( event ) => {
							inputProps.onFocus( event );
							props.onFocus( event );
						} }
						prefix={
							<div className="toolbar-link-control__affix-wrapper">
								<Icon icon={ linkIcon } />
							</div>
						}
						suffix={
							<div className="toolbar-link-control__affix-wrapper">
								{ ( isCreatingPage || isLoading ) && (
									<Spinner />
								) }
							</div>
						}
					/>
				);
			} }
		/>
	);
};

const renderSuggestions = ( suggestionsProps ) => (
	<Popover focusOnMount={ false } position="bottom">
		<LinkControlSearchResults { ...suggestionsProps } />
	</Popover>
);
