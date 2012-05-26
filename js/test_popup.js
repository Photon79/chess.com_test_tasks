/*
*
*
*	Test task PopupWindow
*
*
*
**/


(function (w) {
	var d = w.document,
		u = w.Utils,
		PopupWindow = w.PopupWindow;
		
		
	u.ready(function () {
		var popup = new PopupWindow({
				content: "<h1>Ololo</h1><p>This is a test content</p>"
			}),
			popup1 = new PopupWindow({title: 'Window1', width: 300, height: 300});
			
//			popup.setTitle('hello world');
			popup.wTitle = 'hello world 2';
			
			// requires event emitter for great working
			popup.onClose = function () {
				alert('window closed - ' + this.title);
				console.warn('window closed', this);
			};
			
//			popup.close()
			
			
	});

	return;
})(window);





