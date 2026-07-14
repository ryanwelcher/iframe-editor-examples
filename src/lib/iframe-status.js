/**
 * Shared iframe-status UI for the demo blocks.
 *
 * Every block reports the same thing — is the editor canvas iframed right
 * now? — so it should look the same everywhere. `BlockHeader` renders the
 * block title with a status pill in the top-right; the pill is colored by
 * iframe state alone (blue = iframed, grey = not), identical in every block
 * regardless of whether the block is a "broken" or "fixed" demo.
 *
 * Styles are inline on purpose: inline styles always apply inside the canvas
 * iframe, so the pill can't fall victim to the very editor-styles pitfalls
 * these demos are about.
 */
import { __ } from '@wordpress/i18n';

const pillBase = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: '0.375rem',
	padding: '0.15rem 0.6rem',
	borderRadius: '999px',
	fontSize: '0.6875rem',
	fontWeight: 600,
	lineHeight: 1.6,
	letterSpacing: '0.03em',
	textTransform: 'uppercase',
	whiteSpace: 'nowrap',
	color: '#fff',
};

// Both colors are from the WordPress admin palette.
const pillIframed = { ...pillBase, background: '#2271b1' };
const pillNotIframed = { ...pillBase, background: '#646970' };

const dotStyle = {
	width: '0.5rem',
	height: '0.5rem',
	borderRadius: '50%',
	background: 'currentColor',
	opacity: 0.85,
};

/**
 * A status pill reading "Iframed" or "Not iframed".
 *
 * @param {Object}  props
 * @param {boolean} props.isIframed Whether the editor canvas is iframed.
 */
export function IframeStatusPill( { isIframed } ) {
	return (
		<span style={ isIframed ? pillIframed : pillNotIframed }>
			<span style={ dotStyle } aria-hidden="true" />
			{ isIframed
				? __( 'Iframed', 'iframed-editor-demos' )
				: __( 'Not iframed', 'iframed-editor-demos' ) }
		</span>
	);
}

const headerStyle = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: '0.5rem',
	flexWrap: 'wrap',
	marginBottom: '0.5rem',
};

/**
 * A block header: the title on the left, the iframe-status pill on the right.
 *
 * @param {Object}  props
 * @param {boolean} props.isIframed Whether the editor canvas is iframed.
 * @param {*}       props.children  The block title.
 */
export function BlockHeader( { isIframed, children } ) {
	return (
		<div style={ headerStyle }>
			<strong>{ children }</strong>
			<IframeStatusPill isIframed={ isIframed } />
		</div>
	);
}
