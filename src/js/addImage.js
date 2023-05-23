import { Dropzone } from "dropzone";

const token = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute("content");

// console.log(token);

Dropzone.options.image = {
  dictDefaultMessage: "Arrastra tu imagen aquí",
  acceptedFiles: ".png,.jpg,.jpeg",
  maxFileSize: 5,
  maxFiles: 1,
  parallelUploads: 1,
  autoProcessQueue: false,
  addRemoveLinks: true,
  dictRemoveFile: "Borrar archivo",
  dictMaxFilesExceeded: "El líimite es 1 archivo",
  headers: {
    "CSRF-Token": token,
  },
  paramName: "image",
  init: function () {
    const dropzone = this;
    const submitBTN = document.querySelector("#publicateBTN");

    submitBTN.addEventListener("click", function () {
      dropzone.processQueue();
    });

    dropzone.on('queuecomplete', function() {
      if(dropzone.getActiveFiles().length === 0) {
        window.location.href = "/my-properties"
      }
    })
  },
};
