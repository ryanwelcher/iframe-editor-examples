/**
 * ✅ FIXED for the iframed editor.
 *
 * The editor styles (editor.css) are scoped to the block's own class,
 * with no `.wp-admin` ancestor. The selector matches in the admin
 * document and the canvas document alike, so the green banner and
 * border are always present.
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
		<div { ...useBlockProps( { ref, className: 'ied-admin-scoped-fixed' } ) }>
			<BlockHeader isIframed={ isIframed }>
				{ __( '✅ Admin-Scoped CSS (Fixed)', 'iframed-editor-demos' ) }
			</BlockHeader>
			<p>
				{ isIframed
					? __(
							'The styling is still here, because the selector describes the block, not the admin document.',
							'iframed-editor-demos'
					  )
					: __(
							'The styling applies here too, for the same reason.',
							'iframed-editor-demos'
					  ) }
			</p>
		</div>
	);
}
