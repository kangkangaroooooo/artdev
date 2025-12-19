document.addEventListener('DOMContentLoaded', function () {

	function buildModal() {
		var overlay = document.createElement('div');
		overlay.className = 'fd-modal-overlay';

		var modal = document.createElement('div');
		modal.className = 'fd-modal';

		var closeBtn = document.createElement('button');
		closeBtn.className = 'fd-close';
		closeBtn.innerHTML = '✕';
		closeBtn.setAttribute('aria-label', 'Close');
		modal.appendChild(closeBtn);

		var title = document.createElement('h2');
		title.textContent = 'Upload File';
		modal.appendChild(title);

		var form = document.createElement('form');
		form.id = 'fd-upload-form';

		// build left (file) and right (title + description) columns
		var rowMain = document.createElement('div');
		rowMain.className = 'fd-row--main';

		var leftCol = document.createElement('div');
		leftCol.className = 'fd-row fd-col-left';
		var labelFile = document.createElement('label');
		labelFile.textContent = 'Choose file';
		var inputFile = document.createElement('input');
		inputFile.type = 'file';
		inputFile.name = 'file';
		inputFile.required = true;
		leftCol.appendChild(labelFile);
		leftCol.appendChild(inputFile);

		var rightCol = document.createElement('div');
		rightCol.className = 'fd-col-right';

		var row2 = document.createElement('div');
		row2.className = 'fd-row';
		var labelTitle = document.createElement('label');
		labelTitle.textContent = 'Title';
		var inputTitle = document.createElement('input');
		inputTitle.type = 'text';
		inputTitle.name = 'title';
		row2.appendChild(labelTitle);
		row2.appendChild(inputTitle);

		var row3 = document.createElement('div');
		row3.className = 'fd-row';
		var labelDesc = document.createElement('label');
		labelDesc.textContent = 'Description';
		var textarea = document.createElement('textarea');
		textarea.name = 'description';
		textarea.rows = 3;
		row3.appendChild(labelDesc);
		row3.appendChild(textarea);


		rightCol.appendChild(row2);
		rightCol.appendChild(row3);

		rowMain.appendChild(leftCol);
		rowMain.appendChild(rightCol);

		var actions = document.createElement('div');
		actions.className = 'fd-actions';
		var cancelBtn = document.createElement('button');
		cancelBtn.type = 'button';
		cancelBtn.className = 'fd-btn fd-btn-cancel';
		cancelBtn.textContent = 'Cancel';
		var submitBtn = document.createElement('button');
		submitBtn.type = 'submit';
		submitBtn.className = 'fd-btn fd-btn-primary';
		submitBtn.textContent = 'Upload';
		actions.appendChild(cancelBtn);
		actions.appendChild(submitBtn);

		form.appendChild(rowMain);
		form.appendChild(actions);

		modal.appendChild(form);
		overlay.appendChild(modal);

		overlay.addEventListener('click', function (e) {
			if (e.target === overlay) closeModal(overlay);
		});

		closeBtn.addEventListener('click', function () {
			closeModal(overlay);
		});

		cancelBtn.addEventListener('click', function () {
			closeModal(overlay);
		});

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			var fd = new FormData(form);
			var evt = new CustomEvent('formupload:submit', { detail: fd });
			window.dispatchEvent(evt);
			if (typeof window.handleFormUpload === 'function') {
				window.handleFormUpload(fd, {close: function(){closeModal(overlay)}});
			} else {
				closeModal(overlay);
				console.log('formupload:submit dispatched', fd);
			}
		});

		return overlay;
	}

	function openModal(modal) {
		document.body.appendChild(modal);
		document.body.style.overflow = 'hidden';
	}

	function closeModal(modal) {
		if (!modal || !modal.parentNode) return;
		modal.parentNode.removeChild(modal);
		document.body.style.overflow = '';
	}

	// Styles are provided by css/portfolio.css — no inline style injection.

	function attachToButtons() {
		var btn = document.getElementById('uploadBtn') || document.querySelector('.uploadBtn');
		if (!btn) return;
		btn.addEventListener('click', function (e) {
			e.preventDefault();
			var modal = buildModal();
			openModal(modal);
		});
	}

	attachToButtons();
});

