/**
 * ❌ BROKEN in the iframed editor.
 *
 * This block reads `window.innerWidth` and listens for `resize` on the
 * global `window`. Editor scripts run in the admin document, so the
 * global `window` is the admin window — not the canvas window.
 *
 * The catch: this only misbehaves once the canvas is iframed. When the
 * editor is NOT iframed, the admin window IS the canvas, so the number is
 * right by accident. Once iframed, Tablet/Mobile preview resizes the
 * canvas but this number — read from the admin window — never moves.
 * Compare it side by side with the Fixed block while iframed.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';
import { useRefEffect } from '@wordpress/compose';
import { __, sprintf } from '@wordpress/i18n';
import { BlockHeader } from '../lib/iframe-status';

const wrapperStyle = {
	border: '2px solid #cc1818',
	borderRadius: '4px',
	padding: '1rem',
};

export default function Edit() {
	const [ width, setWidth ] = useState( null );
	const [ isIframed, setIsIframed ] = useState( false );

	// Detection only — the width below is deliberately read the broken way.
	const ref = useRefEffect( ( element ) => {
		setIsIframed( element.ownerDocument !== document );
	}, [] );

	useEffect( () => {
		// ❌ `window` is the admin window, not the canvas window.
		const update = () => setWidth( window.innerWidth );
		update();
		window.addEventListener( 'resize', update );
		return () => window.removeEventListener( 'resize', update );
	}, [] );

	return (
		<div { ...useBlockProps( { ref, style: wrapperStyle } ) }>
			<BlockHeader isIframed={ isIframed }>
				{ __( '❌ Canvas Width (Broken)', 'iframed-editor-demos' ) }
			</BlockHeader>
			<p>
				{ sprintf(
					/* translators: %s: width in pixels. */
					__( 'window.innerWidth says: %spx', 'iframed-editor-demos' ),
					width ?? '…'
				) }
			</p>
			<p>
				{ isIframed
					? __(
							'This reads the admin window, so Tablet/Mobile preview resizes the canvas but never changes this number. Watch the Fixed block move while this one stays stuck.',
							'iframed-editor-demos'
					  )
					: __(
							'The admin window IS the canvas, so this happens to be correct. It only breaks once the canvas is iframed; compare the pair then.',
							'iframed-editor-demos'
					  ) }
			</p>
		</div>
	);
}
