/**
 * ❌ BROKEN in the iframed editor.
 *
 * The block's editor styles (editor.css) are scoped with `.wp-admin` — a
 * class that only exists on the admin document's <body>. Those styles ARE
 * injected into the canvas document (they're registered via `editorStyle`),
 * but inside the canvas the <body> has no `wp-admin` class, so the
 * selector never matches and the border + red banner disappear.
 *
 * The text below is rendered from JavaScript, so it always shows — even
 * when the CSS drops out. That's how you can tell the difference between
 * "the block vanished" and "the styling vanished".
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { useRefEffect } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { BlockHeader } from '../lib/iframe-status';

export default function Edit() {
	const [ isIframed, setIsIframed ] = useState( false );

	const ref = useRefEffect( ( element ) => {
		// If the block's document isn't the admin document, we're iframed.
		setIsIframed( element.ownerDocument !== document );
	}, [] );

	return (
		<div { ...useBlockProps( { ref, className: 'ied-admin-scoped-broken' } ) }>
			<BlockHeader isIframed={ isIframed }>
				{ __( '❌ Admin-Scoped CSS (Broken)', 'iframed-editor-demos' ) }
			</BlockHeader>
			<p>
				{ isIframed
					? __(
							'The .wp-admin selector never matched here. No border, no red banner. The CSS loaded; the selector just found nothing.',
							'iframed-editor-demos'
					  )
					: __(
							'.wp-admin matched, so you see the red banner and border above.',
							'iframed-editor-demos'
					  ) }
			</p>
		</div>
	);
}
