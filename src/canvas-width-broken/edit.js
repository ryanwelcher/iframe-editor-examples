/**
 * ❌ BROKEN in the iframed editor.
 *
 * This block reads `window.innerWidth` and listens for `resize` on the
 * global `window`. Editor scripts are loaded in the ADMIN page, so the
 * global `window` is the admin window — not the editor canvas.
 *
 * In the iframed editor this block reports the wrong width and never
 * responds to the canvas resizing. Try the Tablet/Mobile preview: the
 * canvas shrinks, the number doesn't change.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

const wrapperStyle = {
	border: '2px solid #cc1818',
	borderRadius: '4px',
	padding: '1rem',
};

export default function Edit() {
	const [ width, setWidth ] = useState( null );

	useEffect( () => {
		// ❌ `window` is the admin window, not the canvas.
		const update = () => setWidth( window.innerWidth );
		update();
		window.addEventListener( 'resize', update );
		return () => window.removeEventListener( 'resize', update );
	}, [] );

	return (
		<div { ...useBlockProps( { style: wrapperStyle } ) }>
			<strong>{ __( '❌ Canvas Width (Broken)', 'iframed-editor-demos' ) }</strong>
			<p>
				{ sprintf(
					/* translators: %s: width in pixels. */
					__( 'window.innerWidth says: %spx', 'iframed-editor-demos' ),
					width ?? '…'
				) }
			</p>
			<p>
				{ __(
					'Switch to Tablet or Mobile preview — this number will not change because it is reading the admin window.',
					'iframed-editor-demos'
				) }
			</p>
		</div>
	);
}
