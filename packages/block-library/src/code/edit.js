/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	RichText,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';

export default function CodeEdit( { attributes, setAttributes } ) {
	return (
		<Block.pre>
			<RichText
				tagName="code"
				value={ attributes.content }
				onChange={ ( content ) => setAttributes( { content } ) }
				placeholder={ __( 'Write code…' ) }
				aria-label={ __( 'Code' ) }
			/>
		</Block.pre>
	);
}
