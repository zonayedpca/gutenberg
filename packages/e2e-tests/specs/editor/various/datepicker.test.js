/**
 * WordPress dependencies
 */
import { clickButton, createNewPost } from '@wordpress/e2e-test-utils';

describe( 'Datepicker', () => {
	beforeEach( async () => {
		await createNewPost();
	} );

	it( 'should show the publishing date as "Immediately" if the date is not altered', async () => {
		const publishDate = await page.$eval(
			'.edit-post-post-schedule__current-value',
			( publishDateSpan ) => publishDateSpan.textContent
		);

		expect( publishDate ).toEqual( 'Immediately' );
	} );

	it( 'should show the publishing date if the date is in the past', async () => {
		// Open the datepicker.
		await clickButton( 'Edit publish date' );

		// Change the publishing date to a year in the past.
		await page.click( '.components-datetime__time-field-year' );
		await page.keyboard.press( 'ArrowDown' );

		// Close the datepicker.
		await clickButton( 'Edit publish date' );

		const publishDate = await page.$eval(
			'.edit-post-post-schedule__current-value',
			( publishDateSpan ) => publishDateSpan.textContent
		);

		expect( publishDate ).toMatch(
			/[A-Za-z]{3} \d{1,2}, \d{4} \d{1,2}:\d{2} [ap]m/
		);
	} );

	it( 'should show the publishing date if the date is in the future', async () => {
		// Open the datepicker.
		await clickButton( 'Edit publish date' );

		// Change the publishing date to a year in the future.
		await page.click( '.components-datetime__time-field-year' );
		await page.keyboard.press( 'ArrowUp' );

		// Close the datepicker.
		await clickButton( 'Edit publish date' );

		const publishDate = await page.$eval(
			'.edit-post-post-schedule__current-value',
			( publishDateSpan ) => publishDateSpan.textContent
		);

		expect( publishDate ).not.toEqual( 'Immediately' );
		// The expected date format will be "Sep 26, 2018 11:52 pm".
		expect( publishDate ).toMatch(
			/[A-Za-z]{3} \d{1,2}, \d{4} \d{1,2}:\d{2} [ap]m/
		);
	} );

	it( 'should show the publishing date as "Immediately" if the date is cleared', async () => {
		// Open the datepicker.
		await clickButton( 'Edit publish date' );

		// Change the publishing date to a year in the future.
		await page.click( '.components-datetime__time-field-year' );
		await page.keyboard.press( 'ArrowUp' );

		// Close the datepicker.
		await clickButton( 'Edit publish date' );

		// Open the datepicker.
		await clickButton( 'Edit publish date' );

		// Clear the date.
		await page.click( '.components-datetime__date-reset-button' );

		const publishDate = await page.$eval(
			'.edit-post-post-schedule__current-value',
			( publishDateSpan ) => publishDateSpan.textContent
		);

		expect( publishDate ).toEqual( 'Immediately' );
	} );
} );
