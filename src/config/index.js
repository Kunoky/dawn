export const tinymce = {
  // apiKey: 'mo66vkpnmztc98uyvoqhkckd9ls2hhhrpmvt7d28bmjp3208',
  tinymceScriptSrc: '/tinymce/js/tinymce/tinymce.min.js',
  init: {
    promotion: false,
    branding: false,
    license_key: 'gpl',
    language: 'zh_CN',
    plugins: 'image lists',
    toolbar: [
      'undo redo fontfamily blocks fontsize forecolor bold italic underline strikethrough',
      'alignleft aligncenter alignright alignjustify numlist bullist outdent indent blockquote lineheight image removeformat',
    ],
    images_upload_handler: function (blobInfo, success, failure) {
      const formData = new FormData()
      formData.append('file', blobInfo.blob(), blobInfo.filename())
      return req
        .post('/upload/file', formData)
        .then(res => {
          success(res.data.url)
          return res.data.url
        })
        .catch(e => {
          failure(e)
        })
    },
  },
}
