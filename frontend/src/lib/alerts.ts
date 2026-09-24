import Swal from 'sweetalert2';

const THEME = {
    background: '#ffffff',
    color: '#334155',
    confirmButton: '#0033A0',
    cancelButton: '#E30613',
    accent: '#FFC72C',
    title: '#002060',
    cancelGray: '#94a3b8'
};

export const showError = (msg: string) => {
    Swal.fire({
        icon: 'error',
        title: `<h2 style="color: ${THEME.title}; margin: 0; font-weight: 900;">Error</h2>`,
        text: msg,
        background: THEME.background,
        color: THEME.color,
        confirmButtonColor: THEME.confirmButton,
        confirmButtonText: 'Entendido',
        customClass: { popup: 'rounded-3xl shadow-2xl' }
    });
};

export const showSuccess = (title: string, text: string = '') => {
    Swal.fire({
        icon: 'success',
        title: `<h2 style="color: ${THEME.title}; margin: 0; font-weight: 900;">${title}</h2>`,
        html: text,
        timer: 2500,
        showConfirmButton: false,
        background: THEME.background,
        color: THEME.color,
        iconColor: '#10b981',
        customClass: { popup: 'rounded-3xl shadow-2xl border-t-4 border-[#0033A0]' }
    });
};

export const confirmAction = async (title: string, text: string) => {
    const result = await Swal.fire({
        title: `<h2 style="color: ${THEME.title}; margin: 0; font-weight: 900;">${title}</h2>`,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        background: THEME.background,
        color: THEME.color,
        confirmButtonColor: THEME.confirmButton,
        cancelButtonColor: THEME.cancelGray,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        iconColor: THEME.accent,
        customClass: { popup: 'rounded-3xl shadow-2xl' }
    });
    return result.isConfirmed;
};

export const promptPin = async (): Promise<string | null> => {
    const { value: pin } = await Swal.fire({
        title: `<h2 style="color: ${THEME.title}; margin: 0; font-weight: 900;">Cambiar PIN</h2>`,
        input: 'text',
        inputLabel: 'Ingrese el nuevo PIN de 4 dígitos:',
        inputPlaceholder: 'Ej: 1234',
        inputAttributes: {
            maxlength: '4',
            pattern: '[0-9]*',
            inputmode: 'numeric'
        },
        showCancelButton: true,
        confirmButtonColor: THEME.confirmButton,
        cancelButtonColor: THEME.cancelGray,
        confirmButtonText: 'Guardar PIN',
        cancelButtonText: 'Cancelar',
        background: THEME.background,
        color: THEME.color,
        customClass: { popup: 'rounded-3xl shadow-2xl' },
        inputValidator: (value) => {
            if (!value || value.length !== 4 || !/^\d+$/.test(value)) {
                return 'El PIN debe contener exactamente 4 números.';
            }
        }
    });
    return pin || null;
};