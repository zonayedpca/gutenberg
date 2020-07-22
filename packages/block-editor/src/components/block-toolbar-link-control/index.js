/**
 * WordPress dependencies
 */
import {
	DropdownMenu,
	Icon,
	__experimentalInputControl as InputControl,
	MenuGroup,
	MenuItem,
	ToolbarButton,
	__experimentalToolbarItem as ToolbarItem,
	ToolbarGroup,
	Popover,
	Spinner,
} from '@wordpress/components';
import {
	chevronDown as arrowDownIcon,
	check as checkIcon,
	link as linkIcon,
} from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockControls from '../block-controls';
import LinkControlSearchInput from '../link-control/search-input';
import LinkControlSearchResults from '../link-control/search-results';
import useCreatePage from '../link-control/use-create-page';

export default function ToolbarLinkControl( {
	initialLink,
	createSuggestion,
	close,
	onChange,
} ) {
	const [ currentLink, setCurrentLink ] = useState( initialLink );
	const { opensInNewTab, rel } = currentLink;
	const [ editUrl, setEditUrl ] = useState(
		computeNiceURL( currentLink.url )
	);
	const [ shouldShowSuggestions, setShouldShowSuggestions ] = useState(
		true
	);

	const updateCurrentLink = ( data, replace = false ) => {
		setCurrentLink( {
			...( replace ? {} : currentLink ),
			...data,
			url: data.url ? computeNiceURL( data.url ) : editUrl,
		} );
	};

	const finishLinkEditing = ( acceptChanges = true ) => {
		if ( acceptChanges ) {
			onChange( { ...currentLink, url: editUrl } );
		}
		close();
	};

	const { createPage, isCreatingPage, errorMessage } = useCreatePage(
		createSuggestion
	);

	const renderSuggestions = ( props ) => (
		<Popover focusOnMount={ false } position="bottom">
			<LinkControlSearchResults { ...props } />
		</Popover>
	);

	return (
		<BlockControls __experimentalIsExpanded={ true }>
			<ToolbarGroup className="toolbar-link-control__input-group">
				<ToolbarItem>
					{ ( { ref, ...toolbarItemProps } ) => (
						<div className="toolbar-link-control__input-wrapper">
							<LinkControlSearchInput
								currentLink={ currentLink }
								placeholder="Start typing"
								renderSuggestions={ renderSuggestions }
								value={ editUrl }
								onCreateSuggestion={ createPage }
								onChange={ ( url ) => {
									setShouldShowSuggestions( true );
									setEditUrl( computeNiceURL( url ) );
								} }
								onSelect={ ( link ) =>
									updateCurrentLink( link, true )
								}
								showInitialSuggestions={ false }
								allowDirectEntry
								showSuggestions={ shouldShowSuggestions }
								withCreateSuggestion
								renderControl={ (
									controlProps,
									inputProps,
									isLoading
								) => (
									<InputControl
										{ ...controlProps }
										{ ...inputProps }
										className="toolbar-link-control__input-control"
										onChange={ ( value, { event } ) =>
											inputProps.onChange( event )
										}
										prefix={
											<div className="toolbar-link-control__affix-wrapper">
												<Icon icon={ linkIcon } />
											</div>
										}
										suffix={
											<div className="toolbar-link-control__affix-wrapper">
												{ isLoading && <Spinner /> }
											</div>
										}
										{ ...toolbarItemProps }
									/>
								) }
								ref={ ref }
							/>
						</div>
					) }
				</ToolbarItem>
				<ToolbarItem>
					{ ( toolbarItemProps ) => (
						<DropdownMenu
							popoverProps={ { position: 'bottom' } }
							className="link-option"
							contentClassName="link-options__popover"
							icon={ arrowDownIcon }
							onToggle={ ( isOpen ) => {
								if ( isOpen ) {
									setShouldShowSuggestions( false );
								}
							} }
							toggleProps={ {
								...toolbarItemProps,
								name: 'link-options',
								title: __( 'Link options' ),
							} }
						>
							{ ( { onClose } ) => (
								<>
									<MenuGroup>
										<MenuItem
											icon={ opensInNewTab && checkIcon }
											onClick={ () => {
												updateCurrentLink( {
													opensInNewTab: ! opensInNewTab,
												} );
											} }
										>
											{ __( 'Open in new tab' ) }
										</MenuItem>
										<MenuItem
											icon={
												rel === 'nofollow' && checkIcon
											}
											onClick={ () => {
												updateCurrentLink( {
													rel:
														currentLink.rel ===
														'nofollow'
															? ''
															: 'nofollow',
												} );
											} }
										>
											{ __( 'Add nofollow attribute' ) }
										</MenuItem>
									</MenuGroup>
									<MenuGroup>
										<MenuItem
											onClick={ () => {
												setEditUrl( '' );
												onClose();
											} }
										>
											{ __( 'Remove link' ) }
										</MenuItem>
									</MenuGroup>
								</>
							) }
						</DropdownMenu>
					) }
				</ToolbarItem>
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
		</BlockControls>
	);
}

export function computeNiceURL( url ) {
	if ( ! url ) {
		return '';
	}

	let urlData;
	try {
		urlData = new URL( url );
	} catch ( e ) {
		return url;
	}
	let displayUrl = '';

	const siteHost = document.location.host;
	if ( urlData.host && urlData.host !== siteHost ) {
		displayUrl += urlData.host;
	}
	displayUrl += urlData.pathname;
	if ( urlData.search ) {
		displayUrl += urlData.search;
	}
	return displayUrl;
}
