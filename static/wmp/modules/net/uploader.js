define(['jquery'],function($){
	/*
	 * 文件 upload 
	 * settting字段
	 * before: 上传前调用的函数
	 * sucess: 上传成功后调用的函数
	 */
	function FileUploader (settings) {
		var inputId = 'fileupload-'+Math.random().toString().slice(2);		
		var self = this;
		this.settings = settings;
		/*
		 * accept .jpg,.png,.jpeg,.gif
		 */
		this.$fileInput = $('<input type="file" accept="'+settings['accept']+'" id="'+inputId+'" style="display:none;">');
		this.$fileInput.on('change',function(){
			self._onChange(self);
		});
		self.beyondMaxBytesMsg = settings['maxBytesMsg'] ? settings['maxBytesMsg'] : '上传文件大小超过限制';
		self.maxBytes = settings['maxBytes'];
		$('body').append(this.$fileInput);
	}

	FileUploader.prototype = {
		consotructor: FileUploader,
		$fileInput: null,
		fileBase64: null,
		maxBytes: null,
		beyondMaxBytesMsg: null,
		settings: {},
		/*
		 * 开始上传操作
		 */
		start: function() {
			this.$fileInput.click();
		},
		_onChange:function(self) {
			var selectedFiles = this.$fileInput.get(0).files;
			if( selectedFiles == 0) {
				return;
			} else if(selectedFiles[0].size > self.maxBytes) {
				alert(self.beyondMaxBytesMsg);
				return;
			}
			var fileFormData = new FormData();
			fileFormData.append('file',this.$fileInput.get(0).files[0]);
			/*
			 * 上传前
			 */
			self.settings['before'] && self.settings['before']();

			$.ajax({
				url: this.settings['url'],
				type: 'post',
				data: fileFormData,
				dataType: 'json',
				cache: false,
				contentType: false,
				processData: false,
				success: function(obj) {
					if(obj.code == 0) {
						/*
						 * 上传成功
						 */
						self.settings['success'] && self.settings['success'](obj);
					} else {
					}
				}
			});
		}
	}
	return FileUploader;
});
