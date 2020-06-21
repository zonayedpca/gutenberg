/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	__experimentalAlignmentHookSettingsProvider as AlignmentHookSettingsProvider,
	BlockControls,
	InnerBlocks,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { name as buttonBlockName } from '../button';
import ContentJustificationDropdown from './content-justification-dropdown';

const ALLOWED_BLOCKS = [ buttonBlockName ];
const BUTTONS_TEMPLATE = [ [ 'core/button' ] ];

// Inside buttons block alignment options are not supported.
const alignmentHooksSetting = {
	isEmbedButton: true,
};

function ButtonsEdit( {
	attributes: { contentJustification },
	className,
	setAttributes,
} ) {
	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ContentJustificationDropdown
						value={ contentJustification }
						onChange={ ( updatedValue ) => {
							setAttributes( {
								contentJustification: updatedValue,
							} );
						} }
					/>
				</ToolbarGroup>
			</BlockControls>
			<Block.div
				className={ classnames( className, {
					[ `is-content-justification-${ contentJustification }` ]: contentJustification,
				} ) }
			>
				<AlignmentHookSettingsProvider value={ alignmentHooksSetting }>
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ BUTTONS_TEMPLATE }
						__experimentalMoverDirection="horizontal"
					/>
				</AlignmentHookSettingsProvider>
			</Block.div>
		</>
	);
}

export default ButtonsEdit;
