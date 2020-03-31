/**
 * External dependencies
 */
import { isPlainObject, isString } from 'lodash';

/**
 * Returns true if the given object quacks like an action.
 *
 * @param {*} object Object to test
 *
 * @return {object is import('.').AnyAction}  Whether object is an action.
 */
export function isAction( object ) {
	return isPlainObject( object ) && isString( object.type );
}

/**
 * Returns true if the given object quacks like an action and has a specific
 * action type
 *
 * @template {string} T Action type
 *
 * @param {*}      object       Object to test
 * @param {T} expectedType The expected type for the action.
 *
 * @return {object is {type: T, [extraProps: string]: unknown}} Whether object is an action and is of specific type.
 */
export function isActionOfType( object, expectedType ) {
	return isAction( object ) && object.type === expectedType;
}
