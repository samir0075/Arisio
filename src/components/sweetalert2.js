// import Swal from "sweetalert2";

// export const SWEETALERT = ({ text }) => {
//   // const Toast = Swal.mixin({
//   //   toast: true,
//   //   position: "center",
//   //   showConfirmButton: false,
//   //   timer: 5000,
//   //   timerProgressBar: true,
//   //   didOpen: (toast) => {
//   //     toast.onmouseenter = Swal.stopTimer;
//   //     toast.onmouseleave = Swal.resumeTimer;
//   //   },
//   // });

//   Swal.fire({
//     title: "SUBSCRIPTION LIMIT REACHED !",
//     icon: "warning",
//     text: text,
//     // footer: '<a href="/Pricing">Upgrade Plan</a>',
//   });
// };

import Swal from "sweetalert2";

// Function to create the blocking overlay
const showOverlay = () => {
  const overlay = document.createElement("div");
  overlay.setAttribute("id", "block-overlay");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background
  overlay.style.zIndex = "9998"; // Set overlay under the modal (below SweetAlert)
  overlay.style.pointerEvents = "none"; // Allow clicks on the modal
  document.body.appendChild(overlay); // Add the overlay to the body
};

// Function to remove the overlay
const removeOverlay = () => {
  const overlay = document.getElementById("block-overlay");
  if (overlay) {
    document.body.removeChild(overlay); // Remove overlay when modal closes
  }
};

export const SWEETALERT = ({ text }) => {
  showOverlay(); // Show overlay when the modal is opened

  Swal.fire({
    title: "SUBSCRIPTION LIMIT REACHED!",
    icon: "warning",
    text: text,
    allowOutsideClick: false, // Disable closing by clicking outside
    showCloseButton: false, // Disable the close (X) button
    showConfirmButton: true, // Show confirm button
    confirmButtonText: "OK", // Custom text for the confirm button
    backdrop: true, // Ensure modal backdrop is enabled
    zIndex: 9999, // Ensure modal is on top of the overlay
    didOpen: () => {
      // Ensure the modal has a higher z-index than the overlay
      const modal = document.querySelector(".swal2-container");
      if (modal) {
        modal.style.zIndex = "10000"; // Ensure modal is always above the overlay
      }
    },
    preConfirm: () => {
      // Remove the overlay when the modal is closed
      removeOverlay();
    },
    onClose: () => {
      // Ensure overlay is removed when modal is closed
      removeOverlay();
    },
  });
};
