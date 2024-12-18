import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  loader() {
    Swal.fire({
      title: 'Aguarde!',
      html: 'Se está realizando el proceso.',
      timer: 10000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  close() {
    Swal.close();
  }

  successOrError(texto1: string, texto2: string, status: SweetAlertIcon) {
    Swal.fire({
      title: texto1,
      html: texto2,
      icon: status,
      confirmButtonColor: '#064d74',
    });
  }

  confirmDelete(callback: () => void) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#064d74',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }

  confirmAction(
    callback: () => void,
    title: string = '¿Estás seguro?',
    text: string = 'No podrás revertir esta acción'
  ) {
    Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#064d74',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }
}
