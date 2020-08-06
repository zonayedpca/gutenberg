/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { useBlockEditContext } from '../block-edit';

/**
 * Hook that retrieves the setting for the given editor feature.
 * It works with nested objects using by finding the value at path.
 *
 * @param {string} featurePath  The path to the feature.
 *
 * @return {any} Returns the value defined for the setting.
 *
 * @example
 * ```js
 * const isEnabled = useEditorFeature( 'typography.dropCap' );
 * ```
 */
export default function useEditorFeature( featurePath ) {
	const { name: blockName } = useBlockEditContext();
	const blockPath = `__experimentalFeatures.${ blockName }.${ featurePath }`;
	const globalPath = `__experimentalFeatures.global.${ featurePath }`;

	const setting = useSelect(
		( select ) => {
			const { getBlockSupport } = select( 'core/blocks' );

			const blockSupportValue = getBlockSupport( blockName, blockPath );
			if ( blockSupportValue !== undefined ) {
				return blockSupportValue;
			}

			const { getSettings } = select( 'core/block-editor' );

			return (
				get( getSettings(), blockPath ) ??
				get( getSettings(), globalPath )
			);
		},
		[ blockName, blockPath ]
	);

	return setting;
}
