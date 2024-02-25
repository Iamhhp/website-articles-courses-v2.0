import Swal from 'sweetalert2';

const isEmptyInputs = (inputs) => {
  for (let l = 0; l < inputs.length; l++) {
    if (!inputs[l].value) {
      return { isEmpty: true, inputEmpty: inputs[l] };
    }
  }

  return { isEmpty: false, inputEmpty: null };
};

const showDialog = (type, text, input) => {
  Swal.fire({
    icon: type,
    text: text,
    showConfirmButton: true,
  }).then((result) => {
    if (result.isConfirmed || result.isDismissed) {
      window.setTimeout(() => {
        input?.focus();
      }, 500);
    }
  });
};

export { isEmptyInputs, showDialog };
