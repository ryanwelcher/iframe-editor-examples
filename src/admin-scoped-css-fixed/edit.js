/**
 * ✅ FIXED for the iframed editor.
 *
 * The editor styles (editor.css) are scoped to the block's own class,
 * with no `.wp-admin` ancestor. The selector matches in the admin
 * document and inside the canvas iframe alike, so the green banner and
 * border are always present.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { useRefEffect } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

export default function Edit() {
	const [ isIframed, setIsIframed ] = useState( false );

	const ref = useRefEffect( ( element ) => {
		// If the block's document isn't the admin document, we're iframed.
		setIsIframed( element.ownerDocument !== document );
	}, [] );

	return (
		<div { ...useBlockProps( { ref, className: 'ied-admin-scoped-fixed' } ) }>
			<strong>{ __( '✅ Admin-Scoped CSS (Fixed)', 'iframed-editor-demos' ) }</strong>
			<p>
				{ isIframed
					? __(
							'The canvas IS iframed — and the styling is still here, because the selector describes the block, not the admin chrome.',
							'iframed-editor-demos'
					  )
					: __(
							'The canvas is NOT iframed right now — the styling applies here too.',
							'iframed-editor-demos'
					  ) }
			</p>
		</div>
	);
}
