/*
*
*
*	Test task 1
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
	});

	return;
})(window);





