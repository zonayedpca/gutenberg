/**
 * WordPress dependencies
 */
import { Button, Dropdown, PanelRow } from '@wordpress/components';
import {
	PostVisibility as PostVisibilityForm,
	PostVisibilityCheck,
	PostVisibilityLabel,
} from '@wordpress/editor';
import { __ } from '@wordpress/i18n';

export function PostVisibility() {
	return (
		<PanelRow className="edit-post-post-visibility">
			<PostVisibilityCheck
				render={ ( { canEdit } ) => (
					<>
						<div>
							{ __( 'Visibility:' ) }{ ' ' }
							<span className="edit-post-post-visibility__current-value">
								<PostVisibilityLabel />
							</span>
							{ canEdit && (
								<Dropdown
									position="bottom left"
									contentClassName="edit-post-post-visibility__dialog"
									renderToggle={ ( { isOpen, onToggle } ) => (
										<Button
											aria-expanded={ isOpen }
											onClick={ onToggle }
											isTertiary
										>
											{ __( 'Edit visibility' ) }
										</Button>
									) }
									renderContent={ () => (
										<PostVisibilityForm />
									) }
								/>
							) }
						</div>
						{ ! canEdit && (
							<p>
								{ __(
									'You do not have permission to change the visibility.'
								) }
							</p>
						) }
					</>
				) }
			/>
		</PanelRow>
	);
}

export default PostVisibility;
