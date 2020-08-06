/**
 * WordPress dependencies
 */
import { Button, Dropdown, PanelRow } from '@wordpress/components';
import {
	PostSchedule as PostScheduleForm,
	PostScheduleCheck,
	PostScheduleLabel,
} from '@wordpress/editor';
import { __ } from '@wordpress/i18n';

export default function PostSchedule() {
	return (
		<PostScheduleCheck>
			<PanelRow className="edit-post-post-schedule">
				<>
					{ __( 'Publish date:' ) }{ ' ' }
					<span className="edit-post-post-schedule__current-value">
						<PostScheduleLabel />
					</span>
					<Dropdown
						position="bottom left"
						contentClassName="edit-post-post-schedule__dialog"
						renderToggle={ ( { onToggle, isOpen } ) => (
							<Button
								onClick={ onToggle }
								aria-expanded={ isOpen }
								isTertiary
							>
								{ __( 'Edit publish date' ) }
							</Button>
						) }
						renderContent={ () => <PostScheduleForm /> }
					/>
				</>
			</PanelRow>
		</PostScheduleCheck>
	);
}
